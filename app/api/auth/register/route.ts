import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { generateRingToken } from "@/lib/utils/tokens";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON request body", 400);
    }

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 400);
    }
    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    // Atomic nested write: creates User, Profile, and Ring in a single database operation
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "USER",
        profile: {
          create: {
            name,
            mode: "BUSINESS",
          },
        },
        ring: {
          create: {
            token: generateRingToken(),
            status: "ACTIVE",
          },
        },
      },
      include: {
        profile: true,
        ring: true,
      },
    });

    const token = signSession({ userId: user.id, role: user.role as "USER" | "ADMIN" });
    await setSessionCookie(token);

    return jsonOk(
      {
        id: user.id,
        email: user.email,
        name: user.profile?.name,
        ringToken: user.ring?.token,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { generateRingToken } from "@/lib/utils/tokens";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 422);
    }
    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.$transaction(async (tx: any) => {
      const created = await tx.user.create({
        data: { email, passwordHash },
      });
      await tx.profile.create({
        data: { userId: created.id, name, mode: "BUSINESS" },
      });
      await tx.ring.create({
        data: { userId: created.id, token: generateRingToken(), status: "ACTIVE" },
      });
      return created;
    });

    const token = signSession({ userId: user.id, role: user.role as "USER" | "ADMIN" });
    await setSessionCookie(token);

    return jsonOk({ id: user.id, email: user.email }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

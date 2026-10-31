import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON request body", 400);
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 400);
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return jsonError("Invalid email or password", 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return jsonError("Invalid email or password", 401);

    const token = signSession({ userId: user.id, role: user.role as "USER" | "ADMIN" });
    await setSessionCookie(token);

    return jsonOk({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { connectionSchema, sanitizeText } from "@/lib/validation";
import { trackEvent, normalizeSource } from "@/lib/analytics";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

// Owner: list their received connections
export async function GET() {
  try {
    const user = await requireAuth();
    const connections = await prisma.connection.findMany({
      where: { userAId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk(connections);
  } catch (error) {
    return handleApiError(error);
  }
}

// Public: visitor submits a connection request against a ring token
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`connect:${ip}`, 15, 60_000)) {
      return jsonError("Too many connection attempts. Please try again later.", 429);
    }

    const body = await req.json();
    const { token, source, ...rest } = body;
    if (!token || typeof token !== "string") {
      return jsonError("Missing profile token", 400);
    }
    const parsed = connectionSchema.safeParse(rest);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 422);
    }

    const ring = await prisma.ring.findUnique({
      where: { token },
      include: { user: { include: { profile: true } } },
    });
    if (!ring || ring.status !== "ACTIVE" || !ring.user.profile) {
      return jsonError("Profile not found", 404);
    }

    const visitorEmail = parsed.data.email.toLowerCase().trim();
    const ownerAccountEmail = ring.user.email?.toLowerCase().trim();
    const ownerProfileEmail = ring.user.profile.email?.toLowerCase().trim();

    if (visitorEmail === ownerAccountEmail || (ownerProfileEmail && visitorEmail === ownerProfileEmail)) {
      return jsonError("You cannot connect with yourself", 400);
    }

    const existing = await prisma.connection.findUnique({
      where: { userAId_email: { userAId: ring.userId, email: visitorEmail } },
    });
    if (existing) {
      return jsonError("You've already connected with this profile", 409);
    }

    const connection = await prisma.connection.create({
      data: {
        userAId: ring.userId,
        name: sanitizeText(parsed.data.name),
        email: visitorEmail,
        company: parsed.data.company ? sanitizeText(parsed.data.company) : null,
        message: parsed.data.message ? sanitizeText(parsed.data.message) : null,
      },
    });

    await trackEvent(ring.user.profile.id, "CONNECT", normalizeSource(source));

    return jsonOk(connection, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent, normalizeSource } from "@/lib/analytics";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";
import type { EventType } from "@/lib/types";

const VALID_EVENTS: EventType[] = ["TAP", "VIEW", "QR", "SAVE", "CONNECT", "LEAD"];

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`event:${ip}`, 60, 60_000)) {
      return jsonError("Too many events. Rate limited.", 429);
    }

    const body = await req.json();
    const { token, eventType, source } = body;

    if (!token || !VALID_EVENTS.includes(eventType)) {
      return jsonError("Invalid event payload", 400);
    }

    const ring = await prisma.ring.findUnique({
      where: { token },
      include: { user: { include: { profile: true } } },
    });
    if (!ring || !ring.user.profile) {
      return jsonError("Profile not found", 404);
    }

    await trackEvent(ring.user.profile.id, eventType, normalizeSource(source));

    return jsonOk({ tracked: true });
  } catch (error) {
    return handleApiError(error);
  }
}

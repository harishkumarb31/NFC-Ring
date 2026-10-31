import { prisma } from "@/lib/db";
import type { EventType, EventSource } from "@/lib/types";

export async function trackEvent(
  profileId: string,
  eventType: EventType,
  source: EventSource = "DIRECT",
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        profileId,
        eventType,
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (err) {
    // Analytics must never break the user-facing flow
    console.error("Failed to record analytics event", err);
  }
}

export function normalizeSource(sourceParam: string | null): EventSource {
  if (sourceParam === "nfc") return "NFC";
  if (sourceParam === "qr") return "QR";
  return "DIRECT";
}

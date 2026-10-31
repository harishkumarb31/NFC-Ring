import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { trackEvent, normalizeSource } from "@/lib/analytics";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const { searchParams } = new URL(req.url);
    const sourceParam = searchParams.get("source");

    const ring = await prisma.ring.findUnique({
      where: { token },
      include: { user: { include: { profile: true } } },
    });

    if (!ring || !ring.user.profile) {
      return jsonError("Profile not found", 404);
    }

    if (ring.status !== "ACTIVE") {
      return jsonError("This ring is currently inactive", 423);
    }

    const source = normalizeSource(sourceParam);
    // NFC taps register as TAP; everything else (including QR) registers as a VIEW.
    await trackEvent(ring.user.profile.id, source === "NFC" ? "TAP" : "VIEW", source);
    if (source === "QR") {
      await trackEvent(ring.user.profile.id, "QR", source);
    }

    const p = ring.user.profile;
    return jsonOk({
      token: ring.token,
      name: p.name,
      company: p.company,
      designation: p.designation,
      bio: p.bio,
      shortBio: p.shortBio,
      phone: p.phone,
      email: p.email,
      website: p.website,
      linkedin: p.linkedin,
      whatsapp: p.whatsapp,
      portfolioUrl: p.portfolioUrl,
      photoUrl: p.photoUrl,
      services: p.services,
      mode: p.mode,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

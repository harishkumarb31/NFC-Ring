import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { profileSchema, sanitizeText } from "@/lib/validation";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    const user = await requireAuth();
    return jsonOk(user.profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Invalid input", 422);
    }
    const data = parsed.data;

    const updated = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        name: sanitizeText(data.name),
        company: data.company ? sanitizeText(data.company) : null,
        designation: data.designation ? sanitizeText(data.designation) : null,
        bio: data.bio ? sanitizeText(data.bio) : null,
        shortBio: data.shortBio ? sanitizeText(data.shortBio) : null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        linkedin: data.linkedin || null,
        whatsapp: data.whatsapp || null,
        portfolioUrl: data.portfolioUrl || null,
        photoUrl: data.photoUrl || null,
        services: data.services ? sanitizeText(data.services) : null,
        mode: data.mode,
      },
    });

    return jsonOk(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

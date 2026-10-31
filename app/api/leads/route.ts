import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { leadSchema, sanitizeText } from "@/lib/validation";
import { trackEvent, normalizeSource } from "@/lib/analytics";
import { checkRateLimit, getClientIp } from "@/lib/utils/rateLimit";
import { jsonOk, jsonError, handleApiError } from "@/lib/utils/api";

// Owner: list their leads with optional search/filter/sort
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user.profile) return jsonOk([]);

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest";

    const leads = await prisma.lead.findMany({
      where: {
        profileId: user.profile.id,
        ...(status && status !== "ALL" ? { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { company: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    });

    return jsonOk(leads);
  } catch (error) {
    return handleApiError(error);
  }
}

// Public: visitor submits a collaboration/lead request against a ring token
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`lead:${ip}`, 15, 60_000)) {
      return jsonError("Too many requests. Please try again later.", 429);
    }

    const body = await req.json();
    const { token, source, ...rest } = body;
    if (!token || typeof token !== "string") {
      return jsonError("Missing profile token", 400);
    }
    const parsed = leadSchema.safeParse(rest);
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

    const lead = await prisma.lead.create({
      data: {
        profileId: ring.user.profile.id,
        name: sanitizeText(parsed.data.name),
        email: parsed.data.email.toLowerCase().trim(),
        phone: parsed.data.phone ? sanitizeText(parsed.data.phone) : null,
        company: parsed.data.company ? sanitizeText(parsed.data.company) : null,
        message: parsed.data.message ? sanitizeText(parsed.data.message) : null,
        status: "NEW",
      },
    });

    await trackEvent(ring.user.profile.id, "LEAD", normalizeSource(source));

    return jsonOk(lead, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

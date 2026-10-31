import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    await requireAdmin();
    const [totalUsers, activeRings, inactiveRings, totalTaps, totalLeads] = await Promise.all([
      prisma.user.count(),
      prisma.ring.count({ where: { status: "ACTIVE" } }),
      prisma.ring.count({ where: { status: "INACTIVE" } }),
      prisma.analyticsEvent.count({ where: { eventType: "TAP" } }),
      prisma.lead.count(),
    ]);
    return jsonOk({ totalUsers, activeRings, inactiveRings, totalTaps, totalLeads });
  } catch (error) {
    return handleApiError(error);
  }
}

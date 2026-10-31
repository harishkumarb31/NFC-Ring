import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { jsonOk, handleApiError } from "@/lib/utils/api";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user.profile) return jsonOk(null);

    const profileId = user.profile.id;

    const [tapCount, viewCount, qrCount, saveCount, connectCount, leadCount, events, bySource] =
      await Promise.all([
        prisma.analyticsEvent.count({ where: { profileId, eventType: "TAP" } }),
        prisma.analyticsEvent.count({ where: { profileId, eventType: "VIEW" } }),
        prisma.analyticsEvent.count({ where: { profileId, eventType: "QR" } }),
        prisma.analyticsEvent.count({ where: { profileId, eventType: "SAVE" } }),
        prisma.analyticsEvent.count({ where: { profileId, eventType: "CONNECT" } }),
        prisma.analyticsEvent.count({ where: { profileId, eventType: "LEAD" } }),
        prisma.analyticsEvent.findMany({
          where: { profileId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          select: { eventType: true, source: true, createdAt: true },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["source"],
          where: { profileId },
          _count: { source: true },
        }),
      ]);

    // Build 7-day activity buckets
    const days: { date: string; views: number; taps: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, views: 0, taps: 0 });
    }
    for (const ev of events) {
      const key = ev.createdAt.toISOString().slice(0, 10);
      const bucket = days.find((d) => d.date === key);
      if (!bucket) continue;
      if (ev.eventType === "VIEW") bucket.views += 1;
      if (ev.eventType === "TAP") bucket.taps += 1;
    }

    const totalViews = viewCount + tapCount;
    const conversionRate = totalViews > 0 ? ((connectCount + leadCount) / totalViews) * 100 : 0;

    return jsonOk({
      taps: tapCount,
      views: viewCount,
      qrScans: qrCount,
      saves: saveCount,
      connections: connectCount,
      leads: leadCount,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activity: days,
      sources: bySource.map((s) => ({ source: s.source, count: s._count.source })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

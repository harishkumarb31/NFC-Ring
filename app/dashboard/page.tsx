import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  Nfc,
  UserCircle,
  Sparkles,
  QrCode,
  Users,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityChart } from "@/components/analytics/ActivityChart";
import { SourceBreakdown } from "@/components/analytics/SourceBreakdown";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = user.profile;
  const ring = user.ring;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let stats = { taps: 0, views: 0, connections: 0, leads: 0 };
  let activity: { date: string; views: number; taps: number }[] = [];
  let sources: { source: string; count: number }[] = [];
  let recentConnections: Array<{ id: string; name: string; email: string; company: string | null; createdAt: Date }> = [];
  let recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: Date }> = [];

  if (profile) {
    const [taps, views, connections, leads, events, bySource, conns, lds] = await Promise.all([
      prisma.analyticsEvent.count({ where: { profileId: profile.id, eventType: "TAP" } }),
      prisma.analyticsEvent.count({ where: { profileId: profile.id, eventType: "VIEW" } }),
      prisma.connection.count({ where: { userAId: user.id } }),
      prisma.lead.count({ where: { profileId: profile.id } }),
      prisma.analyticsEvent.findMany({
        where: { profileId: profile.id, createdAt: { gte: sevenDaysAgo } },
        select: { eventType: true, createdAt: true },
      }),
      prisma.analyticsEvent.groupBy({ by: ["source"], where: { profileId: profile.id }, _count: { source: true } }),
      prisma.connection.findMany({
        where: { userAId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, name: true, email: true, company: true, createdAt: true },
      }),
      prisma.lead.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, name: true, email: true, status: true, createdAt: true },
      }),
    ]);
    stats = { taps, views, connections, leads };
    recentConnections = conns;
    recentLeads = lds;

    const days: { date: string; views: number; taps: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), views: 0, taps: 0 });
    }
    for (const ev of events) {
      const key = ev.createdAt.toISOString().slice(0, 10);
      const bucket = days.find((d) => d.date === key);
      if (!bucket) continue;
      if (ev.eventType === "VIEW") bucket.views += 1;
      if (ev.eventType === "TAP") bucket.taps += 1;
    }
    activity = days;
    sources = bySource.map((s: any) => ({ source: s.source, count: s._count.source }));
  }

  const publicUrl = ring ? `/u/${ring.token}` : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader
          title={`${greeting()}, ${profile?.name?.split(" ")[0] ?? "there"}.`}
          subtitle={
            ring?.status === "ACTIVE"
              ? "Your digital identity is live and ready to connect on tap."
              : "Your ring is currently inactive — activate it from My Ring."
          }
        />
        {publicUrl && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-surface-3 text-text-primary border border-border-hair rounded-lg px-3.5 py-2 text-xs font-medium transition-colors"
            >
              <ExternalLink className="size-3.5 text-accent-strong" /> View Live Profile
            </a>
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link
          href="/dashboard/ring"
          className="group rounded-xl border border-border-hair bg-surface-1/70 hover:bg-surface-2/90 hover:border-accent/40 p-4 transition-all duration-200"
        >
          <div className="size-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Nfc className="size-4 text-accent-strong" />
          </div>
          <p className="text-sm font-medium text-text-primary group-hover:text-accent-strong transition-colors">
            My Ring & NFC
          </p>
          <p className="text-xs text-text-faint mt-0.5">Tag provisioning & status</p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group rounded-xl border border-border-hair bg-surface-1/70 hover:bg-surface-2/90 hover:border-accent/40 p-4 transition-all duration-200"
        >
          <div className="size-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <UserCircle className="size-4 text-accent-strong" />
          </div>
          <p className="text-sm font-medium text-text-primary group-hover:text-accent-strong transition-colors">
            Edit Profile
          </p>
          <p className="text-xs text-text-faint mt-0.5">Bio, contact & services</p>
        </Link>

        <Link
          href="/dashboard/ai-bio"
          className="group rounded-xl border border-border-hair bg-surface-1/70 hover:bg-surface-2/90 hover:border-accent/40 p-4 transition-all duration-200"
        >
          <div className="size-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="size-4 text-accent-strong" />
          </div>
          <p className="text-sm font-medium text-text-primary group-hover:text-accent-strong transition-colors">
            RingAI Bio
          </p>
          <p className="text-xs text-text-faint mt-0.5">Generate bio with AI</p>
        </Link>

        <Link
          href="/dashboard/ring"
          className="group rounded-xl border border-border-hair bg-surface-1/70 hover:bg-surface-2/90 hover:border-accent/40 p-4 transition-all duration-200"
        >
          <div className="size-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <QrCode className="size-4 text-accent-strong" />
          </div>
          <p className="text-sm font-medium text-text-primary group-hover:text-accent-strong transition-colors">
            QR Sharing
          </p>
          <p className="text-xs text-text-faint mt-0.5">Instant scan alternative</p>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="NFC Taps" value={stats.taps} icon="nfc" delay={0} />
        <StatCard label="Profile Views" value={stats.views} icon="eye" delay={0.05} />
        <StatCard label="Connections" value={stats.connections} icon="users" delay={0.1} />
        <StatCard label="Leads" value={stats.leads} icon="target" delay={0.15} />
      </div>

      {/* Ring Status Banner if inactive */}
      {ring && ring.status !== "ACTIVE" && (
        <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-200">Your ring is currently inactive</p>
              <p className="text-xs text-amber-400/80">Visitors tapping your NFC ring will see an inactive notice.</p>
            </div>
          </div>
          <Link
            href="/dashboard/ring"
            className="text-xs font-medium bg-amber-500 text-surface-0 hover:bg-amber-400 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            Activate Now
          </Link>
        </div>
      )}

      {/* Activity Charts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <ActivityChart data={activity} />
        </div>
        <SourceBreakdown sources={sources} />
      </div>

      {/* Recent Network Activity Preview */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Connections */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-accent-strong" />
              <h3 className="font-display text-sm">Recent Connections</h3>
            </div>
            <Link
              href="/dashboard/connections"
              className="text-xs text-text-faint hover:text-text-primary inline-flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {recentConnections.length === 0 ? (
            <p className="text-xs text-text-faint py-6 text-center">
              No connections yet. Share your ring or QR code to start building your network.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border-hair">
              {recentConnections.map((c) => (
                <div key={c.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-text-primary">{c.name}</p>
                    <p className="text-text-faint">{c.company || c.email}</p>
                  </div>
                  <span className="text-text-faint">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Collaboration Leads */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-accent-strong" />
              <h3 className="font-display text-sm">Recent Leads</h3>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs text-text-faint hover:text-text-primary inline-flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-xs text-text-faint py-6 text-center">
              No collaboration requests yet. Inquiries submitted via your profile will appear here.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border-hair">
              {recentLeads.map((l) => (
                <div key={l.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-text-primary">{l.name}</p>
                    <p className="text-text-faint">{l.email}</p>
                  </div>
                  <Badge tone={l.status === "NEW" ? "warn" : l.status === "QUALIFIED" ? "live" : "accent"}>
                    {l.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

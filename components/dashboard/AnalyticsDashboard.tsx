"use client";

import { useEffect, useState } from "react";
import { Nfc, Eye, QrCode, Download, Users, Target, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityChart } from "@/components/analytics/ActivityChart";
import { SourceBreakdown } from "@/components/analytics/SourceBreakdown";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Card } from "@/components/ui/Card";

interface AnalyticsData {
  taps: number;
  views: number;
  qrScans: number;
  saves: number;
  connections: number;
  leads: number;
  conversionRate: number;
  activity: { date: string; views: number; taps: number }[];
  sources: { source: string; count: number }[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
        else setError(json.error);
      })
      .catch(() => setError("Could not load analytics."));
  }, []);

  if (error) return <ErrorState description={error} />;
  if (!data) return <LoadingState label="Loading analytics" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="NFC Taps" value={data.taps} icon={Nfc} delay={0} />
        <StatCard label="Profile Views" value={data.views} icon={Eye} delay={0.03} />
        <StatCard label="QR Scans" value={data.qrScans} icon={QrCode} delay={0.06} />
        <StatCard label="Contacts Saved" value={data.saves} icon={Download} delay={0.09} />
        <StatCard label="Connections" value={data.connections} icon={Users} delay={0.12} />
        <StatCard label="Leads" value={data.leads} icon={Target} delay={0.15} />
        <Card className="p-5 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-text-faint uppercase tracking-wide">Conversion rate</span>
            <TrendingUp className="size-4 text-accent-strong" strokeWidth={1.5} />
          </div>
          <span className="font-display text-3xl text-text-primary">{data.conversionRate}%</span>
          <p className="text-xs text-text-faint mt-1">Connections + leads ÷ total views</p>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityChart data={data.activity} />
        </div>
        <SourceBreakdown sources={data.sources} />
      </div>
    </div>
  );
}

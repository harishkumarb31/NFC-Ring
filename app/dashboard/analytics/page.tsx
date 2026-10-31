import { PageHeader } from "@/components/dashboard/PageHeader";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="Analytics" subtitle="Real interaction data from every tap, scan, and click." />
      <AnalyticsDashboard />
    </div>
  );
}

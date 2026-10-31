import { PageHeader } from "@/components/dashboard/PageHeader";
import { LeadsTable } from "@/components/dashboard/LeadsTable";

export default function LeadsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="Leads" subtitle="Collaboration requests captured from your profile." />
      <LeadsTable />
    </div>
  );
}

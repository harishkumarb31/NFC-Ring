import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConnectionsTable } from "@/components/dashboard/ConnectionsTable";

export default function ConnectionsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="Connections" subtitle="Everyone who has connected with your profile." />
      <ConnectionsTable />
    </div>
  );
}

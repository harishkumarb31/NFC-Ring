import { PageHeader } from "@/components/dashboard/PageHeader";
import { AiBioGenerator } from "@/components/dashboard/AiBioGenerator";

export default function AiBioPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="RingAI" subtitle="Generate a professional bio in seconds." />
      <AiBioGenerator />
    </div>
  );
}

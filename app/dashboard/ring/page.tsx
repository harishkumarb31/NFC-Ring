import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RingManager } from "@/components/ring/RingManager";

export default async function RingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.ring) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <PageHeader title="My Ring" subtitle="No ring has been provisioned for your account yet." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <PageHeader title="My Ring" subtitle="Manage your ring status and NFC provisioning details." />
      <RingManager ring={user.ring} appUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} />
    </div>
  );
}

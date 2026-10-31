import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ToastProvider } from "@/components/ui/Toast";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar isAdmin />
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <PageHeader title="Admin" subtitle="Users, rings, and platform-wide metrics." />
            <AdminDashboard />
          </div>
        </main>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}

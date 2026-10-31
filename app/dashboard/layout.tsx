import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { ToastProvider } from "@/components/ui/Toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar isAdmin={user.role === "ADMIN"} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <MobileNav />
      </div>
    </ToastProvider>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Nfc,
  UserCircle,
  Users,
  Target,
  BarChart3,
  Sparkles,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ring", label: "My Ring", icon: Nfc },
  { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
  { href: "/dashboard/connections", label: "Connections", icon: Users },
  { href: "/dashboard/leads", label: "Leads", icon: Target },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/ai-bio", label: "AI Bio", icon: Sparkles },
];

export function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex md:w-60 shrink-0 border-r border-border-hair bg-surface-1/40 flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border-hair">
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-display text-sm">NFC Business Ring</span>
        </div>
        <nav className="p-3 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mt-2 border-t border-border-hair pt-4",
                pathname === "/admin" ? "text-accent-strong" : "text-text-muted hover:text-text-primary"
              )}
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          )}
        </nav>
      </div>
      <div className="p-3 border-t border-border-hair">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 w-full transition-colors"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

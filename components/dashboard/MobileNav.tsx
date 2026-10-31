"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Nfc, UserCircle, Users, Target, BarChart3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/ring", label: "Ring", icon: Nfc },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/connections", label: "Network", icon: Users },
  { href: "/dashboard/leads", label: "Leads", icon: Target },
  { href: "/dashboard/analytics", label: "Stats", icon: BarChart3 },
  { href: "/dashboard/ai-bio", label: "AI Bio", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border-hair bg-surface-1/95 backdrop-blur-md">
      <div className="flex items-stretch justify-between px-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px]",
                active ? "text-accent-strong" : "text-text-faint"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

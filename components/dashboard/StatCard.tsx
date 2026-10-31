"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LucideIcon,
  Nfc,
  Eye,
  Users,
  Target,
  QrCode,
  Download,
  PowerOff,
  MousePointerClick,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const ICON_MAP: Record<string, LucideIcon> = {
  nfc: Nfc,
  eye: Eye,
  users: Users,
  target: Target,
  qr: QrCode,
  download: Download,
  powerOff: PowerOff,
  click: MousePointerClick,
};

export type StatCardIcon = LucideIcon | keyof typeof ICON_MAP | string;

interface StatCardProps {
  label: string;
  value: number;
  icon: StatCardIcon;
  suffix?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, suffix = "", delay = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const IconComponent = typeof icon === "string" ? ICON_MAP[icon] || Target : icon;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-text-faint uppercase tracking-wide">{label}</span>
          {IconComponent && <IconComponent className="size-4 text-accent-strong" strokeWidth={1.5} />}
        </div>
        <span className="font-display text-3xl text-text-primary">
          {display}
          {suffix}
        </span>
      </Card>
    </motion.div>
  );
}

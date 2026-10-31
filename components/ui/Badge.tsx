import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "live" | "off" | "warn" | "neutral" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  live: "bg-status-live/10 text-status-live",
  off: "bg-status-off/10 text-status-off",
  warn: "bg-status-warn/10 text-status-warn",
  neutral: "bg-surface-2 text-text-muted",
  accent: "bg-accent-soft text-accent-strong",
};

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full", {
        "bg-status-live": tone === "live",
        "bg-status-off": tone === "off",
        "bg-status-warn": tone === "warn",
        "bg-text-faint": tone === "neutral",
        "bg-accent": tone === "accent",
      })} />
      {children}
    </span>
  );
}

"use client";

import { Nfc, QrCode, Link2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface SourceRow {
  source: string;
  count: number;
}

const ICONS: Record<string, React.ElementType> = { NFC: Nfc, QR: QrCode, DIRECT: Link2 };
const LABELS: Record<string, string> = { NFC: "NFC Tap", QR: "QR Scan", DIRECT: "Direct Link" };

export function SourceBreakdown({ sources }: { sources: SourceRow[] }) {
  const total = sources.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top interaction sources</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-2">
        {sources.length === 0 && <p className="text-sm text-text-faint">No interactions yet.</p>}
        {sources.map((s) => {
          const Icon = ICONS[s.source] ?? Link2;
          const pct = Math.round((s.count / total) * 100);
          return (
            <div key={s.source}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 text-text-primary">
                  <Icon className="size-3.5 text-accent-strong" /> {LABELS[s.source] ?? s.source}
                </span>
                <span className="text-text-faint">{s.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Download, Power, PowerOff, Nfc, CheckCircle2, ExternalLink } from "lucide-react";
import type { Ring } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export function RingManager({ ring: initialRing, appUrl }: { ring: Ring; appUrl: string }) {
  const { showToast } = useToast();
  const [ring, setRing] = useState(initialRing);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState(appUrl);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  const profileUrl = `${origin}/u/${ring.token}`;
  const nfcUrl = `${origin}/u/${ring.token}?source=nfc`;

  async function toggleStatus() {
    setLoading(true);
    try {
      const endpoint = ring.status === "ACTIVE" ? "/api/ring/deactivate" : "/api/ring/activate";
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setRing(json.data);
        showToast(`Ring ${json.data.status === "ACTIVE" ? "activated" : "deactivated"}`);
      } else {
        showToast(json.error, "error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  }

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-3 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-accent-soft flex items-center justify-center">
              <Nfc className="size-5 text-accent-strong" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Ring #{ring.id.slice(0, 8)}</p>
              <p className="text-xs text-text-faint">Created {new Date(ring.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Badge tone={ring.status === "ACTIVE" ? "live" : "off"}>{ring.status}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "RING STATUS", value: ring.status === "ACTIVE" ? "Active" : "Inactive", tone: ring.status === "ACTIVE" ? "live" : "off" },
            { label: "NFC", value: "Ready", tone: "live" },
            { label: "PROFILE", value: "Connected", tone: "live" },
          ].map((row) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-border-hair bg-surface-2 p-3"
            >
              <p className="text-[10px] uppercase tracking-wide text-text-faint mb-1.5">{row.label}</p>
              <p className="text-sm flex items-center gap-1.5 text-text-primary">
                <CheckCircle2 className="size-3.5 text-status-live" /> {row.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-text-faint mb-1.5">Ring token</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-surface-2 border border-border-hair px-3 py-2 text-xs font-mono text-text-muted">
                {ring.token}
              </code>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-faint mb-1.5">NFC URL (write this to your NTAG213)</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-surface-2 border border-border-hair px-3 py-2 text-xs font-mono text-text-muted">
                {nfcUrl}
              </code>
              <Button size="sm" variant="secondary" onClick={() => copy(nfcUrl, "NFC URL")} icon={<Copy className="size-3.5" />} />
            </div>
          </div>
          <div>
            <p className="text-xs text-text-faint mb-1.5">Public profile URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-surface-2 border border-border-hair px-3 py-2 text-xs font-mono text-text-muted">
                {profileUrl}
              </code>
              <Button size="sm" variant="secondary" onClick={() => copy(profileUrl, "Profile URL")} icon={<Copy className="size-3.5" />} title="Copy URL" />
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="secondary" icon={<ExternalLink className="size-3.5" />} title="Open profile in new tab" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant={ring.status === "ACTIVE" ? "danger" : "primary"}
            onClick={toggleStatus}
            loading={loading}
            icon={ring.status === "ACTIVE" ? <PowerOff className="size-4" /> : <Power className="size-4" />}
          >
            {ring.status === "ACTIVE" ? "Deactivate ring" : "Activate ring"}
          </Button>
        </div>
      </Card>

      <Card className="lg:col-span-2 p-6 flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-wide text-text-faint mb-4">Profile QR code</p>
        <div className="rounded-xl overflow-hidden border border-border-hair-strong bg-white p-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/public/${ring.token}/qr`} alt="Ring profile QR code" width={200} height={200} />
        </div>
        <a href={`/api/public/${ring.token}/qr`} download="ring-qr.png">
          <Button variant="secondary" icon={<Download className="size-4" />}>
            Download QR
          </Button>
        </a>
        <p className="text-xs text-text-faint mt-4 leading-relaxed">
          Scanning this QR opens the exact same profile as an NFC tap, tracked as its own source.
        </p>
      </Card>
    </div>
  );
}

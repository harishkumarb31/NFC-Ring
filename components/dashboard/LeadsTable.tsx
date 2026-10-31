"use client";

import { useCallback, useEffect, useState } from "react";
import { Target, Search } from "lucide-react";
import type { Lead } from "@prisma/client";
import type { LeadStatus } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

const STATUS_TONE: Record<LeadStatus, "warn" | "accent" | "live" | "off"> = {
  NEW: "warn",
  CONTACTED: "accent",
  QUALIFIED: "live",
  CLOSED: "off",
};

export function LeadsTable() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");

  const load = useCallback(() => {
    const params = new URLSearchParams({ q, status, sort });
    fetch(`/api/leads?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setLeads(json.data);
        else setError(json.error);
      })
      .catch(() => setError("Could not load leads."));
  }, [q, status, sort]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(id: string, newStatus: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) {
      setLeads((prev) => prev?.map((l) => (l.id === id ? json.data : l)) ?? null);
      showToast("Lead status updated");
    } else {
      showToast(json.error, "error");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-faint" />
          <Input placeholder="Search name, email, company…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
          <option value="ALL">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="CLOSED">Closed</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-40">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </div>

      {error && <ErrorState description={error} />}
      {!error && !leads && <LoadingState label="Loading leads" />}
      {!error && leads && leads.length === 0 && (
        <EmptyState icon={Target} title="No leads yet" description="Collaboration requests submitted on your profile will appear here." />
      )}
      {!error && leads && leads.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-hair text-left text-xs text-text-faint uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Message</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-border-hair last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-3.5 text-text-primary font-medium">{l.name}</td>
                    <td className="px-5 py-3.5 text-text-muted">
                      <div>{l.email}</div>
                      {l.phone && <div className="text-xs text-text-faint">{l.phone}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-text-muted">{l.company || "—"}</td>
                    <td className="px-5 py-3.5 text-text-muted max-w-xs truncate">{l.message || "—"}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                        className="bg-transparent text-xs rounded-md border border-border-hair px-2 py-1"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      <Badge tone={STATUS_TONE[l.status as LeadStatus]} className="ml-2 hidden sm:inline-flex">{l.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-text-faint whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

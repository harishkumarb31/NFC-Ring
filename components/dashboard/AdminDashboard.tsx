"use client";

import { useEffect, useState } from "react";
import { Users, Nfc, PowerOff, Target, MousePointerClick } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

interface AdminStats {
  totalUsers: number;
  activeRings: number;
  inactiveRings: number;
  totalTaps: number;
  totalLeads: number;
}

interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  ringId: string | null;
  ringStatus: "ACTIVE" | "INACTIVE" | null;
  ringToken: string | null;
}

export function AdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    Promise.all([fetch("/api/admin/stats").then((r) => r.json()), fetch("/api/admin/users").then((r) => r.json())])
      .then(([statsJson, usersJson]) => {
        if (statsJson.success) setStats(statsJson.data);
        else setError(statsJson.error);
        if (usersJson.success) setUsers(usersJson.data);
      })
      .catch(() => setError("Could not load admin data."));
  }

  useEffect(load, []);

  async function toggleRing(userId: string, ringId: string | null, current: "ACTIVE" | "INACTIVE" | null) {
    if (!ringId) return;
    const next = current === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await fetch(`/api/admin/rings/${ringId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const json = await res.json();
    if (json.success) {
      setUsers((prev) => prev?.map((u) => (u.id === userId ? { ...u, ringStatus: next } : u)) ?? null);
      showToast(`Ring ${next === "ACTIVE" ? "activated" : "deactivated"}`);
    } else {
      showToast(json.error, "error");
    }
  }

  if (error) return <ErrorState description={error} />;
  if (!stats || !users) return <LoadingState label="Loading admin dashboard" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} delay={0} />
        <StatCard label="Active Rings" value={stats.activeRings} icon={Nfc} delay={0.04} />
        <StatCard label="Inactive Rings" value={stats.inactiveRings} icon={PowerOff} delay={0.08} />
        <StatCard label="Total Taps" value={stats.totalTaps} icon={MousePointerClick} delay={0.12} />
        <StatCard label="Total Leads" value={stats.totalLeads} icon={Target} delay={0.16} />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-hair text-left text-xs text-text-faint uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Ring</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border-hair last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-3.5 text-text-primary font-medium">{u.name}</td>
                  <td className="px-5 py-3.5 text-text-muted">{u.email}</td>
                  <td className="px-5 py-3.5 text-text-faint font-mono text-xs">{u.ringToken ? u.ringToken.slice(0, 10) + "…" : "—"}</td>
                  <td className="px-5 py-3.5">
                    {u.ringStatus && <Badge tone={u.ringStatus === "ACTIVE" ? "live" : "off"}>{u.ringStatus}</Badge>}
                  </td>
                  <td className="px-5 py-3.5 text-text-faint whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    {u.ringId && (
                      <Button size="sm" variant="secondary" onClick={() => toggleRing(u.id, u.ringId, u.ringStatus)}>
                        {u.ringStatus === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

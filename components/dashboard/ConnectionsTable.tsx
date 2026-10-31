"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import type { Connection } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export function ConnectionsTable() {
  const [connections, setConnections] = useState<Connection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/connections")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setConnections(json.data);
        else setError(json.error);
      })
      .catch(() => setError("Could not load connections."));
  }, []);

  if (error) return <ErrorState description={error} />;
  if (!connections) return <LoadingState label="Loading connections" />;
  if (connections.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No connections yet"
        description="When someone taps your ring and connects, they'll show up here."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-hair text-left text-xs text-text-faint uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Message</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {connections.map((c) => (
              <tr key={c.id} className="border-b border-border-hair last:border-0 hover:bg-surface-2/60">
                <td className="px-5 py-3.5 text-text-primary font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-text-muted">{c.email}</td>
                <td className="px-5 py-3.5 text-text-muted">{c.company || "—"}</td>
                <td className="px-5 py-3.5 text-text-muted max-w-xs truncate">{c.message || "—"}</td>
                <td className="px-5 py-3.5 text-text-faint whitespace-nowrap">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

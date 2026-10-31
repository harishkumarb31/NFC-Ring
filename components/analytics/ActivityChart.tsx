"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface DayPoint {
  date: string;
  views: number;
  taps: number;
}

export function ActivityChart({ data }: { data: DayPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-day activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatted} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a670" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#c9a670" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tapsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fbf8f" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6fbf8f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="label" stroke="#6c6c72" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6c6c72" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #ffffff1a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#9a9a9f" }}
              />
              <Area type="monotone" dataKey="views" name="Views" stroke="#c9a670" fill="url(#viewsFill)" strokeWidth={2} />
              <Area type="monotone" dataKey="taps" name="NFC Taps" stroke="#6fbf8f" fill="url(#tapsFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

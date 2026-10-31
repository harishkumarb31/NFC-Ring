"use client";

import { useState } from "react";
import { Briefcase, Building2, User as UserIcon, Save } from "lucide-react";
// @ts-ignore (VS Code sometimes fails to pick up Prisma generated types)
import type { Profile } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const MODES = [
  { value: "BUSINESS", label: "Business", desc: "Company, designation, website, LinkedIn" },
  { value: "SALES", label: "Sales", desc: "Products, services, WhatsApp, CTA" },
  { value: "EVENT", label: "Event", desc: "Short bio, LinkedIn, portfolio" },
  { value: "PERSONAL", label: "Personal", desc: "Social links, portfolio" },
];

type FormState = {
  name: string;
  company: string;
  designation: string;
  bio: string;
  shortBio: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  whatsapp: string;
  portfolioUrl: string;
  photoUrl: string;
  services: string;
  mode: "BUSINESS" | "PERSONAL" | "SALES" | "EVENT";
};

function toForm(p: Profile): FormState {
  return {
    name: p.name ?? "",
    company: p.company ?? "",
    designation: p.designation ?? "",
    bio: p.bio ?? "",
    shortBio: p.shortBio ?? "",
    phone: p.phone ?? "",
    email: p.email ?? "",
    website: p.website ?? "",
    linkedin: p.linkedin ?? "",
    whatsapp: p.whatsapp ?? "",
    portfolioUrl: p.portfolioUrl ?? "",
    photoUrl: p.photoUrl ?? "",
    services: p.services ?? "",
    mode: p.mode as "BUSINESS" | "PERSONAL" | "SALES" | "EVENT",
  };
}

export function ProfileEditor({ profile }: { profile: Profile }) {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(toForm(profile));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error, "error");
        return;
      }
      showToast("Profile saved");
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="size-4" /> Identity</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 pt-2">
            <Input label="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Input label="Photo URL" value={form.photoUrl} onChange={(e) => set("photoUrl", e.target.value)} placeholder="https://…" />
            <Input label="Short bio" value={form.shortBio} onChange={(e) => set("shortBio", e.target.value)} placeholder="One-line tagline" className="sm:col-span-2" />
            <Textarea label="Full bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} className="sm:col-span-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="size-4" /> Business details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 pt-2">
            <Input label="Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
            <Input label="Designation" value={form.designation} onChange={(e) => set("designation", e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            <Input label="Website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
            <Input label="LinkedIn" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" />
            <Input label="WhatsApp number" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91…" />
            <Input label="Portfolio URL" value={form.portfolioUrl} onChange={(e) => set("portfolioUrl", e.target.value)} placeholder="https://…" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="size-4" /> Services</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Textarea rows={3} value={form.services} onChange={(e) => set("services", e.target.value)} placeholder="What you offer, comma or newline separated" />
          </CardContent>
        </Card>

        <Button type="submit" loading={saving} icon={<Save className="size-4" />} className="self-start">
          Save changes
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sharing mode</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                type="button"
                key={m.value}
                onClick={() => set("mode", m.value as FormState["mode"])}
                className={`text-left rounded-lg border px-3.5 py-3 transition-colors ${
                  form.mode === m.value
                    ? "border-accent bg-accent-soft"
                    : "border-border-hair bg-surface-2 hover:bg-surface-3"
                }`}
              >
                <p className="text-sm font-medium text-text-primary">{m.label}</p>
                <p className="text-xs text-text-faint mt-0.5">{m.desc}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 text-center">
            <div className="size-16 rounded-full bg-surface-2 border border-border-hair mx-auto mb-3 flex items-center justify-center font-display text-accent-strong">
              {form.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?"}
            </div>
            <p className="text-sm font-medium text-text-primary">{form.name || "Your name"}</p>
            <p className="text-xs text-text-faint mt-0.5">
              {form.designation || "Designation"}{form.company ? ` · ${form.company}` : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

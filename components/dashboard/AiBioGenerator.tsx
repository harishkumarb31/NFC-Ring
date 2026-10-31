"use client";

import { useState, useEffect } from "react";
import { Sparkles, Copy, RotateCw, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Result {
  shortBio: string;
  fullBio: string;
}

export function AiBioGenerator() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    designation: "",
    company: "",
    skills: "",
    experience: "",
    industry: "",
    tone: "Professional",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const p = json.data;
          setForm((f) => ({
            ...f,
            name: p.name || f.name,
            designation: p.designation || f.designation,
            company: p.company || f.company,
            skills: p.services || f.skills,
          }));
        }
      })
      .catch(() => {});
  }, []);

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error, "error");
        return;
      }
      setResult(json.data);
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function useThisBio() {
    if (!result) return;
    setApplying(true);
    try {
      const profileRes = await fetch("/api/profile");
      const profileJson = await profileRes.json();
      if (!profileJson.success) throw new Error();
      const current = profileJson.data;
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...current,
          company: current.company ?? "",
          designation: current.designation ?? "",
          phone: current.phone ?? "",
          email: current.email ?? "",
          website: current.website ?? "",
          linkedin: current.linkedin ?? "",
          whatsapp: current.whatsapp ?? "",
          portfolioUrl: current.portfolioUrl ?? "",
          photoUrl: current.photoUrl ?? "",
          services: current.services ?? "",
          shortBio: result.shortBio,
          bio: result.fullBio,
        }),
      });
      const json = await res.json();
      if (json.success) showToast("Bio applied to your profile");
      else showToast(json.error, "error");
    } catch {
      showToast("Could not apply bio to profile.", "error");
    } finally {
      setApplying(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-accent-strong" /> RingAI — Bio generator</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={generate} className="flex flex-col gap-4">
            <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Designation" required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Input label="Skills" required placeholder="React, product design, growth strategy" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Experience" required placeholder="5 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              <Input label="Industry" required placeholder="Construction tech" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <Select label="Tone" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
              <option>Professional</option>
              <option>Modern</option>
              <option>Executive</option>
              <option>Friendly</option>
            </Select>
            <Button type="submit" loading={loading} icon={<Sparkles className="size-4" />}>
              {result ? "Regenerate" : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated bio</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {!result && !loading && (
            <p className="text-sm text-text-faint py-10 text-center">
              Fill out the form and generate to see your bio here.
            </p>
          )}
          {loading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="ring-mark size-8" />
              <span className="text-xs text-text-faint">Writing your bio…</span>
            </div>
          )}
          {result && !loading && (
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs uppercase tracking-wide text-text-faint">Short bio</p>
                  <button onClick={() => copy(result.shortBio)} className="text-text-faint hover:text-text-primary">
                    <Copy className="size-3.5" />
                  </button>
                </div>
                <p className="text-sm text-text-primary bg-surface-2 border border-border-hair rounded-lg p-3">{result.shortBio}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs uppercase tracking-wide text-text-faint">Full bio</p>
                  <button onClick={() => copy(result.fullBio)} className="text-text-faint hover:text-text-primary">
                    <Copy className="size-3.5" />
                  </button>
                </div>
                <p className="text-sm text-text-primary bg-surface-2 border border-border-hair rounded-lg p-3 leading-relaxed">{result.fullBio}</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => generate()} icon={<RotateCw className="size-4" />}>
                  Regenerate
                </Button>
                <Button onClick={useThisBio} loading={applying} icon={<Check className="size-4" />}>
                  Use this bio
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

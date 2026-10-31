"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Download,
  UserPlus,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Share2,
  QrCode as QrCodeIcon,
  Briefcase,
} from "lucide-react";
import type { Profile } from "@prisma/client";
import type { EventSource } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { LinkedinGlyph } from "@/components/ui/icons";

interface Props {
  profile: Profile;
  token: string;
  source: EventSource;
}

function ConnectModal({ open, onClose, token, source }: { open: boolean; onClose: () => void; token: string; source: EventSource }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, source: source.toLowerCase(), ...form }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error, "error");
        return;
      }
      showToast("Connection request sent");
      onClose();
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Connect">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input label="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <Textarea label="Message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button type="submit" loading={loading} className="w-full">Send connection request</Button>
      </form>
    </Modal>
  );
}

function LeadModal({ open, onClose, token, source }: { open: boolean; onClose: () => void; token: string; source: EventSource }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, source: source.toLowerCase(), ...form }),
      });
      const json = await res.json();
      if (!json.success) {
        showToast(json.error, "error");
        return;
      }
      showToast("Request sent — they'll be in touch");
      onClose();
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Request collaboration">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input label="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <Textarea label="What are you looking to do?" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button type="submit" loading={loading} className="w-full">Send request</Button>
      </form>
    </Modal>
  );
}

function QrModal({ open, onClose, token }: { open: boolean; onClose: () => void; token: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Scan to share">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl overflow-hidden border border-border-hair-strong bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/public/${token}/qr`} alt="Profile QR code" width={220} height={220} />
        </div>
        <a href={`/api/public/${token}/qr`} download="profile-qr.png" className="text-sm text-accent-strong hover:underline">
          Download QR code
        </a>
      </div>
    </Modal>
  );
}

function ProfileContent({ profile, token, source }: Props) {
  const { showToast } = useToast();
  const [connectOpen, setConnectOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const initials = profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const sourceParam = source.toLowerCase();

  async function share() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Profile link copied");
    }
  }

  const modeLabel: Record<string, string> = {
    BUSINESS: "Business",
    PERSONAL: "Personal",
    SALES: "Sales",
    EVENT: "Event",
  };

  return (
    <div className="flex-1 flex flex-col items-center px-5 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border-hair bg-surface-1 overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-accent-soft to-transparent relative">
            <span className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-accent-strong bg-surface-0/70 px-2 py-1 rounded-full">
              {modeLabel[profile.mode]}
            </span>
          </div>
          <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {profile.photoUrl && !imageError ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  width={96}
                  height={96}
                  unoptimized
                  onError={() => setImageError(true)}
                  className="rounded-full border-4 border-surface-1 object-cover size-24"
                />
              ) : (
                <div className="size-24 rounded-full border-4 border-surface-1 bg-surface-2 flex items-center justify-center font-display text-2xl text-accent-strong">
                  {initials}
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="font-display text-2xl mt-4"
            >
              {profile.name}
            </motion.h1>
            {profile.designation && (
              <p className="text-sm text-text-muted mt-1">
                {profile.designation}
                {profile.company ? ` · ${profile.company}` : ""}
              </p>
            )}
            {profile.shortBio && <p className="text-sm text-accent-strong mt-2">{profile.shortBio}</p>}
            {profile.bio && <p className="text-sm text-text-muted mt-3 leading-relaxed">{profile.bio}</p>}

            {profile.services && (
              <div className="mt-4 w-full text-left">
                <p className="text-xs uppercase tracking-wide text-text-faint mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="size-3.5" /> Services
                </p>
                <p className="text-sm text-text-muted">{profile.services}</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="grid grid-cols-2 gap-2.5 w-full mt-6"
            >
              <a
                href={`/api/public/${token}/vcard?source=${sourceParam}`}
                className="col-span-2 inline-flex items-center justify-center gap-2 bg-accent text-surface-0 hover:bg-accent-strong font-medium rounded-lg px-4 py-3 text-sm transition-colors"
              >
                <Download className="size-4" /> Save contact
              </a>
              <Button variant="secondary" onClick={() => setConnectOpen(true)} icon={<UserPlus className="size-4" />}>
                Connect
              </Button>
              <Button variant="secondary" onClick={() => setLeadOpen(true)} icon={<MessageCircle className="size-4" />}>
                Collaborate
              </Button>
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border-hair hover:bg-surface-3 rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border-hair hover:bg-surface-3 rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  <Mail className="size-4" /> Email
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border-hair hover:bg-surface-3 rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  <Phone className="size-4" /> Call
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border-hair hover:bg-surface-3 rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  <LinkedinGlyph className="size-4" /> LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-surface-2 border border-border-hair hover:bg-surface-3 rounded-lg px-4 py-2.5 text-sm font-medium"
                >
                  <Globe className="size-4" /> Portfolio
                </a>
              )}
            </motion.div>

            <div className="flex items-center gap-4 mt-6">
              <button onClick={() => setQrOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-text-primary">
                <QrCodeIcon className="size-3.5" /> QR code
              </button>
              <button onClick={share} className="inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-text-primary">
                <Share2 className="size-3.5" /> Share profile
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-text-faint mt-6">Powered by NFC Business Ring</p>
      </motion.div>

      <ConnectModal open={connectOpen} onClose={() => setConnectOpen(false)} token={token} source={source} />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} token={token} source={source} />
      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} token={token} />
    </div>
  );
}

export function PublicProfileView(props: Props) {
  return (
    <ToastProvider>
      <ProfileContent {...props} />
    </ToastProvider>
  );
}

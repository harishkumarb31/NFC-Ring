import Link from "next/link";
import {
  Nfc,
  ScanLine,
  IdCard,
  Users,
  BarChart3,
  Sparkles,
  QrCode,
  ArrowRight,
  Contact,
  Radio,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Droplets,
  BatteryCharging,
  Smartphone,
} from "lucide-react";
import { LandingNav } from "@/components/landing/Nav";
import { LandingFooter } from "@/components/landing/Footer";
import { RingVisual } from "@/components/landing/RingVisual";
import { Reveal } from "@/components/landing/Reveal";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-accent-strong bg-accent-soft px-3 py-1.5 rounded-full mb-6">
                <span className="size-1.5 rounded-full bg-accent-strong animate-pulse" />
                Wearable digital identity
              </div>
              <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight text-text-primary">
                One ring.
                <br />
                One tap.
                <br />
                <span className="text-accent-strong">Infinite connections.</span>
              </h1>
              <p className="mt-6 text-lg text-text-muted max-w-md leading-relaxed">
                Your professional identity, always with you. Tap your ring against any smartphone
                to share your profile, exchange contacts, and capture qualified leads — zero app required.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-accent text-surface-0 hover:bg-accent-strong font-medium rounded-lg px-6 py-3.5 text-sm transition-all duration-150 shadow-lg shadow-accent/10"
                >
                  Get started free <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm font-medium transition-colors px-4 py-3.5 rounded-lg border border-border-hair hover:bg-surface-1"
                >
                  See how it works
                </a>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-text-faint">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-status-live" /> iOS & Android
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-status-live" /> No battery needed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-status-live" /> Dynamic cloud profile
                </span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <RingVisual size={340} />
            </div>
          </div>
        </section>

        {/* HARDWARE SPECIFICATIONS BANNER */}
        <section className="border-y border-border-hair bg-surface-1/50 py-8">
          <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-2 border border-border-hair flex items-center justify-center shrink-0">
                <Cpu className="size-5 text-accent-strong" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-text-faint">NFC Chip</p>
                <p className="text-sm font-medium text-text-primary">NTAG213 13.56 MHz</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-2 border border-border-hair flex items-center justify-center shrink-0">
                <BatteryCharging className="size-5 text-accent-strong" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-text-faint">Power</p>
                <p className="text-sm font-medium text-text-primary">0% Battery • Passive RF</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-2 border border-border-hair flex items-center justify-center shrink-0">
                <Droplets className="size-5 text-accent-strong" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-text-faint">Durability</p>
                <p className="text-sm font-medium text-text-primary">IP68 Waterproof</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-2 border border-border-hair flex items-center justify-center shrink-0">
                <Smartphone className="size-5 text-accent-strong" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-text-faint">Compatibility</p>
                <p className="text-sm font-medium text-text-primary">All NFC Phones + QR</p>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROBLEM STATEMENT */}
        <Reveal>
          <section className="border-b border-border-hair">
            <div className="mx-auto max-w-6xl px-6 py-20 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-faint mb-4">
                The problem with paper
              </p>
              <h2 className="font-display text-3xl sm:text-4xl max-w-2xl mx-auto leading-tight">
                88% of paper business cards get thrown away within a week.
              </h2>
              <p className="mt-4 text-text-muted max-w-lg mx-auto">
                Your network deserves better than a stack of cardstock. Identity should live on
                you, update in real time, and work the moment you meet someone.
              </p>
            </div>
          </section>
        </Reveal>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-b border-border-hair bg-surface-1/30">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-strong mb-3 text-center">
                How it works
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-center mb-16">
                From tap to connection in under two seconds
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Radio,
                  step: "01",
                  title: "Wear",
                  body: "A passive NTAG213 chip sits safely inside the ring — zero battery, no charging cables, and no Bluetooth pairing required.",
                },
                {
                  icon: ScanLine,
                  step: "02",
                  title: "Tap",
                  body: "Touch your ring to any NFC-enabled iPhone or Android phone. The browser opens natively and instantly without downloading an app.",
                },
                {
                  icon: IdCard,
                  step: "03",
                  title: "Connect",
                  body: "Your live digital profile loads. Contacts are saved straight to their phonebook with real vCard export, and leads are logged in your dashboard.",
                },
              ].map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div className="rounded-xl border border-border-hair bg-surface-1 p-7 h-full flex flex-col justify-between hover:border-accent/30 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <step.icon className="size-5 text-accent-strong" strokeWidth={1.5} />
                        <span className="font-mono text-xs text-text-faint">{step.step}</span>
                      </div>
                      <h3 className="font-display text-lg mb-2">{step.title}</h3>
                      <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section id="identity" className="border-b border-border-hair">
          <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-16">
            <Reveal>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <Nfc className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">A profile that&apos;s actually yours</h3>
              <p className="text-text-muted leading-relaxed">
                Photo, title, company, bio, socials, and services — all editable in real time.
                Switch between Business, Sales, Event, and Personal modes so the right details
                surface for the right room. Change your number or title anytime without re-flashing the ring.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <Users className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Networking that doesn&apos;t end at the handshake</h3>
              <p className="text-text-muted leading-relaxed">
                Every tap can become a connection. Visitors save your contact as a real vCard,
                send a connection request, or request to collaborate — all logged automatically
                in your private dashboard with contact management.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="intelligence" className="border-b border-border-hair bg-surface-1/30">
          <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-16">
            <Reveal>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <BarChart3 className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">Analytics you can act on</h3>
              <p className="text-text-muted leading-relaxed">
                Every tap, view, scan, save, connection, and lead is an authenticated event — tracked by
                source (NFC, QR, Direct), so you know exactly which events and conversations drive your network growth.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <Sparkles className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">RingAI writes your first draft</h3>
              <p className="text-text-muted leading-relaxed">
                Give RingAI your role, skills, and preferred tone — it drafts a tailored short tagline
                and full executive biography in seconds. Regenerate until it sounds like you, then publish with one click.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-border-hair">
          <div className="mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-16">
            <Reveal>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <QrCode className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">No NFC phone? No problem</h3>
              <p className="text-text-muted leading-relaxed">
                Every profile comes equipped with an on-screen QR code alternative. Scan it with any camera and the exact
                same digital profile opens — same design, same contact actions, tracked distinctly as a QR scan.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="size-10 rounded-lg bg-accent-soft flex items-center justify-center mb-5">
                <Contact className="size-5 text-accent-strong" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl mb-3">A contact card that actually saves</h3>
              <p className="text-text-muted leading-relaxed">
                The &quot;Save contact&quot; action generates a verified RFC 2426 .vcf card with your name, company, title, phone,
                email, and website — directly opening the native phone contacts app on iOS and Android.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="border-b border-border-hair bg-surface-1/20 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="text-center mb-16">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-strong mb-3">
                  Got questions?
                </p>
                <h2 className="font-display text-3xl sm:text-4xl">Frequently asked questions</h2>
              </div>
            </Reveal>
            <div className="grid gap-6">
              {[
                {
                  q: "Does the person receiving my information need an app?",
                  a: "No. When you tap the ring against any modern smartphone, their default web browser opens your digital profile instantly. No app installation or sign-up required for the other party.",
                },
                {
                  q: "Do I ever need to charge the ring?",
                  a: "Never. The ring uses passive NFC (NTAG213) technology. It draws minuscule radio-frequency energy from the reading smartphone when held near it, requiring zero batteries or chargers.",
                },
                {
                  q: "What happens if I change my job, phone number, or email?",
                  a: "Your ring points to a secure cloud profile URL. You can update your phone, email, title, social links, or bio anytime from your dashboard — your physical ring updates automatically without rewriting the NFC chip.",
                },
                {
                  q: "Can I temporarily deactivate my ring if it gets lost?",
                  a: "Yes. From your My Ring dashboard, you can toggle your ring status to 'Inactive' with one click. Anyone attempting to tap your ring will see an inactive message until you re-enable it.",
                },
              ].map((item, i) => (
                <Reveal key={item.q} delay={i * 0.06}>
                  <div className="rounded-xl border border-border-hair bg-surface-1 p-6">
                    <h4 className="font-display text-base text-text-primary mb-2 flex items-center gap-2">
                      <HelpCircle className="size-4 text-accent-strong shrink-0" />
                      {item.q}
                    </h4>
                    <p className="text-sm text-text-muted leading-relaxed pl-6">{item.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <Reveal>
          <section className="border-b border-border-hair">
            <div className="mx-auto max-w-3xl px-6 py-28 text-center">
              <ShieldCheck className="size-8 text-accent-strong mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="font-display text-4xl mb-4">Your identity. Always on you.</h2>
              <p className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
                Create your professional profile, provision your ring token, and start turning every handshake into
                a relationship you can track.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-accent text-surface-0 hover:bg-accent-strong font-medium rounded-lg px-7 py-3.5 text-sm transition-colors shadow-lg shadow-accent/10"
                >
                  Get started free <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary px-5 py-3.5 text-sm font-medium transition-colors"
                >
                  Sign in to dashboard
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
      <LandingFooter />
    </>
  );
}

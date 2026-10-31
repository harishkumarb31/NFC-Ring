import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-hair bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-display text-base tracking-wide">NFC Business Ring</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</a>
          <a href="#identity" className="hover:text-text-primary transition-colors">Identity</a>
          <a href="#intelligence" className="hover:text-text-primary transition-colors">Intelligence</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors hidden sm:block">
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-accent text-surface-0 hover:bg-accent-strong rounded-lg px-4 py-2 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

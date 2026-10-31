import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border-hair mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="size-2 rounded-full bg-accent" />
            <span className="font-display text-base">NFC Business Ring</span>
          </div>
          <p className="text-sm text-text-faint max-w-xs">
            Wearable digital identity for professional networking. One ring. One tap. Infinite connections.
          </p>
        </div>
        <div className="flex gap-8 text-sm text-text-muted">
          <Link href="/login" className="hover:text-text-primary transition-colors">Log in</Link>
          <Link href="/register" className="hover:text-text-primary transition-colors">Get started</Link>
        </div>
      </div>
      <div className="border-t border-border-hair py-6 text-center text-xs text-text-faint">
        © {new Date().getFullYear()} NFC Business Ring. Built for professionals who move fast.
      </div>
    </footer>
  );
}

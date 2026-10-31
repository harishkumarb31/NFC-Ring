"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Invalid email or password.");
        return;
      }

      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    } catch {
      setError("Connection to server failed. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="size-2 rounded-full bg-accent" />
          <span className="font-display text-base">NFC Business Ring</span>
        </Link>
        <h1 className="font-display text-2xl">Welcome back</h1>
        <p className="text-sm text-text-faint mt-1">Log in to manage your ring and digital identity.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-start gap-2.5"
        >
          <AlertCircle className="size-4 shrink-0 text-red-400 mt-0.5" />
          <span className="leading-relaxed flex-1">{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="hover:text-text-primary transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <Button type="submit" loading={loading} disabled={loading} className="w-full mt-2">
          Log in
        </Button>
      </form>

      <p className="text-sm text-text-faint text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent-strong hover:underline font-medium">
          Get started
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

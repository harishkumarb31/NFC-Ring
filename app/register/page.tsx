"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setError("Full name must be at least 2 characters long.");
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Registration could not be completed. Please try again.");
        return;
      }

      // Successful registration: session cookie is set, proceed to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network or server connection failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const isPasswordValid = password.length >= 8;
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
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
          <h1 className="font-display text-2xl">Create your identity</h1>
          <p className="text-sm text-text-faint mt-1">
            Your profile and ring token are provisioned automatically.
          </p>
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
            label="Full name"
            name="name"
            autoComplete="name"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            autoComplete="new-password"
            required
            hint="At least 8 characters"
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

          <Input
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="hover:text-text-primary transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />

          {/* Live password matching feedback */}
          {password.length > 0 && confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              {isMatch ? (
                <span className="text-status-live flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-amber-400">Passwords do not match yet</span>
              )}
            </div>
          )}

          <Button type="submit" loading={loading} disabled={loading} className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-sm text-text-faint text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-strong hover:underline font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

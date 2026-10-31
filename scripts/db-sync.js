#!/usr/bin/env node

/**
 * db-sync.js
 *
 * Automatically synchronizes the Prisma schema with the PostgreSQL database
 * (e.g., Neon PostgreSQL on Vercel) during the production build step.
 *
 * If a PostgreSQL connection is detected, this runs `prisma db push` to ensure
 * all tables (User, Profile, Ring, Connection, Lead, AnalyticsEvent) and indexes
 * are created/updated before the Next.js app starts serving requests.
 */

const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "";

console.log("[db-sync] Checking database synchronization requirements...");

if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  console.log("[db-sync] PostgreSQL connection string detected.");
  console.log("[db-sync] Synchronizing Prisma models to PostgreSQL database...");
  try {
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      stdio: "inherit",
      env: process.env,
    });
    console.log("[db-sync] Database schema synchronized successfully.");
  } catch (err) {
    console.error(
      "[db-sync] Notice: prisma db push failed or database is currently unreachable. Build will proceed:",
      err.message
    );
  }
} else {
  console.log("[db-sync] Non-PostgreSQL database URL detected. Skipping push.");
}

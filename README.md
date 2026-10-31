# NFC Business Ring — Wearable Digital Identity & Networking Platform

> **One Ring. One Tap. Infinite Connections.**

A production-grade, wearable digital identity platform built for modern professionals, founders, and executives. A passive NTAG213 NFC ring resolves instantly to a live, editable digital business profile — enabling seamless contact exchange, vCard downloads, lead capture, and real-time interaction analytics without requiring any app installation.

---

## Architecture Overview

The NFC Business Ring platform operates on a zero-friction, app-less interaction model. The physical ring stores only a secure, lightweight NDEF URI record (`https://yourdomain.com/u/{token}?source=nfc`). 

When tapped against any NFC-enabled smartphone (iOS or Android):
1. The smartphone's native NFC reader reads the 13.56 MHz passive chip.
2. The phone immediately launches the default browser directly to the public profile route.
3. The platform verifies ring status (`ACTIVE` vs `INACTIVE`) and records an authenticated analytics interaction (`TAP` or `QR`).
4. The visitor can save the contact directly to their phonebook (.vcf format), send a connection request, or submit a collaboration inquiry.
5. All interactions are logged in real time and reflected in the user's private dashboard.

```
┌──────────────┐     NFC Tap      ┌───────────────┐    NDEF URL    ┌──────────────────────────┐
│   NTAG213    │ ───────────────> │  Smartphone   │ ─────────────> │ /u/[token]?source=nfc    │
│  Smart Ring  │   (13.56 MHz)    │ (iOS/Android) │                │ (Next.js Public Profile) │
└──────────────┘                  └───────────────┘                └─────────────┬────────────┘
                                                                                 │
                                          ┌──────────────────────────────────────┴───────────────┐
                                          │                                                      │
                                          ▼                                                      ▼
                                ┌──────────────────┐                                   ┌──────────────────┐
                                │   Save Contact   │                                   │ Connect / Lead   │
                                │  RFC 2426 .vcf   │                                   │ Inbound Pipeline │
                                └──────────────────┘                                   └──────────────────┘
```

---

## Features

### 1. Digital Identity & Public Profile
- **Four Adaptive Sharing Modes:**
  - **Business:** Corporate title, company, bio, phone, email, website, LinkedIn.
  - **Sales:** Services, offerings, direct WhatsApp chat CTA, collaboration form.
  - **Event:** Brief elevator pitch, portfolio link, social handles.
  - **Personal:** Social links, custom bio, personal portfolio.
- **RFC 2426 vCard Generation:** "Save contact" delivers a standardized `.vcf` file with proper First/Last name splitting (`N:`) and Organization tags, opening the native iOS/Android contacts app.
- **High-Res QR Code Sharing:** Automatic on-demand QR code generation for camera scans when NFC is unavailable, tracked distinctly under analytics.

### 2. Networking & Lead Capture
- **Connection Requests:** Visitor exchange form with automatic self-connection and duplicate connection prevention.
- **Lead Pipeline:** Inbound inquiry capture with 4-stage status pipeline (`NEW` → `CONTACTED` → `QUALIFIED` → `CLOSED`), live search, and status filtering.
- **Source Attribution:** Granular tracking separating NFC taps, QR scans, and direct link views.

### 3. Ring Hardware Management
- **Instant Activation Toggle:** Deactivate a misplaced ring instantly from the dashboard; visitors see a secure inactive notice until re-enabled.
- **Dynamic Cloud Updating:** Update phone numbers, job titles, or companies at any time without re-flashing or rewriting the physical NFC tag.
- **NTAG213 Compatibility:** Generates standard NDEF URLs compatible with all standard NFC programmer apps (NFC Tools, TagWriter).

### 4. RingAI — AI Bio Generator
- **Multi-Model Resilient Architecture:** Powered by the Groq SDK with automatic fallback support across leading open models (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`).
- **Profile Pre-filling:** Automatically loads your existing name, designation, and company from your profile.
- **One-Click Apply:** Directly reviews generated short tagline and executive biography and writes them to your live profile.
- **Secure Server-Only Execution:** API keys are strictly confined to the backend and never exposed to the client.

### 5. Analytics & Metrics
- **Real Interaction Metrics:** 7-day visual activity chart (Recharts) charting profile views vs. physical NFC taps.
- **Conversion Rate Tracking:** Calculates `(connections + leads) ÷ total views`.
- **Source Breakdown:** Visual percentage bars for NFC vs. QR vs. Direct links.

### 6. Administration & Governance
- **Platform Admin Dashboard:** Overview of total users, active/inactive rings, platform-wide tap counts, and user management.
- **Administrative Ring Control:** Ability to manage and toggle user rings across the platform.

---

## Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, custom graphite design system with champagne gold accents
- **Database & ORM:** SQLite (zero-setup local development) / PostgreSQL (production on Neon/Supabase) via Prisma ORM
- **Authentication:** Custom JWT-based authentication in HttpOnly, SameSite, Secure cookies with bcryptjs password hashing
- **Route Protection:** Next.js `proxy.ts` middleware and server-side RBAC guards (`requireAuth`, `requireAdmin`)
- **Visuals & Animation:** Framer Motion 13, Lucide React icons, Recharts

---

## Folder Structure

```
nfc-ring/
├── app/
│   ├── admin/                    # Admin portal
│   ├── api/                      # Backend Route Handlers
│   │   ├── admin/                # Platform management endpoints
│   │   ├── ai/generate-bio/      # RingAI Groq bio generation
│   │   ├── analytics/            # Owner analytics & event logging
│   │   ├── auth/                 # register, login, logout, me
│   │   ├── connections/          # Contact exchange endpoints
│   │   ├── leads/                # Lead capture & pipeline management
│   │   ├── profile/              # Authenticated profile CRUD
│   │   ├── public/[token]/       # Public profile, QR code, vCard export
│   │   └── ring/                 # Ring status toggle & provisioning
│   ├── dashboard/                # Authenticated user dashboard
│   │   ├── ai-bio/               # AI Bio generator page
│   │   ├── analytics/            # Detailed analytics page
│   │   ├── connections/          # Network directory page
│   │   ├── leads/                # Inbound leads pipeline
│   │   ├── profile/              # Profile editor page
│   │   └── ring/                 # NFC ring provisioning & QR page
│   ├── login/ & register/        # Authentication pages
│   ├── u/[token]/                # Public dynamic profile page (NFC destination)
│   ├── globals.css               # Design tokens, typography & animations
│   ├── layout.tsx                # Root layout & font configurations
│   └── page.tsx                  # Landing page
├── components/
│   ├── analytics/                # Recharts activity chart & source breakdown
│   ├── dashboard/                # AdminDashboard, Sidebar, MobileNav, StatCards
│   ├── landing/                  # Hero, RingVisual, Nav, Footer, Reveal
│   ├── profile/                  # ProfileEditor, PublicProfileView
│   ├── ring/                     # RingManager
│   └── ui/                       # Primitives (Button, Card, Input, Modal, Toast)
├── lib/
│   ├── analytics/                # Event tracking & source normalization
│   ├── auth/                     # Password hashing, JWT signing & cookies
│   ├── db/                       # Prisma client singleton
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── utils/                    # api, cn, rateLimit, tokens, vcard
│   └── validation/               # Zod validation & URL normalizers
├── prisma/
│   ├── dev.db                    # Local SQLite database
│   ├── schema.prisma             # Data models & relations
│   └── seed.ts                   # Idempotent demo database seeder
├── proxy.ts                      # Next.js 16 edge session proxy / middleware
└── next.config.ts                # Next.js configuration (remote image patterns)
```

---

## Getting Started

### 1. Prerequisites
- **Node.js:** v20.x or later
- **npm** or **pnpm**

### 2. Installation
Navigate into the project directory and install dependencies:

```bash
cd nfc-ring
npm install
```

### 3. Environment Configuration
Create or verify your `.env` file in the `nfc-ring` directory:

```env
# Database connection (SQLite default for local dev)
DATABASE_URL="file:./dev.db"

# JWT Signing Secret (generate via: openssl rand -base64 32)
JWT_SECRET="super-secret-jwt-key-for-local-dev-12345"

# Application Base URL (used for building NFC & QR URLs)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Groq Cloud API key for AI Bio generation
GROQ_API_KEY="your-groq-api-key-here"
```

### 4. Database Setup & Seeding
Initialize the database and populate demo records:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

**Pre-configured Demo Accounts:**
- **Admin Account:** `admin@nfcring.demo` / `Admin@12345`
- **User Account:** `harish@nfcring.demo` / `Demo@12345`

### 5. Running the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Writing to Your Physical NFC Ring

1. Sign in to your dashboard and navigate to **My Ring**.
2. Copy the **NFC URL** (e.g. `http://localhost:3000/u/YOUR_TOKEN?source=nfc`).
3. Download a free NFC programming app on your smartphone:
   - **NFC Tools** (iOS & Android)
   - **NXP TagWriter** (iOS & Android)
4. Open the app, select **Write** → **Add a record** → **URL / URI**.
5. Paste your copied NFC URL.
6. Tap **Write** and hold your NFC ring against the back of your smartphone until confirmed.
7. Test by locking your phone, waking it up, and tapping the ring — your digital profile will load immediately.

---

## Production Build & Deployment

### Build Verification
To test production compilation locally:

```bash
npm run build
npm start
```

### Deploying to Vercel
1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select the repository.
3. Configure the Root Directory to `nfc-ring` if deploying from the root workspace.
4. Add the environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Neon, Supabase, etc.).
   - `JWT_SECRET`: A strong production secret.
   - `NEXT_PUBLIC_APP_URL`: Your production domain (e.g. `https://my-nfc-ring.com`).
   - `GROQ_API_KEY`: Your Groq API key.
5. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"` for PostgreSQL hosting.
6. Deploy. Next.js will build the project and generate the Prisma Client automatically via the `postinstall` script.

---

## Security Architecture

- **Password Storage:** Salted and hashed using `bcryptjs` with 12 rounds.
- **Session Protection:** Signed JWT tokens stored in `HttpOnly`, `SameSite=Lax`, `Secure` (in production) cookies, mitigating XSS token theft.
- **Access Control:** User profiles, leads, and rings are strictly bound to `user.id` on every query, preventing Insecure Direct Object References (IDOR).
- **Rate Limiting:** IP-based sliding window rate limiter protects public lead and connection submission endpoints against spam and DoS attempts.
- **Input Sanitization:** Multi-stage sanitization strips HTML tags and script injections while safely normalizing URLs to prevent `javascript:` execution.
- **Server-Side API Keys:** `GROQ_API_KEY` and `DATABASE_URL` are strictly server-side environment variables and are never bundled into client bundles.

---

## License

MIT License. Designed and engineered for high-performance professional networking.

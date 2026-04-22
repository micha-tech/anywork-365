# Anywork365 — Nigeria's Work Platform

A production-ready MVP marketplace connecting artisans, technicians, engineers, and service professionals with clients across Nigeria.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript (strict)                 |
| Styling     | Tailwind CSS + custom design system |
| Validation  | Zod                                 |
| Auth        | JWT via `jose` + httpOnly cookies   |
| Passwords   | bcryptjs (cost factor 12)           |
| Fonts       | Sora (display) + Inter (body)       |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Landing page
│   ├── login/page.tsx          # Login with Zod validation
│   ├── signup/page.tsx         # Signup with role selection
│   ├── professionals/
│   │   ├── page.tsx            # Professionals listing + filters
│   │   └── [id]/page.tsx       # Professional detail + booking
│   ├── jobs/
│   │   ├── page.tsx            # Jobs listing + search
│   │   └── [id]/page.tsx       # Job detail + apply modal
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar layout
│   │   ├── page.tsx            # Overview with metrics
│   │   ├── jobs/page.tsx       # My jobs list
│   │   ├── post-job/page.tsx   # Post job form
│   │   └── profile/page.tsx    # Profile editor
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/signup/route.ts
│       ├── auth/me/route.ts
│       ├── jobs/route.ts
│       └── users/route.ts
│
├── components/
│   ├── ui/
│   │   ├── index.tsx           # Badge, Card, Avatar, Stars, EmptyState
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── DashboardSidebar.tsx
│   └── forms/
│       ├── ProCard.tsx
│       └── JobCard.tsx
│
├── lib/
│   ├── api.ts                  # Client-side API helper
│   ├── auth.ts                 # JWT + session + bcrypt
│   ├── mockData.ts             # Dev data (replace with DB)
│   ├── utils.ts                # cn(), formatCurrency(), etc.
│   └── validators/
│       ├── auth.ts             # Login + signup schemas
│       └── job.ts              # Job post + application schemas
│
├── hooks/
│   ├── useAuth.ts
│   └── useDebounce.ts
│
├── types/index.ts              # All TypeScript interfaces
└── middleware.ts               # Route protection
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourname/anywork365.git
cd anywork365
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Run in development

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Demo login

Use these credentials on the login page:
- **Email:** demo@anywork365.com
- **Password:** Demo1234

---

## Design System

| Token              | Value     |
|--------------------|-----------|
| Primary green      | `#2CA24D` |
| Primary hover      | `#249143` |
| Primary active     | `#1F7A38` |
| Light green bg     | `#EAF7EF` |
| Page background    | `#F5F7F6` |
| Card background    | `#FFFFFF` |
| Border             | `#E5E7EB` |
| Text primary       | `#111827` |
| Text secondary     | `#6B7280` |

Reusable CSS classes in `globals.css`:
- `.btn-primary` — green CTA button
- `.btn-outline` — outlined green button
- `.btn-ghost` — subtle grey button
- `.input-field` — form input with focus ring
- `.card` — white card with border and rounded corners
- `.badge` — small pill label

---

## Connecting a Real Database

The mock data layer in `src/lib/mockData.ts` has clear comments showing exactly where to swap in your DB queries.

**Recommended stack for production:**
- **ORM:** Prisma or Drizzle
- **DB:** PostgreSQL (Neon or Supabase for serverless, AWS RDS for self-hosted)
- **Hosting:** AWS Africa (af-south-1 Cape Town) or Vercel

---

## Roadmap

| Phase | Feature                        | Notes                        |
|-------|--------------------------------|------------------------------|
| v1.0  | ✅ Auth, Jobs, Profiles, Dash  | This codebase                |
| v1.1  | Real PostgreSQL DB             | Prisma + Neon                |
| v1.2  | Paystack payment integration   | Escrow-style job payments    |
| v1.3  | Real-time messaging            | Socket.io or Ably            |
| v1.4  | Push notifications             | Firebase FCM                 |
| v1.5  | Mobile app                     | React Native (shared logic)  |
| v2.0  | Reviews & disputes system      | —                            |

---

## License

MIT — built for Anywork365.

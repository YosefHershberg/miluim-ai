# MiluimAI

A web application that calculates grants, benefits, and rights for Israeli army reservists (מילואים). Uses AI to extract service period data from official 3010 PDF documents and computes all eligible benefits based on Israeli government frameworks.

## Features

- Google OAuth authentication via Supabase Auth
- AI-powered extraction of service data from 3010 PDF documents (Gemini API)
- Automatic calculation of NII compensation, wartime benefits (2025/2026), and business owner grants
- Full Hebrew UI with RTL layout
- Dark/light mode

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Database:** Supabase PostgreSQL + Prisma 7 ORM
- **Auth:** Supabase Auth (Google OAuth)
- **AI:** Google Gemini API (`@google/genai`)
- **UI:** shadcn/ui + Tailwind CSS v4 + Framer Motion
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- Google OAuth credentials
- Google Gemini API key

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
GEMINI_API_KEY=
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

```bash
npx prisma generate   # Regenerate Prisma client
npx prisma db push    # Push schema to database
npx prisma studio     # Open Prisma Studio
```

## Project Structure

```
src/
├── app/           # Next.js pages (App Router)
│   ├── (auth)/    # Login, OAuth callback
│   └── (app)/     # Authenticated routes
├── components/    # React components
├── services/      # Business logic & calculations
├── data-access/   # Prisma database operations
├── actions/       # Next.js Server Actions
└── lib/           # Utilities (supabase, prisma, i18n)
```

## Disclaimer

Calculation results are for informational purposes only and do not constitute legal or financial advice. Always verify eligibility with the relevant government authority (ביטוח לאומי).

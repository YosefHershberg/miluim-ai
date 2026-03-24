# MiluimAI — Full Build Agent Prompt

> **Copy this entire prompt and give it to Claude Code with the Chrome extension active.**

---

## Your Role

You are an AI agent building the **MiluimAI** application — an IDF reserve duty (miluim) benefits calculator and 3010 document manager. You have access to a Chrome browser extension. You must explore the reference website, verify calculations, build the full application, create documentation, and update project files.

**Read `CLAUDE.md` first — it contains the tech stack, conventions, and project structure. Follow all conventions exactly.**

---

## Phase 0: Research & Verification

### 0.1 — Explore miluim-helper.com (use Chrome extension)

Navigate to https://miluim-helper.com/ and go through EVERY feature:

1. **Step 1 form — "פרטי השירות הבסיסיים":**
   - Year toggle: מתווה 2025 / מתווה 2026
   - Activity tier selector (מדרג פעילות): א+, א, ב, ג, ד, ה
   - For tiers א+ and א: role selector (תפקיד): ללא תפקיד פיקודי, מג"ד, סמג"ד, מ"פ, סמ"פ, מ"מ
   - Days served from start of war through end of 2025
   - Days served in 2026

2. **Step 2 form — "מעמד אישי ומשפחתי":**
   - Parent of child under 14? (yes/no)
   - Number of children under 18 (0, 1-3, 4+)
   - Student in academic year? (yes/no)

3. **Results page — test with MULTIPLE input combinations:**
   - Tab: "כל ההטבות" (all benefits)
   - Tab: "ישירות לחשבון" (direct to bank)
   - Tab: "במימוש" (redeemable)
   - **Record EVERY benefit, its amount, and its formula** for each combination

4. **Test these specific scenarios and record results:**

   | Scenario | Tier | Role | 2025 Days | 2026 Days | Parent | Kids | Student |
   |----------|------|------|-----------|-----------|--------|------|---------|
   | A | א+ | ללא תפקיד | 60 | 30 | כן | 1-3 | לא |
   | B | א+ | מ"פ | 100 | 50 | כן | 4+ | לא |
   | C | א | ללא תפקיד | 30 | 20 | לא | 0 | כן |
   | D | ב | — | 45 | 15 | כן | 1-3 | לא |
   | E | ג | — | 20 | 10 | לא | 0 | לא |
   | F | ד | — | 0 | 40 | כן | 1-3 | לא |
   | G | א+ | מג"ד | 120 | 80 | כן | 4+ | לא |

   For EACH scenario, record the exact amounts shown for every benefit.

5. **Also explore:**
   - The FAQ section at the bottom
   - Any tooltips or explanation modals (e.g., "איזה מדרג אני?")
   - The "סרטון הסבר" (explanation video) links — note what they explain
   - The share button functionality
   - The "בדיקה חדשה" (new check) flow

### 0.2 — Verify & Update CALCULATIONS.md

Read `CALCULATIONS.md` thoroughly. Then compare it against the miluim-helper.com results. **Known gaps you MUST investigate and fix:**

1. **Activity Tiers (מדרגי פעילות) — MISSING from CALCULATIONS.md:**
   The 2026 framework introduced a 6-tier system that affects almost all benefit amounts:
   - א+ (highest — combat battalions)
   - א (brigades)
   - ב (divisions)
   - ג (HOMEC/הגמ"ר)
   - ד (training/security)
   - ה (commands/HQ)

   Add a new section to CALCULATIONS.md documenting all tiers and how each benefit amount varies by tier.

2. **Per-day rates by tier — verify these against the website:**
   - Personal expenses grant: website shows 46₪/day for א+ (= 466/10). What are the rates for other tiers?
   - Family grant: website shows 83₪/day for א+ (= 833/10). Other tiers?
   - Digital wallet: website shows 45₪/day for א+ in 2026. CALCULATIONS.md says 30₪/day for days 10-30 (2025). The 2026 rates are different — update.
   - Special compensation: 133₪/day appears tier-independent. Verify.

3. **Calendar Grant (המענק הקלנדרי / תגמול נוסף) — VERIFY:**
   Website showed 4,356₪ for 30 days in 2026 for tier א+. This equals 1.5 credit points × 2,904₪. But CALCULATIONS.md says 30 days falls in the 10-31 range. The tier system may change this — the IDF PDF shows different credit point amounts per tier. Verify and fix the table.

4. **Benefits NOT in CALCULATIONS.md that the website shows:**
   - השתתפות במימון קייטנות (camp funding) — 500₪ first child + 250₪ each additional
   - השתתפות בעלויות מעבר דירה (moving expenses) — 2,500₪
   - החזר בייביסטר (babysitter reimbursement) — up to 8,000₪/year, 100₪/day, 2,000₪/month
   - החזר בייביסטר תוספת שאגת הארי — additional 1,500₪/year
   - מועדון בהצדעה (Behatzdaa club) — consumer club benefits
   - הטבות משרת מילואים פעיל (active reservist perks) — arnona discount, passport discount, etc.
   - הנחה בארנונה — up to 5%
   - הנחה באגרת רישיון רכב — 193₪ (15% discount)
   - רפואת שיניים — expanded dental treatments
   - רפואה משלימה — 22 complementary medicine treatments
   - ימי התארגנות (organization days) — varies by tier and days
   - חוק נפגעי טרור — up to 5,000,000₪ for terror/war injury

   Add ALL of these to CALCULATIONS.md with amounts, eligibility criteria per tier, and formulas.

5. **Household maintenance grant (מענק כלכלת הבית):**
   Website shows 1,250₪ based on "20+ days in 2026 (tier א+)". Verify threshold for each tier. CALCULATIONS.md says 2,500₪ for combat reservists with 45+ days — check if this is a separate enhanced amount.

6. **Commander grant rates:** Verify they match the website for מג"ד, סמג"ד, מ"פ, סמ"פ, מ"מ roles.

After verification, **update CALCULATIONS.md** with all corrections, adding:
- A new Section 2.5 for the 2026 Activity Tier System
- Updated benefit tables with per-tier amounts
- All missing benefits documented above
- Corrected formulas where they differ from the website

---

## Phase 1: Create PRD.md

Create `PRD.md` at the project root with a full Product Requirements Document:

### Structure:

```markdown
# MiluimAI — Product Requirements Document

## 1. Product Overview
- What: AI-powered IDF reserve duty benefits calculator & 3010 document manager
- Who: Israeli reservists wanting to understand their entitlements
- Why: Existing tools (miluim-helper.com) are calculators only — no document storage, no AI extraction, no persistent user data

## 2. User Personas
- Salaried employee reservist
- Self-employed reservist
- Student reservist
- Parent reservist (with children under 14/18)
- Combat commander (various ranks)

## 3. Core Features

### 3.1 Authentication (EXISTING)
- Email/password via Supabase Auth
- Session management via proxy.ts

### 3.2 Benefits Calculator (NEW)
- 2-step wizard matching miluim-helper.com functionality
- Step 1: Service details (year, tier, role, days)
- Step 2: Personal/family status
- Results page with 3 tabs: all / direct-to-account / redeemable
- All calculations per CALCULATIONS.md
- Persistent: save calculation inputs to user profile

### 3.3 My Miluim (NEW) — Route: /my-miluim
- Central hub for all reserve service periods
- **Two ways to add a service period:**
  1. **Manual entry:** Form with fields for start date, end date, total days, unit name, order type (צו 8/regular/training), year. User fills in dates from their 3010 document manually.
  2. **PDF upload + AI extraction:** Upload a 3010 PDF → Gemini AI extracts data automatically → SSE streams progress ("העלאה הצליחה! מחלץ נתונים..." / "Upload successful! Extracting data...") → extracted data shown for user review/edit → confirm to save.
- **Main view:** List of all miluim periods as cards, each showing:
  - Service dates (start → end)
  - Total days
  - Unit name
  - Order type badge (צו 8 / רגיל / אימון)
  - Source badge (manual / extracted from PDF)
  - Edit / Delete actions
- **"הוסף תקופת מילואים" / "Add Miluim Period"** button at top — opens a modal/page with two options: manual entry form OR PDF upload
- Store uploaded PDFs in Supabase Storage
- Edit/correct any service period data (whether manual or AI-extracted)
- Delete service periods (with confirmation)

### 3.4 My Entitlements (NEW) — Route: /my-entitlements
- Based on aggregated data from all service periods (manual + extracted)
- Calculates total benefits owed from:
  - National Insurance (ביטוח לאומי)
  - IDF / MOFET
  - Tax Authority
  - Ministry of Defense
  - Aid Fund (קרן הסיוע)
- Groups benefits by paying entity
- Shows payment timeline (when each benefit is paid)
- Shows claim status / action items
- References CALCULATIONS.md formulas

### 3.5 User Profile (NEW)
- Employment type (salaried/self-employed/unemployed/student)
- Gross salary / annual income
- Activity tier (מדרג פעילות)
- Role (if commander)
- Family status (children under 14, children under 18)
- Bank account info (for reference, NOT stored sensitively)

## 4. Technical Architecture
- Reference: CLAUDE.md for stack details
- Reference: CALCULATIONS.md for all formulas and rates

### 4.1 Service Layer Architecture
[Document each service with JSDoc]

- **CalculationService** — Pure functions implementing every formula from CALCULATIONS.md
  - calculateCoreCompensation(salary, days, employmentType)
  - calculateAdjustedDays(rawDays)
  - calculatePersonalExpensesGrant(days, tier, year)
  - calculateFamilyGrant(days, tier, hasChildUnder14, year)
  - calculateHouseholdGrant(days, tier, isCombat)
  - calculateSpecialCompensation(days, tier)
  - calculateCalendarGrant(days, tier, year)
  - calculateDigitalWallet(days, tier, year)
  - calculateTaxCreditPoints(days, isCombat, year)
  - calculateCommanderGrant(role, days, isStudent)
  - calculatePersistenceGrant(nonTzav8Days, totalTzav8Days)
  - calculateBabysitterReimbursement(tier, days)
  - calculateCampFunding(tier, days, numChildren)
  - calculateMovingExpenses(tier, days)
  - calculateAllBenefits(userProfile, serviceRecords) → BenefitsSummary

- **DocumentService** — 3010 PDF handling
  - uploadDocument(userId, file) → DocumentRecord
  - deleteDocument(userId, documentId)
  - getDocuments(userId) → DocumentRecord[]
  - getDocument(userId, documentId) → DocumentRecord

- **ExtractionService** — Gemini AI integration
  - extractFromPDF(fileBuffer) → ExtractedServiceData
  - streamExtraction(fileBuffer) → SSE stream of progress + final data
  - validateExtractedData(data) → ValidationResult

- **EntitlementService** — Aggregates 3010 data + profile → entitlements
  - calculateEntitlements(userId) → EntitlementBreakdown
  - getEntitlementsByPayer(userId) → GroupedEntitlements
  - getPaymentTimeline(userId) → TimelineEntry[]

- **UserProfileService** — Profile CRUD
  - getProfile(userId) → UserProfile
  - updateProfile(userId, data) → UserProfile

### 4.2 Database Schema (Prisma)
[Design these models]

- UserProfile (linked to Supabase auth.users via supabaseUserId)
- ServiceRecord (extracted 3010 data)
- Document (3010 PDF metadata + storage path)
- CalculationSnapshot (saved calculator results)

### 4.3 API Routes

- POST /api/service-periods — Create service period (manual entry)
- GET /api/service-periods — List user's service periods
- GET /api/service-periods/[id] — Get period details
- PUT /api/service-periods/[id] — Update period (edit)
- DELETE /api/service-periods/[id] — Delete period
- POST /api/documents/upload — Upload 3010 PDF
- GET /api/documents/[id]/extract — SSE endpoint for extraction progress
- GET /api/entitlements — Get calculated entitlements
- GET /api/entitlements/by-payer — Get entitlements grouped by paying entity
- GET/PUT /api/profile — User profile

### 4.4 SSE Implementation for PDF Extraction
- Use Next.js Route Handlers with ReadableStream
- Events: upload_complete → extraction_started → extraction_progress(%) → extraction_complete(data) → error
- Client: EventSource API with reconnection logic

## 5. Pages & Routes

| Route | Description (HE / EN) | Auth Required |
|-------|------------------------|---------------|
| / | דשבורד / Dashboard | Yes |
| /login | התחברות / Login | No |
| /signup | הרשמה / Sign Up | No |
| /auth/callback | OAuth callback | No |
| /calculator | מחשבון הטבות / Benefits Calculator | Yes |
| /my-miluim | המילואים שלי / My Miluim | Yes |
| /my-miluim/add | הוסף תקופת מילואים / Add Miluim Period | Yes |
| /my-entitlements | הכספים המגיעים לי / My Entitlements | Yes |
| /profile | פרופיל / Profile | Yes |

## 6. Internationalization (i18n) — Hebrew + English

**The entire app must support both Hebrew and English.** Hebrew is the default language.

### 6.1 Implementation Approach

Use a lightweight i18n approach with JSON translation dictionaries and a React context:

- `src/lib/i18n/locales/he.json` — Hebrew translations (default)
- `src/lib/i18n/locales/en.json` — English translations
- `src/lib/i18n/context.tsx` — `LanguageProvider` context with `useTranslation()` hook
- `src/lib/i18n/types.ts` — Type-safe translation keys

### 6.2 Language Switching

- Language toggle button in the app header/navbar (🇮🇱 / 🇬🇧 or עב / EN)
- Persist language preference in:
  1. `localStorage` for immediate use
  2. `UserProfile.preferredLanguage` in DB for cross-device persistence
- When Hebrew is selected: `dir="rtl"`, Geist font
- When English is selected: `dir="ltr"`, Geist font
- The `<html>` tag's `dir` and `lang` attributes must update dynamically

### 6.3 Translation Coverage

ALL user-facing text must be translated. Key areas:

**Navigation & Layout:**
- "המילואים שלי" / "My Miluim"
- "הכספים המגיעים לי" / "My Entitlements"
- "מחשבון הטבות" / "Benefits Calculator"
- "פרופיל" / "Profile"
- "התנתק" / "Sign Out"

**My Miluim page:**
- "הוסף תקופת מילואים" / "Add Miluim Period"
- "הזנה ידנית" / "Manual Entry"
- "העלאת טופס 3010" / "Upload 3010 Form"
- "תאריך התחלה" / "Start Date"
- "תאריך סיום" / "End Date"
- "סה״כ ימים" / "Total Days"
- "שם יחידה" / "Unit Name"
- "סוג צו" / "Order Type"
- "צו 8" / "Emergency Order (Tzav 8)"
- "שירות רגיל" / "Regular Service"
- "אימון" / "Training"
- "העלאה הצליחה! מחלץ נתונים..." / "Upload successful! Extracting data..."
- "אשר" / "Confirm"
- "ערוך" / "Edit"
- "מחק" / "Delete"

**Calculator & Entitlements:**
- All benefit names in both languages (e.g., "מענק הוצאות אישיות מוגדל" / "Enhanced Personal Expenses Grant")
- "ישירות לחשבון" / "Direct to Account"
- "במימוש" / "Redeemable Benefits"
- "כל ההטבות" / "All Benefits"
- All payer names: "ביטוח לאומי" / "National Insurance", etc.

**Forms & UI:**
- All form labels, placeholders, validation messages, button text
- Error messages and toast notifications
- FAQ items (if included)

### 6.4 Translation Key Pattern

```typescript
// Usage in components:
const { t } = useTranslation();

// Simple key
<h1>{t('myMiluim.title')}</h1>

// With interpolation
<p>{t('myMiluim.totalDays', { count: 30 })}</p>

// Benefit names — use a mapping function
<span>{t(`benefits.${benefitId}.name`)}</span>
```

### 6.5 RTL/LTR Handling

- Use Tailwind's `rtl:` and `ltr:` variants for directional styles
- Use logical CSS properties where possible (`ps-4` instead of `pl-4`, `me-2` instead of `mr-2`)
- Icons that imply direction (arrows, chevrons) must flip in RTL
- Number formatting: use `Intl.NumberFormat('he-IL')` for Hebrew, `Intl.NumberFormat('en-IL')` for English (both use NIS ₪)
- Date formatting: use `Intl.DateTimeFormat` with appropriate locale

### 6.6 Add to UserProfile model

Add `preferredLanguage String @default("he")` to the UserProfile Prisma model.

## 7. UI/UX Requirements
- **Bilingual:** Full Hebrew and English support with language toggle
- **RTL/LTR:** Dynamic direction based on selected language
- Mobile-first responsive design
- Wizard-style multi-step forms (like miluim-helper.com)
- Results cards with expandable details
- Color-coded benefit categories (direct payment vs redeemable)
- Loading states with SSE progress for document processing
- Toast notifications for success/error states

## 8. Non-Functional Requirements
- All calculation functions must be pure and unit-testable
- JSDoc on every exported function and service
- Type-safe: strict TypeScript throughout
- Env vars via @/env (never raw process.env)
- Follow all CLAUDE.md conventions
- All user-facing strings must go through the i18n system (no hardcoded text)

## 8. References
- CALCULATIONS.md — All formulas, rates, and legal framework
- CLAUDE.md — Tech stack, conventions, project structure
```

---

## Phase 2: Database Schema

### 2.1 — Design and create Prisma schema

Read the existing `prisma/schema.prisma`. Add these models:

```prisma
model UserProfile {
  id              String   @id @default(uuid())
  supabaseUserId  String   @unique
  employmentType  String   // "salaried" | "self_employed" | "unemployed" | "student"
  grossMonthlySalary  Decimal? @db.Decimal(10, 2)
  annualIncome    Decimal? @db.Decimal(10, 2)
  activityTier    String?  // "aleph_plus" | "aleph" | "bet" | "gimel" | "dalet" | "he"
  commandRole     String?  // "none" | "magad" | "samagad" | "mefaked_pluga" | "samap" | "mam"
  hasChildUnder14 Boolean  @default(false)
  childrenUnder18 Int      @default(0)
  isStudent       Boolean  @default(false)
  isCombat        Boolean  @default(false)
  preferredLanguage String @default("he") // "he" | "en"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  documents       Document[]
  serviceRecords  ServiceRecord[]
  calculationSnapshots CalculationSnapshot[]
}

model Document {
  id              String   @id @default(uuid())
  userProfileId   String
  userProfile     UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
  fileName        String
  storagePath     String   // Supabase Storage path
  fileSize        Int
  mimeType        String   @default("application/pdf")
  status          String   @default("uploaded") // "uploaded" | "extracting" | "extracted" | "error"
  extractionError String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  serviceRecord   ServiceRecord?
}

model ServiceRecord {
  id              String   @id @default(uuid())
  userProfileId   String
  userProfile     UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)
  documentId      String?  @unique
  document        Document? @relation(fields: [documentId], references: [id], onDelete: SetNull)

  // How was this record created?
  entryMethod       String   @default("manual") // "manual" | "pdf_extraction"

  // Service period data (manual or extracted)
  serviceStartDate  DateTime?
  serviceEndDate    DateTime?
  totalDays         Int
  year              Int      // 2025, 2026, etc.
  orderType         String   // "tzav8" | "regular" | "training"
  unitName          String?
  isVerified        Boolean  @default(false) // user confirmed extracted data
  rawExtractedJson  Json?    // full Gemini response for debugging (only for pdf_extraction)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CalculationSnapshot {
  id              String   @id @default(uuid())
  userProfileId   String
  userProfile     UserProfile @relation(fields: [userProfileId], references: [id], onDelete: Cascade)

  // Input snapshot
  inputData       Json     // full calculator inputs at time of calculation
  // Result snapshot
  resultData      Json     // full calculated results
  totalDirectPayment  Decimal @db.Decimal(10, 2)
  totalRedeemable     Decimal @db.Decimal(10, 2)

  createdAt       DateTime @default(now())
}
```

Run `npx prisma migrate dev --name add_miluim_models` after creating the schema.

---

## Phase 3: Build the Application

### 3.1 — Calculation Service (`src/lib/services/calculation.service.ts`)

Implement **every** formula from CALCULATIONS.md as pure functions with JSDoc. This is the most critical file — every number must match the verified calculations from Phase 0.

Key requirements:
- All functions are pure (no side effects, no DB calls)
- Full JSDoc with @param, @returns, @example
- Rates should be in a constants file (`src/lib/constants/rates.ts`) organized by year
- The adjusted-days conversion table must be exact:
  ```
  remainder 1 → 1.4, remainder 2 → 2.4, remainder 3 → 4.2,
  remainder 4 → 4.2, remainder 5 → 7.0, remainder 6 → 7.0
  ```
- Activity tier affects: personal expenses, family grant, digital wallet, calendar grant, camp funding, babysitter, moving expenses, organization days
- Commander role affects: commander grant eligibility and amount
- Results must be grouped into: directToAccount and redeemable (matching miluim-helper.com's tabs)

### 3.2 — Gemini Extraction Service (`src/lib/services/extraction.service.ts`)

**Use the latest Gemini SDK: `@google/genai`** (NOT the old `@google/generative-ai`).

```bash
npm install @google/genai
```

**Model:** `gemini-2.5-flash` (latest stable model for document processing)

**SDK Usage — the new API:**

```typescript
import { GoogleGenAI, createPartFromUri } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Upload PDF via Files API (supports up to 50MB / 1000 pages)
const uploadedFile = await ai.files.upload({
  file: pdfFilePath, // or pass a Blob/Buffer
  config: { displayName: "3010-document.pdf" },
});

// Wait for processing
let file = await ai.files.get({ name: uploadedFile.name! });
while (file.state === "PROCESSING") {
  await new Promise((r) => setTimeout(r, 2000));
  file = await ai.files.get({ name: uploadedFile.name! });
}

// Extract structured data
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    createPartFromUri(file.uri!, file.mimeType!),
    `You are extracting data from an IDF 3010 military service confirmation document (אישור שירות מילואים / טופס 3010).
    Extract the following fields as JSON:
    {
      "serviceStartDate": "YYYY-MM-DD",
      "serviceEndDate": "YYYY-MM-DD",
      "totalDays": number,
      "unitName": "string",
      "orderType": "tzav8" | "regular" | "training",
      "personalNumber": "string or null",
      "rank": "string or null",
      "notes": "string or null"
    }
    Return ONLY valid JSON, no markdown.`,
  ],
});

const extracted = JSON.parse(response.text!);
```

**Important notes:**
- The `@google/genai` package auto-reads `GEMINI_API_KEY` from env, but we pass it explicitly from `env.ts` for validation
- Use the Files API for PDFs (better than inline base64 for documents)
- The SDK handles polling for file processing state
- For SSE streaming, use `ai.models.generateContentStream()` to get token-by-token progress

```typescript
/**
 * Extracts service record data from a 3010 military confirmation PDF.
 * Uses Google Gemini's document understanding to parse Hebrew military documents.
 *
 * @param fileBuffer - The PDF file as a Buffer
 * @returns Extracted service data including dates, days, unit, and order type
 */
```

The Gemini prompt should extract:
- Service start and end dates
- Total service days
- Unit name
- Order type (צו 8 / regular / training)
- Personal number (מספר אישי) if present
- Rank if present
- Any other identifiable fields from the 3010 form

Add `GEMINI_API_KEY` to `src/env.ts` validation schema.

### 3.3 — SSE Endpoint (`src/app/api/documents/[id]/extract/route.ts`)

Implement Server-Sent Events using Next.js Route Handler with ReadableStream:

```typescript
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // 1. Verify auth
  // 2. Get document from DB
  // 3. Download PDF from Supabase Storage
  // 4. Create ReadableStream
  // 5. Stream events:
  //    - { event: 'status', data: { status: 'extracting', message: 'מעבד את המסמך...' } }
  //    - { event: 'progress', data: { percent: 50 } }
  //    - { event: 'complete', data: { serviceRecord: {...} } }
  //    - { event: 'error', data: { message: '...' } }
  // 6. Return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', ... } })
}
```

### 3.4 — Document Upload Flow (`src/app/api/documents/upload/route.ts`)

1. Accept multipart/form-data with PDF file
2. Validate file (PDF only, max 10MB)
3. Upload to Supabase Storage bucket `documents/{userId}/{uuid}.pdf`
4. Create Document record in DB with status "uploaded"
5. Return document ID + success message
6. Client then connects to SSE endpoint to start extraction

### 3.5 — Pages

**`/my-miluim` — My Miluim (Service Periods) Page:**
- Server component that fetches user's service periods
- Shows a list/grid of cards, each representing one miluim period:
  - Date range (e.g., "15/01/2026 — 14/02/2026")
  - Total days (e.g., "30 ימים" / "30 days")
  - Unit name
  - Order type badge (צו 8 / רגיל / אימון)
  - Source indicator (ידני / PDF — manual / extracted)
  - Edit (✏️) and Delete (🗑️) action buttons
- Prominent **"הוסף תקופת מילואים" / "Add Miluim Period"** button at the top
- Empty state: friendly message encouraging user to add their first period

**`/my-miluim/add` — Add Miluim Period Page:**
- Two-tab or two-card layout giving the user a choice:

  **Option A: "הזנה ידנית" / "Manual Entry"**
  - Form with: start date (date picker), end date (date picker), total days (auto-calculated or manual override), unit name (text), order type (select: צו 8 / רגיל / אימון), year (auto from dates)
  - Submit → saves ServiceRecord directly → redirect to `/my-miluim`

  **Option B: "העלאת טופס 3010" / "Upload 3010 Form"**
  - Drag-and-drop PDF upload area
  - After upload: show success message "העלאה הצליחה! מחלץ נתונים..." / "Upload successful! Extracting data..."
  - SSE connection shows real-time extraction progress with animated indicator
  - On completion: show extracted data in an **editable form** (same fields as manual entry, pre-filled with AI results) for user review
  - "אשר" / "Confirm" button → saves ServiceRecord → redirect to `/my-miluim`
  - "נסה שוב" / "Try Again" button if extraction fails

**Edit flow:** Clicking edit on any period opens the same form (pre-filled) for modification.

**`/my-entitlements` — Entitlements Page:**
- Aggregates all verified service records
- Calculates benefits using CalculationService
- Groups by paying entity:
  - ביטוח לאומי (National Insurance)
  - צה"ל / מופ"ת (IDF / MOFET)
  - רשות המסים (Tax Authority)
  - משרד הביטחון (Ministry of Defense)
  - קרן הסיוע (Aid Fund)
- Each group shows: benefit name, amount, payment date, claim action
- Total summary at bottom

**`/calculator` — Benefits Calculator:**
- Multi-step wizard (like miluim-helper.com)
- Step 1: Service details
- Step 2: Personal/family
- Results with 3 tabs
- "Save" button to create CalculationSnapshot
- All calculations happen client-side using the same CalculationService functions

**`/profile` — User Profile:**
- Form to set employment type, salary, tier, role, family status
- This data is used as defaults for the calculator and entitlements

### 3.6 — UI Components

Build reusable components in `src/components/`:
- `WizardForm` — multi-step form container with progress bar
- `TierSelector` — the 6-tier button selector (א+ through ה)
- `RoleSelector` — commander role selector
- `DaysInput` — numeric input for service days
- `BenefitCard` — expandable card showing benefit name, amount, formula, payment date
- `BenefitTabs` — tab switcher for all/direct/redeemable
- `ServicePeriodCard` — miluim period card showing dates, days, unit, badges, edit/delete
- `ServicePeriodForm` — form for manual entry / editing a service period (date pickers, selects)
- `FileUpload` — drag-and-drop PDF upload with preview
- `ExtractionProgress` — SSE-powered progress display with animated indicator
- `EntitlementGroup` — grouped benefits by paying entity
- `LanguageToggle` — Hebrew/English switcher button for the header
- `AddPeriodChoice` — two-option card (manual entry vs PDF upload)

All components must support both RTL (Hebrew) and LTR (English). Use Tailwind CSS v4 with dynamic `dir` attribute on root layout based on language context.

---

## Phase 4: Documentation

### 4.1 — JSDoc Everything

Every exported function, type, interface, and service must have JSDoc:

```typescript
/**
 * Calculates the Enhanced Personal Expenses Grant (מענק הוצאות אישיות מוגדל).
 * Based on the 2026 activity tier system and service days.
 *
 * @param days - Number of service days in the calculation year
 * @param tier - Activity tier (א+ through ה)
 * @param year - Calculation year (2025 or 2026)
 * @returns Grant amount in NIS, or 0 if not eligible (requires 40+ days under צו 8)
 *
 * @example
 * // Combat reservist (א+), 30 days in 2026
 * calculatePersonalExpensesGrant(30, 'aleph_plus', 2026) // → 1380
 *
 * @see CALCULATIONS.md Section 3.5
 */
```

### 4.2 — Update CLAUDE.md

After building, update CLAUDE.md to reflect:
- New pages and routes
- New dependencies (@google/genai, etc.)
- New project structure (services, components, API routes)
- Add references to PRD.md and CALCULATIONS.md:
  ```
  ## Key Documents
  - **PRD.md** — Full product requirements, feature specs, and architecture
  - **CALCULATIONS.md** — All compensation formulas, rates, legal framework, and activity tiers
  ```

---

## Phase 5: Verification

### 5.1 — Cross-check calculations

After building, use the Chrome extension to:
1. Go to miluim-helper.com
2. Input the same scenarios from Phase 0
3. Compare their results against your calculator at `/calculator`
4. Fix ANY discrepancies

### 5.2 — Test the upload flow

1. If you have a sample 3010 PDF, test the upload → extraction → display flow
2. Verify SSE events fire correctly
3. Verify extracted data saves to DB
4. Verify entitlements page aggregates correctly

### 5.3 — Run the build

```bash
npm run build
npm run lint
```

Fix any errors.

---

## Critical Rules

1. **Read `CLAUDE.md` before writing ANY code** — follow all conventions (proxy.ts not middleware, @/env not process.env, etc.)
2. **Read `node_modules/next/dist/docs/` before writing Next.js code** — Next.js 16 has breaking changes
3. **Supabase Auth manages users** — do NOT create a Prisma model for auth. UserProfile links via `supabaseUserId`
4. **Pure calculation functions** — the CalculationService must be stateless and testable
5. **Bilingual (HE/EN)** — all user-facing text must go through i18n. No hardcoded strings. Hebrew is default. RTL for Hebrew, LTR for English.
6. **Two entry methods** — users can EITHER manually enter service period dates OR upload a 3010 PDF for AI extraction. Both paths produce the same ServiceRecord.
7. **JSDoc everything** — every export gets documentation
8. **Env vars in `src/env.ts`** — add GEMINI_API_KEY there, never use raw process.env
9. **Accuracy over speed** — if a calculation doesn't match miluim-helper.com, STOP and fix it before moving on
10. **Gemini SDK** — use `@google/genai` (latest), NOT `@google/generative-ai` (deprecated). Model: `gemini-2.5-flash`.

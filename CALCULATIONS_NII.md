# Calculations — Legal Framework & Core NII Compensation
> Sections 1–3 | Part of the MiluimAI calculation reference

---

## 1. Legal Framework

### Key Laws

- **חוק הביטוח הלאומי [נוסח משולב], התשנ"ה-1995** — National Insurance Law. Governs core reservist compensation (תגמול מילואים) paid by NII. Defines calculation methodology, min/max rates, and employer reimbursement.
- **חוק שירות המילואים, התשס"ח-2008** — Reserve Service Law. Establishes the framework for reserve duty, annual service caps, and the "Additional Compensation" (תגמול נוסף) and "Special Compensation" (תגמול מיוחד) based on cumulative service days (Section 19).
- **פקודת מס הכנסה [נוסח חדש]** — Income Tax Ordinance. Amendment No. 283 (2025) introduced tax credit points for combat reservists from tax year 2026.
- **חוק הביטוח הלאומי (תיקון מס' 253), התשפ"ה-2025** — Published January 21, 2025. Changed compensation calculation for reservists called within 90 days of previous service from May 1, 2025 onward.
- **Government Decisions No. 2540 (Dec 2024) and subsequent** — Established wartime grant frameworks, combat differentiation, family grants, and employer incentives.

### Who Administers What

| Payment Type | Administered By |
|---|---|
| Core reservist compensation (תגמול מילואים) | National Insurance Institute (ביטוח לאומי) |
| Calendar Grant / May Grant (מענק קלנדרי) | IDF via Tax Authority (רשות המסים) — paid in May |
| Special Compensation (תגמול מיוחד) | IDF via MOFET (מופ"ת) — paid in May |
| Wartime grants & family grants | Ministry of Defense / IDF via MOFET |
| Business owner compensation | Tax Authority (רשות המסים) |
| Employer social contribution reimbursement | National Insurance Institute |
| Tax credit points for combat reservists | Tax Authority — via payroll (Form 101) |

---

## 2. Two Frameworks: 2025 and 2026

See `CALCULATIONS_2025.md` (מתווה 2025) and `CALCULATIONS_2026.md` (מתווה 2026) for full details.

**2025 Framework:** 3 roles — Combat (לוחם), Territorial Defense (הגנה מרחבית), Support (תומך). Days tracked: צו 8 days in 2024 + 2025.

**2026 Framework:** 6 activity tiers (מדרגי פעילות) — א+ through ה. Days tracked: War start (Oct 7, 2023) to end of 2025 + days in 2026.

---

## 3. Core Compensation (NII — ביטוח לאומי)

### 3.1 Core Reservist Compensation (תגמול מילואים)

**Eligibility:** All persons called to active reserve duty (שמ"פ), including צו 8, single-day/half-day service, and civil defense training (מל"ח).

**Formula:**
```
Daily_Rate = (Gross salary in 3 months preceding service) ÷ 90
Total_Compensation = Daily_Rate × Adjusted_Service_Days
```

The total compensation includes an automatic 40% supplement (built into the methodology).

**Adjusted service days:** Divide total days by 7. Full weeks count 1:1. Remainder maps as:

| Remainder | Counted as |
|---|---|
| 1 | 1.4 days |
| 2 | 2.4 days |
| 3 | 4.2 days |
| 4 | 4.2 days |
| 5 | 7.0 days |
| 6 | 7.0 days |

**Current Rates (NIS) — as of January 1, 2026:**
- Minimum: **328.76 NIS/day** | **9,863 NIS/month**
- Maximum: **1,730.33 NIS/day** | **51,910 NIS/month**
- Half-day service: 50% of daily rate
- Young worker (נער עובד) minimum: 114.73 NIS/day
- Basic Amount (סכום בסיסי): 10,382 NIS/month. Max = 5× basic. Min = 95% of basic.

**Worked Example — Salaried Employee:**
> 15,000 NIS/month, 30 days service:
> Daily rate = (15,000 × 3) ÷ 90 = 500 NIS/day ✓ (within min/max)
> Adjusted days: 4×7 + remainder 2 = 28 + 2.4 = 30.4 days
> Total = 500 × 30.4 = **15,200 NIS**

**Worked Example — Minimum Wage Earner:**
> 6,247.67 NIS/month, 30 days:
> Daily rate = 208.26 NIS → below minimum → **minimum applies: 328.76 NIS/day**
> Total = 328.76 × 30.4 ≈ **9,994 NIS**

**Amendment 253 (effective May 1, 2025):** For reservists called within 90 days of previous service:
- If current income < previous: compensated at the higher previous income.
- If current income > previous by more than 20%: capped at previous + 20%.

---

### 3.2 Self-Employed Compensation (עצמאי)

**Formula:**
```
Daily_Rate = Annual gross income ÷ 360
```
Initially based on advance payments (מקדמות). Final adjustment after annual tax assessment (שומה). Income subject to NII includes a 25% supplement.

**Special wartime rule (2023–2025):** Uses the highest of: advance payments reported by Oct 31, 2024; final 2024 assessment; or final 2025 assessment.

**Worked Example:**
> Annual income: 180,000 NIS, 20 days service:
> Daily rate = 180,000 ÷ 360 = 500 NIS/day
> Adjusted days: 14 (2×7) + remainder 6 → 14 + 7 = 21 adjusted days
> Total = 500 × 21 = **10,500 NIS** (subject to annual reconciliation)

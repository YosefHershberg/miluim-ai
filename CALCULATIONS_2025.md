# Calculations — 2025 Wartime Framework (מתווה 2025)
> Sections 4 + 11 | Part of the MiluimAI calculation reference

**Role classification:** Combat (לוחם) | Territorial Defense (הגנה מרחבית) | Support (תומך/ג'וב/עורפי)
**Days tracked:** צו 8 days in 2024 + צו 8 days in 2025

---

## 4.1 Special Compensation (תגמול מיוחד)

**Eligibility:** 32+ total days (2024 + 2025). Once threshold exceeded, ALL days in 2025 qualify.

| Role | Rate/day |
|---|---|
| Combat (לוחם) | 133 NIS |
| Territorial Defense | 60 NIS |
| Support | 40 NIS |

**Paid by:** IDF via MOFET, by May 1 of following year.

---

## 4.2 Calendar Grant / May Grant (מענק קלנדרי)

**Eligibility:** 10+ cumulative reserve days in calendar year. Paid in May of following year.

| Days Served | Credit Points | Amount (NIS) |
|---|---|---|
| 10–29 | ~1.0 | ~2,904 |
| 30–79 | 1.5 | 4,356 |
| 80+ | 2.0 (max) | 5,808 |

Credit point value: **2,904 NIS** (2026). Subject to flat 25% tax (no deductions/credits).

---

## 4.3 Enhanced Personal Expenses (מענק הוצאות אישיות מוגדל)

**Eligibility:** 40+ days under צו 8. Paid from day 40 onward, per 10-day blocks.

| Role | Amount per 10 days |
|---|---|
| Combat | 466 NIS |
| Territorial Defense | 310 NIS |
| Support | 266 NIS |

---

## 4.4 Enhanced Family Grant (מענק משפחה מוגדל)

**Eligibility:** 40+ days under צו 8, with child under 14. Per 10-day blocks from day 40.

| Role | Amount per 10 days |
|---|---|
| Combat | 833 NIS |
| Territorial Defense | 600 NIS |
| Support | 500 NIS |

---

## 4.5 Digital Wallet Grant (מענק ארנק דיגיטלי)

**Eligibility:** Combat only, 10+ days in 2025. Payment covers from day 1 once eligible.

```
Days 1–30:  30 NIS/day
Day 31+:    80 NIS/day
Maximum:    5,000 NIS total
```

Examples: 30 days → 900 NIS | 80 days → 4,900 NIS | 93+ days → capped at 5,000 NIS

---

## 4.6 Tax Credit Points (נקודות זיכוי)

**Eligibility:** Combat only, 30+ days in 2025. Applied in tax year 2026–2027.

| Days | Points | Annual Value (NIS) |
|---|---|---|
| 30–39 | 0.50 | 1,452 |
| 40–49 | 0.75 | 2,178 |
| 50–54 | 1.00 | 2,904 |
| 60–64 | 1.50 | 4,356 |
| 70–74 | 2.00 | 5,808 |
| 80–84 | 2.50 | 7,260 |
| 90–94 | 3.00 | 8,712 |
| 100–104 | 3.50 | 10,164 |
| 110+ | 4.00 | 11,616 |

Full table in `src/services/calculations/constants.ts` (`CREDIT_POINTS_SCHEDULE`). From 2028: threshold drops to 20 days.

---

## 4.7 Household Maintenance Grant (מענק כלכלת הבית)

- **Base:** 1,250 NIS for all active reservists
- **Enhanced:** Additional 1,250 NIS (total 2,500 NIS) for Combat with 45+ days in 2025

---

## 4.8 Commander Grant (מענק מפקדים)

**Eligibility:** Combat commanders, 60+ days in 2025 (40+ if student).

| Rank | Grant |
|---|---|
| Battalion Commander (מג"ד) | 20,000 NIS |
| Deputy Battalion / Company Commander (סמג"ד/מ"פ) | 10,000 NIS |
| Deputy Company / Platoon Commander (סמ"פ/מ"מ) | 5,000 NIS |

Additional: 25% arnona discount, 800 NIS sports voucher, חבר membership, subsidized vacation.

---

## 4.9 Vacation Voucher (שובר חופשה)

**Eligibility:** 180+ total days under צו 8. Valid until 31/12/2027.

| Role | Amount |
|---|---|
| Combat (לוחם) | 7,000 NIS (two × 3,500) |
| Territorial Defense / Support | 3,350 NIS (2,000 + 1,350) |

---

## 4.10 Camp Grant (מענק קייטנות)

- **Amount:** 1,500 NIS
- **Eligibility:** Parents of children up to age 14, with 5+ days served in July–August 2025
- **Payment:** September 1

---

## 4.11 Babysitter Refund (החזר בייביסיטר)

| Role | April / July / August | Other months |
|---|---|---|
| Combat | Up to 3,500 NIS/month | Up to 2,000 NIS/month |
| Territorial Defense / Support | Up to 2,000 NIS/month | Up to 2,000 NIS/month |

---

## 4.13 Mental Health Treatment

With child under 18: 22 sessions, 80% up to 240 NIS/session → max **5,280 NIS**
Without (combat only): 15 sessions → max **3,600 NIS**. Valid until 31/12/2026.

---

## 4.15 Household Services Refund (מענה שוטף)

| Role | Max |
|---|---|
| Combat | 1,500 NIS |
| Territorial Defense / Support | 500 NIS |

---

## 4.16 Moving Expenses — 2,500 NIS for Combat with 120+ total days (2024+2025)

## 4.17 Pet Kennel Refund — Combat only: 100 NIS/day, max 2,000 NIS/month

## 4.18 Highway 6 Refund — up to 300 NIS/month (with vehicle ownership)

## 4.19 Vehicle License Discount

| Days | Discount | Amount |
|---|---|---|
| 30+ | 10% | 129 NIS |
| 180+ | 15% | 193 NIS |

## 4.20 Complementary Medicine — Combat: 22 sessions (60+ days) | Others: 16 sessions (60+ total)

## 4.21 Amit Program — 12,000 coins, 30+ days from war start, valid until 31/12/2027

## 4.22 Persistence Grant — 100 NIS/day from day 10, for non-צו 8 service after war (if had 60+ צו 8 days)

---

## 11. Quick Reference — 2025 Benefits by Role

| Benefit | Combat | Territorial | Support |
|---|---|---|---|
| Special Compensation | 133/day | 60/day | 40/day |
| Personal Expenses (per 10d from day 40) | 466 | 310 | 266 |
| Family Grant (per 10d from day 40) | 833 | 600 | 500 |
| Digital Wallet (days 1–30) | 30/day | — | — |
| Digital Wallet (day 31+) | 80/day | — | — |
| Household Maintenance | 2,500 (45+ days) | 1,250 | 1,250 |
| Tax Credit Points (80 days) | 7,260 | — | — |
| Vacation Voucher (180+ days) | 7,000 | 3,350 | 3,350 |
| Babysitter (peak months) | 3,500/month | 2,000/month | 2,000/month |
| Household Services | 1,500 | 500 | 500 |
| Pet Kennel | 2,000 | — | — |

### Calendar Grant (All Roles)

| Days | Points | Amount (NIS) |
|---|---|---|
| 30 | 1.5 | 4,356 |
| 80+ | 2.0 | 5,808 |

### Worked Example — 80 days, Combat, 15K/month salary, child<14

| Component | Calculation | Amount |
|---|---|---|
| Core NII compensation | 500/day × adjusted days | ~40,000 NIS |
| Special Compensation | 80 × 133 | 10,640 NIS |
| Calendar Grant | 2.0 points | 5,808 NIS (gross) |
| Personal Expenses (from day 40) | 4 blocks × 466 | 1,864 NIS |
| Family Grant (from day 40) | 4 blocks × 833 | 3,332 NIS |
| Digital Wallet | (30×30) + (50×80) | 4,900 NIS |
| Tax Credit Points (2.5 points) | tax reduction | 7,260 NIS |
| Household Maintenance | combat, 45+ | 2,500 NIS |
| **Approximate total** | | **~36,300+ NIS** |

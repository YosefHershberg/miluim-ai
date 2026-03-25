# IDF Reservist Compensation — Calculation Reference (Index)
> Last updated: March 25, 2026 | Verified against: miluim-helper.com, btl.gov.il, kolzchut.org.il, miluim.idf.il

## Section Files

| File | Contents |
|---|---|
| `CALCULATIONS_NII.md` | Legal framework, core NII compensation formula, salaried/self-employed examples |
| `CALCULATIONS_2025.md` | 2025 framework — all benefits by role (Combat/Territorial/Support) |
| `CALCULATIONS_2026.md` | 2026 framework — all benefits by tier (א+ through ה) |
| `CALCULATIONS_MISC.md` | Business owner compensation, employer obligations, special cases, how to claim, tax implications |

## TypeScript Constants

All numeric rates, thresholds, and tables live in:
**`src/services/calculations/constants.ts`** — single source of truth for code.

---

## Key Rates (2026) — Quick Reference

| Rate | Value |
|---|---|
| NII minimum daily rate | **328.76 NIS/day** |
| NII maximum daily rate | **1,730.33 NIS/day** |
| NII minimum monthly | **9,863 NIS/month** |
| NII maximum monthly | **51,910 NIS/month** |
| Basic amount (סכום בסיסי) | 10,382 NIS/month |
| Credit point value | **2,904 NIS/year** |
| Young worker minimum | 114.73 NIS/day |

## Adjusted Days Remainder Table (Section 3.1)

| Remainder | Counted as |
|---|---|
| 1 | 1.4 days |
| 2 | 2.4 days |
| 3 | 4.2 days |
| 4 | 4.2 days |
| 5 | 7.0 days |
| 6 | 7.0 days |

## 2025 Framework — Key Rates by Role

| Benefit | Combat | Territorial | Support |
|---|---|---|---|
| Special Compensation | 133/day | 60/day | 40/day |
| Personal Expenses (per 10d from day 40) | 466 | 310 | 266 |
| Family Grant (per 10d from day 40) | 833 | 600 | 500 |
| Vacation Voucher (180+ days) | 7,000 | 3,350 | 3,350 |

## 2026 Framework — Key Rates by Tier (Extreme Values)

| Benefit | א+ | ה |
|---|---|---|
| Special Compensation | 133/day | 30/day |
| Personal Expenses | 46/day | 11/day |
| Family Grant (child<14) | 83/day | 21/day |
| Vacation Voucher (60d, child<14) | 4,500 | 1,030 |

Tiers א–ד graduate linearly between these extremes (see `graduatedRate()` in `wartime-2026.ts`).

---

## Calculation Rules (Must Follow)

1. **Adjusted days formula** (§3.1): `floor(days/7) × 7 + REMAINDER_TABLE[days % 7]`
2. **2025 eligibility thresholds:** Special comp 32+ days (2024+2025); calendar grant 10+ days; personal expenses/family grant from day 40
3. **2026 eligibility thresholds:** Special comp 32+ days (war start to present); calendar grant 10+ days; personal expenses/family grant apply from day 1
4. **Credit points** (§4.6/5.6): See `CREDIT_POINTS_SCHEDULE` in `constants.ts` — combat/א+ only, 30+ days
5. **Calendar grant tax:** Subject to flat 25% tax — report gross amount in UI
6. **All monetary amounts in NIS**

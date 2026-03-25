# Calculations — 2026 Wartime Framework (מתווה 2026)
> Sections 5 + 12 | Part of the MiluimAI calculation reference

**Tier classification (מדרגי פעילות):**

| Tier | Description |
|---|---|
| א+ | Combat battalions (גדודי לחימה) |
| א | Brigades (חטיבות) |
| ב | Divisions (אוגדות) |
| ג | Higher formations |
| ד | Support echelons |
| ה | Rear/highest echelons (עורף) |

Commander ranks available for **tier א+ only**. Days tracked: War start (Oct 7, 2023) to end of 2025 + days in 2026.

**Graduated rates:** Tiers א through ד interpolate linearly between the א+ (max) and ה (min) values. See `TIER_INDEX` in `constants.ts`.

---

## 5.1 Special Compensation (תגמול מיוחד)

**Eligibility:** 32+ total days (war start to end 2025 + 2026 days). ALL 2026 days qualify once threshold exceeded.

| Tier | Rate/day |
|---|---|
| א+ | 133 NIS |
| א–ד | Graduated 133→30 |
| ה | 30 NIS |

---

## 5.2 Calendar Grant / May Grant (מענק קלנדרי)

Same as 2025 (credit-point-based, all tiers). After 25% tax.

| Days | Points | Amount net (NIS) |
|---|---|---|
| 10–29 | 1.0 | 2,178 |
| 30–79 | 1.5 | 3,267 |
| 80+ | 2.0 | 4,356 |

Credit point value: **2,904 NIS** gross.

---

## 5.3 Enhanced Personal Expenses (מענק הוצאות אישיות מוגדל)

**2026 change:** Per-day on ALL days (no 10-day blocks, no day-40 threshold).

| Tier | Rate/day |
|---|---|
| א+ | 46 NIS |
| א–ד | Graduated 46→11 |
| ה | 11 NIS |

---

## 5.4 Enhanced Family Grant (מענק משפחה מוגדל)

**Eligibility:** Parent with child under 14. Per-day on ALL days.

| Tier | Rate/day |
|---|---|
| א+ | 83 NIS |
| א–ד | Graduated 83→21 |
| ה | 21 NIS |

---

## 5.5 Digital Wallet Grant (מענק ארנק דיגיטלי)

**Eligibility:** Tier א+ only.

```
Days 1–30:   45 NIS/day
Days 31–45:  120 NIS/day
Days 46+:    70 NIS/day
Maximum:     5,000 NIS total
```

Examples: 30 days → 1,350 NIS | 45 days → 3,150 NIS | 80 days → capped at 5,000 NIS

---

## 5.6 Tax Credit Points (נקודות זיכוי)

**Eligibility:** Tier א+ only, 30+ days in 2026. Same table as 2025 (see `CREDIT_POINTS_SCHEDULE` in `constants.ts`).

---

## 5.7 Household Maintenance Grant (מענק כלכלת הבית)

- **Base:** 1,250 NIS for all active reservists
- **Enhanced:** 2,500 NIS for tier א+ with 45+ days in 2026
- Tier ה does NOT receive the enhanced grant

---

## 5.8 Commander Grant (מענק מפקדים)

**Eligibility:** Tier א+ commanders, 60+ days in 2026 (40+ if student). Same amounts as 2025:

| Rank | Grant |
|---|---|
| Battalion Commander (מג"ד) | 20,000 NIS |
| Deputy Battalion / Company Commander | 10,000 NIS |
| Deputy Company / Platoon Commander | 5,000 NIS |

Additional: 25% arnona discount, 800 NIS sports voucher, חבר membership, subsidized vacation.

---

## 5.9 Vacation Voucher (שובר חופשה)

**Eligibility:** 60+ days in 2026, with child under 14. Valid until 31/12/2028.

| Tier | Amount |
|---|---|
| א+ | 4,500 NIS |
| א–ד | Graduated |
| ה | 1,030 NIS |

---

## 5.10 Babysitter Refund (החזר בייביסיטר)

| Tier | Daily rate | Monthly cap | Annual cap |
|---|---|---|---|
| א+ | 100 NIS/day | 2,000 NIS/month | 8,000 NIS/year |
| ה | 80 NIS/day | — | 2,000 NIS total |

**"שאגת הארי" bonus:** א+: 1,500 NIS/year extra | ה: 1,000 NIS/year extra

---

## 5.11 Mental Health Treatment — Same structure as 2025. Valid until 31/12/2027.

---

## 5.12 Moving Expenses — 2,500 NIS for tier א+ with 1+ day in 2026

---

## 5.13 Complementary Medicine

| Tier | Sessions | Eligibility |
|---|---|---|
| א+ | 22 treatments | 60+ days |
| All others | 16 treatments | 60+ total days |

---

## 5.14 Maternity Leave Extension Grant (NEW 2026)

- **Amount:** 10,700 NIS
- **Eligibility:** 45+ days in 2026, with 21+ days during the maternity extension period
- **Condition:** Partner must not be eligible for maternity pay

---

## 5.15 Spouse Absence Days — Parents of child under 14. ~1 day per 20 service days.

## 5.16 Organizing Days (ימי התארגנות) — Tier-based; e.g. 80 days in א+ → 9 organizing days.

## 5.17 Amit Program — 12,000 coins, 30+ days from war start, valid until 31/12/2027.

## 5.18 Vehicle License Discount / Highway 6 — Same as 2025 (see `CALCULATIONS_2025.md` §4.18–4.19).

---

## 12. Quick Reference — 2026 Benefits by Tier

| Benefit | א+ | ה |
|---|---|---|
| Special Compensation | 133/day | 30/day |
| Personal Expenses | 46/day (all days) | 11/day (all days) |
| Family Grant (child<14) | 83/day (all days) | 21/day (all days) |
| Digital Wallet (days 1–30) | 45/day | — |
| Digital Wallet (days 31–45) | 120/day | — |
| Digital Wallet (days 46+) | 70/day | — |
| Household Maintenance | 2,500 (45+ days) | 1,250 |
| Tax Credit Points (80 days) | 7,260 | — |
| Vacation Voucher (60d, child<14) | 4,500 | 1,030 |
| Babysitter | 100/day (2K/mo, 8K/yr) | 80/day (2K total) |
| Babysitter "שאגת הארי" bonus | 1,500/yr | 1,000/yr |
| Moving Expenses | 2,500 (1+ day) | — |
| Maternity Extension (NEW) | 10,700 | 10,700 |

### Calendar Grant (All Tiers)

| Days | Points | Amount (NIS gross) |
|---|---|---|
| 30 | 1.5 | 4,356 |
| 80+ | 2.0 | 5,808 |

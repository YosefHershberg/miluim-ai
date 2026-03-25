import type { ServicePeriod } from "@/generated/prisma/client";
export { getCreditPoints } from "./constants";

const WAR_START = new Date("2023-10-07");

export { ADJUSTED_DAYS_REMAINDER } from "./constants";

/** Calculate adjusted service days per Section 3.1 */
export function calculateAdjustedDays(totalDays: number): number {
  const REMAINDER_TABLE: Record<number, number> = {
    0: 0, 1: 1.4, 2: 2.4, 3: 4.2, 4: 4.2, 5: 7.0, 6: 7.0,
  };
  const fullWeeks = Math.floor(totalDays / 7);
  const remainder = totalDays % 7;
  return fullWeeks * 7 + (REMAINDER_TABLE[remainder] ?? 0);
}

/** Group service days by calendar year */
export function aggregateDaysByYear(
  periods: ServicePeriod[]
): Record<number, number> {
  const yearDays: Record<number, number> = {};

  for (const p of periods) {
    const startYear = new Date(p.startDate).getFullYear();
    const endYear = new Date(p.endDate).getFullYear();

    if (startYear === endYear) {
      yearDays[startYear] = (yearDays[startYear] || 0) + p.totalDays;
    } else {
      // Split across years proportionally
      const start = new Date(p.startDate);
      const endOfYear = new Date(startYear, 11, 31);
      const totalSpan =
        (new Date(p.endDate).getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      const daysInFirstYear =
        (endOfYear.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      const ratio = daysInFirstYear / totalSpan;
      const firstYearDays = Math.round(p.totalDays * ratio);
      const secondYearDays = p.totalDays - firstYearDays;

      yearDays[startYear] = (yearDays[startYear] || 0) + firstYearDays;
      yearDays[endYear] = (yearDays[endYear] || 0) + secondYearDays;
    }
  }

  return yearDays;
}

/** Total days from war start (Oct 7, 2023) */
export function getTotalDaysSinceWarStart(periods: ServicePeriod[]): number {
  return periods
    .filter(
      (p) => p.isEmergencyOrder && new Date(p.endDate) >= WAR_START
    )
    .reduce((sum, p) => sum + p.totalDays, 0);
}

/** Total days in a specific year */
export function getTotalDaysInYear(
  periods: ServicePeriod[],
  year: number
): number {
  const yearDays = aggregateDaysByYear(
    periods.filter((p) => p.isEmergencyOrder)
  );
  return yearDays[year] || 0;
}

/** Total emergency order (צו 8) days */
export function getTotalTzav8Days(periods: ServicePeriod[]): number {
  return periods
    .filter((p) => p.isEmergencyOrder)
    .reduce((sum, p) => sum + p.totalDays, 0);
}

/** Days from war start to end of a given year */
export function getDaysWarStartToEndOfYear(
  periods: ServicePeriod[],
  endYear: number
): number {
  const yearDays = aggregateDaysByYear(
    periods.filter((p) => p.isEmergencyOrder)
  );
  let total = 0;
  for (const [year, days] of Object.entries(yearDays)) {
    if (Number(year) >= 2023 && Number(year) <= endYear) {
      total += days;
    }
  }
  return total;
}

/** Get combined days for 2024+2025 (for 2025 framework threshold) */
export function getDays2024Plus2025(periods: ServicePeriod[]): number {
  const yearDays = aggregateDaysByYear(
    periods.filter((p) => p.isEmergencyOrder)
  );
  return (yearDays[2024] || 0) + (yearDays[2025] || 0);
}

/**
 * Calculate 10-day blocks from a starting day threshold.
 * First block triggers AT fromDay, then every 10 days after.
 * E.g. 117 days from day 40: blocks at 40,50,60,70,80,90,100,110 = 8 blocks
 */
export function getTenDayBlocks(totalDays: number, fromDay: number): number {
  if (totalDays < fromDay) return 0;
  return Math.floor((totalDays - fromDay) / 10) + 1;
}

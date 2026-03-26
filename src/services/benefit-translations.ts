/**
 * Translates Hebrew benefit strings (description, ineligibleReason, etc.)
 * to English for display in the benefits view.
 *
 * These strings are generated dynamically in the calculator services with
 * Hebrew text. This utility maps common patterns to English equivalents.
 */

const reasonPatterns: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^אין תקופות שירות$/, () => "No service periods"],
  [/^אין ימי שירות$/, () => "No service days"],
  [/^אין ילד עד גיל 14$/, () => "No child under 14"],
  [/^לוחמים בלבד$/, () => "Combat only"],
  [/^מדרג א\+ בלבד$/, () => "Tier A+ only"],
  [/^אין תפקיד פיקודי \/ לא לוחם$/, () => "No command role / not combat"],
  [/^אין תפקיד פיקודי \/ לא מדרג א\+$/, () => "No command role / not tier A+"],
  [/^נדרשים (\d+)\+ ימים$/, (m) => `Requires ${m[1]}+ days`],
  [/^נדרשים (\d+)\+ ימים בשנה$/, (m) => `Requires ${m[1]}+ days per year`],
  [/^נדרשים (\d+)\+ ימים, יש (\d+)$/, (m) => `Requires ${m[1]}+ days, have ${m[2]}`],
  [/^נדרשים (\d+)\+ ימי צו 8$/, (m) => `Requires ${m[1]}+ Tzav 8 days`],
  [/^נדרשים (\d+)\+ ימי צו 8 ב-(\d+)$/, (m) => `Requires ${m[1]}+ Tzav 8 days in ${m[2]}`],
  [/^נדרשים (\d+)\+ ימים ב-(\d+)$/, (m) => `Requires ${m[1]}+ days in ${m[2]}`],
  [/^נדרשים 32\+ ימים$/, () => "Requires 32+ days"],
];

const descriptionPatterns: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^תגמול מילואים מביטוח לאומי$/, () => "NII reserve duty compensation"],
  [/^תגמול מילואים מביטוח לאומי עבור כל ימי השירות בצו 8$/, () => "NII compensation for all Tzav 8 service days"],
  [/^אין תקופות שירות בצו 8$/, () => "No Tzav 8 service periods"],
  [/^תגמול מיוחד לשנת (\d+)$/, (m) => `Special compensation for ${m[1]}`],
  [/^תגמול מיוחד — כל ימי (\d+) לאחר חציית סף 32$/, (m) => `Special compensation — all ${m[1]} days after 32-day threshold`],
  [/^מענק קלנדרי$/, () => "Calendar grant"],
  [/^מענק קלנדרי — לאחר 25% מס$/, () => "Calendar grant — after 25% tax"],
  [/^מענק קלנדרי \(ברוטו, לפני 25% מס\)$/, () => "Calendar grant (gross, before 25% tax)"],
  [/^מענק הוצאות אישיות מוגדל$/, () => "Enhanced personal expenses grant"],
  [/^מענק הוצאות אישיות מוגדל — לפי יום על כל הימים$/, () => "Enhanced personal expenses — per day on all days"],
  [/^מענק הוצאות אישיות מוגדל מיום 40$/, () => "Enhanced personal expenses from day 40"],
  [/^מענק משפחה מוגדל$/, () => "Enhanced family grant"],
  [/^מענק משפחה מוגדל — לפי יום על כל הימים$/, () => "Enhanced family grant — per day on all days"],
  [/^מענק משפחה מוגדל מיום 40$/, () => "Enhanced family grant from day 40"],
  [/^ארנק דיגיטלי פייטר$/, () => "Digital wallet (Fighter Card)"],
  [/^נקודות זיכוי במס$/, () => "Tax credit points"],
  [/^נקודות זיכוי במס הכנסה$/, () => "Income tax credit points"],
  [/^נקודות זיכוי במס הכנסה — שנת מס (\d+)$/, (m) => `Income tax credits — tax year ${m[1]}`],
  [/^מענק למשרת מילואים פעיל$/, () => "Active reservist grant"],
  [/^מענק כלכלת הבית המוגדל$/, () => "Enhanced household maintenance grant"],
  [/^מענק כלכלת הבית בסיסי$/, () => "Basic household maintenance grant"],
  [/^מענק מפקדים$/, () => "Commander grant"],
  [/^שובר חופשה$/, () => "Vacation voucher"],
  [/^מענק קייטנות$/, () => "Camp grant"],
  [/^הנחה באגרת רישיון רכב$/, () => "Vehicle license fee discount"],
  [/^תוכנית עמית$/, () => "Amit Program"],
  // Payment dates & misc
  [/^מוחל בשנת המס הבאה$/, () => "Applied next tax year"],
  [/^שנת מס (\d+) — דרך טופס 101$/, (m) => `Tax year ${m[1]} — via Form 101`],
  [/^בתוקף עד (.+)$/, (m) => `Valid until ${m[1]}`],
  [/^מאי השנה הבאה$/, () => "May next year"],
  [/^1 במאי (\d+)$/, (m) => `May 1, ${m[1]}`],
  [/^1 בספטמבר$/, () => "September 1st"],
  [/^1 בספטמבר (\d+)$/, (m) => `September 1, ${m[1]}`],
  [/^ראשון לחודש בזמן השירות$/, () => "First of each month during service"],
  [/^משולם דרך המעסיק \/ ישירות מביטוח לאומי$/, () => "Paid via employer / directly from NII"],
  [/^מענק כלכלת הבית מוגדל \(א\+ 45\+ ימים\)$/, () => "Enhanced household grant (A+ 45+ days)"],
];

function translateWithPatterns(
  text: string,
  patterns: [RegExp, (m: RegExpMatchArray) => string][]
): string | null {
  for (const [pattern, translator] of patterns) {
    const match = text.match(pattern);
    if (match) return translator(match);
  }
  return null;
}

export function translateIneligibleReason(reasonHe: string): string {
  return translateWithPatterns(reasonHe, reasonPatterns) || reasonHe;
}

export function translateDescription(descHe: string): string {
  return translateWithPatterns(descHe, descriptionPatterns) || descHe;
}

export function translatePaymentDate(dateHe: string): string {
  return translateWithPatterns(dateHe, descriptionPatterns) || dateHe;
}

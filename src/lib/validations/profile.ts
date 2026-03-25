import { z } from "zod";

const booleanFromString = z.preprocess(
  (val) => val === "true" || val === true,
  z.boolean()
);

export const profileSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    dateOfBirth: z.coerce.date(),
    idNumber: z.string().regex(/^\d{9}$/, "Must be 9 digits"),
    commanderRank: z.enum([
      "NONE",
      "PLATOON_COMMANDER",
      "DEPUTY_COMPANY",
      "COMPANY_COMMANDER",
      "BATTALION_COMMANDER",
    ]),
    serviceRole: z
      .enum(["COMBAT", "TERRITORIAL_DEFENSE", "SUPPORT"])
      .optional()
      .nullable(),
    activityTier: z
      .enum(["ALEPH_PLUS", "ALEPH", "BET", "GIMEL", "DALET", "HE"])
      .optional()
      .nullable(),
    employmentType: z.enum([
      "SALARIED",
      "SELF_EMPLOYED",
      "UNEMPLOYED",
      "STUDENT",
    ]),
    monthlyGrossSalary: z.coerce.number().positive().optional().nullable(),
    annualGrossIncome: z.coerce.number().positive().optional().nullable(),
    hasChildUnder14: booleanFromString,
    childrenUnder18: z.enum(["ZERO", "ONE_TO_THREE", "FOUR_PLUS"]),
    isStudent: booleanFromString,
  })
  .refine(
    (data) => {
      if (data.employmentType === "SALARIED" && !data.monthlyGrossSalary) {
        return false;
      }
      if (data.employmentType === "SELF_EMPLOYED" && !data.annualGrossIncome) {
        return false;
      }
      return true;
    },
    { message: "Salary/income required for your employment type" }
  );

export type ProfileFormData = z.infer<typeof profileSchema>;

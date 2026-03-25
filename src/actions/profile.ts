"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { profileSchema } from "@/lib/validations/profile";
import {
  createUserProfile,
  updateUserProfile,
} from "@/data-access/user-profile";

function parseFormData(formData: FormData) {
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  raw.hasChildUnder14 = raw.hasChildUnder14 === "true" ? "true" : "false";
  raw.isStudent = raw.isStudent === "true" ? "true" : "false";
  // Handle optional selects that may be empty strings
  if (!raw.serviceRole) raw.serviceRole = null;
  if (!raw.activityTier) raw.activityTier = null;
  return raw;
}

export async function createProfile(formData: FormData) {
  const user = await requireAuth();
  const raw = parseFormData(formData);

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  await createUserProfile(user.id, {
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    idNumber: data.idNumber,
    commanderRank: data.commanderRank,
    serviceRole: data.serviceRole ?? null,
    activityTier: data.activityTier ?? null,
    employmentType: data.employmentType,
    monthlyGrossSalary: data.monthlyGrossSalary ?? null,
    annualGrossIncome: data.annualGrossIncome ?? null,
    hasChildUnder14: data.hasChildUnder14,
    childrenUnder18: data.childrenUnder18,
    isStudent: data.isStudent,
  });

  redirect("/dashboard");
}

export async function editProfile(formData: FormData) {
  const user = await requireAuth();
  const raw = parseFormData(formData);

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  await updateUserProfile(user.id, {
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    idNumber: data.idNumber,
    commanderRank: data.commanderRank,
    serviceRole: data.serviceRole ?? null,
    activityTier: data.activityTier ?? null,
    employmentType: data.employmentType,
    monthlyGrossSalary: data.monthlyGrossSalary ?? null,
    annualGrossIncome: data.annualGrossIncome ?? null,
    hasChildUnder14: data.hasChildUnder14,
    childrenUnder18: data.childrenUnder18,
    isStudent: data.isStudent,
  });

  revalidatePath("/profile");
  redirect("/profile");
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { extractFromMultipleDocuments } from "@/services/document-processor";
import {
  createServicePeriods,
  deleteServicePeriod as deleteServicePeriodFromDB,
  getServicePeriodsByUserId,
} from "@/data-access/service-periods";

interface ExtractedResult {
  fileName: string;
  periods: { startDate: string; endDate: string; totalDays: number; isDuplicate: boolean }[];
  error?: string;
}

export async function processDocuments(
  formData: FormData
): Promise<{ results: ExtractedResult[] } | { error: string }> {
  const user = await requireAuth();

  const files = formData.getAll("files") as File[];
  if (!files.length) return { error: "No files uploaded" };

  const fileData = await Promise.all(
    files.map(async (file) => ({
      buffer: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type || "application/pdf",
      fileName: file.name,
    }))
  );

  const [rawResults, existingPeriods] = await Promise.all([
    extractFromMultipleDocuments(fileData),
    getServicePeriodsByUserId(user.id),
  ]);

  const existingStartDates = new Set(
    existingPeriods.map((p) => p.startDate.toISOString().split("T")[0])
  );

  // Track startDates seen across all uploaded files to catch cross-file duplicates
  const seenInUpload = new Set<string>();

  const results: ExtractedResult[] = rawResults.map((result) => ({
    ...result,
    periods: (result.periods ?? []).map((period) => {
      const key = period.startDate; // YYYY-MM-DD string from AI
      const isDuplicate = existingStartDates.has(key) || seenInUpload.has(key);
      if (!isDuplicate) seenInUpload.add(key);
      return { ...period, isDuplicate };
    }),
  }));

  return { results };
}

interface PeriodToSave {
  startDate: string;
  endDate: string;
  totalDays: number;
  isEmergencyOrder: boolean;
}

export async function confirmAndSavePeriods(periods: PeriodToSave[]) {
  const user = await requireAuth();

  // Defense-in-depth: re-check for duplicates before writing to DB
  const existingPeriods = await getServicePeriodsByUserId(user.id);
  const existingStartDates = new Set(
    existingPeriods.map((p) => p.startDate.toISOString().split("T")[0])
  );

  const seenInBatch = new Set<string>();
  const newPeriods = periods.filter((p) => {
    if (existingStartDates.has(p.startDate) || seenInBatch.has(p.startDate)) return false;
    seenInBatch.add(p.startDate);
    return true;
  });

  const skipped = periods.length - newPeriods.length;

  if (newPeriods.length > 0) {
    await createServicePeriods(
      user.id,
      newPeriods.map((p) => ({
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
        totalDays: p.totalDays,
        isEmergencyOrder: p.isEmergencyOrder,
      }))
    );
  }

  revalidatePath("/service-periods");
  return { success: true, saved: newPeriods.length, skipped };
}

export async function removeServicePeriod(id: string) {
  const user = await requireAuth();
  await deleteServicePeriodFromDB(id, user.id);
  revalidatePath("/service-periods");
  return { success: true };
}

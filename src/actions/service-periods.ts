"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { extractFromMultipleDocuments } from "@/services/document-processor";
import {
  createServicePeriods,
  deleteServicePeriod as deleteServicePeriodFromDB,
} from "@/data-access/service-periods";

interface ExtractedResult {
  fileName: string;
  periods: { startDate: string; endDate: string; totalDays: number }[];
  error?: string;
}

export async function processDocuments(
  formData: FormData
): Promise<{ results: ExtractedResult[] } | { error: string }> {
  await requireAuth();

  const files = formData.getAll("files") as File[];
  if (!files.length) return { error: "No files uploaded" };

  const fileData = await Promise.all(
    files.map(async (file) => ({
      buffer: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type || "application/pdf",
      fileName: file.name,
    }))
  );

  const results = await extractFromMultipleDocuments(fileData);
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

  await createServicePeriods(
    user.id,
    periods.map((p) => ({
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      totalDays: p.totalDays,
      isEmergencyOrder: p.isEmergencyOrder,
    }))
  );

  revalidatePath("/service-periods");
  return { success: true };
}

export async function removeServicePeriod(id: string) {
  const user = await requireAuth();
  await deleteServicePeriodFromDB(id, user.id);
  revalidatePath("/service-periods");
  return { success: true };
}

import { GoogleGenAI } from "@google/genai";

interface ExtractedPeriod {
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string;
  totalDays: number;
}

export async function extractFromDocument(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ExtractedPeriod[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: fileBuffer.toString("base64"),
            },
          },
          {
            text: `Extract all service periods from this IDF 3010 form.
For each period, return:
- startDate (ISO format YYYY-MM-DD)
- endDate (ISO format YYYY-MM-DD)
- totalDays (number)

The document is in Hebrew. Look for the table with columns:
תאריך תחילה (start date), תאריך סיום (end date), סה"כ ימים (total days)

Return ONLY valid JSON array: [{"startDate": "...", "endDate": "...", "totalDays": ...}]
No markdown, no explanation.`,
          },
        ],
      },
    ],
  });

  const text = response.text?.trim();
  if (!text) throw new Error("Empty response from Gemini");

  // Strip markdown fences if present
  const clean = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(clean);
}

export async function extractFromMultipleDocuments(
  files: { buffer: Buffer; mimeType: string; fileName: string }[]
): Promise<
  { fileName: string; periods: ExtractedPeriod[]; error?: string }[]
> {
  const results = await Promise.allSettled(
    files.map(async (file) => ({
      fileName: file.fileName,
      periods: await extractFromDocument(file.buffer, file.mimeType),
    }))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return {
      fileName: files[i].fileName,
      periods: [],
      error: result.reason?.message,
    };
  });
}

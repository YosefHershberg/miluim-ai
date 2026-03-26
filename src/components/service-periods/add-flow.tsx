"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Check, Loader2, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { processDocuments, confirmAndSavePeriods } from "@/actions/service-periods";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";

interface ExtractedPeriod {
  startDate: string;
  endDate: string;
  totalDays: number;
  isEmergencyOrder: boolean;
  isDuplicate: boolean;
}

type Step = "upload" | "processing" | "review" | "success";

export function AddServicePeriodFlow() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [periods, setPeriods] = useState<ExtractedPeriod[]>([]);
  const [errors, setErrors] = useState<{ fileName: string; error: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = useCallback(async () => {
    if (!files.length) return;
    setStep("processing");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const result = await processDocuments(formData);

    if ("error" in result) {
      toast.error(result.error);
      setStep("upload");
      return;
    }

    const allPeriods: ExtractedPeriod[] = [];
    const allErrors: { fileName: string; error: string }[] = [];

    for (const r of result.results) {
      if (r.error) {
        allErrors.push({ fileName: r.fileName, error: r.error });
      } else {
        for (const p of r.periods) {
          allPeriods.push({ ...p, isEmergencyOrder: true, isDuplicate: p.isDuplicate });
        }
      }
    }

    setPeriods(allPeriods);
    setErrors(allErrors);

    if (allPeriods.length > 0) {
      setStep("review");
    } else {
      const errorMsg = allErrors.length > 0
        ? allErrors.map((e) => `${e.fileName}: ${e.error}`).join("\n")
        : "לא הצלחנו לחלץ תקופות מהקבצים";
      toast.error(errorMsg);
      setStep("upload");
    }
  }, [files]);

  const updatePeriod = (index: number, updates: Partial<ExtractedPeriod>) => {
    setPeriods((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await confirmAndSavePeriods(
      periods.map((p) => ({
        startDate: p.startDate,
        endDate: p.endDate,
        totalDays: p.totalDays,
        isEmergencyOrder: p.isEmergencyOrder,
      }))
    );

    if (result.success) {
      setStep("success");
      if (result.skipped > 0) {
        toast.success(`נשמרו ${result.saved} תקופות. ${result.skipped} תקופות כפולות דולגו.`);
      } else {
        toast.success("התקופות נשמרו בהצלחה");
      }
      setTimeout(() => router.push("/service-periods"), 1500);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("myMiluim.addPeriod")}</h1>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="py-8">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium">העלה טופס 3010</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF — ניתן להעלות מספר קבצים
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted"
                      >
                        <FileText className="h-4 w-4" />
                        {f.name}
                      </div>
                    ))}
                    <Button onClick={handleUpload} className="w-full mt-4">
                      חלץ נתונים
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                <p className="font-medium">{t("myMiluim.extracting")}</p>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 15, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {errors.length > 0 && (
              <Card className="border-destructive">
                <CardContent className="py-4">
                  {errors.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {e.fileName}: {e.error}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {(() => {
              const duplicateCount = periods.filter((p) => p.isDuplicate).length;
              const newCount = periods.length - duplicateCount;
              return (
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    נמצאו {periods.length} תקופות שירות — בדוק את הנתונים ואשר
                  </p>
                  {duplicateCount > 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                      <Copy className="h-3.5 w-3.5" />
                      {duplicateCount} תקופות כבר קיימות במערכת ויידולגו · {newCount} חדשות יישמרו
                    </p>
                  )}
                </div>
              );
            })()}

            {periods.map((period, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={period.isDuplicate ? "opacity-60 border-amber-500/50" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">
                        {new Date(period.startDate).toLocaleDateString("he-IL")} –{" "}
                        {new Date(period.endDate).toLocaleDateString("he-IL")} ({period.totalDays} ימים)
                      </CardTitle>
                      {period.isDuplicate && (
                        <Badge variant="outline" className="text-amber-600 border-amber-500 shrink-0 gap-1">
                          <Copy className="h-3 w-3" />
                          כפול
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Switch
                        id={`emergency-${i}`}
                        checked={period.isEmergencyOrder}
                        disabled={period.isDuplicate}
                        onCheckedChange={(checked) =>
                          updatePeriod(i, { isEmergencyOrder: checked })
                        }
                      />
                      <Label htmlFor={`emergency-${i}`} className={period.isDuplicate ? "text-muted-foreground" : ""}>
                        צו 8
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setPeriods([]);
                  setFiles([]);
                }}
                className="flex-1"
              >
                {t("calculator.back")}
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? t("common.loading") : t("myMiluim.confirmData")}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
                >
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <p className="font-medium text-lg">התקופות נשמרו בהצלחה!</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

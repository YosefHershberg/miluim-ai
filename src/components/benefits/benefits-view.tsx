"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BenefitCard } from "./benefit-card";
import { useTranslation } from "@/lib/i18n";
import type { BenefitResult } from "@/services/benefits-calculator";
import { AlertTriangle } from "lucide-react";

interface BenefitsViewProps {
  benefits: BenefitResult[];
  totalDirect: number;
}

export function BenefitsView({ benefits, totalDirect }: BenefitsViewProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("all");

  const filtered =
    tab === "all"
      ? benefits
      : tab === "direct"
        ? benefits.filter((b) => b.category === "direct")
        : benefits.filter((b) => b.category === "redeemable");

  const eligible = filtered.filter((b) => b.eligible);
  const ineligible = filtered.filter((b) => !b.eligible);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("entitlements.title")}</h1>
      </div>

      {/* Summary Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-6 text-center">
            <p className="text-sm opacity-80">{t("calculator.totalDirectLabel")}</p>
            <p className="text-4xl font-bold mt-1">
              ₪{totalDirect.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            {t("tabs.all")} ({benefits.length})
          </TabsTrigger>
          <TabsTrigger value="direct" className="flex-1">
            {t("tabs.direct")} ({benefits.filter((b) => b.category === "direct").length})
          </TabsTrigger>
          <TabsTrigger value="redeemable" className="flex-1">
            {t("tabs.redeemable")} ({benefits.filter((b) => b.category === "redeemable").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {eligible.length > 0 && (
            <div className="space-y-3">
              {eligible.map((benefit, i) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <BenefitCard benefit={benefit} />
                </motion.div>
              ))}
            </div>
          )}

          {ineligible.length > 0 && (
            <div className="space-y-3 mt-6">
              <p className="text-sm text-muted-foreground font-medium">
                הטבות שאינך זכאי להן כרגע
              </p>
              {ineligible.map((benefit, i) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (eligible.length + i) * 0.05 }}
                >
                  <BenefitCard benefit={benefit} />
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t("entitlements.empty")}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="py-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              מחשבון זה הינו לצרכי מידע בלבד. סכומי ההטבות בפועל עשויים להשתנות
              בהתאם לנסיבות אישיות, עדכוני מדיניות והחלטות מנהליות. לחישובים
              מוגדרים, פנה לביטוח לאומי (*6050), יועץ מס או עורך דין לדיני עבודה.
            </p>
            <p className="text-xs">
              This calculator is for informational purposes only. Actual benefit
              amounts may vary. Consult the National Insurance Institute (*6050),
              a tax advisor, or a labor law attorney.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

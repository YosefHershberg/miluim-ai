"use client";

import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { BenefitResult } from "@/services/benefits-calculator";
import { useTranslation } from "@/lib/i18n";
import { translateIneligibleReason, translateDescription, translatePaymentDate } from "@/services/benefit-translations";

export function BenefitCard({ benefit }: { benefit: BenefitResult }) {
  const { t, locale } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        !benefit.eligible ? "opacity-60" : ""
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                benefit.eligible
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-muted"
              }`}
            >
              {benefit.eligible ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium leading-tight">{locale === "he" ? benefit.nameHe : benefit.nameEn}</p>
              <p className="text-xs text-muted-foreground">{locale === "he" ? benefit.description : benefit.nameEn}</p>
              {!benefit.eligible && benefit.ineligibleReason && (
                <p className="text-xs text-destructive mt-1">
                  {locale === "en" ? translateIneligibleReason(benefit.ineligibleReason) : benefit.ineligibleReason}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {benefit.eligible && benefit.amount != null && (
              <span className="font-bold text-lg">
                ₪{benefit.amount.toLocaleString()}
              </span>
            )}
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={benefit.category === "direct" ? "default" : "secondary"}
                className="text-xs"
              >
                {benefit.category === "direct" ? t("benefits.directLabel") : t("benefits.redeemableLabel")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {benefit.framework}
              </Badge>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                <p className="text-muted-foreground">
                  {locale === "en" ? translateDescription(benefit.description) : benefit.description}
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-mono text-xs">
                    {benefit.calculationBreakdown}
                  </p>
                </div>
                {benefit.paymentDate && (
                  <p className="text-xs text-muted-foreground">
                    {t("benefits.paymentDateLabel")} {locale === "en" ? translatePaymentDate(benefit.paymentDate) : benefit.paymentDate}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t("benefits.sectionLabel")} {benefit.section}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

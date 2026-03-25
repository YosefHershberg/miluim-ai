"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { removeServicePeriod } from "@/actions/service-periods";
import { useTranslation } from "@/lib/i18n";

interface Period {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  isEmergencyOrder: boolean;
  role: string | null;
  activityTier: string | null;
}

const roleLabels: Record<string, string> = {
  COMBAT: "לוחם",
  TERRITORIAL_DEFENSE: "הגנה מרחבית",
  SUPPORT: "תומך/עורפי",
};

const tierLabels: Record<string, string> = {
  ALEPH_PLUS: "א+",
  ALEPH: "א",
  BET: "ב",
  GIMEL: "ג",
  DALET: "ד",
  HE: "ה",
};

export function ServicePeriodsList({ periods }: { periods: Period[] }) {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await removeServicePeriod(deleteId);
    setDeleteId(null);
    setDeleting(false);
  };

  const totalDays = periods.reduce((sum, p) => sum + p.totalDays, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("myMiluim.title")}</h1>
          {periods.length > 0 && (
            <p className="text-muted-foreground text-sm mt-1">
              {t("myMiluim.totalDays", { count: totalDays })}
            </p>
          )}
        </div>
        <Link href="/service-periods/add" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" />
          {t("myMiluim.addPeriod")}
        </Link>
      </div>

      {periods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("myMiluim.empty")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("myMiluim.emptySubtext")}
            </p>
            <Link href="/service-periods/add" className={cn(buttonVariants(), "mt-4")}>
              {t("myMiluim.addPeriod")}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {periods.map((period, i) => (
              <motion.div
                key={period.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {new Date(period.startDate).toLocaleDateString("he-IL")} –{" "}
                          {new Date(period.endDate).toLocaleDateString("he-IL")}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {period.totalDays} ימים
                          </span>
                          {period.isEmergencyOrder && (
                            <Badge variant="secondary" className="text-xs">
                              צו 8
                            </Badge>
                          )}
                          {period.role && (
                            <Badge variant="outline" className="text-xs">
                              {roleLabels[period.role]}
                            </Badge>
                          )}
                          {period.activityTier && (
                            <Badge variant="outline" className="text-xs">
                              מדרג {tierLabels[period.activityTier]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(period.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת תקופת מילואים</DialogTitle>
            <DialogDescription>
              {t("myMiluim.deleteConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? t("common.loading") : t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

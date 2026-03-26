"use client";

import { motion } from "framer-motion";
import { Calendar, Calculator, User, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface DashboardClientProps {
  fullName: string;
  totalDays: number;
  yearBreakdown: Record<number, number>;
  hasPeriods: boolean;
}

export function DashboardClient({
  fullName,
  totalDays,
  yearBreakdown,
  hasPeriods,
}: DashboardClientProps) {
  const { t } = useTranslation();

  const sortedYears = Object.entries(yearBreakdown)
    .map(([year, days]) => ({ year: Number(year), days }))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">
          {t("dashboard.welcome", { name: fullName.split(" ")[0] })}
        </h1>
      </motion.div>

      {/* Total Days */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <p className="text-sm opacity-80">{t("dashboard.totalDays")}</p>
            <motion.p
              className="text-5xl font-bold mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {totalDays}
            </motion.p>
            <p className="text-sm opacity-60 mt-1">{t("dashboard.tzav8Days")}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Year Breakdown */}
      {sortedYears.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("dashboard.yearBreakdown")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedYears.map(({ year, days }) => (
                <div key={year} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{year}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((days / Math.max(totalDays, 1)) * 100, 100)}%`,
                        }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-left">
                      {days} {t("common.days")}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <QuickAction
          href="/benefits"
          icon={<Calculator className="h-5 w-5" />}
          label={t("dashboard.calculate")}
        />
        <QuickAction
          href="/service-periods/add"
          icon={<Plus className="h-5 w-5" />}
          label={t("dashboard.addPeriodShort")}
        />
        <QuickAction
          href="/profile"
          icon={<User className="h-5 w-5" />}
          label={t("nav.profile")}
        />
      </motion.div>

      {/* Empty State */}
      {!hasPeriods && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="py-8 text-center space-y-3">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {t("dashboard.noPeriods")}
              </p>
              <Link href="/service-periods/add" className={cn(buttonVariants())}>
                {t("dashboard.getStarted")}
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <Link href={href}>
        <CardContent className="py-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <span className="font-medium text-sm">{label}</span>
        </CardContent>
      </Link>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 px-3 text-xs font-medium"
      onClick={() => setLocale(locale === "he" ? "en" : "he")}
    >
      {locale === "he" ? "EN" : "עב"}
    </Button>
  );
}

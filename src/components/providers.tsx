"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

/**
 * Wraps the app with all required client-side providers:
 * - ThemeProvider (next-themes) for dark/light mode
 * - LanguageProvider for i18n (Hebrew default)
 * - TooltipProvider for shadcn tooltips
 * - Toaster for sonner notifications
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </LanguageProvider>
    </NextThemesProvider>
  );
}

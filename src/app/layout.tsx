import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "MiluimAI",
  description: "מחשבון הטבות מילואים — AI-powered IDF reserve duty benefits calculator",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-heebo)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

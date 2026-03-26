"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronLeft, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/actions/auth";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/* ─── animated grid background ─── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─── floating hexagon particles ─── */
function HexParticle({
  size,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.15, 0.08, 0.15, 0],
        scale: [0.6, 1, 0.8, 1, 0.6],
        rotate: [0, 90, 180, 270, 360],
        y: [0, -30, 10, -20, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="text-primary">
        <polygon
          points="50,2 95,25 95,75 50,98 5,75 5,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </motion.div>
  );
}

/* ─── pulsing radar ring ─── */
function RadarRing({ delay, size }: { delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-primary/20"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.3, 0], scale: [0.3, 1, 1.2] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ─── shield emblem animation ─── */
function AnimatedShieldEmblem() {
  return (
    <div className="relative flex items-center justify-center">
      {/* radar rings */}
      <RadarRing delay={0} size={280} />
      <RadarRing delay={1} size={280} />
      <RadarRing delay={2} size={280} />

      {/* glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* outer ring */}
      <motion.div
        className="relative flex items-center justify-center w-32 h-32 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, var(--primary) 25%, transparent 50%, var(--primary) 75%, transparent 100%)",
          opacity: 0.15,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-[2px] rounded-full bg-background" />
      </motion.div>

      {/* shield icon */}
      <motion.div
        className="absolute flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 120 }}
      >
        <Shield className="w-11 h-11" strokeWidth={1.8} />
      </motion.div>

      {/* orbiting dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"
        style={{ left: "50%", top: "50%", marginLeft: -6, marginTop: -6 }}
        animate={{
          x: [0, 60, 0, -60, 0],
          y: [-60, 0, 60, 0, -60],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─── scanning line effect ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      initial={{ top: "0%" }}
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── feature pill ─── */
function FeaturePill({
  icon: Icon,
  text,
  delay,
}: {
  icon: React.ElementType;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span>{text}</span>
    </motion.div>
  );
}

/* ─── main page ─── */
export default function LoginPage() {
  const { t, locale } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ═══ LEFT PANEL — visual showcase ═══ */}
      <div className="hidden lg:flex relative w-[55%] flex-col items-center justify-center overflow-hidden">
        {/* layered background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at 30% 50%, oklch(0.25 0.04 155 / 30%) 0%, transparent 70%), radial-gradient(ellipse at 70% 80%, oklch(0.2 0.03 260 / 20%) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 30% 50%, oklch(0.92 0.04 155 / 40%) 0%, transparent 70%), radial-gradient(ellipse at 70% 80%, oklch(0.95 0.02 260 / 30%) 0%, transparent 60%)",
          }}
        />

        <AnimatedGrid />
        <ScanLine />

        {/* hex particles */}
        <HexParticle size={50} x="12%" y="15%" delay={0} duration={10} />
        <HexParticle size={35} x="78%" y="22%" delay={2} duration={12} />
        <HexParticle size={45} x="20%" y="72%" delay={1} duration={11} />
        <HexParticle size={30} x="85%" y="65%" delay={3} duration={9} />
        <HexParticle size={25} x="55%" y="10%" delay={1.5} duration={13} />
        <HexParticle size={40} x="65%" y="85%" delay={2.5} duration={10} />

        {/* center emblem */}
        <AnimatedShieldEmblem />

        {/* app title below emblem */}
        <motion.div
          className="relative mt-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-l from-primary via-emerald-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-x_4s_ease_infinite]">
              {t("app.name")}
            </span>
          </h1>
          <motion.p
            className="mt-3 text-muted-foreground text-lg max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {t("app.description")}
          </motion.p>
        </motion.div>

        {/* feature pills */}
        <motion.div
          className="relative mt-10 flex flex-wrap justify-center gap-3 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <FeaturePill icon={Zap} text={t("landing.features.calculate.title")} delay={1.3} />
          <FeaturePill icon={Shield} text={t("landing.features.track.title")} delay={1.5} />
          <FeaturePill icon={Lock} text={t("auth.login.secure")} delay={1.7} />
        </motion.div>

        {/* bottom decorative line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--primary), transparent)",
            opacity: 0.2,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
      </div>

      {/* ═══ RIGHT PANEL — login form ═══ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* subtle bg gradient for right panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at 50% 0%, oklch(0.22 0.01 260 / 50%) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 50% 0%, oklch(0.96 0.01 155 / 30%) 0%, transparent 60%)",
          }}
        />

        <AnimatePresence>
          <motion.div
            className="relative w-full max-w-sm space-y-8"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* mobile-only logo */}
            <motion.div
              className="flex flex-col items-center lg:hidden mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-l from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
                {t("app.name")}
              </h1>
            </motion.div>

            {/* heading */}
            <div className="space-y-2 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold tracking-tight">
                  {t("auth.login.welcome")}
                </h2>
              </motion.div>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {t("auth.login.subtitle")}
              </motion.p>
            </div>

            {/* login card area */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {/* google sign-in */}
              <form action={signInWithGoogle}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    variant="outline"
                    className="relative w-full h-14 gap-3 text-base font-medium border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group overflow-hidden"
                  >
                    {/* hover shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    />
                    <svg className="h-5 w-5 relative" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="relative">{t("auth.continueWithGoogle")}</span>
                  </Button>
                </motion.div>
              </form>

              {/* divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <motion.span
                    className="bg-background px-4 text-xs text-muted-foreground/60 uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {t("auth.login.secured")}
                  </motion.span>
                </div>
              </div>

              {/* trust indicators */}
              <motion.div
                className="flex items-center justify-center gap-6 text-muted-foreground/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>{t("auth.login.encrypted")}</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield className="w-3 h-3" />
                  <span>{t("auth.login.privacy")}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* disclaimer */}
            <motion.p
              className="text-center text-xs text-muted-foreground/40 leading-relaxed max-w-xs mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {t("landing.footer.disclaimer")}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* back to home link */}
        <motion.a
          href="/"
          className="absolute top-6 start-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ChevronLeft className="w-4 h-4" />
          {t("auth.login.backHome")}
        </motion.a>
      </div>

      {/* gradient x animation keyframes */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  );
}

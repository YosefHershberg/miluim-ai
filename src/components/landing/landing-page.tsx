"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, FileUp, Calculator, BarChart3, ArrowLeft, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/i18n";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, type: "spring" as const, stiffness: 150 },
  }),
};

function FloatingParticle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full bg-primary/10 ${className}`}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function LandingPage({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "he";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const featuresRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: FileUp,
      title: t("landing.features.upload.title"),
      description: t("landing.features.upload.description"),
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Calculator,
      title: t("landing.features.calculate.title"),
      description: t("landing.features.calculate.description"),
      gradient: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-500",
    },
    {
      icon: BarChart3,
      title: t("landing.features.track.title"),
      description: t("landing.features.track.description"),
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
  ];

  const stats = [
    { value: "30+", label: t("landing.stats.benefits") },
    { value: "99%", label: t("landing.stats.accuracy") },
    { value: `< 30 ${t("landing.stats.timeValue")}`, label: t("landing.stats.time") },
  ];

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur-xl"
      >
        <nav className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              <Shield className="h-5 w-5 text-primary" />
            </motion.div>
            <span>{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <a href={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? t("nav.dashboard") : t("nav.signIn")}
              </a>
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Background particles */}
      <FloatingParticle className="h-32 w-32 top-20 right-[10%]" delay={0} />
      <FloatingParticle className="h-24 w-24 top-40 left-[15%]" delay={1} />
      <FloatingParticle className="h-16 w-16 top-60 right-[30%]" delay={2} />
      <FloatingParticle className="h-20 w-20 bottom-40 left-[25%]" delay={3} />
      <FloatingParticle className="h-28 w-28 bottom-20 right-[20%]" delay={1.5} />

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("landing.hero.badge")}
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          {t("landing.hero.title")}{" "}
          <span className="relative">
            <span className="bg-gradient-to-l from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
              {t("landing.hero.titleHighlight")}
            </span>
            <motion.span
              className="absolute -bottom-2 right-0 left-0 h-1 bg-gradient-to-l from-primary via-emerald-500 to-primary rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          {t("landing.hero.subtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          {isAuthenticated ? (
            <Button size="lg" asChild className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
              <a href="/dashboard" className="inline-flex items-center gap-2">
                {t("nav.dashboard")}
                <ArrowIcon className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="lg" asChild className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/25">
              <a href="/login" className="inline-flex items-center gap-2">
                {t("landing.hero.cta")}
                <ArrowIcon className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="text-base px-8 h-12"
            onClick={scrollToFeatures}
          >
            {t("landing.hero.secondary")}
            <ChevronDown className="h-4 w-4 ms-1" />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 hidden md:flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-extrabold bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold"
              variants={fadeUp}
              custom={0}
            >
              {t("landing.features.title")}
            </motion.h2>
            <motion.p
              className="mt-3 text-muted-foreground text-lg"
              variants={fadeUp}
              custom={1}
            >
              {t("landing.features.subtitle")}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-b from-card to-card/50 shadow-lg hover:shadow-xl transition-shadow duration-500 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="relative p-6 md:p-8">
                    <motion.div
                      className={`inline-flex items-center justify-center rounded-2xl p-3 mb-5 bg-gradient-to-br ${feature.gradient}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </motion.div>

                    <div className="absolute top-6 end-6 text-6xl font-black text-foreground/[0.03]">
                      {i + 1}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div
            variants={scaleIn}
            custom={0}
            className="relative"
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
              <CardContent className="relative p-8 md:p-12">
                <motion.div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Shield className="h-8 w-8" />
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {t("landing.cta.title")}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                  {t("landing.cta.subtitle")}
                </p>

                <Button size="lg" asChild className="gap-2 text-base px-10 h-12 shadow-lg shadow-primary/25">
                  <a href={isAuthenticated ? "/dashboard" : "/login"}>
                    {isAuthenticated ? t("nav.dashboard") : t("landing.cta.button")}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-5xl text-center space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold">
            <Shield className="h-4 w-4 text-primary" />
            <span>{t("app.name")}</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t("landing.footer.disclaimer")}
          </p>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} {t("app.name")}. {t("landing.footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}

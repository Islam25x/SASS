import { Camera, Lightbulb, Mic, Target, TrendingUp, Wallet } from "lucide-react";
import CTASection from "../../components/landing/CTASection";
import FeatureSection from "../../components/landing/FeatureSection";
import GoalsSection from "../../components/landing/GoalsSection";
import HeroSection from "../../components/landing/HeroSection";
import type { BenefitItem, LandingCardItem } from "../../components/landing/types";
import navLogoSrc from "../../assets/logo.png";
import robotImageSrc from "../../assets/Finixa robot.png";
import { motion, useReducedMotion } from "framer-motion";
import {
  motionViewport,
  pageEnter,
  slideIn,
} from "../../shared/animations/motionPresets";

const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";

const heroBenefits: BenefitItem[] = [
  { id: "voice-photo", label: "Track expenses by voice or photo" },
  { id: "alerts", label: "Get alerts before you're broke" },
];

const preventionCards: LandingCardItem[] = [
  {
    id: "voice",
    title: "Record expenses by voice",
    description: "Just say it, we'll track it automatically.",
    icon: Mic,
  },
  {
    id: "receipt",
    title: "Snap a photo of your receipt",
    description: "Just snap a photo, done.",
    icon: Camera,
  },
  {
    id: "forecast",
    title: "See when you'll be broke",
    description: "Know in advance if you'll overshoot your budget.",
    icon: TrendingUp,
  },
];

const goalsCards: LandingCardItem[] = [
  {
    id: "goals",
    title: "Simple Goals",
    description: "Set a specific target to save each month.",
    icon: Target,
  },
  {
    id: "budgeting",
    title: "Budgeting",
    description: "Set your spending limits before you overspend.",
    icon: Wallet,
  },
  {
    id: "insights",
    title: "Smart Insights",
    description: "Break down expenses and get personalized tips.",
    icon: Lightbulb,
  },
];

function StickyNavbar() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.header
      variants={slideIn({
        direction: "down",
        distance: 16,
        duration: 0.45,
        reducedMotion: shouldReduceMotion,
      })}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-20 border-b border-slate-200/70 bg-customBg/95 backdrop-blur"
    >
      <div className={CONTAINER_CLASS}>
        <nav className="flex h-20 items-center" aria-label="Finexa">
          <img src={navLogoSrc} alt="Finexa" className="h-12 w-auto object-contain lg:h-14" />
        </nav>
      </div>
    </motion.header>
  );
}

export default function WelcomePage() {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <motion.main
      variants={pageEnter({ reducedMotion: shouldReduceMotion })}
      initial="hidden"
      animate="visible"
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white to-customBg"
    >
      <StickyNavbar />
      <HeroSection robotImageSrc={robotImageSrc} benefits={heroBenefits} />
      <motion.div
        variants={slideIn({
          direction: "up",
          distance: 24,
          reducedMotion: shouldReduceMotion,
        })}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport.once}
      >
        <FeatureSection
          title="How Finexa"
          highlighted="prevents running out of money"
          cards={preventionCards}
        />
      </motion.div>
      <motion.div
        variants={slideIn({
          direction: "up",
          distance: 24,
          delay: 0.04,
          reducedMotion: shouldReduceMotion,
        })}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport.once}
      >
        <GoalsSection
          title="How Finexa helps you"
          highlighted="save before the end of the month"
          cards={goalsCards}
        />
      </motion.div>
      <motion.div
        variants={slideIn({
          direction: "up",
          distance: 18,
          reducedMotion: shouldReduceMotion,
        })}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport.once}
      >
        <CTASection />
      </motion.div>
    </motion.main>
  );
}

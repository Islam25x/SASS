import Card from "./Card";
import type { LandingCardItem } from "./types";
import { motion, useReducedMotion } from "framer-motion";
import {
  motionViewport,
  slideIn,
  staggerChild,
  staggerParent,
} from "../../shared/animations/motionPresets";

interface GoalsSectionProps {
  title: string;
  highlighted: string;
  cards: LandingCardItem[];
}

const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";

export default function GoalsSection({
  title,
  highlighted,
  cards,
}: GoalsSectionProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section className="bg-white py-12 lg:py-20" aria-labelledby="goals-section-title">
      <div className={CONTAINER_CLASS}>
        <motion.h2
          variants={slideIn({
            direction: "up",
            distance: 20,
            reducedMotion: shouldReduceMotion,
          })}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport.once}
          id="goals-section-title"
          className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          {title} <span className="text-primary">{highlighted}</span>
        </motion.h2>
        <motion.div
          variants={staggerParent({ delayChildren: 0.08, staggerChildren: 0.1 })}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport.once}
          className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={staggerChild({
                direction: index % 2 === 0 ? "right" : "left",
                distance: 24,
                reducedMotion: shouldReduceMotion,
              })}
            >
              <Card item={card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

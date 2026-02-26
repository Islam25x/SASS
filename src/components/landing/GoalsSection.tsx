import Card from "./Card";
import type { LandingCardItem } from "./types";

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
  return (
    <section className="bg-white py-12 lg:py-20" aria-labelledby="goals-section-title">
      <div className={CONTAINER_CLASS}>
        <h2 id="goals-section-title" className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
          {title} <span className="text-primary">{highlighted}</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} item={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

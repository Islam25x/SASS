import type { LandingCardItem } from "./types";

interface CardProps {
  item: LandingCardItem;
}

export default function Card({ item }: CardProps) {
  const Icon = item.icon;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-500">{item.description}</p>
    </article>
  );
}

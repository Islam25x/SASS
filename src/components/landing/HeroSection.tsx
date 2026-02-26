import type { BenefitItem } from "./types";

interface HeroSectionProps {
  robotImageSrc: string;
  benefits: BenefitItem[];
}

const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";

export default function HeroSection({ robotImageSrc, benefits }: HeroSectionProps) {
  return (
    <section
      className="flex h-[88vh] items-center bg-white overflow-hidden"
      aria-labelledby="landing-hero-title"
    >
      <div className={CONTAINER_CLASS}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6 text-center lg:text-left">
            <h1
              id="landing-hero-title"
              className="mx-auto max-w-xl text-4xl font-bold leading-tight text-slate-900 lg:mx-0 lg:text-5xl"
            >
              Running out of salary before the end of the{" "}
              <span className="text-primary">month</span>?
            </h1>

            <p className="mx-auto max-w-xl text-base text-slate-600 sm:text-lg lg:mx-0">
              Finexa alerts you before you run out - and guides you on how to save.
            </p>

            <button
              type="button"
              aria-label="Try Finexa for free"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-0"
            >
              Try Free
            </button>

            <ul className="space-y-3" aria-label="Finexa key benefits">
              {benefits.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-center gap-3 text-sm text-slate-600 lg:justify-start"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary"
                  >
                    &#10003;
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <figure
              className="w-full max-w-xl lg:max-w-none"
              aria-label="Finexa robot preview"
            >
              <img
                src={robotImageSrc}
                alt="Finexa AI robot holding a phone"
                className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl object-contain"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

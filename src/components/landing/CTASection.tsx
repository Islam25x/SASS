const CONTAINER_CLASS = "mx-auto max-w-7xl px-6";

export default function CTASection() {
  return (
    <section className="bg-slate-50 py-12 lg:py-20" aria-labelledby="landing-cta-title">
      <div className={CONTAINER_CLASS}>
        <div className="text-center">
          <h2 id="landing-cta-title" className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Take control of your salary.
          </h2>
          <button
            type="button"
            aria-label="Try Finexa and take control"
            className="mt-6 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-0"
          >
            Try Free and Take Control
          </button>
        </div>
      </div>
    </section>
  );
}

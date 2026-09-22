import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Droplet, FlaskConical, Sparkles } from "lucide-react";
import routineLineup from "@/assets/routine-lineup.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";
import productSerum from "@/assets/product-serum.jpg";
import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productTreatment from "@/assets/product-treatment.jpg";

type RoutineProduct = {
  name: string;
  description: string;
  image: string;
  price: number;
};

type RoutineDef = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  bestFor: string;
  products: RoutineProduct[];
};

const ROUTINES: RoutineDef[] = [
  {
    id: "mild",
    name: "Mild Clarity Routine",
    shortName: "Mild",
    description:
      "A gentle 3-step system designed to maintain balance and prevent early breakouts. Ideal for sensitive skin and occasional acne.",
    bestFor: "Sensitive skin · Occasional breakouts",
    products: [
      {
        name: "Gentle Cleanser",
        description:
          "Purify without disrupting your skin. A soft, non-stripping cleanser designed to remove impurities while maintaining your skin's natural balance. Ideal for mild breakouts and sensitive skin.",
        image: productCleanser,
        price: 32,
      },
      {
        name: "Clarify Serum (Mild)",
        description:
          "Target breakouts—gently. A lightweight serum that supports clearer skin while calming redness and improving texture.",
        image: productSerum,
        price: 58,
      },
      {
        name: "Balance Moisturizer",
        description:
          "Hydration that keeps skin in balance. A lightweight, non-comedogenic moisturizer that supports the skin barrier and prevents dryness.",
        image: productMoisturizer,
        price: 46,
      },
    ],
  },
  {
    id: "moderate",
    name: "Moderate Clarity Routine",
    shortName: "Moderate",
    description:
      "A targeted routine to reduce active acne while keeping skin calm and supported. Designed for frequent breakouts and uneven texture.",
    bestFor: "Frequent breakouts · Uneven texture",
    products: [
      {
        name: "Purifying Cleanser",
        description:
          "Deep cleanse, without compromise. Removes excess oil and buildup while protecting the skin barrier and preventing clogged pores.",
        image: productCleanser,
        price: 36,
      },
      {
        name: "Clarify Serum (Moderate)",
        description:
          "Visible results, balanced approach. Reduces active acne and improves skin clarity without overwhelming the skin.",
        image: productSerum,
        price: 64,
      },
      {
        name: "Balance Moisturizer",
        description:
          "Hydration that keeps skin in balance. A lightweight, non-comedogenic moisturizer that supports the skin barrier and prevents dryness.",
        image: productMoisturizer,
        price: 46,
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced Clarity Routine",
    shortName: "Advanced",
    description:
      "A complete system for persistent acne, focused on clarity, recovery, and long-term skin health.",
    bestFor: "Persistent acne · Active breakouts",
    products: [
      {
        name: "Clarifying Cleanser",
        description:
          "Reset your skin, gently. An advanced cleanser that prepares the skin for treatment while maintaining balance and comfort.",
        image: productCleanser,
        price: 40,
      },
      {
        name: "Intensive Clarify Serum",
        description:
          "Powerful care, refined for sensitive skin. Targets persistent breakouts while calming inflammation and restoring clarity.",
        image: productTreatment,
        price: 72,
      },
      {
        name: "Recovery Moisturizer",
        description:
          "Restore, repair, rebalance. A deeply supportive moisturizer designed to calm irritation and repair the skin barrier during intensive treatment.",
        image: productMoisturizer,
        price: 54,
      },
    ],
  },
];

const ICONS = [Droplet, FlaskConical, Sparkles];

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Routine = () => {
  const [selected, setSelected] = useState<RoutineDef | null>(null);

  if (selected) {
    const total = selected.products.reduce((s, p) => s + p.price, 0);
    const bundle = Math.round(total * 0.85 * 100) / 100;
    return (
      <div>
        <section className="hero-surface">
          <div className="container-wide pt-12 md:pt-16 pb-10">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All routines
            </button>
            <p className="eyebrow mt-8">{selected.bestFor}</p>
            <h1 className="font-serif text-4xl md:text-6xl mt-3 leading-[1.05] max-w-2xl">
              {selected.name}
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
              {selected.description}
            </p>
          </div>
        </section>

        <section className="container-narrow py-16 md:py-24">
          <ol className="space-y-16 md:space-y-20">
            {selected.products.map((p, i) => (
              <li
                key={p.name}
                className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                <div className={i % 2 === 0 ? "md:col-span-5" : "md:col-span-5 md:order-2"}>
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover bg-muted"
                  />
                </div>
                <div
                  className={
                    i % 2 === 0
                      ? "md:col-span-7 md:pl-8"
                      : "md:col-span-7 md:order-1 md:pr-8"
                  }
                >
                  <p className="eyebrow">Step {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-tight">
                    {p.name}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                  <p className="mt-5 text-sm tracking-wide">{formatUSD(p.price)}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-20 md:mt-28 border border-border p-8 md:p-12 bg-background">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="eyebrow">Complete the routine</p>
                <h3 className="font-serif text-3xl md:text-4xl mt-3">
                  {selected.name}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Save 15% when purchased as a routine.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-sm text-muted-foreground line-through">
                  {formatUSD(total)}
                </p>
                <p className="font-serif text-4xl md:text-5xl mt-1">
                  {formatUSD(bundle)}
                </p>
                  <Button size="lg" variant="primary" className="mt-6">
                  Add Full Routine to Cart
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="hero-surface">
        <div className="container-wide grid md:grid-cols-12 gap-10 md:gap-16 items-center py-20 md:py-28">
          <div className="md:col-span-6">
            <p className="eyebrow">Shop your routine</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[1.02]">
              Find Your Routine.
            </h1>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              Targeted skincare systems designed for every stage of acne—without
              compromising skin sensitivity.
            </p>
            <Button
              asChild
              size="lg"
              variant="primary"
              className="mt-8"
            >
              <Link to="/quiz">Take the Skin Quiz</Link>
            </Button>
          </div>
          <div className="md:col-span-6">
            <img
              src={routineLineup}
              alt="The LA-ECLANTE routine"
              loading="lazy"
              className="w-full h-[420px] md:h-[560px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-wide py-20 md:py-28">
        <div className="text-center mb-14 md:mb-20">
          <p className="eyebrow">Three curated systems</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">
            Choose your level of care.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {ROUTINES.map((r) => {
            const total = r.products.reduce((s, p) => s + p.price, 0);
            const bundle = Math.round(total * 0.85 * 100) / 100;
            return (
              <article
                key={r.id}
                className="group flex flex-col border border-border bg-background p-8 md:p-10 transition-shadow hover:shadow-[var(--shadow-elevated)]"
              >
                <p className="eyebrow">{r.bestFor}</p>
                <h3 className="font-serif text-2xl md:text-3xl mt-3 leading-tight">
                  {r.name}
                </h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed min-h-[5rem]">
                  {r.description}
                </p>

                <div className="my-8 flex items-center justify-center gap-6 py-6 border-y border-border">
                  {r.products.map((p, i) => {
                    const Icon = ICONS[i];
                    return (
                      <div key={p.name} className="flex flex-col items-center text-center w-1/3">
                        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground leading-tight">
                          {p.name.replace(/\(.*\)/, "").trim()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl">{formatUSD(bundle)}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatUSD(total)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-accent">
                  Save 15% as a routine
                </p>

                <Button
                  onClick={() => {
                    setSelected(r);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-8 rounded-none h-12 tracking-[0.16em] uppercase text-[12px]"
                >
                  Shop This Routine
                </Button>
              </article>
            );
          })}
        </div>

        <p className="text-center mt-16 text-sm text-muted-foreground">
          Not sure which is right for you?{" "}
          <Link to="/quiz" className="underline underline-offset-4 hover:text-foreground">
            Take the 60-second skin quiz
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default Routine;

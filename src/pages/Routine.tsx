import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Droplet, FlaskConical, MoonStar, Sparkles } from "lucide-react";
import routineLineup from "@/assets/routine-lineup.jfif";
import productCleanser from "@/assets/anti-acne-facewash.jfif";
import productSerum from "@/assets/anti-acne-serum.jfif";
import productMoisturizer from "@/assets/korean-glass-skin-moisturizer.jfif";
import productTreatment from "@/assets/advanced-anti-acne-serum.jfif";
import productRetinal from "@/assets/retinal-retreival-serum.jfif";
import { fetchProductByHandle, type ShopifyProductNode } from "@/lib/shopify";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

type RoutineProduct = {
  name: string;
  description: string;
  image: string;
  price: number;
  type: "cleanser" | "acne-serum" | "moisturizer" | "retinal";
};

type RoutineDef = {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  luxury?: boolean;
  products: RoutineProduct[];
  bundleHandles: Record<CommitmentKey, string>;
};

const COMMITMENTS = [
  { id: "1", label: "1 MONTH" },
  { id: "3", label: "3 MONTHS" },
  { id: "6", label: "6 MONTHS" },
] as const;

type CommitmentKey = (typeof COMMITMENTS)[number]["id"];
type CommitmentId = CommitmentKey;

const ROUTINES: RoutineDef[] = [
  {
    id: "clarity",
    name: "ECLANTIAN CLARITY",
    description:
      "A considered two-step foundation for maintaining balance and supporting skin through early-stage breakouts.",
    bestFor: "MILD / EARLY-STAGE ACNE",
    bundleHandles: {
      "1": "eclantian-clarity-routine-essential-2-step-foundation",
      "3": "eclantian-clarity-routine-essential-2-step-foundation-3-month",
      "6": "eclantian-clarity-routine-essential-2-step-foundation-6-month",
    },
    products: [
      {
        name: "Anti-Acne Face Wash",
        description: "Purify without disrupting your skin with a gentle daily cleanse.",
        image: productCleanser,
        price: 1400,
        type: "cleanser",
      },
      {
        name: "Korean Glass Skin Moisturiser",
        description: "Comforting, non-comedogenic hydration to support a calm skin barrier.",
        image: productMoisturizer,
        price: 1800,
        type: "moisturizer",
      },
    ],
  },
  {
    id: "balance",
    name: "ECLANTIAN BALANCE",
    description:
      "A focused three-step system for recurring acne, uneven texture, and skin that needs a steadier rhythm.",
    bestFor: "MODERATE / RECURRING ACNE",
    bundleHandles: {
      "1": "eclantian-balance-routine-focused-3-step-acne-system",
      "3": "eclantian-balance-routine-focused-3-step-acne-system-3-month",
      "6": "eclantian-balance-routine-focused-3-step-acne-system-6-month",
    },
    products: [
      {
        name: "Anti-Acne Face Wash",
        description: "A clear, comfortable cleanse that lifts excess oil and daily buildup.",
        image: productCleanser,
        price: 1400,
        type: "cleanser",
      },
      {
        name: "Anti-Acne Treatment Serum",
        description: "Targeted treatment for active blemishes and recurring congestion.",
        image: productSerum,
        price: 2400,
        type: "acne-serum",
      },
      {
        name: "Korean Glass Skin Moisturiser",
        description: "Lightweight hydration that keeps treatment-focused skin supported.",
        image: productMoisturizer,
        price: 1800,
        type: "moisturizer",
      },
    ],
  },
  {
    id: "renewal",
    name: "ECLANTIAN RENEWAL",
    description:
      "A complete treatment rhythm for persistent acne, combining targeted clarity with barrier-conscious recovery.",
    bestFor: "SEVERE / PERSISTENT ACNE",
    bundleHandles: {
      "1": "eclantian-renewal-routine-advanced-skin-recovery-complex",
      "3": "eclantian-renewal-routine-advanced-skin-recovery-complex-3-month",
      "6": "eclantian-renewal-routine-advanced-skin-recovery-complex-6-month",
    },
    products: [
      {
        name: "Anti-Acne Face Wash",
        description: "A daily reset that prepares skin for a more focused treatment routine.",
        image: productCleanser,
        price: 1400,
        type: "cleanser",
      },
      {
        name: "Advanced Acne Treatment Serum",
        description: "Intensive care for persistent breakouts, used with a measured hand.",
        image: productTreatment,
        price: 2800,
        type: "acne-serum",
      },
      {
        name: "Korean Glass Skin Moisturiser",
        description: "Replenishing hydration to help treatment-focused skin stay comfortable.",
        image: productMoisturizer,
        price: 1800,
        type: "moisturizer",
      },
    ],
  },
  {
    id: "professional-support",
    name: "ECLANTIAN PROFESSIONAL SUPPORT",
    description:
      "The most complete Eclantian system for deep, cystic acne, with an extended night renewal step for professional-level support.",
    bestFor: "DEEP / CYSTIC ACNE",
    luxury: true,
    bundleHandles: {
      "1": "eclantian-professional-support-routine-maximum-strength-4-step-system",
      "3": "eclantian-professional-support-routine-maximum-strength-4-step-system-3-month",
      "6": "eclantian-professional-support-routine-maximum-strength-4-step-system-6-month",
    },
    products: [
      {
        name: "Anti-Acne Face Wash",
        description: "A gentle daily cleanse to prepare skin without stripping it.",
        image: productCleanser,
        price: 1400,
        type: "cleanser",
      },
      {
        name: "Advanced Acne Treatment Serum",
        description: "Focused acne care for persistent and deeply congested skin.",
        image: productTreatment,
        price: 2800,
        type: "acne-serum",
      },
      {
        name: "Korean Glass Skin Moisturiser",
        description: "Barrier-supporting hydration to keep an intensive routine balanced.",
        image: productMoisturizer,
        price: 1800,
        type: "moisturizer",
      },
      {
        name: "Retinal Renewal Serum",
        description: "A considered night renewal step for texture and long-term clarity.",
        image: productRetinal,
        price: 3200,
        type: "retinal",
      },
    ],
  },
];

const ICONS = { cleanser: Droplet, "acne-serum": FlaskConical, moisturizer: Sparkles, retinal: MoonStar };

const formatPKR = (n: number) => `Rs. ${n.toLocaleString("en-PK")}`;

const FRONTEND_PRICES: Record<string, Record<CommitmentKey, { price: number; original: number }>> = {
  clarity: {
    "1": { price: 2720, original: 3200 },
    "3": { price: 2560, original: 3200 },
    "6": { price: 2400, original: 3200 },
  },
  balance: {
    "1": { price: 4760, original: 5600 },
    "3": { price: 4480, original: 5600 },
    "6": { price: 4200, original: 5600 },
  },
  renewal: {
    "1": { price: 5100, original: 6000 },
    "3": { price: 4800, original: 6000 },
    "6": { price: 4500, original: 6000 },
  },
  "professional-support": {
    "1": { price: 7820, original: 9200 },
    "3": { price: 7360, original: 9200 },
    "6": { price: 6900, original: 9200 },
  },
};

const Routine = () => {
  const [selected, setSelected] = useState<RoutineDef | null>(null);
  const [commitments, setCommitments] = useState<Record<string, CommitmentId>>({});
  const [bundles, setBundles] = useState<Record<string, Record<CommitmentKey, ShopifyProductNode>>>({});
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ROUTINES.map(async (routine) => {
        const products = await Promise.all(
          COMMITMENTS.map(async ({ id }) => [id, await fetchProductByHandle(routine.bundleHandles[id])] as const)
        );
        if (products.some(([, product]) => !product)) return null;
        return [routine.id, Object.fromEntries(products) as Record<CommitmentKey, ShopifyProductNode>] as const;
      })
    ).then((results) => {
      if (!cancelled) {
        setBundles(Object.fromEntries(results.filter(Boolean) as Array<readonly [string, Record<CommitmentKey, ShopifyProductNode>]>));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const getSelectedCommitment = (routine: RoutineDef) => commitments[routine.id] ?? "1";
  const getSelectedBundle = (routine: RoutineDef) => bundles[routine.id]?.[getSelectedCommitment(routine)];

  const addRoutineToCart = async (routine: RoutineDef, commitment = getSelectedCommitment(routine)) => {
    const product = bundles[routine.id]?.[commitment];
    if (!product) {
      toast.error("This routine is temporarily unavailable. Please try again shortly.");
      return;
    }

    const commitmentLabel = COMMITMENTS.find((option) => option.id === commitment)?.label ?? "1 MONTH";
    const variant = product.variants.edges[0]?.node;
    if (!variant) {
      toast.error("This routine has no available purchase option yet.");
      return;
    }

    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success(`${routine.name} · ${commitmentLabel} added to your bag.`);
  };

  if (selected) {
    const commitment = getSelectedCommitment(selected);
    const selectedBundle = getSelectedBundle(selected);
    const frontendPrice = FRONTEND_PRICES[selected.id][commitment];
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

        <section className="section-blush container-narrow section-space">
          <ol className="space-y-16 md:space-y-20">
            {selected.products.map((p, i) => (
              <li
                key={p.name}
                className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                <div className={i % 2 === 0 ? "md:col-span-5" : "md:col-span-5 md:order-2"}>
                  <div className="product-media">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover bg-muted"
                    />
                  </div>
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
                  <p className="mt-5 text-sm tracking-wide">{formatPKR(p.price)}</p>
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
                  Choose your commitment and save more as you stay consistent.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-sm text-muted-foreground line-through">
                  {formatPKR(frontendPrice.original)}
                </p>
                <p className="font-serif text-4xl md:text-5xl mt-1">
                  {formatPKR(frontendPrice.price)}
                </p>
                <div className="mt-6 flex md:justify-end gap-1" role="group" aria-label={`${selected.name} commitment`}>
                  {COMMITMENTS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCommitments((current) => ({ ...current, [selected.id]: option.id }))}
                      className={`px-3 py-2 text-[10px] uppercase tracking-[0.12em] border transition-colors ${
                        commitment === option.id
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {commitment === "6" && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-accent-gold">+ LA-ECLANTE SKIN CREDIT</p>
                )}
                <Button size="lg" variant="primary" className="mt-6" onClick={() => addRoutineToCart(selected, commitment)} disabled={isLoading || !selectedBundle}>
                  {isLoading ? "Adding..." : "Add Full Routine to Cart"}
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
        <div className="container-wide section-space grid md:grid-cols-12 gap-10 md:gap-16 items-center">
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

      <section className="container-wide section-space">
        <div className="text-center mb-14 md:mb-20">
          <p className="eyebrow">Four curated systems</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">
            Choose your level of care.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {ROUTINES.map((r) => {
            const commitment = getSelectedCommitment(r);
            const selectedBundle = getSelectedBundle(r);
            const frontendPrice = FRONTEND_PRICES[r.id][commitment];
            return (
              <article
                key={r.id}
                className={`group flex flex-col rounded-xl p-8 md:p-10 transition-all duration-200 ease-in-out ${
                  r.luxury
                    ? "border border-[#deaf04] bg-[#211b12] text-[#f8edcf] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#C9A24B] hover:bg-black hover:shadow-[0_0_0_1px_#C9A24B,0_0_20px_4px_rgba(201,162,75,0.35)]"
                    : "border border-[#E8E0D4] bg-[#FBF8F3] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#D9C7B8] hover:bg-[#F5EBE3] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
                }`}
              >
                <p className={`eyebrow ${r.luxury ? "text-accent-gold" : ""}`}>{r.bestFor}</p>
                <h3 className="font-serif text-2xl md:text-3xl mt-3 leading-tight">
                  {r.name}
                </h3>
                <p className={`mt-4 text-sm leading-relaxed min-h-[5rem] ${r.luxury ? "text-[#d9cda9]" : "text-muted-foreground"}`}>
                  {r.description}
                </p>

                <div className={`my-8 grid grid-cols-4 items-start gap-2 sm:gap-3 py-6 border-y ${r.luxury ? "border-accent-gold/30" : "border-border"}`}>
                  {r.products.map((p) => {
                    const Icon = ICONS[p.type];
                    return (
                      <div key={p.name} className="flex min-w-0 flex-col items-center text-center">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${r.luxury ? "bg-accent-gold text-[#211b12]" : "bg-secondary text-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`mt-3 min-h-[3.5rem] w-full break-words text-[9px] uppercase tracking-[0.1em] leading-tight [overflow-wrap:anywhere] ${r.luxury ? "text-[#d9cda9]" : "text-muted-foreground"}`}>
                          {p.name.replace(/\(.*\)/, "").trim().replace("Korean Glass Skin ", "").replace("Advanced Acne Treatment ", "Advanced ")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl">{formatPKR(frontendPrice.price)}</span>
                  <span className={`text-sm line-through ${r.luxury ? "text-[#b9aa82]" : "text-muted-foreground"}`}>
                    {formatPKR(frontendPrice.original)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-accent-gold">
                  {commitment === "6" ? "LA-ECLANTE SKIN CREDIT" : ""}
                </p>

                <div className={`mt-6 flex gap-1 ${r.luxury ? "text-[#f8edcf]" : ""}`} role="group" aria-label={`${r.name} commitment`}>
                  {COMMITMENTS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCommitments((current) => ({ ...current, [r.id]: option.id }))}
                      className={`flex-1 px-2 py-2 text-[10px] uppercase tracking-[0.1em] border transition-colors ${
                        commitment === option.id
                          ? "bg-foreground text-background border-foreground"
                          : r.luxury
                            ? "border-accent-gold/50 text-[#d9cda9] hover:text-[#f8edcf]"
                            : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {commitment === "6" && (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-accent-gold">LA-ECLANTE SKIN CREDIT</p>
                )}

                <Button
                  onClick={() => {
                    setSelected(r);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!selectedBundle}
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

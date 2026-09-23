import { useState } from "react";
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
  handle: string;
  name: string;
  description: string;
  bestFor: string;
  baseTotal: number;
  luxury?: boolean;
  products: RoutineProduct[];
};

const COMMITMENTS = [
  { id: "1-month", label: "1 MONTH", discount: 15, suffix: "" },
  { id: "3-months", label: "3 MONTHS", discount: 20, suffix: " / month" },
  { id: "6-months", label: "6 MONTHS", discount: 25, suffix: " / month" },
] as const;

type CommitmentId = (typeof COMMITMENTS)[number]["id"];

const ROUTINES: RoutineDef[] = [
  {
    id: "clarity",
    handle: "eclantian-clarity",
    name: "ECLANTIAN CLARITY",
    description:
      "A considered two-step foundation for maintaining balance and supporting skin through early-stage breakouts.",
    bestFor: "MILD / EARLY-STAGE ACNE",
    baseTotal: 3200,
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
    handle: "eclantian-balance",
    name: "ECLANTIAN BALANCE",
    description:
      "A focused three-step system for recurring acne, uneven texture, and skin that needs a steadier rhythm.",
    bestFor: "MODERATE / RECURRING ACNE",
    baseTotal: 5600,
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
    handle: "eclantian-renewal",
    name: "ECLANTIAN RENEWAL",
    description:
      "A complete treatment rhythm for persistent acne, combining targeted clarity with barrier-conscious recovery.",
    bestFor: "SEVERE / PERSISTENT ACNE",
    baseTotal: 6000,
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
    handle: "eclantian-professional-support",
    name: "ECLANTIAN PROFESSIONAL SUPPORT",
    description:
      "The most complete Eclantian system for deep, cystic acne, with an extended night renewal step for professional-level support.",
    bestFor: "DEEP / CYSTIC ACNE",
    baseTotal: 9200,
    luxury: true,
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

const getCommitmentPrice = (baseTotal: number, commitment: CommitmentId) => {
  const selected = COMMITMENTS.find((option) => option.id === commitment) ?? COMMITMENTS[0];
  const months = commitment === "1-month" ? 1 : commitment === "3-months" ? 3 : 6;
  return Math.round((baseTotal * months * (1 - selected.discount / 100)) / months);
};

const Routine = () => {
  const [selected, setSelected] = useState<RoutineDef | null>(null);
  const [commitments, setCommitments] = useState<Record<string, CommitmentId>>({});
  const { addItem, isLoading } = useCart();

  const getSelectedCommitment = (routine: RoutineDef) => commitments[routine.id] ?? "1-month";

  const addRoutineToCart = async (routine: RoutineDef, commitment = getSelectedCommitment(routine)) => {
    const product = await fetchProductByHandle(routine.handle);
    if (!product) {
      toast.error("This routine is temporarily unavailable. Please try again shortly.");
      return;
    }

    const commitmentLabel = COMMITMENTS.find((option) => option.id === commitment)?.label ?? "1 MONTH";
    const variant =
      product.variants.edges.find((item) => item.node.title.toUpperCase().includes(commitmentLabel))?.node ??
      product.variants.edges[0]?.node;
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
    const selectedOption = COMMITMENTS.find((option) => option.id === commitment) ?? COMMITMENTS[0];
    const bundle = getCommitmentPrice(selected.baseTotal, commitment);
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
                  {formatPKR(selected.baseTotal)}
                </p>
                <p className="font-serif text-4xl md:text-5xl mt-1">
                  {formatPKR(bundle)}{selectedOption.suffix}
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
                {commitment === "6-months" && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-accent-gold">+ LA-ECLANTE SKIN CREDIT</p>
                )}
                <Button size="lg" variant="primary" className="mt-6" onClick={() => addRoutineToCart(selected, commitment)} disabled={isLoading}>
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
            const selectedOption = COMMITMENTS.find((option) => option.id === commitment) ?? COMMITMENTS[0];
            const bundle = getCommitmentPrice(r.baseTotal, commitment);
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

                <div className={`my-8 flex items-start justify-center gap-3 sm:gap-6 py-6 border-y ${r.luxury ? "border-accent-gold/30" : "border-border"}`}>
                  {r.products.map((p) => {
                    const Icon = ICONS[p.type];
                    return (
                      <div key={p.name} className="flex flex-col items-center text-center flex-1 min-w-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${r.luxury ? "bg-accent-gold text-[#211b12]" : "bg-secondary text-foreground"}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`mt-3 text-[10px] uppercase tracking-[0.14em] leading-tight ${r.luxury ? "text-[#d9cda9]" : "text-muted-foreground"}`}>
                          {p.name.replace(/\(.*\)/, "").trim().replace("Korean Glass Skin ", "").replace("Advanced Acne Treatment ", "Advanced ")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl">{formatPKR(bundle)}{selectedOption.suffix}</span>
                  <span className={`text-sm line-through ${r.luxury ? "text-[#b9aa82]" : "text-muted-foreground"}`}>
                    {formatPKR(r.baseTotal)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-accent-gold">
                  Save {selectedOption.discount}%{commitment === "6-months" ? " + skin credit" : ""}
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
                {commitment === "6-months" && (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-accent-gold">LA-ECLANTE SKIN CREDIT</p>
                )}

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

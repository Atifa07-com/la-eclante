import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroProduct from "@/assets/hero-product.jpg";
import routineLineup from "@/assets/routine-lineup.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatPrice } from "@/lib/products";
import { Leaf, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

interface ProductCard {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  price_cents: number;
  product_images: { url: string }[];
}

const Home = () => {
  const [products, setProducts] = useState<ProductCard[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, slug, name, tagline, price_cents, product_images(url)")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setProducts((data ?? []) as ProductCard[]));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-warm overflow-hidden">
        <div className="container-wide grid md:grid-cols-12 gap-10 md:gap-16 items-center py-16 md:py-28">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow">For acne-prone & sensitive skin</p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] mt-5 tracking-tight">
              Clarity, without<br />compromise.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
              Clinically effective skincare for acne-prone and sensitive skin — formulated to calm,
              clarify, and protect the barrier you depend on.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-none h-12 px-8 tracking-[0.16em] uppercase text-[12px]">
                <Link to="/shop">Shop the Routine</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none h-12 px-8 tracking-[0.16em] uppercase text-[12px] border-foreground/30">
                <Link to="/quiz">Take the Skin Quiz</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Dermatologist tested</span>
              <span>Non-comedogenic</span>
              <span>Fragrance-free</span>
            </div>
          </div>
          <div className="md:col-span-6 reveal" style={{ animationDelay: "120ms" }}>
            <img
              src={heroProduct}
              alt="LA-ECLANTE balancing serum"
              width={1600}
              height={1200}
              className="w-full h-[460px] md:h-[640px] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="container-narrow py-24 md:py-32 text-center">
        <p className="eyebrow">Our philosophy</p>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight mt-5 max-w-3xl mx-auto">
          We believe skincare for reactive skin should feel as gentle as it is effective.
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          LA-ECLANTE — “the sparkle” — was born from years of trial and frustration with acne-prone skin.
          Every formula is rigorously tested, dermatologist-reviewed, and stripped to what your skin actually needs.
        </p>
      </section>

      {/* ROUTINE GRID */}
      <section className="bg-muted/40 py-24 md:py-32">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <p className="eyebrow">The four-step ritual</p>
              <h2 className="font-serif text-3xl md:text-5xl mt-3">A complete routine.</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] hover:opacity-60">
              Shop all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group reveal"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-[4/5] bg-background overflow-hidden">
                  <img
                    src={resolveImage(p.product_images[0]?.url)}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-5">
                  <p className="eyebrow">{p.tagline}</p>
                  <h3 className="font-serif text-xl md:text-2xl mt-2">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPrice(p.price_cents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container-wide py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            { icon: Leaf, title: "Gentle by design", body: "Formulated without fragrance, essential oils, or irritants. Calm enough for daily use on reactive skin." },
            { icon: ShieldCheck, title: "Clinically effective", body: "Niacinamide, ceramides, salicylic acid — proven actives at the percentages your skin needs." },
            { icon: Sparkles, title: "Barrier-supporting", body: "Restores rather than strips. Designed to work with your skin, not against it." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center md:text-left">
              <Icon size={28} strokeWidth={1.25} className="mx-auto md:mx-0 text-accent" />
              <h3 className="font-serif text-2xl mt-5">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm md:mx-0 mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted/40 py-24 md:py-32">
        <div className="container-narrow">
          <p className="eyebrow text-center">Loved by sensitive skin</p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-12">
            {[
              { quote: "The first routine that didn't trigger a reaction. My skin is calmer than it has been in years.", name: "Maya R." },
              { quote: "Genuinely cleared my breakouts in three weeks. The texture on my cheeks is gone.", name: "Imani K." },
              { quote: "Quietly luxurious — and it actually works. The serum is the most effective thing I've ever used.", name: "Sara L." },
            ].map((t) => (
              <figure key={t.name} className="bg-background p-8 md:p-10 border border-border">
                <p className="font-serif text-xl md:text-2xl leading-snug">“{t.quote}”</p>
                <figcaption className="mt-6 eyebrow">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="container-wide py-24 md:py-32 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <img src={aboutPortrait} alt="A calm portrait" loading="lazy" className="w-full h-[480px] md:h-[600px] object-cover" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="font-serif text-3xl md:text-5xl mt-4 leading-tight">A quiet answer to a loud problem.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
            Founded after a decade of searching for skincare that didn't choose between effectiveness and gentleness.
            LA-ECLANTE is the line we wished existed — calm, clinical, and made to be trusted.
          </p>
          <Button asChild variant="link" className="px-0 mt-6 text-foreground tracking-[0.16em] uppercase text-[12px]">
            <Link to="/about">Read our story <ArrowRight size={14} className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-foreground text-background py-24 md:py-32 text-center">
        <div className="container-narrow">
          <p className="eyebrow text-background/60">Begin</p>
          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">Your clearest skin starts with the right routine.</h2>
          <Button asChild size="lg" className="mt-10 rounded-none h-12 px-10 tracking-[0.16em] uppercase text-[12px] bg-background text-foreground hover:bg-background/90">
            <Link to="/quiz">Take the skin quiz</Link>
          </Button>
        </div>
      </section>

      <img src={routineLineup} alt="" aria-hidden className="hidden" />
    </div>
  );
};

export default Home;

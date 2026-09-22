import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroProduct from "@/assets/hero-product.jfif";
import aboutPortrait from "@/assets/about-portrait.jpg";
import { Button } from "@/components/ui/button";
import { fetchProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { Leaf, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts(8)
      .then((data) => {
        // null => Shopify unavailable; keep the page, flag the grid.
        if (data === null) setError(true);
        else setProducts(data);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative hero-surface overflow-hidden">
        <div className="container-wide section-space grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 reveal">
            <p className="eyebrow">For acne-prone & sensitive skin</p>
            <h1 className="font-serif text-hero mt-5">
              Clarity, without<br />compromise.
            </h1>
            <p className="mt-6 max-w-md">
              Clinically effective skincare for acne-prone and sensitive skin — formulated to calm,
              clarify, and protect the barrier you depend on.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="primary" size="lg">
                <Link to="/shop">Shop the Routine</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
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
      <section className="container-narrow section-space-lg text-center">
        <p className="eyebrow">Our philosophy</p>
        <h2 className="font-serif text-h2 mt-5 max-w-3xl mx-auto">
          We believe skincare for reactive skin should feel as gentle as it is effective.
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          LA-ECLANTE — “the sparkle” — was born from years of trial and frustration with acne-prone skin.
          Every formula is rigorously tested, dermatologist-reviewed, and stripped to what your skin actually needs.
        </p>
      </section>

      {/* PRODUCTS GRID */}
      <section className="bg-muted/40 section-space-lg">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="font-serif text-h2 mt-3">A complete routine.</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] hover:opacity-60">
              Shop all <ArrowRight size={14} />
            </Link>
          </div>

          {error ? (
            <div className="border border-border p-16 text-center">
              <p className="font-serif text-3xl">Oops! The collection is momentarily unavailable.</p>
              <p className="mt-3 text-sm">
                We couldn&rsquo;t load products just now. Please try again shortly.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-border p-16 text-center">
              <p className="font-serif text-3xl">No products found</p>
                <p className="mt-3 text-sm">
                Tell us in the chat what to add and we'll publish your first product.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
              {products.slice(0, 4).map((p, i) => {
                const img = p.node.images.edges[0]?.node;
                return (
                  <Link
                    key={p.node.id}
                    to={`/products/${p.node.handle}`}
                    className="product-card group reveal"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="aspect-[4/5] bg-background overflow-hidden">
                      {img && (
                        <img
                          src={img.url}
                          alt={img.altText ?? p.node.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="mt-5">
                      {p.node.productType && <p className="eyebrow">{p.node.productType}</p>}
                      <h3 className="font-serif text-h3 mt-2">{p.node.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatMoney(
                          p.node.priceRange.minVariantPrice.amount,
                          p.node.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container-wide section-space-lg">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            { icon: Leaf, title: "Gentle by design", body: "Formulated without fragrance, essential oils, or irritants. Calm enough for daily use on reactive skin." },
            { icon: ShieldCheck, title: "Clinically effective", body: "Niacinamide, ceramides, salicylic acid — proven actives at the percentages your skin needs." },
            { icon: Sparkles, title: "Barrier-supporting", body: "Restores rather than strips. Designed to work with your skin, not against it." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center md:text-left">
              <Icon size={28} strokeWidth={1.25} className="mx-auto md:mx-0 text-accent" />
              <h3 className="font-serif text-h3 mt-5">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm md:mx-0 mx-auto">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="container-wide section-space-lg grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <img src={aboutPortrait} alt="A calm portrait" loading="lazy" className="w-full h-[480px] md:h-[600px] object-cover" />
        <div>
          <p className="eyebrow">Our story</p>
          <h2 className="font-serif text-h2 mt-4">A quiet answer to a loud problem.</h2>
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
      <section className="bg-foreground text-background section-space-lg text-center">
        <div className="container-narrow">
          <p className="eyebrow text-background/60">Begin</p>
          <h2 className="font-serif text-h2 mt-4">Your clearest skin starts with the right routine.</h2>
          <Button asChild variant="primary" size="lg" className="mt-10 bg-background text-foreground hover:bg-background/90">
            <Link to="/quiz">Take the skin quiz</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

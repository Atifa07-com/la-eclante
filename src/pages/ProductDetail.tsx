import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductByHandle, formatMoney, type ShopifyProductNode } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { RecommendedProducts } from "@/components/product/RecommendedProducts";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<ShopifyProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [variantId, setVariantId] = useState<string | null>(null);
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    if (!slug) return;
    fetchProductByHandle(slug)
      .then((data) => {
        if (data === undefined) {
          // Shopify unavailable — keep the shopper here and show a fallback
          // rather than bouncing them to /shop (which may also be down).
          setError(true);
          return;
        }
        if (data === null) {
          // Product genuinely does not exist.
          nav("/shop");
          return;
        }
        setP(data);
        setVariantId(data.variants.edges[0]?.node.id ?? null);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug, nav]);

  if (loading) {
    return <div className="container-narrow py-32 text-center text-muted-foreground">Loading…</div>;
  }

  if (error) {
    return (
      <div className="container-narrow py-24 md:py-32 text-center">
        <Link to="/shop" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>
        <p className="eyebrow mt-10">Temporarily unavailable</p>
        <h1 className="font-serif text-3xl md:text-5xl mt-4">
          Oops! This product is currently unavailable.
        </h1>
        <p className="mt-5 max-w-md mx-auto text-muted-foreground leading-relaxed">
          We couldn&rsquo;t load this product just now. Please try again in a moment —
          the rest of the store is still open.
        </p>
      </div>
    );
  }

  if (!p) return null;

  const variant = p.variants.edges.find((v) => v.node.id === variantId)?.node ?? p.variants.edges[0]?.node;
  const img = p.images.edges[0]?.node;
  const benefits = (p.tags ?? []).filter((t) => !t.startsWith("_"));

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: { node: p },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
    toast.success(`${p.title} added to your bag.`);
  };

  return (
    <div>
      <div className="container-wide pt-10 pb-6">
        <Link to="/shop" className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>
      </div>

      <section className="container-wide pb-24 grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7">
          {img && (
            <img
              src={img.url}
              alt={img.altText ?? p.title}
              className="w-full aspect-[4/5] object-cover bg-muted"
            />
          )}
        </div>

        <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
          {p.productType && <p className="eyebrow">{p.productType}</p>}
          <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">{p.title}</h1>

          <p className="mt-4 font-serif text-2xl">
            {variant && formatMoney(variant.price.amount, variant.price.currencyCode)}
          </p>

          {p.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
              {p.description}
            </p>
          )}

          {/* Variant picker */}
          {p.variants.edges.length > 1 && (
            <div className="mt-8">
              <p className="eyebrow mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {p.variants.edges.map((v) => (
                  <button
                    key={v.node.id}
                    onClick={() => setVariantId(v.node.id)}
                    disabled={!v.node.availableForSale}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      variantId === v.node.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    } ${!v.node.availableForSale ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {v.node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleAdd}
            disabled={!variant?.availableForSale || isLoading}
            size="lg"
            className="mt-6 w-full h-12 rounded-none tracking-[0.16em] uppercase text-[12px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !variant?.availableForSale ? (
              "Sold out"
            ) : (
              <>Add to bag — {variant && formatMoney(variant.price.amount, variant.price.currencyCode)}</>
            )}
          </Button>

          {benefits.length > 0 && (
            <div className="mt-8 space-y-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3 text-sm">
                  <Check size={14} className="text-accent" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 space-y-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <p>Dermatologist tested</p>
            <p>Non-comedogenic</p>
            <p>Fragrance-free</p>
          </div>
        </div>
      </section>

      <RecommendedProducts excludeHandle={p.handle} />

      {/* Mobile sticky add to cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border p-3">
        <Button
          onClick={handleAdd}
          disabled={!variant?.availableForSale || isLoading}
          className="w-full h-12 rounded-none tracking-[0.16em] uppercase text-[12px]"
        >
          {!variant?.availableForSale
            ? "Sold out"
            : `Add to bag — ${variant ? formatMoney(variant.price.amount, variant.price.currencyCode) : ""}`}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;

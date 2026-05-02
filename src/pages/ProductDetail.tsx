import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DetailedProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  who_its_for: string | null;
  what_it_does: string | null;
  how_to_use: string | null;
  ingredients: string | null;
  benefits: string[];
  price_cents: number;
  subscription_price_cents: number | null;
  product_images: { url: string }[];
}

interface Review {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState<DetailedProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubscription, setIsSubscription] = useState(false);
  const { add, setOpen } = useCart();

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("products")
      .select("*, product_images(url)")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return nav("/shop");
        setP(data as DetailedProduct);
      });
  }, [slug, nav]);

  useEffect(() => {
    if (!p) return;
    supabase
      .from("reviews")
      .select("id, author_name, rating, title, body, created_at")
      .eq("product_id", p.id)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, [p]);

  if (!p) {
    return <div className="container-narrow py-32 text-center text-muted-foreground">Loading…</div>;
  }

  const price = isSubscription && p.subscription_price_cents ? p.subscription_price_cents : p.price_cents;
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleAdd = async () => {
    await add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      imageUrl: p.product_images[0]?.url ?? "",
      unitPriceCents: price,
      quantity: 1,
      isSubscription,
    });
    toast.success(`${p.name} added to your bag.`);
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
          <img
            src={resolveImage(p.product_images[0]?.url)}
            alt={p.name}
            width={1200}
            height={1500}
            className="w-full aspect-[4/5] object-cover bg-muted"
          />
        </div>

        <div className="md:col-span-5 md:sticky md:top-24 md:self-start">
          <p className="eyebrow">{p.tagline}</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">{p.name}</h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= Math.round(avgRating) ? "fill-foreground text-foreground" : "text-muted-foreground"}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{reviews.length} reviews</span>
            </div>
          )}

          <p className="mt-6 text-muted-foreground leading-relaxed">{p.description}</p>

          {/* purchase options */}
          {p.subscription_price_cents && (
            <div className="mt-8 grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsSubscription(false)}
                className={cn(
                  "border p-4 text-left transition-colors",
                  !isSubscription ? "border-foreground" : "border-border"
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">One-time</p>
                <p className="mt-1 font-serif text-2xl">{formatPrice(p.price_cents)}</p>
              </button>
              <button
                onClick={() => setIsSubscription(true)}
                className={cn(
                  "border p-4 text-left transition-colors",
                  isSubscription ? "border-foreground" : "border-border"
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Subscribe & save 10%</p>
                <p className="mt-1 font-serif text-2xl">{formatPrice(p.subscription_price_cents)}</p>
              </button>
            </div>
          )}

          <Button onClick={handleAdd} size="lg" className="mt-6 w-full h-12 rounded-none tracking-[0.16em] uppercase text-[12px]">
            Add to bag — {formatPrice(price)}
          </Button>

          <div className="mt-8 space-y-2">
            {(p.benefits ?? []).map((b) => (
              <div key={b} className="flex items-center gap-3 text-sm">
                <Check size={14} className="text-accent" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            {p.who_its_for && (
              <Detail title="Who it's for" body={p.who_its_for} />
            )}
            {p.what_it_does && (
              <Detail title="What it does" body={p.what_it_does} />
            )}
            {p.how_to_use && (
              <Detail title="How to use" body={p.how_to_use} />
            )}
            {p.ingredients && (
              <Detail title="Key ingredients" body={p.ingredients} />
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="bg-muted/40 py-20">
          <div className="container-narrow">
            <p className="eyebrow">Reviews</p>
            <h2 className="font-serif text-3xl md:text-4xl mt-3">What customers say.</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {reviews.map((r) => (
                <article key={r.id} className="bg-background p-8 border border-border">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={12} className={n <= r.rating ? "fill-foreground text-foreground" : "text-muted-foreground"} />
                    ))}
                  </div>
                  {r.title && <h3 className="font-serif text-xl mt-3">{r.title}</h3>}
                  {r.body && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.body}</p>}
                  <p className="mt-4 eyebrow">— {r.author_name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky add to cart */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border p-3">
        <Button onClick={handleAdd} className="w-full h-12 rounded-none tracking-[0.16em] uppercase text-[12px]">
          Add to bag — {formatPrice(price)}
        </Button>
      </div>
    </div>
  );
};

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-border pt-6">
      <p className="eyebrow">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export default ProductDetail;

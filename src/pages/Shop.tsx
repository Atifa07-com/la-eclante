import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  price_cents: number;
  skin_types: string[];
  concerns: string[];
  routine_step: string | null;
  product_images: { url: string }[];
}

const SKIN_TYPES = ["oily", "dry", "combination", "sensitive", "acne-prone"];
const CONCERNS = ["acne", "dark spots", "redness", "dryness", "uneven tone", "large pores", "sensitivity"];

const Shop = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [skinFilter, setSkinFilter] = useState<string | null>(null);
  const [concernFilter, setConcernFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    supabase
      .from("products")
      .select("id, slug, name, tagline, price_cents, skin_types, concerns, routine_step, product_images(url)")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setProducts((data ?? []) as ShopProduct[]));
  }, []);

  const filtered = useMemo(() => {
    let out = [...products];
    if (skinFilter) out = out.filter((p) => p.skin_types?.includes(skinFilter));
    if (concernFilter) out = out.filter((p) => p.concerns?.includes(concernFilter));
    if (sort === "price-asc") out.sort((a, b) => a.price_cents - b.price_cents);
    if (sort === "price-desc") out.sort((a, b) => b.price_cents - a.price_cents);
    return out;
  }, [products, skinFilter, concernFilter, sort]);

  return (
    <div className="bg-warm">
      <header className="container-wide pt-16 md:pt-24 pb-10">
        <p className="eyebrow">The shop</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">Considered formulas.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every LA-ECLANTE product is dermatologist-tested, fragrance-free, and made for skin that reacts.
        </p>
      </header>

      <div className="container-wide pb-6 flex flex-wrap items-center gap-3">
        <FilterMenu label="Skin type" value={skinFilter} options={SKIN_TYPES} onChange={setSkinFilter} />
        <FilterMenu label="Concern" value={concernFilter} options={CONCERNS} onChange={setConcernFilter} />
        <div className="ml-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-transparent border-b border-border py-1 pr-6 text-foreground focus:outline-none focus:border-foreground"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="hairline container-wide" />

      <section className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
          {filtered.map((p) => (
            <Link key={p.id} to={`/products/${p.slug}`} className="group">
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
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No products match those filters.</p>
        )}
      </section>
    </div>
  );
};

function FilterMenu({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em]">
      <span className="text-muted-foreground">{label}:</span>
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-3 py-1 border transition-colors",
          value === null ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </button>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(value === o ? null : o)}
          className={cn(
            "px-3 py-1 border transition-colors capitalize",
            value === o ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default Shop;

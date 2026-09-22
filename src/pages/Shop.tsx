import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify";

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    fetchProducts(50)
      .then((data) => {
        // null => Shopify unavailable; [] => genuinely no products.
        if (data === null) setError(true);
        else setProducts(data);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc")
      return parseFloat(a.node.priceRange.minVariantPrice.amount) -
        parseFloat(b.node.priceRange.minVariantPrice.amount);
    if (sort === "price-desc")
      return parseFloat(b.node.priceRange.minVariantPrice.amount) -
        parseFloat(a.node.priceRange.minVariantPrice.amount);
    return 0;
  });

  return (
    <div>
      <header className="hero-surface container-wide pt-16 md:pt-24 pb-10">
        <p className="eyebrow">The shop</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">Considered formulas.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Every LA-ECLANTE product is dermatologist-tested, fragrance-free, and made for skin that reacts.
        </p>
      </header>

      <div className="container-wide pb-6 flex flex-wrap items-center gap-3">
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

      <section className="container-wide section-space">
        {loading ? (
          <p className="text-center text-muted-foreground py-20">Loading…</p>
        ) : error ? (
          <div className="border border-border p-16 text-center">
            <p className="font-serif text-3xl">Oops! Our shop is taking a breather.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Products are temporarily unavailable. Please try again in a moment.
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="border border-border p-16 text-center">
            <p className="font-serif text-3xl">No products found</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us in the chat what to add and we'll publish your first product.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
            {sorted.map((p) => {
              const img = p.node.images.edges[0]?.node;
              return (
                <Link key={p.node.id} to={`/products/${p.node.handle}`} className="product-card group">
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
                    <h3 className="font-serif text-xl md:text-2xl mt-2">{p.node.title}</h3>
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
      </section>
    </div>
  );
};

export default Shop;

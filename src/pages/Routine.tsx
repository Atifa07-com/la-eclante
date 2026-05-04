import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import routineLineup from "@/assets/routine-lineup.jpg";

const Routine = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProducts(20).then(setProducts).catch((e) => console.error(e));
  }, []);

  return (
    <div>
      <section className="bg-warm">
        <div className="container-wide grid md:grid-cols-12 gap-10 md:gap-16 items-center py-20 md:py-28">
          <div className="md:col-span-6">
            <p className="eyebrow">The ritual</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[1.02]">A simple routine.</h1>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              A considered system designed to clarify acne-prone skin without compromising the barrier.
              Use morning and evening for best results.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-none h-12 px-8 tracking-[0.16em] uppercase text-[12px]">
              <Link to="/shop">Shop the full routine</Link>
            </Button>
          </div>
          <div className="md:col-span-6">
            <img src={routineLineup} alt="The LA-ECLANTE routine" loading="lazy" className="w-full h-[420px] md:h-[560px] object-cover" />
          </div>
        </div>
      </section>

      <section className="container-narrow py-24 md:py-32">
        {products.length === 0 ? (
          <div className="border border-border p-16 text-center">
            <p className="font-serif text-3xl">No products found</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us in the chat what to add and we'll publish your first product.
            </p>
          </div>
        ) : (
          <ol className="space-y-16 md:space-y-20">
            {products.map((p, i) => {
              const img = p.node.images.edges[0]?.node;
              return (
                <li key={p.node.id} className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  <div className={i % 2 === 0 ? "md:col-span-5 order-1" : "md:col-span-5 md:order-2"}>
                    {img && (
                      <img
                        src={img.url}
                        alt={img.altText ?? p.node.title}
                        loading="lazy"
                        className="w-full aspect-[4/5] object-cover bg-muted"
                      />
                    )}
                  </div>
                  <div className={i % 2 === 0 ? "md:col-span-7 md:pl-8" : "md:col-span-7 md:order-1 md:pr-8"}>
                    <p className="eyebrow">Step {String(i + 1).padStart(2, "0")}{p.node.productType ? ` — ${p.node.productType}` : ""}</p>
                    <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-tight">{p.node.title}</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-4">
                      {p.node.description}
                    </p>
                    <Button asChild variant="link" className="px-0 mt-4 text-foreground tracking-[0.16em] uppercase text-[12px]">
                      <Link to={`/products/${p.node.handle}`}>View product →</Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
};

export default Routine;

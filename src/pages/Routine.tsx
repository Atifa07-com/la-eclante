import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/products";
import routineLineup from "@/assets/routine-lineup.jpg";

interface RoutineProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  what_it_does: string | null;
  how_to_use: string | null;
  routine_step: string | null;
  product_images: { url: string }[];
}

const order = ["cleanser", "serum", "moisturizer", "treatment"];

const Routine = () => {
  const [products, setProducts] = useState<RoutineProduct[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, slug, name, tagline, what_it_does, how_to_use, routine_step, product_images(url)")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => {
        const sorted = (data ?? []).slice().sort(
          (a: any, b: any) => order.indexOf(a.routine_step ?? "") - order.indexOf(b.routine_step ?? "")
        );
        setProducts(sorted as RoutineProduct[]);
      });
  }, []);

  return (
    <div>
      <section className="bg-warm">
        <div className="container-wide grid md:grid-cols-12 gap-10 md:gap-16 items-center py-20 md:py-28">
          <div className="md:col-span-6">
            <p className="eyebrow">The ritual</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[1.02]">Four steps. Calm skin.</h1>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              A simple, considered system designed to clarify acne-prone skin without compromising the barrier.
              Use morning and evening for best results.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-none h-12 px-8 tracking-[0.16em] uppercase text-[12px]">
              <Link to="/shop">Shop the full routine</Link>
            </Button>
          </div>
          <div className="md:col-span-6">
            <img src={routineLineup} alt="The four-step LA-ECLANTE routine" loading="lazy" className="w-full h-[420px] md:h-[560px] object-cover" />
          </div>
        </div>
      </section>

      <section className="container-narrow py-24 md:py-32">
        <ol className="space-y-16 md:space-y-20">
          {products.map((p, i) => (
            <li key={p.id} className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className={i % 2 === 0 ? "md:col-span-5 order-1" : "md:col-span-5 md:order-2"}>
                <img
                  src={resolveImage(p.product_images[0]?.url)}
                  alt={p.name}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover bg-muted"
                />
              </div>
              <div className={i % 2 === 0 ? "md:col-span-7 md:pl-8" : "md:col-span-7 md:order-1 md:pr-8"}>
                <p className="eyebrow">Step {String(i + 1).padStart(2, "0")} — {p.routine_step}</p>
                <h2 className="font-serif text-3xl md:text-5xl mt-3 leading-tight">{p.name}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{p.what_it_does}</p>
                {p.how_to_use && (
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="eyebrow mb-2">How to use</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.how_to_use}</p>
                  </div>
                )}
                <Button asChild variant="link" className="px-0 mt-4 text-foreground tracking-[0.16em] uppercase text-[12px]">
                  <Link to={`/products/${p.slug}`}>View product →</Link>
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default Routine;

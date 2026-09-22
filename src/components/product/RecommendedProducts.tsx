import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RecommendedProductsProps {
  excludeHandle?: string;
  title?: string;
}

export function RecommendedProducts({
  excludeHandle,
  title = "You may also like",
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchProducts(12)
      .then((all) => {
        if (cancelled) return;
        // null => Shopify unavailable; leave this non-critical section empty.
        if (!all) return;
        setProducts(all.filter((p) => p.node.handle !== excludeHandle));
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
  }, [excludeHandle]);

  if (products.length === 0) return null;

  return (
    <section className="container-wide section-space border-t border-border">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-5">
          {products.map((p) => {
            const img = p.node.images.edges[0]?.node;
            return (
              <CarouselItem
                key={p.node.id}
                className="pl-5 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link to={`/products/${p.node.handle}`} className="product-card group block">
                  <div className="aspect-[4/5] bg-background overflow-hidden rounded-md">
                    {img && (
                      <img
                        src={img.url}
                        alt={img.altText ?? p.node.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="px-2 pb-2 pt-3">
                    {p.node.productType && <p className="eyebrow">{p.node.productType}</p>}
                    <h3 className="font-serif text-lg md:text-xl mt-1.5">{p.node.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatMoney(
                        p.node.priceRange.minVariantPrice.amount,
                        p.node.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}

// Map server-stored image paths to bundled assets for our seed catalog.
import cleanser from "@/assets/product-cleanser.jpg";
import serum from "@/assets/product-serum.jpg";
import moisturizer from "@/assets/product-moisturizer.jpg";
import treatment from "@/assets/product-treatment.jpg";

const assetMap: Record<string, string> = {
  "/src/assets/product-cleanser.jpg": cleanser,
  "/src/assets/product-serum.jpg": serum,
  "/src/assets/product-moisturizer.jpg": moisturizer,
  "/src/assets/product-treatment.jpg": treatment,
};

export function resolveImage(url?: string | null): string {
  if (!url) return cleanser;
  return assetMap[url] ?? url;
}

export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

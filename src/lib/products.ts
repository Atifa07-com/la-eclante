// Map server-stored image paths to bundled assets for our seed catalog.
import cleanser from "@/assets/anti-acne-facewash.jfif";
import serum from "@/assets/anti-acne-serum.jfif";
import moisturizer from "@/assets/korean-glass-skin-moisturizer.jfif";
import treatment from "@/assets/advanced-anti-acne-serum.jfif";

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

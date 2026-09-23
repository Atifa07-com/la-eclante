import { useEffect } from "react";
import { getShopifyAccountUrl } from "@/lib/shopify";

export default function AccountPage() {
  useEffect(() => {
    window.location.replace(getShopifyAccountUrl());
  }, []);

  return (
    <section className="container-narrow section-space text-center" aria-live="polite">
      <p className="eyebrow">Your account</p>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">Taking you to Secure Sign in</h1>
      <p className="mt-5 text-sm text-muted-foreground">
        Your account details and orders are managed securely by Eclante.
      </p>
    </section>
  );
}

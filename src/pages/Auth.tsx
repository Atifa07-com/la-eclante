import { useEffect } from "react";
import { getShopifyAccountUrl } from "@/lib/shopify";

export default function AuthPage() {
  useEffect(() => {
    window.location.replace(getShopifyAccountUrl("/account/login"));
  }, []);

  return (
    <section className="container-narrow section-space text-center" aria-live="polite">
      <p className="eyebrow">Account</p>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">Opening secure sign in.</h1>
      <p className="mt-5 text-sm text-muted-foreground">
        Eclante is securely loading your account sign-in.
      </p>
    </section>
  );
}

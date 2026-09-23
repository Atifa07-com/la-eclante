import { useEffect, useState } from "react";
import { getShopifyAccountUrl } from "@/lib/shopify";

export default function AuthPage() {
  const [showPatience, setShowPatience] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(prefersReducedMotion.matches);

    const patienceTimer = window.setTimeout(() => setShowPatience(true), 1500);
    window.location.replace(getShopifyAccountUrl("/account/login"));

    return () => window.clearTimeout(patienceTimer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(214,180,133,0.16),rgba(250,247,242,0)_48%)] px-6 text-center" aria-live="polite">
      <div className={reduceMotion ? "" : "animate-auth-enter"}>
        <p className="eyebrow">Account</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">Opening secure sign in.</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {showPatience ? "Almost there — thanks for your patience." : "Eclante is securely loading your account sign-in."}
        </p>
        <div
          className={`mx-auto mt-8 h-7 w-7 rounded-full border border-accent-gold border-r-transparent ${
            reduceMotion ? "" : "animate-spin"
          }`}
          aria-label="Loading"
          role="status"
        />
      </div>
    </section>
  );
}

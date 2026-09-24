import { useEffect, useState } from "react";
import { buildCustomerAuthorizeUrl } from "@/lib/customerAuth";
import { useLocation } from "react-router-dom";

export default function AuthPage() {
  const [showPatience, setShowPatience] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(prefersReducedMotion.matches);

    const patienceTimer = window.setTimeout(() => setShowPatience(true), 1500);
    buildCustomerAuthorizeUrl(new URLSearchParams(location.search).get("prompt") === "none" ? "none" : undefined)
      .then((url) => window.location.replace(url))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "We could not open secure sign in."));

    return () => window.clearTimeout(patienceTimer);
  }, [location.search]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(214,180,133,0.16),rgba(250,247,242,0)_48%)] px-6 text-center" aria-live="polite">
      <div className={reduceMotion ? "" : "animate-auth-enter"}>
        <p className="eyebrow">Account</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">{error ? "Sign in is unavailable." : "Opening secure sign in."}</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          {error || (showPatience ? "Almost there — thanks for your patience." : "Eclante is securely loading your account sign-in.")}
        </p>
        {error && <a href="/auth" className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm text-primary-foreground hover:bg-primary/90">Try again</a>}
        {!error && <div
          className={`mx-auto mt-8 h-7 w-7 rounded-full border border-accent-gold border-r-transparent ${
            reduceMotion ? "" : "animate-spin"
          }`}
          aria-label="Loading"
          role="status"
        />}
      </div>
    </section>
  );
}

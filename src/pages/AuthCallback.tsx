import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { exchangeCustomerCode } from "@/lib/customerAuth";

export default function AuthCallbackPage() {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const providerError = params.get("error");
    if (providerError) {
      setError(providerError === "login_required" ? "Your Shopify session has ended. Please sign in again." : "Sign in was cancelled. Please try again.");
      return () => { active = false; };
    }
    if (!code) { setError("No sign-in code was returned. Please try again."); return () => { active = false; }; }
    exchangeCustomerCode(code, params.get("state"))
      .then(() => { if (active) window.location.replace("/account"); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "We could not complete sign in. Please try again."); });
    return () => { active = false; };
  }, [location.search]);

  return <section className="container-narrow section-space text-center" aria-live="polite"><p className="eyebrow">Account</p>{error ? <><h1 className="font-serif text-4xl md:text-5xl mt-3">Sign in could not be completed.</h1><p className="mx-auto mt-5 text-sm">{error}</p><Link to="/auth" className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm text-primary-foreground hover:bg-primary/90">Try again</Link></> : <><h1 className="font-serif text-4xl md:text-5xl mt-3">Finishing your sign in.</h1><p className="mx-auto mt-5 text-sm">One moment while we bring you back to Eclante.</p><div className="mx-auto mt-8 h-7 w-7 rounded-full border border-accent-gold border-r-transparent animate-spin" role="status" aria-label="Loading" /></>}</section>;
}
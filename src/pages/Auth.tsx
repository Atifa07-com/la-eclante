import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <section className="container-narrow py-20 md:py-28">
      <div className="max-w-md mx-auto text-center">
        <p className="eyebrow">Account</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">Sign in.</h1>
        <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
          Account sign-in is handled by Shopify. Once your Shopify Customer Account API
          is connected, this page will redirect customers to Shopify&rsquo;s hosted login.
        </p>

        <Button
          asChild
          variant="primary"
          className="mt-10 w-full"
        >
          <a href="/account">Continue</a>
        </Button>

        <p className="mt-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/" className="hover:opacity-60">&larr; Back to site</Link>
        </p>
      </div>
    </section>
  );
}

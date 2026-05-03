import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ComingSoon = ({ title, blurb, cta = "/shop", ctaLabel = "Shop the routine" }: { title: string; blurb: string; cta?: string; ctaLabel?: string }) => (
  <section className="container-narrow py-32 md:py-40 text-center">
    <p className="eyebrow">Coming next</p>
    <h1 className="font-serif text-5xl md:text-6xl mt-4 leading-tight">{title}</h1>
    <p className="mt-5 text-muted-foreground max-w-md mx-auto">{blurb}</p>
    <Button asChild size="lg" className="mt-8 rounded-none h-12 px-10 tracking-[0.16em] uppercase text-[12px]">
      <Link to={cta}>{ctaLabel}</Link>
    </Button>
  </section>
);

export const Quiz = () => (
  <ComingSoon title="The skin quiz." blurb="A personalised routine recommendation based on your skin type, sensitivity, and concerns. Arriving in the next update." />
);
export const Checkout = () => (
  <ComingSoon title="Secure checkout." blurb="Stripe-powered checkout with discount codes and shipping options. Arriving in the next update." cta="/shop" ctaLabel="Continue shopping" />
);
export const Admin = () => (
  <ComingSoon title="Admin dashboard." blurb="Orders, products, customers, and analytics. Arriving in the next update." cta="/" ctaLabel="Back home" />
);

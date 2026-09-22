import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ComingSoon = ({ title, blurb }: { title: string; blurb: string }) => (
  <section className="container-narrow section-space-lg text-center">
    <p className="eyebrow">Coming next</p>
    <h1 className="font-serif text-5xl md:text-6xl mt-4 leading-tight">{title}</h1>
    <p className="mt-5 text-muted-foreground max-w-md mx-auto">{blurb}</p>
    <Button asChild variant="primary" size="lg" className="mt-8">
      <Link to="/shop">Shop the routine</Link>
    </Button>
  </section>
);

export const Quiz = () => (
  <ComingSoon
    title="The skin quiz."
    blurb="A personalised routine recommendation based on your skin type, sensitivity, and concerns. Arriving in the next update."
  />
);

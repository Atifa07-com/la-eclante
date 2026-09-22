import aboutPortrait from "@/assets/about-portrait.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => (
  <div>
    <section className="hero-surface">
      <div className="container-narrow section-space text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-[1.02]">
          Made for the skin we never stopped fighting for.
        </h1>
      </div>
    </section>

    <section className="container-wide section-space-lg grid md:grid-cols-2 gap-12 md:gap-20 items-start">
      <img src={aboutPortrait} alt="Founder portrait" className="w-full h-[500px] md:h-[680px] object-cover" loading="lazy" />
      <div className="md:pt-8">
        <p className="eyebrow">A note from the founder</p>
        <p className="mt-6 font-serif text-2xl md:text-3xl leading-snug">
          “For ten years I tried everything. Prescription retinoids, harsh cleansers, every ‘cure.’ Nothing worked
          for long, and most of it left my skin worse than it started.”
        </p>
        <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            LA-ECLANTE began as a personal project — a search for skincare that could be both clinically effective
            and genuinely gentle. After years of working alongside dermatologists and formulators, we built the line
            we wished had existed: simple, considered, and quietly luxurious.
          </p>
          <p>
            The name means “the sparkle.” It's our shorthand for the calm, clear skin that comes from a routine you
            can finally trust.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-muted/40 section-space-lg">
      <div className="container-narrow">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { title: "Clinical first.", body: "Every formula is dermatologist-reviewed and tested on reactive skin before it ships." },
            { title: "Gentle always.", body: "Fragrance-free, dye-free, essential-oil-free. We exclude what reactive skin doesn't need." },
            { title: "Considered, never trendy.", body: "We don't chase ingredients of the moment. We build routines that hold up over time." },
          ].map((b) => (
            <div key={b.title}>
              <h3 className="font-serif text-2xl md:text-3xl">{b.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="container-narrow section-space-lg text-center">
      <h2 className="font-serif text-4xl md:text-5xl leading-tight">Find your routine.</h2>
      <p className="mt-4 text-muted-foreground">Take our two-minute skin quiz for a personalised recommendation.</p>
      <Button asChild variant="primary" size="lg" className="mt-8">
        <Link to="/quiz">Take the quiz</Link>
      </Button>
    </section>
  </div>
);

export default About;

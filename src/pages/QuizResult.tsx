import { Link, useSearchParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RESULT_MAP, type Severity } from "@/lib/quiz";
import { Check, Sparkles } from "lucide-react";

const COPY: Record<
  Severity,
  { description: string; routine: string[]; pro?: string; medical?: string; cta: string }
> = {
  mild: {
    description:
      "Your skin shows mostly clogged pores and occasional breakouts. This stage is highly manageable with consistent care and barrier support.",
    routine: [
      "Anti-Acne Facewash (gentle cleansing)",
      "Mild Acne Serum (controls oil & prevents clogging)",
      "Ceramide Moisturizer (protects skin barrier)",
    ],
    pro: "Consistency matters more than intensity at this stage.",
    cta: "Shop Mild Clarity Routine",
  },
  moderate: {
    description:
      "Your skin shows active inflammation with recurring pimples. A targeted treatment approach is needed to calm and control breakouts.",
    routine: [
      "Anti-Acne Facewash (twice daily)",
      "Moderate Acne Serum (active treatment)",
      "Ceramide Moisturizer (repair + hydration)",
    ],
    pro: "Avoid over-drying your skin — it can worsen acne.",
    cta: "Shop Moderate Clarity Routine",
  },
  severe: {
    description:
      "Your skin shows deeper, more painful acne that may lead to scarring if untreated.",
    routine: ["Anti-Acne Facewash", "Strong Acne Serum", "Ceramide Moisturizer"],
    medical:
      "We strongly recommend consulting a dermatologist alongside this routine for best results.",
    cta: "Shop Advanced Clarity Routine",
  },
};

export default function QuizResult() {
  const [params] = useSearchParams();
  const severityParam = params.get("severity") as Severity | null;
  if (!severityParam || !RESULT_MAP[severityParam]) {
    return <Navigate to="/quiz" replace />;
  }
  const meta = RESULT_MAP[severityParam];
  const copy = COPY[severityParam];

  return (
    <main className="container-narrow section-space max-w-3xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-[0.2em] mb-6">
        <Sparkles className="w-3.5 h-3.5" /> Your personalized result
      </div>
      <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-4">
        Your Skin Type: <span className="text-primary">{meta.title}</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">{copy.description}</p>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 mb-8">
        <h2 className="font-serif text-2xl mb-5">Your Routine</h2>
        <ul className="space-y-3">
          {copy.routine.map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="mt-1 inline-flex w-5 h-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="w-3 h-3" />
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {copy.pro && (
        <div className="border-l-2 border-primary pl-4 mb-8 italic text-foreground/80">
          <span className="font-medium not-italic">Pro Tip — </span>
          {copy.pro}
        </div>
      )}
      {copy.medical && (
        <div className="rounded-xl bg-secondary p-5 mb-8 text-sm">
          <span className="font-medium">Medical Note — </span>
          {copy.medical}
        </div>
      )}

      <Button
        asChild
        size="lg"
        variant="primary"
      >
        <Link to={meta.route}>{copy.cta} →</Link>
      </Button>
    </main>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { QUIZ, calculateScores, determineSeverity, RESULT_MAP } from "@/lib/quiz";
import { submitQuiz } from "@/lib/customer";

const emailSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"questions" | "email" | "submitting">("questions");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const totalSteps = QUIZ.length + 1;
  const currentStep = phase === "email" ? QUIZ.length : step;
  const progress = (currentStep / totalSteps) * 100;

  const choose = (qid: string, optionIdx: number) => {
    const next = { ...answers, [qid]: optionIdx };
    setAnswers(next);
    if (step < QUIZ.length - 1) {
      setTimeout(() => setStep(step + 1), 180);
    } else {
      setTimeout(() => setPhase("email"), 180);
    }
  };

  const back = () => {
    if (phase === "email") {
      setPhase("questions");
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    const parsed = emailSchema.safeParse({ name: name || undefined, email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setPhase("submitting");
    const scores = calculateScores(answers);
    const severity = determineSeverity(scores);
    const meta = RESULT_MAP[severity];

    const result = await submitQuiz({
      name: parsed.data.name ?? null,
      email: parsed.data.email,
      answers,
      scores,
      severity,
      routine: meta.routine,
      tag: meta.tag,
    });

    if (!result.ok) {
      toast.error("Could not save your results. Please try again.");
      setPhase("email");
      return;
    }

    sessionStorage.setItem(
      "le_quiz_result",
      JSON.stringify({ severity, scores, name: parsed.data.name ?? null, email: parsed.data.email })
    );
    navigate(`/quiz/result?severity=${severity}`);
  };

  const q = QUIZ[step];

  return (
    <main className="container-narrow max-w-2xl py-16 md:py-24">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>{phase === "email" ? "Final step" : `Question ${step + 1} of ${QUIZ.length}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {phase === "questions" && (
        <section className="animate-in fade-in duration-500">
          <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-8">{q.question}</h1>
          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => choose(q.id, i)}
                  className={`text-left p-5 rounded-xl border transition-all hover:border-primary hover:-translate-y-0.5 ${
                    selected ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <span className="text-base md:text-lg">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {(phase === "email" || phase === "submitting") && (
        <section className="animate-in fade-in duration-500">
          <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-3">
            Save Your Personalized Skin Results
          </h1>
          <p className="text-muted-foreground mb-8">
            Get your recommended routine + skincare guidance.
          </p>
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                placeholder="you@example.com"
              />
            </div>
            <Button
              size="lg"
              onClick={submit}
              disabled={phase === "submitting"}
              className="mt-2 rounded-none h-12 tracking-[0.16em] uppercase text-[12px]"
            >
              {phase === "submitting" ? "Calculating…" : "See my results"}
            </Button>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </section>
      )}

      <div className="mt-10">
        {(step > 0 || phase === "email") && phase !== "submitting" && (
          <button
            onClick={back}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}

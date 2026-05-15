export type Severity = "mild" | "moderate" | "severe";

export type Scores = { mild: number; moderate: number; severe: number };

export type AnswerEffect = Partial<Scores>;

export interface QuizOption {
  label: string;
  effect: AnswerEffect;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "How often do you experience breakouts?",
    options: [
      { label: "Rarely (almost never)", effect: { mild: 1 } },
      { label: "Occasionally (1–2 per month)", effect: { mild: 2 } },
      { label: "Frequently (weekly)", effect: { moderate: 2 } },
      { label: "Constantly (ongoing acne)", effect: { severe: 3 } },
    ],
  },
  {
    id: "q2",
    question: "How would you describe your acne?",
    options: [
      { label: "Small, occasional pimples", effect: { mild: 2 } },
      { label: "Regular breakouts in certain areas", effect: { moderate: 2 } },
      { label: "Widespread or inflamed acne", effect: { severe: 3 } },
    ],
  },
  {
    id: "q3",
    question: "How sensitive is your skin?",
    options: [
      { label: "Not sensitive", effect: { moderate: 1 } },
      { label: "Slightly sensitive", effect: { mild: 1 } },
      { label: "Very sensitive (reacts easily)", effect: { mild: 2 } },
    ],
  },
  {
    id: "q4",
    question: "What concerns you most?",
    options: [
      { label: "Occasional breakouts", effect: { mild: 2 } },
      { label: "Ongoing acne", effect: { moderate: 2 } },
      { label: "Persistent or severe acne", effect: { severe: 3 } },
    ],
  },
  {
    id: "q5",
    question: "How does your skin feel after washing?",
    options: [
      { label: "Tight and dry", effect: { mild: 1 } },
      { label: "Balanced", effect: { mild: 1 } },
      { label: "Oily again quickly", effect: { moderate: 2 } },
      { label: "Irritated or reactive", effect: { severe: 2 } },
    ],
  },
  {
    id: "q6",
    question: "Have you used acne treatments before?",
    options: [
      { label: "No", effect: { mild: 1 } },
      { label: "Yes, but too harsh", effect: { moderate: 1, severe: 1 } },
      { label: "Yes, and they didn't work", effect: { severe: 2 } },
    ],
  },
];

export function calculateScores(answers: Record<string, number>): Scores {
  const scores: Scores = { mild: 0, moderate: 0, severe: 0 };
  for (const q of QUIZ) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const eff = q.options[idx]?.effect ?? {};
    scores.mild += eff.mild ?? 0;
    scores.moderate += eff.moderate ?? 0;
    scores.severe += eff.severe ?? 0;
  }
  return scores;
}

export function determineSeverity(s: Scores): Severity {
  const max = Math.max(s.mild, s.moderate, s.severe);
  if (s.severe === max) return "severe";
  if (s.moderate === max) return "moderate";
  return "mild";
}

export const RESULT_MAP: Record<
  Severity,
  { route: string; routine: string; tag: string; title: string }
> = {
  mild: {
    route: "/routine?severity=mild",
    routine: "Mild Clarity Routine",
    tag: "mild_acne",
    title: "Mild Acne (Early-Stage Breakouts)",
  },
  moderate: {
    route: "/routine?severity=moderate",
    routine: "Moderate Clarity Routine",
    tag: "moderate_acne",
    title: "Moderate Acne (Inflamed Breakouts)",
  },
  severe: {
    route: "/routine?severity=severe",
    routine: "Advanced Clarity Routine",
    tag: "severe_acne",
    title: "Severe Acne (Deep & Persistent Breakouts)",
  },
};

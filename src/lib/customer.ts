// Customer + marketing capture stubs.
// Wire these to your Shopify Admin API (via a serverless route) and/or Klaviyo.
//
// Two recommended endpoints to implement on the server side:
//   POST /api/quiz-submission   -> creates / updates a Shopify customer with
//                                  email_marketing_consent + quiz metafields
//   POST /api/newsletter        -> creates / updates a Shopify customer with
//                                  email_marketing_consent (and / or Klaviyo profile)
//
// Calling Shopify Admin API from the browser is not safe (the Admin token is
// secret). Run these calls through a serverless function (Vercel, Netlify,
// Cloudflare Workers, or Shopify Functions) that holds the secret.

export interface QuizSubmissionPayload {
  name?: string | null;
  email: string;
  answers: Record<string, number>;
  scores: { mild: number; moderate: number; severe: number };
  severity: string;
  routine: string;
  tag: string;
}

export interface NewsletterPayload {
  email: string;
  source: "footer" | "popup";
}

export type CaptureResult = { ok: boolean };

// When you wire these to a serverless route, that route MUST NOT return a 500
// to the browser on an upstream (Shopify Admin / Klaviyo) failure. Have it
// catch the error and respond with a safe default — e.g. 200 { ok: false } —
// so the frontend shows a retry message instead of the fetch throwing.
// The try/catch below guarantees these functions resolve to { ok: false }
// rather than rejecting, no matter how the endpoint behaves.

export async function submitQuiz(payload: QuizSubmissionPayload): Promise<CaptureResult> {
  try {
    // TODO: POST to your server endpoint that calls Shopify Admin API.
    // Expected server-side flow:
    //   1. customers.search?query=email:{email}
    //   2. if missing, customers.create with email + email_marketing_consent.state="subscribed"
    //   3. customers.update with metafields: skin_severity, skin_routine, skin_tag, raw_answers
    //   4. (optional) Klaviyo identify/track event
    console.info("[quiz] submission ready for backend wiring", payload);
    return { ok: true };
  } catch (err) {
    console.error("[quiz] submission failed:", (err as Error)?.message ?? err);
    return { ok: false };
  }
}

export async function subscribeToNewsletter(payload: NewsletterPayload): Promise<CaptureResult> {
  try {
    // TODO: POST to your server endpoint. Server should:
    //   1. customers.search?query=email:{email}
    //   2. if missing, customers.create with email_marketing_consent.state="subscribed" and tag=`newsletter:${source}`
    //   3. (optional) Klaviyo subscribe to a list
    console.info("[newsletter] subscription ready for backend wiring", payload);
    return { ok: true };
  } catch (err) {
    console.error("[newsletter] subscription failed:", (err as Error)?.message ?? err);
    return { ok: false };
  }
}

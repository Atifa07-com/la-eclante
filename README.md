# LA-ECLANTE

Clinically effective skincare storefront. Frontend only — backend is Shopify.

## Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Zustand** for the cart store
- **React Router** for routing
- **TanStack Query** for data fetching
- **Zod** + **react-hook-form** for forms
- **Shopify Storefront API** for products, cart, and checkout

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:8080.

## Environment

Copy `.env` and fill in your Shopify Storefront credentials:

```
VITE_SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN="..."
VITE_SHOPIFY_STOREFRONT_API_VERSION="2025-01"
```

## Backend integration points

The frontend calls Shopify directly for products, cart, and checkout. Two flows
still need a small serverless function (so the Shopify Admin token stays secret):

- `src/lib/customer.ts` &rarr; `submitQuiz` — creates / updates a Shopify
  customer with email-marketing consent and stores quiz answers as metafields.
- `src/lib/customer.ts` &rarr; `subscribeToNewsletter` — creates / updates a
  Shopify customer with email-marketing consent (or pushes a profile to Klaviyo).

Both are currently stubs that log the payload. Wire them to your serverless
endpoint when ready.

## Scripts

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the dev server             |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | Run ESLint                       |
| `npm test`        | Run the Vitest suite             |

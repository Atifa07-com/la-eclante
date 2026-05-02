
# LA-ECLANTE — Luxury Skincare E-commerce

A calm, dermatology-meets-luxury storefront with a full backend: products, cart, accounts, skin quiz, Stripe checkout, branded emails, and an admin dashboard.

## Design system

- Palette: off-white `#FAF7F2`, warm beige `#E8DFD3`, muted sage `#9CAF94`, deep ink `#2A2A2A`, soft accent `#C9B8A0`
- Typography: serif headings (Cormorant Garamond / Playfair), sans-serif body (Inter)
- Generous whitespace, hairline dividers, matte cards, soft shadows, subtle fade-in animations
- Fully responsive; mobile sticky "Add to Cart" on product pages

## Pages & UX

**Homepage** — Hero ("Clarity, without compromise."), brand story strip, the 4-step routine, benefits trio (gentle / clinically effective / barrier-supporting), trust badges (Dermatologist tested, Non-comedogenic, Fragrance-free), testimonials, final CTA. A 10%-off email popup appears once per session after a short delay.

**Shop** — Clean grid, filters by skin type and concern, sort by bestselling/price.

**Product detail** — Large imagery, "Who it's for / What it does / Key ingredients / How to use", one-time vs. subscribe-and-save toggle, reviews, sticky mobile add-to-cart.

**Routine** — Step-by-step AM/PM walkthrough showing how the products work together.

**About** — Founder's acne journey, brand philosophy, clinical + emotional positioning.

**Skin Quiz** — 5–7 questions (skin type, acne severity, sensitivity, concerns, current routine) → personalized routine recommendation page with "Add full routine to cart."

**Cart & Checkout** — Slide-out cart, discount code field, shipping selection (standard / express), Stripe-hosted checkout.

**Account area** — Sign up / log in (email + Google), order history, saved address, quiz results, subscription management.

**Admin dashboard** (role-gated, separate `/admin` area):
- Orders: list, filter by status (pending / shipped / delivered), update status, revenue totals
- Products: create / edit / delete, manage stock, pricing, descriptions, images
- Customers: list with order history, segments (new / returning / high-value computed from order count + spend)
- Analytics: total sales, conversion rate (visits → orders), best-sellers, AOV
- Marketing: newsletter list, popup signups, export CSV
- Discount codes: create % or fixed-amount codes with usage limits

## E-commerce functionality

- Cart persists across sessions for logged-in users; localStorage for guests
- Stripe-hosted checkout (built-in Stripe payments — test mode immediately)
- Discount code validation server-side
- Shipping options with flat rates
- Webhook updates order status on payment success
- Subscription option on products (monthly auto-reorder)

## Emails (Lovable Emails)

Branded transactional emails sent from your domain:
- Order confirmation
- Order shipped
- Welcome + 10% off code (on newsletter signup)
- Account welcome (on signup)
- Quiz results recap

Requires DNS setup on a domain you own — handled via guided dialog.

## Trust & conversion

- Trust badges in hero and product pages
- Real reviews on PDPs
- Subtle scarcity-free copy ("Loved by 2,000+ sensitive skin customers" once seeded)
- Clear, single CTAs per section

## Technical notes

- Stack: React + Vite + Tailwind + shadcn (already in project), Lovable Cloud (Postgres + auth + edge functions), Stripe built-in payments, Lovable Emails
- Auth: email/password + Google; `profiles` table linked to `auth.users`; `user_roles` table with `app_role` enum (`admin`, `customer`) and `has_role()` security-definer function for admin gating — never store roles on profiles
- Schema: `products`, `product_variants`, `product_images`, `reviews`, `cart_items`, `orders`, `order_items`, `addresses`, `discount_codes`, `subscriptions`, `quiz_responses`, `newsletter_subscribers`, `profiles`, `user_roles`
- RLS on every table; admin policies use `has_role(auth.uid(), 'admin')`
- Edge functions: `create-checkout`, `stripe-webhook`, `validate-discount`, `quiz-recommend`, plus the email sender
- Input validation with Zod on all forms and edge functions
- Mobile-first responsive; Lighthouse-friendly (lazy images, minimal JS on landing)

## Build order

1. Design tokens, layout shell, navigation, footer
2. Database schema + RLS + roles
3. Homepage, Shop, PDP, Routine, About (with seed products you'll provide)
4. Auth + account area + cart
5. Stripe checkout + discount codes + shipping + webhooks
6. Skin quiz + recommendation engine
7. Email domain setup + transactional emails
8. Admin dashboard
9. Newsletter popup + analytics polish

After approval I'll set up Lovable Cloud, then ask you for product details (names, prices, ingredients, images) before seeding the catalog.

## Next build phase — Auth, Checkout, Admin, Quiz, Emails

The storefront foundation is live. To turn it into a fully operational store, I'll build the remaining pillars in this order. Each step unlocks the next.

### 1. Authentication (foundation for everything else)
- `/auth` page with sign in / sign up tabs (email + password, plus Google OAuth)
- `emailRedirectTo: window.location.origin` on signup
- `/account` page: profile, order history, saved address, subscriptions, quiz results — protected route
- Sync guest cart → server cart on login (already wired in `cart.ts`, just needs trigger)
- Sign-out button in header dropdown

### 2. Stripe checkout (real test orders)
- Run `recommend_payment_provider`, then enable Lovable's built-in **Stripe payments** (skincare = digital + physical mix; Stripe with managed payments fits)
- Seed products into Stripe via `batch_create_product` (one-time + subscription prices for each of the 4 SKUs)
- Edge functions:
  - `create-checkout` — builds a Stripe Checkout Session from cart, applies discount code, supports one-time + subscription line items, shipping options (standard/express)
  - `validate-discount` — server-side code lookup against `discount_codes` table
  - `stripe-webhook` — on `checkout.session.completed`, write `orders` + `order_items`, decrement stock, clear cart, trigger order-confirmation email
- `/checkout` page: cart review, discount code field, shipping selector, "Pay securely" button → Stripe-hosted checkout
- `/checkout/success` and `/checkout/cancel` return pages

### 3. Skin Quiz + recommendation engine
- `/quiz` multi-step form (6 questions: skin type, acne severity, sensitivity, top concern, current routine, age range) using shadcn `Form` + `RadioGroup`
- `quiz-recommend` edge function: deterministic rule-based mapping → returns recommended product slugs + rationale
- Results page with personalised routine, "Add full routine to cart" button, save to `quiz_responses` if logged in
- Quiz results visible in `/account`

### 4. Admin dashboard (`/admin`, gated by `has_role(uid,'admin')`)
- Layout with sidebar: Orders / Products / Customers / Discounts / Newsletter / Analytics
- **Orders**: table with status filter, row drawer to update status (pending → shipped → delivered), revenue totals
- **Products**: CRUD with image upload to a new `product-images` storage bucket, stock + price editing
- **Customers**: list with computed segments (new / returning / high-value by spend)
- **Discounts**: create % or fixed codes with usage limits and expiry
- **Newsletter**: subscriber list + CSV export
- **Analytics**: total sales, AOV, best-sellers, signups over time (recharts)

### 5. Branded transactional emails (Lovable Emails)
- Trigger email-domain setup dialog (one-time DNS step on a domain you own)
- Scaffold transactional emails, then customise templates with brand styling (Cormorant headings, sage accent, white body):
  - Order confirmation (from webhook)
  - Order shipped (from admin status update)
  - Welcome + 10% off code (from newsletter signup)
  - Quiz results recap
- Scaffold auth email templates (verification, password reset) styled to match

### Suggested checkpoint cadence
I'll pause for your review after **Step 2** (so you can place a real test order end-to-end) and again after **Step 4** (admin live).

### Question before I start
- For Google OAuth, do you want me to wire it now? It works in dev but you'll need to add your production redirect URL in the Cloud auth settings before launch — I'll show you where.
- Are you OK proceeding with **Stripe** built-in payments (digital + physical handled in one flow)? Mentioned because the original plan said "Stripe (built-in)" — just confirming before I enable.

Approve and I'll start with Auth + Account.
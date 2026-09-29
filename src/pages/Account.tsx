import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Copy, LogOut, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCustomerAuthorizeUrl, cacheCustomerInitial, fetchCustomerProfile, hasNameCaptureBeenPrompted, logoutCustomer } from "@/lib/customerAuth";
import type { CustomerProfile } from "@/lib/customerAuth";
import { toast } from "sonner";

const WELCOME_OFFER_CODE = "Eclantian@6124";
const WELCOME_OFFER_KEY = "eclantian_welcome_offer";
const actionButtonClass = "bg-foreground text-background transition-colors duration-200 hover:bg-accent-gold hover:text-foreground";

export default function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(false);
  const [copiedWelcomeOffer, setCopiedWelcomeOffer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasWelcomeOffer = sessionStorage.getItem(WELCOME_OFFER_KEY) === "1";
    fetchCustomerProfile().then((customer) => {
      cacheCustomerInitial(customer.firstName);
      setProfile(customer);
      if (hasWelcomeOffer) {
        setShowWelcomeOffer(true);
        sessionStorage.removeItem(WELCOME_OFFER_KEY);
      }
    }).catch((reason: unknown) => {
      if (reason instanceof Error && reason.message === "interactive_refresh_required") {
        buildCustomerAuthorizeUrl("none").then((url) => window.location.replace(url)).catch(() => {
          sessionStorage.removeItem(WELCOME_OFFER_KEY);
          setError("Your session has expired. Please sign in again.");
        });
        return;
      }
      sessionStorage.removeItem(WELCOME_OFFER_KEY);
      setError(reason instanceof Error && reason.message === "not_authenticated" ? "Sign in to view your account and order history." : "We could not load your account right now. Please try again.");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || error || location.hash !== "#orders") return;
    document.getElementById("orders")?.scrollIntoView({ block: "start" });
  }, [error, loading, location.hash]);

  const welcomeOfferBanner = showWelcomeOffer && (
    <div className="relative mb-8 flex flex-col gap-4 rounded-md border border-border bg-muted/40 p-4 pr-12 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium">Welcome, Eclantian. Your 10% code: <span className="font-semibold">{WELCOME_OFFER_CODE}</span></p>
      <Button
        type="button"
        className={actionButtonClass}
        size="sm"
        onClick={() => {
          void navigator.clipboard.writeText(WELCOME_OFFER_CODE).then(() => {
            setCopiedWelcomeOffer(true);
          }).catch(() => toast.error("Could not copy the code. Please select it to copy."));
        }}
      >
        {copiedWelcomeOffer ? <Check /> : <Copy />}
        {copiedWelcomeOffer ? "Copied" : "Copy"}
      </Button>
      <button
        type="button"
        aria-label="Dismiss welcome offer"
        onClick={() => setShowWelcomeOffer(false)}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition-colors duration-200 hover:bg-accent-gold hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  );

  if (loading) return <section className="container-narrow section-space text-center"><p className="eyebrow">Your account</p><h1 className="font-serif text-4xl mt-3">Loading your account.</h1><div className="mx-auto mt-8 h-7 w-7 rounded-full border border-foreground border-r-transparent animate-spin" role="status" aria-label="Loading" /></section>;
  if (error) return <section className="container-narrow section-space text-center"><p className="eyebrow">Your account</p><h1 className="font-serif text-4xl md:text-5xl mt-3">{error}</h1><div className="mt-8 flex justify-center gap-3"><Button asChild className={actionButtonClass}><Link to="/auth">Sign in</Link></Button><Button className={actionButtonClass} onClick={() => window.location.reload()}><RefreshCw /> Try again</Button></div></section>;
  if (!profile) return null;

  const name = [profile.firstName?.trim(), profile.lastName?.trim()].filter(Boolean).join(" ");
  return (
    <section className="section-space"><div className="container-narrow">
      {welcomeOfferBanner}
      <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="font-serif mt-3 text-5xl md:text-6xl">{name ? `Welcome, ${name}.` : "Welcome."}</h1>
          <p className="mt-4 text-sm">{profile.emailAddress?.emailAddress}</p>
        </div>
        <Button className={actionButtonClass} onClick={() => void logoutCustomer()}><LogOut /> Sign out</Button>
      </div>

      {!name && hasNameCaptureBeenPrompted(profile.id) && (
        <div className="mt-6 flex flex-col gap-3 rounded-md border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Your name hasn&apos;t been saved yet. You can retry whenever you&apos;re ready.</p>
          <Button asChild className={actionButtonClass} size="sm"><Link to="/welcome-name?retry=1">Add your name</Link></Button>
        </div>
      )}

      <section className="mt-8 rounded-md border border-border bg-muted/40 p-6 sm:p-8">
        <p className="eyebrow">Track your order</p>
        <h2 className="font-serif mt-3 text-3xl md:text-4xl">Where&apos;s my order?</h2>
        <p className="mt-3 text-sm text-muted-foreground">Enter your order number below, or check your recent orders.</p>
        <Button asChild className={`${actionButtonClass} mt-6`}>
          <a href="#orders">Track My Order</a>
        </Button>
      </section>

      <section id="orders" className="mt-12 scroll-mt-28">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="eyebrow">Your history</p>
            <h2 className="font-serif mt-3 text-3xl">Recent orders</h2>
          </div>
          <span className="text-sm text-muted-foreground">{profile.orders.nodes.length} orders</span>
        </div>
        {profile.orders.nodes.length === 0 ? (
          <p className="py-8 text-sm">Your completed orders will appear here.</p>
        ) : (
          <div>
            {profile.orders.nodes.map((order) => {
              const itemCount = order.lineItems.nodes.reduce((total, item) => total + item.quantity, 0);
              const status = order.fulfillmentStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
              const firstItem = order.lineItems.nodes[0];
              const orderPath = `/account/orders/${encodeURIComponent(order.id)}`;
              const orderLabel = order.name || `Order #${order.number}`;

              return (
                <div key={order.id} className="relative flex items-center gap-4 border-b border-border px-3 py-5 transition-colors hover:bg-muted/40 sm:gap-5 sm:px-4">
                  <Link
                    to={orderPath}
                    aria-label={`View ${orderLabel}`}
                    className="absolute inset-0 z-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <div aria-hidden="true" className="pointer-events-none relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    {firstItem?.image ? (
                      <img src={firstItem.image.url} alt={firstItem.image.altText || firstItem.name || firstItem.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] uppercase tracking-wider text-muted-foreground">Eclante</div>
                    )}
                  </div>
                  <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{orderLabel}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(order.processedAt))}
                        {" · "}{itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-foreground">{status}</span>
                      <p className="shrink-0 text-sm">
                        {new Intl.NumberFormat("en", { style: "currency", currency: order.totalPrice.currencyCode }).format(Number(order.totalPrice.amount))}
                      </p>
                      <Button asChild size="sm" className={`${actionButtonClass} pointer-events-auto relative z-10`}>
                        <Link to={orderPath}>Track Order</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div></section>
  );
}

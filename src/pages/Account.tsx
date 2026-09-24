import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCustomerAuthorizeUrl, cacheCustomerInitial, fetchCustomerProfile, logoutCustomer } from "@/lib/customerAuth";
import type { CustomerProfile } from "@/lib/customerAuth";

export default function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerProfile().then((customer) => {
      cacheCustomerInitial(customer.firstName);
      setProfile(customer);
    }).catch((reason: unknown) => {
      if (reason instanceof Error && reason.message === "interactive_refresh_required") {
        buildCustomerAuthorizeUrl("none").then((url) => window.location.replace(url)).catch(() => setError("Your session has expired. Please sign in again."));
        return;
      }
      setError(reason instanceof Error && reason.message === "not_authenticated" ? "Sign in to view your account and order history." : "We could not load your account right now. Please try again.");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <section className="container-narrow section-space text-center"><p className="eyebrow">Your account</p><h1 className="font-serif text-4xl mt-3">Loading your account.</h1><div className="mx-auto mt-8 h-7 w-7 rounded-full border border-accent-gold border-r-transparent animate-spin" role="status" aria-label="Loading" /></section>;
  if (error) return <section className="container-narrow section-space text-center"><p className="eyebrow">Your account</p><h1 className="font-serif text-4xl md:text-5xl mt-3">{error}</h1><div className="mt-8 flex justify-center gap-3"><Button asChild><Link to="/auth">Sign in</Link></Button><Button variant="outline" onClick={() => window.location.reload()}><RefreshCw /> Try again</Button></div></section>;
  if (!profile) return null;

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Eclante customer";
  return (
    <section className="section-space"><div className="container-narrow">
      <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Your account</p><h1 className="font-serif mt-3 text-5xl md:text-6xl">Welcome, {name}.</h1><p className="mt-4 text-sm">{profile.emailAddress?.emailAddress}</p></div><Button variant="outline" onClick={() => void logoutCustomer()}><LogOut /> Sign out</Button></div>
      <div className="mt-14 grid gap-12 md:grid-cols-[0.7fr_1.3fr]"><div><p className="eyebrow">Profile</p><h2 className="font-serif mt-3 text-3xl">Your details</h2><div className="mt-6 space-y-4 border-t border-border pt-5 text-sm"><div><span className="text-muted-foreground">Name</span><p className="mt-1 text-foreground">{name}</p></div><div><span className="text-muted-foreground">Email</span><p className="mt-1 text-foreground">{profile.emailAddress?.emailAddress || "Not available"}</p></div></div></div><div><div className="flex items-end justify-between border-b border-border pb-4"><div><p className="eyebrow">Your history</p><h2 className="font-serif mt-3 text-3xl">Recent orders</h2></div><span className="text-sm text-muted-foreground">{profile.orders.nodes.length} orders</span></div>{profile.orders.nodes.length === 0 ? <p className="py-8 text-sm">Your completed orders will appear here.</p> : <div className="divide-y divide-border">{profile.orders.nodes.map((order) => { const itemCount = order.lineItems.nodes.reduce((total, item) => total + item.quantity, 0); const status = order.fulfillmentStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); const isFulfilled = order.fulfillmentStatus === "FULFILLED"; const firstItem = order.lineItems.nodes[0]; return <div key={order.id} className="flex items-center gap-4 py-5"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">{firstItem?.image ? <img src={firstItem.image.url} alt={firstItem.image.altText || firstItem.name || firstItem.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[10px] uppercase tracking-wider text-muted-foreground">Eclante</div>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{order.name || `Order #${order.number}`}</p><span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${isFulfilled ? "bg-sage/20 text-foreground" : "bg-secondary text-foreground"}`}>{status}</span></div><p className="mt-1 text-xs text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(order.processedAt))} · {itemCount} {itemCount === 1 ? "item" : "items"}</p></div><p className="shrink-0 text-sm">{new Intl.NumberFormat("en", { style: "currency", currency: order.totalPrice.currencyCode }).format(Number(order.totalPrice.amount))}</p></div>; })}</div>}</div></div>
    </div></section>
  );
}

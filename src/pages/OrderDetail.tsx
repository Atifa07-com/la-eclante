import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCustomerOrder } from "@/lib/customerAuth";
import type { CustomerOrderDetail } from "@/lib/customerAuth";

const STEPS = ["Placed", "Processing", "Shipped", "Delivered"] as const;

function statusIndex(status: string): number {
  if (status === "FULFILLED" || status === "DELIVERED") return 3;
  if (["IN_TRANSIT", "OUT_FOR_DELIVERY", "SHIPPED"].includes(status)) return 2;
  if (["PARTIALLY_FULFILLED", "IN_PROGRESS", "PROCESSING"].includes(status)) return 1;
  return 0;
}

function titleCase(value: string): string {
  return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) { setError("Order not found"); setLoading(false); return; }
    fetchCustomerOrder(decodeURIComponent(orderId)).then((result) => {
      if (!result) setError("Order not found");
      else setOrder(result);
    }).catch((reason: unknown) => {
      setError(reason instanceof Error && reason.message === "not_authenticated" ? "Sign in to view this order." : "We could not load this order right now.");
    }).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <section className="container-narrow section-space text-center"><p className="eyebrow">Order details</p><h1 className="font-serif mt-3 text-4xl">Loading your order.</h1><div className="mx-auto mt-8 h-7 w-7 rounded-full border border-accent-gold border-r-transparent animate-spin" role="status" aria-label="Loading" /></section>;
  if (error || !order) return <section className="container-narrow section-space text-center"><p className="eyebrow">Order details</p><h1 className="font-serif mt-3 text-4xl md:text-5xl">{error || "Order not found"}</h1><p className="mx-auto mt-5 text-sm">This order may not belong to your account, or it may no longer be available.</p><Button asChild className="mt-8"><Link to="/account"><ArrowLeft /> Back to account</Link></Button></section>;

  const activeStep = statusIndex(order.fulfillmentStatus);
  const tracking = order.fulfillments.nodes.flatMap((fulfillment) => fulfillment.trackingInformation).find((item) => item.url || item.number);
  const address = order.shippingAddress;
  return <section className="section-space"><div className="container-narrow">
    <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Back to account</Link>
    <div className="mt-8 flex flex-col gap-4 border-b border-border pb-10 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Order details</p><h1 className="font-serif mt-3 text-5xl">{order.name || `Order #${order.number}`}</h1><p className="mt-3 text-sm text-muted-foreground">Placed {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(order.createdAt))}</p></div><span className="rounded-full bg-secondary px-3 py-1.5 text-xs uppercase tracking-[0.14em]">{titleCase(order.fulfillmentStatus)}</span></div>
    <div className="mt-12 border-b border-border pb-12"><div className="grid grid-cols-4 gap-2">{STEPS.map((step, index) => <div key={step} className="relative text-center"><div className={`mx-auto h-3 w-3 rounded-full ${index <= activeStep ? "bg-accent-gold" : "bg-border"}`} />{index < STEPS.length - 1 && <div className={`absolute left-1/2 top-1.5 h-px w-full ${index < activeStep ? "bg-accent-gold" : "bg-border"}`} />}<p className={`relative mt-3 text-xs ${index <= activeStep ? "text-foreground" : "text-muted-foreground"}`}>{step}</p></div>)}</div></div>
    <div className="mt-12 grid gap-12 md:grid-cols-[1.35fr_0.65fr]"><div><p className="eyebrow">Items</p><h2 className="font-serif mt-3 text-3xl">Your order</h2><div className="mt-6 divide-y divide-border border-y border-border">{order.lineItems.nodes.map((item) => <div key={item.id} className="flex gap-4 py-5"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">{item.image ? <img src={item.image.url} alt={item.image.altText || item.name || item.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[10px] uppercase tracking-wider text-muted-foreground">Eclante</div>}</div><div className="min-w-0 flex-1"><p className="font-medium">{item.name || item.title}</p><p className="mt-1 text-sm text-muted-foreground">Quantity: {item.quantity}</p></div><p className="text-sm">{new Intl.NumberFormat("en", { style: "currency", currency: item.price.currencyCode }).format(Number(item.price.amount))}</p></div>)}</div><div className="flex justify-between pt-6 text-sm font-medium"><span>Total</span><span>{new Intl.NumberFormat("en", { style: "currency", currency: order.totalPrice.currencyCode }).format(Number(order.totalPrice.amount))}</span></div></div><div className="space-y-10"><div><p className="eyebrow">Shipping address</p><h2 className="font-serif mt-3 text-3xl">Delivering to</h2><div className="mt-6 text-sm leading-7">{address ? <>{address.firstName} {address.lastName}<br />{address.address1}{address.address2 && <><br />{address.address2}</>}<br />{address.city}{address.province && `, ${address.province}`} {address.zip}<br />{address.country}</> : <p>Shipping address unavailable.</p>}</div></div><div><p className="eyebrow">Tracking</p><h2 className="font-serif mt-3 text-3xl">Shipment</h2>{tracking ? <div className="mt-6 space-y-3 text-sm"><p>{tracking.company || "Carrier"}{tracking.number && ` · ${tracking.number}`}</p>{tracking.url && <a href={tracking.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-accent-gold hover:underline">Track package <ExternalLink size={14} /></a>}</div> : <p className="mt-6 text-sm text-muted-foreground">Tracking will appear here once your order ships.</p>}</div></div></div>
  </div></section>;
}
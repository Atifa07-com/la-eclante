import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { resolveImage, formatPrice } from "@/lib/products";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X } from "lucide-react";

export function CartDrawer() {
  const { open, setOpen, lines, update, remove, subtotalCents } = useCart();
  const subtotal = subtotalCents();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-serif text-2xl tracking-wide">Your bag</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link to="/shop">Discover the routine</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {lines.map((l) => (
                <div key={`${l.productId}-${l.isSubscription}`} className="flex gap-4">
                  <Link to={`/products/${l.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                    <img
                      src={resolveImage(l.imageUrl)}
                      alt={l.name}
                      loading="lazy"
                      className="w-20 h-24 object-cover bg-muted"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link
                          to={`/products/${l.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-serif text-lg leading-tight hover:opacity-70"
                        >
                          {l.name}
                        </Link>
                        {l.isSubscription && (
                          <p className="eyebrow mt-1 text-accent-foreground">Subscribe & save</p>
                        )}
                      </div>
                      <button
                        onClick={() => remove(l.productId, l.isSubscription)}
                        aria-label="Remove"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button
                          aria-label="Decrease"
                          className="w-8 h-8 grid place-items-center hover:bg-muted"
                          onClick={() => update(l.productId, l.isSubscription, l.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{l.quantity}</span>
                        <button
                          aria-label="Increase"
                          className="w-8 h-8 grid place-items-center hover:bg-muted"
                          onClick={() => update(l.productId, l.isSubscription, l.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-sm">{formatPrice(l.unitPriceCents * l.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and discounts calculated at checkout.</p>
              <Button asChild className="w-full h-12 rounded-none" onClick={() => setOpen(false)}>
                <Link to="/checkout">Checkout — {formatPrice(subtotal)}</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

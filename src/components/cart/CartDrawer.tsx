import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { formatMoney } from "@/lib/shopify";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Minus, X, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CartDrawer() {
  const {
    open,
    setOpen,
    items,
    updateQuantity,
    removeItem,
    isLoading,
    isSyncing,
    syncCart,
    getCheckoutUrl,
  } = useCart();

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const subtotal = items.reduce(
    (s, i) => s + parseFloat(i.price.amount) * i.quantity,
    0
  );
  const currency = items[0]?.price.currencyCode ?? "USD";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    } else {
      // Checkout URL is missing (e.g. cart couldn't sync with Shopify).
      // Fail gracefully instead of doing nothing on click.
      toast.error("Checkout is temporarily unavailable. Please try again in a moment.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-serif text-2xl tracking-wide">Your bag</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link to="/shop">Discover the routine</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((l) => {
                const img = l.product.node.images.edges[0]?.node;
                return (
                  <div key={l.variantId} className="flex gap-4">
                    <Link
                      to={`/products/${l.product.node.handle}`}
                      onClick={() => setOpen(false)}
                      className="shrink-0"
                    >
                      {img ? (
                        <img
                          src={img.url}
                          alt={img.altText ?? l.product.node.title}
                          loading="lazy"
                          className="w-20 h-24 object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-20 h-24 bg-muted" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            to={`/products/${l.product.node.handle}`}
                            onClick={() => setOpen(false)}
                            className="font-serif text-lg leading-tight hover:opacity-70"
                          >
                            {l.product.node.title}
                          </Link>
                          {l.variantTitle && l.variantTitle !== "Default Title" && (
                            <p className="eyebrow mt-1 text-muted-foreground">{l.variantTitle}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(l.variantId)}
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
                            onClick={() => updateQuantity(l.variantId, l.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{l.quantity}</span>
                          <button
                            aria-label="Increase"
                            className="w-8 h-8 grid place-items-center hover:bg-muted"
                            onClick={() => updateQuantity(l.variantId, l.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-sm">
                          {formatMoney(parseFloat(l.price.amount) * l.quantity, l.price.currencyCode)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                onClick={handleCheckout}
                className="w-full h-12 rounded-none"
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Checkout — {formatMoney(subtotal, currency)}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

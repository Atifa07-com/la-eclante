import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "hasSeenOctoberLaunchPromo";

export function OctoberLaunchPromo() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const availOffer = () => {
    dismiss();
    navigate("/shop");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
        else setOpen(true);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-charcoal/65 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/20 bg-background text-foreground shadow-2xl duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:rounded-3xl">
          <DialogPrimitive.Close
            aria-label="Close launch offer"
            className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5 sm:top-5"
          >
            <X size={19} aria-hidden="true" />
          </DialogPrimitive.Close>

          <div className="relative overflow-hidden bg-charcoal px-6 pb-7 pt-8 text-background sm:px-10 sm:pb-9 sm:pt-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border border-accent-gold/30" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-1 -top-7 size-36 rounded-full border border-accent-gold/25" />

            <div className="relative">
              <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-accent-gold">
                <Sparkles size={14} aria-hidden="true" />
                The celebration starts now
              </p>
              <DialogTitle className="mt-5 font-serif text-3xl font-normal leading-tight text-background sm:text-4xl">
                October is our <span className="text-accent-gold">Launch Month.</span>
              </DialogTitle>

              <div className="mt-6 inline-flex items-baseline gap-2 rounded-lg border border-accent-gold/50 bg-white/[0.06] px-4 py-2.5 sm:px-5 sm:py-3">
                <span className="font-serif text-5xl leading-none text-accent-gold sm:text-6xl">30%</span>
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-background sm:text-base">Off everything</span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-7 pt-6 sm:px-10 sm:pb-9 sm:pt-7">
            <DialogDescription className="max-w-none text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              We&apos;re opening our doors with a little something for your skin. Enjoy a flat 30% off every product, storewide, all month long. Your launch offer is automatically applied at checkout, so there&apos;s no code to remember.
            </DialogDescription>

            <Button
              type="button"
              variant="primary"
              onClick={availOffer}
              className="group mt-6 h-12 w-full gap-2 text-sm font-semibold uppercase tracking-[0.12em]"
            >
              Avail Offer
              <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">October only · No promo code needed</p>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCustomerTokens } from "@/lib/customerAuth";

const STORAGE_KEY = "la-eclante-popup-shown-v1";
const WELCOME_OFFER_KEY = "eclantian_welcome_offer";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getCustomerTokens()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const claimOffer = () => {
    dismiss();
    sessionStorage.setItem(WELCOME_OFFER_KEY, "1");
    navigate("/auth");
  };

  if (!open || getCustomerTokens()) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setOpen(true);
        else dismiss();
      }}
    >
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-border p-0 shadow-elevated">
        <div className="h-0.5 w-full bg-accent-gold" aria-hidden="true" />
        <div className="px-7 pb-7 pt-8 md:px-9 md:pb-9">
          <p className="eyebrow">AN ECLANTIAN WELCOME</p>
          <DialogTitle className="mt-3 font-serif text-3xl leading-tight font-normal">
            Your 10% welcome reward is waiting.
          </DialogTitle>
          <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Become an Eclantian in under a minute. No password, just a one-time code sent to your email. Unlock 10% off your first order, routine guidance made for your skin, and first access to new launches.
          </DialogDescription>
          <Button
            type="button"
            variant="primary"
            onClick={claimOffer}
            className="group mt-7 h-auto min-h-12 w-full whitespace-normal py-3"
          >
            <span>Claim my 10% — Become an Eclantian</span>
            <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" size={17} aria-hidden="true" />
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Passwordless sign-in · Under 60 seconds
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

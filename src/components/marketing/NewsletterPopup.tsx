import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCustomerTokens } from "@/lib/customerAuth";

const STORAGE_KEY = "la-eclante-popup-shown-v1";

interface NewsletterPopupProps {
  blocked?: boolean;
}

export function NewsletterPopup({ blocked = false }: NewsletterPopupProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined" || blocked) return;
    if (getCustomerTokens()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, [blocked]);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const becomeEclantian = () => {
    dismiss();
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
      <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-md overflow-y-auto overscroll-contain rounded-xl border-border p-0 shadow-elevated sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl">
        <div className="h-0.5 w-full bg-accent-gold" aria-hidden="true" />
        <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-8 md:px-9 md:pb-9">
          <p className="eyebrow">BECOME AN ECLANTIAN</p>
          <DialogTitle className="mt-3 font-serif text-2xl leading-tight font-normal sm:text-3xl">
            Know exactly where your order is.
          </DialogTitle>
          <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Sign in with just your email — no password — and always know where your order stands. As an Eclantian, you&apos;ll also get first access to new routines and offers made just for members, before anyone else sees them.
          </DialogDescription>
          <ul className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:gap-3">
            <li className="flex items-center gap-2"><Package size={15} className="shrink-0 text-accent-gold" aria-hidden="true" />Track every order in one place</li>
            <li className="flex items-center gap-2"><Sparkles size={15} className="shrink-0 text-accent-gold" aria-hidden="true" />Member-only offers, sent occasionally</li>
            <li className="flex items-center gap-2"><Zap size={15} className="shrink-0 text-accent-gold" aria-hidden="true" />No password — a code sent to your email</li>
          </ul>
          <Button
            type="button"
            variant="primary"
            onClick={becomeEclantian}
            className="group mt-5 h-auto min-h-12 w-full whitespace-normal py-3 sm:mt-7"
          >
            <span>Become an Eclantian</span>
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

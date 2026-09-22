import { useEffect, useState } from "react";
import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/customer";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const emailSchema = z.string().trim().email().max(255);
const STORAGE_KEY = "la-eclante-popup-shown-v1";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error("Please enter a valid email.");
    setLoading(true);
    const result = await subscribeToNewsletter({ email: parsed.data, source: "popup" });
    setLoading(false);
    if (!result.ok) {
      toast.error("Could not subscribe. Please try again.");
      return;
    }
    toast.success("Welcome — use code WELCOME10 at checkout.");
    close();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-fade-up">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={close} aria-hidden />
      <div className="relative w-full max-w-md bg-background border border-border shadow-elevated p-8 md:p-10">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
        <p className="eyebrow">A small welcome</p>
        <h3 className="font-serif text-3xl mt-3 leading-tight">Get 10% off your first order.</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Join the LA-ECLANTE list for skin-care guidance, new arrivals, and a quiet welcome offer.
        </p>
        <form onSubmit={subscribe} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full h-12 px-4 border border-border bg-transparent text-sm focus:border-foreground focus:outline-none"
          />
          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "..." : "Get my 10% off"}
          </Button>
        </form>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground text-center">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

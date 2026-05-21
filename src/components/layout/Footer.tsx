import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/customer";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(255);

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await subscribeToNewsletter({ email: parsed.data, source: "footer" });
    setLoading(false);
    if (!result.ok) {
      toast.error("Could not subscribe. Please try again.");
      return;
    }
    toast.success("Welcome — your 10% off code will arrive shortly.");
    setEmail("");
  };

  return (
    <footer className="mt-32 border-t border-border bg-muted/40">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl tracking-[0.18em] uppercase">LA-ECLANTE</div>
          <p className="eyebrow mt-2">The sparkle.</p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground leading-relaxed">
            Clinically effective skincare made for acne-prone and sensitive skin. Dermatologist tested,
            fragrance-free, non-comedogenic — always.
          </p>

          <form onSubmit={subscribe} className="mt-8 max-w-md">
            <label className="eyebrow block mb-3">Get 10% off your first order</label>
            <div className="flex border-b border-foreground/40 focus-within:border-foreground transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-muted-foreground/70"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[12px] uppercase tracking-[0.18em] py-2 px-1 hover:opacity-60 disabled:opacity-50"
              >
                {loading ? "..." : "Join"}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <h4 className="eyebrow mb-4">Shop</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shop" className="hover:opacity-60">All products</Link></li>
            <li><Link to="/routine" className="hover:opacity-60">The routine</Link></li>
            <li><Link to="/quiz" className="hover:opacity-60">Skin quiz</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="eyebrow mb-4">Brand</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:opacity-60">About</Link></li>
            <li><Link to="/account" className="hover:opacity-60">Account</Link></li>
            <li><a href="mailto:hello@la-eclante.com" className="hover:opacity-60">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-wide py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <div>© {new Date().getFullYear()} LA-ECLANTE</div>
          <div className="flex gap-6">
            <span>Dermatologist tested</span>
            <span>Non-comedogenic</span>
            <span>Fragrance-free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

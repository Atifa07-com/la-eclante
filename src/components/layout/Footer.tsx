import { Link } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { ArrowUpRight, Instagram } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/customer";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(255);

const INSTAGRAM_URL = "https://instagram.com/laeclante";
const WHATSAPP_URL = "https://wa.me/923355865864";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.045zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

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
    <footer className="mt-32 border-t border-charcoal/80 bg-charcoal text-background">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl tracking-[0.18em] uppercase">LA-ECLANTE</div>
          <p className="eyebrow mt-2">The sparkle.</p>
          <p className="mt-6 max-w-md text-sm text-background/70 leading-relaxed">
            Formulated with clinically validated actives, this dermatologist-tested, non-comedogenic regimen optimizes epidermal tolerance in acne-prone and hypersensitive skin.
          </p>

          <form onSubmit={subscribe} className="mt-8 max-w-md">
            <label className="eyebrow block mb-3">Become an Eclantian.</label>
            <div className="flex border-b border-background/40 focus-within:border-background transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-background/50"
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

          <div className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow LA-ECLANTE on Instagram"
              className="group flex min-w-0 items-center gap-3 rounded-md border border-background/15 bg-background/[0.04] px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d62976]/70 hover:bg-[#d62976]/10"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#feda75] via-[#fa7e1e] to-[#d62976] text-white shadow-sm">
                <Instagram size={22} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-background/55">Instagram</span>
                <span className="mt-1 block truncate text-sm font-medium text-background">Follow @laeclante</span>
                <span className="mt-0.5 block truncate text-[11px] text-background/55">Skincare, stories, and new drops</span>
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-background/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-background" aria-hidden="true" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Dr. Arfa directly on WhatsApp"
              className="group flex min-w-0 items-center gap-3 rounded-md border border-background/15 bg-background/[0.04] px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#25D366]/70 hover:bg-[#25D366]/10"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#25D366]/15 text-[#25D366]">
                <WhatsAppIcon size={23} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-[0.16em] text-background/55">WhatsApp</span>
                <span className="mt-1 block truncate text-sm font-medium text-background">Message Dr. Arfa</span>
                <span className="mt-0.5 block truncate text-[11px] text-background/55">Direct dermatologist contact</span>
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-background/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-background" aria-hidden="true" />
            </a>
          </div>
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

      <div className="border-t border-background/15">
        <div className="container-wide py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-background/60">
          <div>© {new Date().getFullYear()} LA-ECLANTE</div>
          <div className="flex gap-6">
            <span>Dermatologist tested</span>
            <span>Non-comedogenic</span>
            <span>Hypoallergenic</span>
            <span>Biocompatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

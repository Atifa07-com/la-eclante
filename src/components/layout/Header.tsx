import { Link, NavLink as RouterNav, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/routine", label: "Routine" },
  { to: "/quiz", label: "Skin Quiz" },
  { to: "/about", label: "About" },
];

export function Header() {
  const { setOpen, count } = useCart();
  const { user, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const itemCount = count();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [loc.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 ease-smooth border-b",
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-border"
          : "bg-background/80 backdrop-blur-sm border-transparent"
      )}
    >
      <div className="container-wide flex h-16 md:h-20 items-center justify-between gap-4">
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 -ml-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="font-serif text-xl md:text-2xl tracking-[0.18em] uppercase font-medium">
          LA-ECLANTE
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <RouterNav
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "text-[13px] tracking-[0.14em] uppercase transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </RouterNav>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:inline-block text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground px-3 py-1 border border-border rounded-sm"
            >
              Admin
            </Link>
          )}
          <Link to={user ? "/account" : "/auth"} aria-label="Account" className="p-2 hover:opacity-70 transition-opacity">
            <User size={18} strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Open cart"
            onClick={() => setOpen(true)}
            className="p-2 hover:opacity-70 transition-opacity relative"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-foreground text-background text-[10px] font-medium">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container-wide py-4 flex flex-col gap-3">
            {links.map((l) => (
              <RouterNav
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "py-2 text-sm tracking-[0.14em] uppercase",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )
                }
              >
                {l.label}
              </RouterNav>
            ))}
            {isAdmin && (
              <Link to="/admin" className="py-2 text-sm tracking-[0.14em] uppercase text-muted-foreground">
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

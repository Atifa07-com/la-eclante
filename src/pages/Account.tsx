import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  currency: string;
}

interface Profile {
  full_name: string | null;
  email: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/account", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id, created_at, status, total_cents, currency")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      setProfile(p);
      setOrders(o ?? []);
      setLoadingData(false);
    })();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    navigate("/", { replace: true });
  };

  if (loading || !user) return null;

  return (
    <section className="container-wide py-16 md:py-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-3">
            Hello{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{profile?.email ?? user.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={signOut}
          className="rounded-none h-11 px-6 tracking-[0.14em] uppercase text-[12px]"
        >
          Sign out
        </Button>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-5">Order history</h2>
          {loadingData ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="border border-border p-10 text-center">
              <p className="font-serif text-2xl">No orders yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your future routines will appear here.
              </p>
              <Button asChild className="mt-6 rounded-none h-11 px-8 tracking-[0.14em] uppercase text-[12px]">
                <Link to="/shop">Shop the routine</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border border border-border">
              {orders.map((o) => (
                <li key={o.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(o.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatPrice(o.total_cents)}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mt-1">
                      {o.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-10">
          <div>
            <h2 className="eyebrow mb-4">Quick links</h2>
            <ul className="space-y-3 text-sm">
              <li><Link to="/quiz" className="hover:opacity-60">Retake skin quiz</Link></li>
              <li><Link to="/routine" className="hover:opacity-60">View the routine</Link></li>
              <li><Link to="/shop" className="hover:opacity-60">Continue shopping</Link></li>
            </ul>
          </div>
          <div className="border border-border p-6 bg-muted/40">
            <h3 className="font-serif text-xl">Need help?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Email us at{" "}
              <a href="mailto:hello@la-eclante.com" className="underline underline-offset-4">
                hello@la-eclante.com
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

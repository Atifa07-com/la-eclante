import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  full_name: string | null;
  email: string;
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/account", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
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
          <div className="border border-border p-10 text-center">
            <p className="font-serif text-2xl">Track orders by email.</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Orders are processed by our checkout. You'll receive tracking and updates at the email
              you used to check out.
            </p>
            <Button asChild className="mt-6 rounded-none h-11 px-8 tracking-[0.14em] uppercase text-[12px]">
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
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

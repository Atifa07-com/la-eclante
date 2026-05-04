import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8, "At least 8 characters").max(72);

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(
    (params.get("mode") as "signin" | "signup") ?? "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate(params.get("redirect") ?? "/account", { replace: true });
    }
  }, [user, loading, navigate, params]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const e1 = emailSchema.safeParse(email);
    const p1 = passwordSchema.safeParse(password);
    if (!e1.success) return toast.error("Please enter a valid email.");
    if (!p1.success) return toast.error(p1.error.errors[0].message);

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: e1.data,
          password: p1.data,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: fullName.trim() || undefined },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: e1.data,
          password: p1.data,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/account`,
    });
    if (result?.error) {
      toast.error(result.error.message ?? "Could not sign in with Google.");
      setBusy(false);
    }
  };

  return (
    <section className="container-narrow py-20 md:py-28">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow">{mode === "signup" ? "Create account" : "Welcome back"}</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-3">
            {mode === "signup" ? "Begin your routine." : "Sign in."}
          </h1>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full h-12 rounded-none tracking-[0.14em] uppercase text-[12px]"
        >
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="h-px bg-border flex-1" />
          or
          <div className="h-px bg-border flex-1" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="full_name" className="eyebrow">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 h-11 rounded-none"
                maxLength={120}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="eyebrow">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 rounded-none"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="eyebrow">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 rounded-none"
              minLength={8}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-none tracking-[0.16em] uppercase text-[12px]"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to LA-ECLANTE?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-foreground underline underline-offset-4 hover:opacity-70"
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>

        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link to="/" className="hover:opacity-60">← Back to site</Link>
        </p>
      </div>
    </section>
  );
}

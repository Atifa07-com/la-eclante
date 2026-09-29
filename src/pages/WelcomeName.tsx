import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cacheCustomerInitial, fetchCustomerProfile, markNameCapturePrompted, updateCustomerFirstName } from "@/lib/customerAuth";
import type { CustomerProfile } from "@/lib/customerAuth";

const actionButtonClass = "bg-foreground text-background transition-colors duration-200 hover:bg-accent-gold hover:text-foreground";

export default function WelcomeNamePage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCustomerProfile().then((profile) => {
      if (!active) return;
      const hasName = Boolean(profile.firstName?.trim() || profile.lastName?.trim());
      if (hasName) {
        navigate("/account", { replace: true });
        return;
      }
      markNameCapturePrompted(profile.id);
      setCustomer(profile);
      setName(profile.firstName?.trim() || "");
      setError(null);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "We could not load your account. Please try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [loadAttempt, navigate]);

  const submitName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = name.trim();
    if (!firstName) {
      setError("Please enter a name to continue.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updatedCustomer = await updateCustomerFirstName(firstName);
      cacheCustomerInitial(updatedCustomer.firstName);
      navigate("/account", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your name could not be saved. You can retry or continue to your account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container-narrow section-space">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow">A little introduction</p>
        <h1 className="font-serif mt-3 text-4xl md:text-5xl">What should we call you?</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">A name makes your Eclante account feel a little more like yours.</p>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground" role="status">Loading your account...</p>
        ) : error && !customer ? (
          <div className="mt-8 space-y-4" role="alert">
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex flex-wrap gap-3">
              <Button className={actionButtonClass} onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Try again</Button>
              <Button asChild variant="outline"><Link to="/account">Continue to account</Link></Button>
            </div>
          </div>
        ) : customer ? (
          <form className="mt-8 space-y-5" onSubmit={(event) => void submitName(event)}>
            <div>
              <label htmlFor="customer-name" className="mb-2 block text-sm font-medium">Your name</label>
              <Input
                id="customer-name"
                name="name"
                type="text"
                autoComplete="given-name"
                maxLength={255}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                disabled={saving}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className={actionButtonClass} disabled={saving}>
                {saving ? "Saving..." : "Save and continue"}
              </Button>
              <Button asChild variant="outline"><Link to="/account">Continue to account</Link></Button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
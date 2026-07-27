import { useMemo, useState } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  DONATION_MAX_AMOUNT_CENTS,
  DONATION_MIN_AMOUNT_CENTS,
  donationPresetAmounts,
  formatDonationAmount
} from "@/lib/donation";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const StripeDonateSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(
    donationPresetAmounts[1]
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [checkoutAmountCents, setCheckoutAmountCents] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string>("");

  const selectedAmountCents = useMemo(() => {
    const trimmed = customAmount.trim();

    if (!trimmed) {
      return selectedAmount;
    }

    const parsedDollars = Number.parseFloat(trimmed);
    if (!Number.isFinite(parsedDollars) || parsedDollars <= 0) {
      return NaN;
    }

    return Math.round(parsedDollars * 100);
  }, [customAmount, selectedAmount]);

  const handleStartCheckout = () => {
    if (!Number.isFinite(selectedAmountCents)) {
      setError("Enter a valid donation amount.");
      return;
    }

    if (selectedAmountCents < DONATION_MIN_AMOUNT_CENTS) {
      setError(
        `Donation must be at least ${formatDonationAmount(DONATION_MIN_AMOUNT_CENTS)}.`
      );
      return;
    }

    if (selectedAmountCents > DONATION_MAX_AMOUNT_CENTS) {
      setError(
        `Donation must be under ${formatDonationAmount(DONATION_MAX_AMOUNT_CENTS)}.`
      );
      return;
    }

    setError("");
    setCheckoutAmountCents(selectedAmountCents);
  };

  // Stripe requires fetchClientSecret to keep the same identity for the
  // life of the provider — a new function per render makes it throw
  // "You cannot change fetchClientSecret after setting it" and never call
  // the API. Recreate the options only when the committed amount changes;
  // the provider is also keyed by amount so each one gets a fresh instance.
  const checkoutOptions = useMemo(() => {
    if (!checkoutAmountCents) {
      return null;
    }

    return {
      fetchClientSecret: async () => {
        const response = await fetch("/api/create-donation-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ amountCents: checkoutAmountCents })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.clientSecret) {
          throw new Error(data?.error ?? "Unable to start checkout.");
        }

        return data.clientSecret as string;
      }
    };
  }, [checkoutAmountCents]);

  if (!stripePromise) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
        <p className="font-semibold">Stripe isn&apos;t configured yet.</p>
        <p className="mt-2 text-sm leading-relaxed">
          Add <span className="font-semibold">VITE_STRIPE_PUBLISHABLE_KEY</span>{" "}
          and
          <span className="font-semibold"> STRIPE_SECRET_KEY</span> to enable
          donations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-3xl font-black uppercase leading-tight text-primary md:text-4xl">
          Make A Donation
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Your gift funds equipment, travel, and coaching so more youth can
          access sports.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {donationPresetAmounts.map((amount) => {
            const isActive = !customAmount.trim() && selectedAmount === amount;

            return (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                  setError("");
                  setCheckoutAmountCents(null);
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors md:text-base ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:border-primary/40"
                }`}
              >
                {formatDonationAmount(amount)}
              </button>
            );
          })}
        </div>

        <div className="mt-4 max-w-sm">
          <label
            htmlFor="custom-donation"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Custom amount (USD)
          </label>
          <input
            id="custom-donation"
            type="number"
            inputMode="decimal"
            min={DONATION_MIN_AMOUNT_CENTS / 100}
            step="0.01"
            placeholder="e.g. 75"
            value={customAmount}
            onChange={(event) => {
              setCustomAmount(event.target.value);
              setError("");
              setCheckoutAmountCents(null);
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition-colors focus:border-primary"
          />
        </div>

        {error ? (
          <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleStartCheckout}
            className="rounded-xl bg-primary px-6 py-3 font-heading text-sm font-black uppercase tracking-wide text-white transition-transform hover:scale-[1.02]"
          >
            Continue To Secure Checkout
          </button>
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            {Number.isFinite(selectedAmountCents)
              ? formatDonationAmount(selectedAmountCents)
              : "-"}
          </p>
        </div>
      </div>

      {checkoutAmountCents && checkoutOptions ? (
        <div className="rounded-2xl bg-white p-2 shadow-sm md:p-4">
          <EmbeddedCheckoutProvider
            key={checkoutAmountCents}
            stripe={stripePromise}
            options={checkoutOptions}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      ) : null}
    </div>
  );
};

export default StripeDonateSection;

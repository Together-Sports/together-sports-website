import { z } from "zod";

export const DONATION_MIN_AMOUNT_CENTS = 500;
export const DONATION_MAX_AMOUNT_CENTS = 1000000;

export const donationPresetAmounts = [2500, 5000, 10000, 25000] as const;

export const donationRequestSchema = z.object({
  amountCents: z
    .number()
    .int("Donation amount must be a whole number.")
    .min(DONATION_MIN_AMOUNT_CENTS, "Donation must be at least $5.00.")
    .max(DONATION_MAX_AMOUNT_CENTS, "Donation amount is too large."),
});

export type DonationRequest = z.infer<typeof donationRequestSchema>;

export const formatDonationAmount = (amountCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

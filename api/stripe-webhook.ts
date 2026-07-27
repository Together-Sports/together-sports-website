import Stripe from "stripe";
import { Resend } from "resend";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.CONTACT_FROM_EMAIL;
const notifyEmail = process.env.CONTACT_TO_EMAIL;
// Optional: shown on the receipt when set (e.g. "12-3456789").
const orgEin = process.env.DONATION_RECEIPT_EIN?.trim();

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    })
  : null;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const formatUsd = (amountCents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

type ReceiptDetails = {
  donorName: string;
  amountCents: number;
  dateLabel: string;
  reference: string;
};

const taxStatement = [
  "Together Sports is a 501(c)(3) tax-exempt nonprofit organization.",
  orgEin ? `EIN: ${orgEin}.` : "",
  "Your contribution is tax-deductible to the extent allowed by law.",
  "No goods or services were provided in exchange for this contribution.",
  "Please keep this email as your receipt for tax purposes.",
]
  .filter(Boolean)
  .join(" ");

const createReceiptHtml = ({ donorName, amountCents, dateLabel, reference }: ReceiptDetails) => `
  <div style="margin:0;padding:32px 16px;background:#f5f7ff;font-family:Montserrat,Arial,sans-serif;color:#0a0d28;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe4ff;border-radius:24px;overflow:hidden;">
      <div style="padding:28px;background:#020367;color:#ffffff;text-align:center;">
        <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;opacity:0.9;">Together Sports</div>
        <h1 style="margin:12px 0 0;font-family:'League Spartan',Arial,sans-serif;font-size:44px;line-height:1;font-weight:800;">Thank You! 💚</h1>
        <div style="margin-top:10px;font-size:15px;opacity:0.9;">Your generosity puts more kids in the game.</div>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#1f223f;">
          ${donorName ? `Dear ${escapeHtml(donorName)},` : "Dear Friend,"}
        </p>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#1f223f;">
          Thank you so much for supporting Together Sports. Your donation funds
          equipment, coaching, and free programs that make sports accessible to
          every kid — regardless of background, income, or ability. We couldn't
          do this without you.
        </p>

        <div style="padding:20px;border:1px solid #d8def0;border-radius:20px;background:#f8faff;margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f74d6;margin-bottom:12px;">🧾 Donation Receipt</div>
          <table style="width:100%;border-collapse:collapse;font-size:15px;color:#0a0d28;">
            <tr>
              <td style="padding:6px 0;color:#6b7194;">Amount</td>
              <td style="padding:6px 0;text-align:right;font-weight:700;font-size:18px;">${formatUsd(amountCents)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7194;">Date</td>
              <td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(dateLabel)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7194;">Reference</td>
              <td style="padding:6px 0;text-align:right;font-weight:600;font-family:monospace;font-size:13px;">${escapeHtml(reference)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7194;">Organization</td>
              <td style="padding:6px 0;text-align:right;font-weight:600;">Together Sports${orgEin ? ` · EIN ${escapeHtml(orgEin)}` : ""}</td>
            </tr>
          </table>
        </div>

        <div style="padding:16px 18px;border:1px solid #e4e9f7;border-radius:16px;background:#ffffff;margin-bottom:20px;">
          <div style="font-size:13px;line-height:1.7;color:#5a5f7d;">${escapeHtml(taxStatement)}</div>
        </div>

        <p style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#1f223f;">
          With gratitude,<br />
          <strong>The Together Sports Team</strong>
        </p>
        <p style="margin:16px 0 0;font-size:13px;color:#6b7194;">
          See what your support makes possible at
          <a href="https://togethersports.org" style="color:#4f74d6;">togethersports.org</a>
        </p>
      </div>
    </div>
  </div>
`;

const createReceiptText = ({ donorName, amountCents, dateLabel, reference }: ReceiptDetails) => `Together Sports - Thank You!

${donorName ? `Dear ${donorName},` : "Dear Friend,"}

Thank you so much for supporting Together Sports. Your donation funds equipment, coaching, and free programs that make sports accessible to every kid - regardless of background, income, or ability. We couldn't do this without you.

DONATION RECEIPT
Amount: ${formatUsd(amountCents)}
Date: ${dateLabel}
Reference: ${reference}
Organization: Together Sports${orgEin ? ` (EIN ${orgEin})` : ""}

${taxStatement}

With gratitude,
The Together Sports Team
https://togethersports.org`;

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return Response.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (
    session.mode !== "payment" ||
    session.payment_status !== "paid" ||
    session.metadata?.source !== "get-involved-donate"
  ) {
    return Response.json({ received: true }, { status: 200 });
  }

  const donorEmail = session.customer_details?.email;
  const details: ReceiptDetails = {
    donorName: session.customer_details?.name?.trim() ?? "",
    amountCents: session.amount_total ?? 0,
    dateLabel: new Date(event.created * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    }),
    reference:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? session.id),
  };

  try {
    if (resend && fromEmail && donorEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: donorEmail,
        subject: "Thank you for your donation to Together Sports 💚",
        html: createReceiptHtml(details),
        text: createReceiptText(details),
        tags: [{ name: "source", value: "donation-receipt" }],
      });
    }

    if (resend && fromEmail && notifyEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `New donation: ${formatUsd(details.amountCents)}`,
        text: `New donation received!\n\nAmount: ${formatUsd(details.amountCents)}\nFrom: ${details.donorName || "Anonymous"}${donorEmail ? ` (${donorEmail})` : ""}\nDate: ${details.dateLabel}\nReference: ${details.reference}`,
        tags: [{ name: "source", value: "donation-notification" }],
      });
    }
  } catch {
    // A failed send returns 500 so Stripe retries the webhook (and the email).
    return Response.json({ error: "Unable to send receipt email." }, { status: 500 });
  }

  return Response.json({ received: true }, { status: 200 });
}

export function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}

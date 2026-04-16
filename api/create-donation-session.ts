import Stripe from "stripe";
import {
  DONATION_MAX_AMOUNT_CENTS,
  DONATION_MIN_AMOUNT_CENTS,
  donationRequestSchema,
} from "../src/lib/donation.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const configuredAllowedOrigins = (process.env.STRIPE_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    })
  : null;

const isAllowedOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!origin) {
    return true;
  }

  if (configuredAllowedOrigins.length > 0) {
    return configuredAllowedOrigins.includes(origin);
  }

  if (!host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host || /^localhost(:\d+)?$/i.test(originUrl.host);
  } catch {
    return false;
  }
};

const getSiteUrl = (request: Request) => {
  const configuredSiteUrl = process.env.SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";

  if (!host) {
    return null;
  }

  return `${proto}://${host}`;
};

export async function POST(request: Request) {
  if (!stripe) {
    return Response.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Origin not allowed." }, { status: 403 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = donationRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid donation amount.",
        minAmountCents: DONATION_MIN_AMOUNT_CENTS,
        maxAmountCents: DONATION_MAX_AMOUNT_CENTS,
      },
      { status: 400 },
    );
  }

  const siteUrl = getSiteUrl(request);
  if (!siteUrl) {
    return Response.json({ error: "Unable to determine site URL." }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      return_url: `${siteUrl}/get-involved?donation=success`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: "Together Sports Donation",
              description: "Support youth sports access programs.",
            },
            unit_amount: parsed.data.amountCents,
          },
        },
      ],
      submit_type: "donate",
      custom_text: {
        submit: {
          message: "Thank you for helping expand access to youth sports.",
        },
      },
      metadata: {
        source: "get-involved-donate",
      },
    });

    if (!session.client_secret) {
      return Response.json({ error: "Unable to initialize checkout." }, { status: 502 });
    }

    return Response.json({ clientSecret: session.client_secret }, { status: 200 });
  } catch {
    return Response.json(
      {
        error: "Unable to start donation checkout right now. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}

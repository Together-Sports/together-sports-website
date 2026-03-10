import { Resend } from "resend";
import { CONTACT_MESSAGE_MAX_CHARS, contactFormSchema } from "../src/lib/contact-form";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
const configuredAllowedOrigins = (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const submissionsByIp = new Map<string, number[]>();
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getRequestIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const recentRequests = (submissionsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    submissionsByIp.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  submissionsByIp.set(ip, recentRequests);
  return false;
};

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

const createEmailHtml = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  message: string;
}) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0a0d28;">
    <h2 style="margin:0 0 16px;">New Together Sports contact form message</h2>
    <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</p>
    <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p style="margin:0 0 8px;"><strong>Topic:</strong> ${escapeHtml(payload.topic)}</p>
    <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
    <div style="white-space:pre-wrap;border:1px solid #d8def0;padding:16px;background:#ffffff;">
      ${escapeHtml(payload.message)}
    </div>
  </div>
`;

const createEmailText = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  message: string;
}) => `New Together Sports contact form message

Name: ${payload.firstName} ${payload.lastName}
Email: ${payload.email}
Topic: ${payload.topic}

Message:
${payload.message}`;

export async function POST(request: Request) {
  if (!resend || !contactToEmail || !contactFromEmail) {
    return Response.json({ error: "Contact email is not configured." }, { status: 500 });
  }

  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Origin not allowed." }, { status: 403 });
  }

  const ip = getRequestIp(request);
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid form submission.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const submission = parsed.data;

  if (submission.website) {
    return Response.json({ ok: true }, { status: 200 });
  }

  try {
    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: submission.email,
      subject: `Together Sports Contact: ${submission.topic}`,
      html: createEmailHtml(submission),
      text: createEmailText(submission),
      tags: [
        { name: "source", value: "contact-form" },
        { name: "topic", value: submission.topic.toLowerCase().replace(/\s+/g, "-").slice(0, 50) },
      ],
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json(
      {
        error: `Unable to send your message right now. Please email us directly instead.`,
        maxMessageLength: CONTACT_MESSAGE_MAX_CHARS,
      },
      { status: 502 },
    );
  }
}

export function GET() {
  return Response.json({ error: "Method not allowed." }, { status: 405 });
}

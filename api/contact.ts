import { Resend } from "resend";
import { CONTACT_MESSAGE_MAX_CHARS, contactFormSchema } from "../src/lib/contact-form.js";

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
  <div style="margin:0;padding:32px 16px;background:#f5f7ff;font-family:Montserrat,Arial,sans-serif;color:#0a0d28;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe4ff;border-radius:24px;overflow:hidden;">
      <div style="padding:24px 28px;background:#020367;color:#ffffff;">
        <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;opacity:0.9;">Together Sports</div>
        <h1 style="margin:10px 0 0;font-family:'League Spartan',Arial,sans-serif;font-size:40px;line-height:1;font-weight:800;">New Contact Message 💬</h1>
      </div>
      <div style="padding:28px;">
        <div style="display:grid;gap:12px;margin-bottom:20px;">
          <div style="padding:14px 16px;border:1px solid #d8def0;border-radius:16px;background:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f74d6;margin-bottom:4px;">👤 Name</div>
            <div style="font-size:18px;font-weight:600;color:#0a0d28;">${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</div>
          </div>
          <div style="padding:14px 16px;border:1px solid #d8def0;border-radius:16px;background:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f74d6;margin-bottom:4px;">📧 Email</div>
            <div style="font-size:18px;font-weight:600;color:#0a0d28;">${escapeHtml(payload.email)}</div>
          </div>
          <div style="padding:14px 16px;border:1px solid #d8def0;border-radius:16px;background:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f74d6;margin-bottom:4px;">🏷️ Topic</div>
            <div style="font-size:18px;font-weight:600;color:#0a0d28;">${escapeHtml(payload.topic)}</div>
          </div>
        </div>
        <div style="padding:18px 20px;border:1px solid #d8def0;border-radius:20px;background:#ffffff;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4f74d6;margin-bottom:8px;">📝 Message</div>
          <div style="font-size:16px;line-height:1.7;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;color:#1f223f;">
            ${escapeHtml(payload.message)}
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const createEmailText = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  message: string;
}) => `Together Sports - New Contact Message

👤 Name: ${payload.firstName} ${payload.lastName}
📧 Email: ${payload.email}
🏷️ Topic: ${payload.topic}

📝 Message:
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

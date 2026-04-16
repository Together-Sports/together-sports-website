# Together Sports Website

Together Sports is a Vite + React site with a live Supabase-backed edit mode for home content, team cards, partners, blog tags, testimonials, experiences, and sport-page content.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- Resend

## If You Only Want Edit Mode

The easiest way to manage content is not by editing code.

Use:
- Vercel for hosting and environment variables
- Supabase for auth, live content, and media uploads
- `/admin` for the actual editing

That is easier than changing repo files manually because:
- content updates go live without redeploying
- images upload directly to Supabase storage
- admin access is controlled by magic-link sign-in
- non-technical editors do not need to touch the codebase

The code-based backup/export tools still exist, but they are the fallback, not the preferred workflow.

## Edit Mode

The editor lives at:

```txt
/admin
```

With Supabase configured:
- enter an allowed admin email
- receive a magic link
- sign in
- edit content live
- upload images
- click `Save Live`

Without Supabase configured:
- the editor falls back to the seeded repo defaults
- changes are not the recommended production workflow

## Local Development

Install dependencies:

```sh
npm install
```

Run the normal Vite dev server:

```sh
npm run dev
```

This project is pinned to `http://localhost:8081` for regular local development.

If you want to run the Vercel serverless routes locally too, use:

```sh
npx vercel dev
```

That runs the app on `http://localhost:3000`.

## Environment Variables

Put these in:
- `.env.local` for local development
- Vercel Project Settings -> Environment Variables for deployed environments

Current env vars:

```sh
SITE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
VITE_SUPABASE_ADMIN_EMAILS=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
CONTACT_ALLOWED_ORIGINS=
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_ALLOWED_ORIGINS=
```

What they do:
- `SITE_URL`
  - canonical production domain
  - used for sitemap, robots, canonical tags, and SEO metadata
- `VITE_SUPABASE_URL`
  - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - Supabase publishable key
- `VITE_SUPABASE_ADMIN_EMAILS`
  - comma-separated allowlist for `/admin`
- `RESEND_API_KEY`
  - API key for the contact form email sending
- `CONTACT_TO_EMAIL`
  - inbox that receives contact form submissions
- `CONTACT_FROM_EMAIL`
  - verified sender used by Resend
- `CONTACT_ALLOWED_ORIGINS`
  - optional comma-separated allowed origins for the contact API
- `VITE_STRIPE_PUBLISHABLE_KEY`
  - Stripe publishable key used by the embedded donation checkout UI
- `STRIPE_SECRET_KEY`
  - Stripe secret key used by the donation session API (`/api/create-donation-session`)
- `STRIPE_ALLOWED_ORIGINS`
  - optional comma-separated allowed origins for the Stripe donation API

Example:

```sh
SITE_URL=https://togethersports.org
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_publishable_key
VITE_SUPABASE_ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
RESEND_API_KEY=re_xxxxx
CONTACT_TO_EMAIL=togethersportsorg@gmail.com
CONTACT_FROM_EMAIL=Together Sports <hello@yourdomain.com>
CONTACT_ALLOWED_ORIGINS=https://togethersports.org,http://localhost:3000,http://localhost:8081
```

See [.env.example](./.env.example).

## Live Content System

How it works:

- public pages load live content from Supabase at runtime
- `/admin` uses Supabase magic-link auth
- `Save Live` writes the full content object to `site_content`
- uploaded images go into the `site-media` storage bucket
- content changes do not require a redeploy
- export/import JSON tools still exist as backup tools

## Supabase Notes

The intended production setup is:
- create the Supabase project
- create the `site_content` table
- create the `site-media` bucket
- add row-level-security policies for allowed admin emails
- create or invite the allowed admin users in Supabase Auth
- add the Supabase env vars in Vercel

This is the recommended path for editors. It is easier and safer than maintaining content directly in the repo.

## Backup Content Workflow

JSON backup tools still exist if you want content snapshots:

- export from `/admin`
- save the file as `content/editable-content.json`
- run `npm run apply:content`
- commit `content/editable-content.json` and `src/data/editableContentSeed.ts`

This backup flow is optional.

## Build

Create a production build with:

```sh
npm run build
```

## Deployment

Deploy on Vercel with:
- Framework Preset: `Vite`
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Then add the env vars above in Vercel for `Development`, `Preview`, and `Production`.

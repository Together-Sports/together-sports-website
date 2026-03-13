# Together Sports Code Guide For A Non-Technical Owner

This guide is for someone who may need to change the website **in code**, but does not normally work with code.

It does **not** try to teach programming from scratch. Its job is to explain:
- where each page lives
- which files control what
- what is safe to edit
- what should be left alone unless there is a very specific reason

## Before Touching Anything

## The safest rule

If you only need to change:
- text
- people
- partner logos
- testimonials
- blog tags / featured
- homepage metrics
- tennis lesson videos

use `/admin`, not code.

This guide is only for changes that truly need code.

## Make changes in small steps

Good workflow:

1. Change one file.
2. Save it.
3. Run the site locally.
4. Check the page.
5. Then do the next change.

Do **not** change many unrelated files at once unless you know exactly why.

## Main Route Map

The route list lives in:

- [src/App.tsx]

Current main routes:

- `/` = Home
- `/team` = Team
- `/sports` = Sports overview
- `/sports/tennis`
- `/sports/basketball`
- `/sports/football`
- `/sports/golf`
- `/blog`
- `/blog/:slug`
- `/experiences`
- `/get-involved`
- `/contact`
- `/partners`
- `/admin`

If you need to add, remove, or rename a route, start in `src/App.tsx`.

## What File Controls Each Page

## Home

- [src/pages/Index.tsx]

This controls:
- homepage hero
- mission section
- what we stand for
- sports CTA
- testimonials
- impact metrics placement
- second serve section
- location
- donation CTA

If you want to:
- move homepage sections
- change homepage wording in code
- change homepage shapes / animations / visual layout

this is the file.

## Team

- [src/pages/AboutPage.tsx]

This controls:
- team hero
- team card layout
- founder/staff/coaches display
- hover/tap description behavior

If a team card looks wrong on the page, this is the file to inspect.

## Sports Overview

- [src/pages/SportsPage.tsx]

This controls:
- sports hero
- sports page section below the hero

## Individual Sport Pages

- [src/pages/SportDetailPage.tsx]

This one file controls all sport detail pages using the route parameter.

It handles:
- each sport hero
- sport descriptions
- tennis live USTA sessions
- tennis lesson videos
- waitlist CTA
- second serve section on tennis

If tennis, basketball, football, or golf pages need layout or text changes in code, start here.

## Blog Index

- [src/pages/BlogPage.tsx]

This controls:
- blog hero
- featured post layout
- blog card layout
- empty state

## Blog Post Page

- [src/pages/BlogPostPage.tsx]

This controls:
- single article layout
- article header
- article body display

## Experiences

- [src/pages/ExperiencesPage.tsx]

This controls:
- experiences hero
- moments captured
- athlete quotes
- parent quotes
- video section

## Partners

- [src/pages/PartnersPage.tsx]

This controls:
- partners title / top section
- conveyor belt
- why partner with us
- partner CTA

## Get Involved

- [src/pages/GetInvolvedPage.tsx]

This controls:
- get involved hero/title
- donate / volunteer / partner cards
- card icons
- action button links

## Contact

- [src/pages/ContactPage.tsx]

This controls:
- contact page hero
- form layout
- logo image panel
- submit success message in the page UI

## Shared Layout Files

These affect many pages at once.

## Header

- [src/components/Navbar.tsx]

This controls:
- top navigation
- dropdown under Home
- mobile menu
- logo placement
- nav link order
- Get Involved button in the header

If you want to change the header, start here.

## Footer

- [src/components/Footer.tsx]

This controls:
- footer columns
- footer links
- footer logo
- social icons
- nonprofit/legal line

## Global Layout Wrapper

- [src/components/Layout.tsx]

This wraps pages with:
- header
- footer
- edit mode button logic

## Sitewide Scroll-to-Top

- [src/components/ScrollToTop.tsx]

This makes route changes go back to the top of the page.

## Where The Editable Content Comes From

## Main editable content logic

- [src/lib/editable-content.tsx]

This is one of the most important files in the whole project.

It controls:
- loading saved content from Supabase
- saving `/admin` edits
- image uploads
- auth state
- live blog merging
- preview draft behavior

If this file breaks, Edit Mode usually breaks too.

Do not change it casually.

## Data formatting for editable content

- [src/lib/editable-content-format.ts]

This defines the editable content structure.

Change this only if you are intentionally adding a new editable content type.

## Default fallback content

- [src/data/editableContentSeed.ts]

This is the built-in fallback/default content.

If something is not yet in Supabase, this file may still affect what shows.

## Admin / Edit Mode Page

- [src/pages/AdminPage.tsx]

This controls:
- `/admin`
- all admin tabs
- all admin form fields
- limits like max characters, max social links, etc.

If you need to add a new field to Edit Mode, you usually need to change:

1. `src/pages/AdminPage.tsx`
2. `src/lib/editable-content-format.ts`
3. `src/lib/editable-content.tsx`
4. `src/data/editableContentSeed.ts`
5. the actual page that displays the content

## Live Blog Files

## Blog API endpoint

- [api/blog-posts.ts]

This is very important.

It controls:
- live Substack fetching
- cached blog persistence in Supabase
- protection against temporary Substack feed regressions

If the blog stops updating or older posts disappear unexpectedly, check this file first.

## Feed parser

- [scripts/substack-feed.mjs]

This parses the Substack RSS feed.

If the feed format changes, this file may need updates.

## Fallback blog data

- [src/data/blogPosts.ts]

This is fallback/default data only.

It is **not** the main live blog source anymore.

## Live Tennis / USTA Files

- [api/usta-sessions.ts]
- [src/lib/usta-sessions.ts]

These control:
- live USTA session fetching
- session formatting

If the tennis live section breaks, check these two.

## Contact Form / Email Files

- [api/contact.ts]
- [src/lib/contact-form.ts]

These control:
- contact form validation
- Resend email sending
- server-side spam protection / checks

If the contact form stops sending messages, inspect these files.

## SEO / Search / Icons

## SEO tags and route metadata

- [src/components/Seo.tsx]

This controls:
- page titles
- meta descriptions
- Open Graph
- Twitter tags
- structured data
- favicon/head tags at runtime

## Static head file

- [index.html]

This controls:
- base HTML shell
- static icon links
- static fallback SEO tags

## Generated SEO files

- [scripts/generate-seo-assets.mjs]
- [public/sitemap.xml]
- [public/robots.txt]
- [public/site.webmanifest]

These are SEO/search/share related.

If you touch them, do it carefully.

## Styles

- [src/index.css]

This controls global styles like:
- fonts
- utility classes
- scrollbar
- shared visuals
- some custom highlight/shape behavior

If many pages suddenly look different, this file may be why.

## Safe Changes vs Risky Changes

## Usually Safe

These are usually safe if done carefully:

- changing text inside page files
- changing button labels
- changing links
- swapping images
- changing section order inside one page
- changing colors/classes in one page file
- changing footer or header link labels

## Riskier

These need more care:

- `src/lib/editable-content.tsx`
- `src/lib/editable-content-format.ts`
- `api/blog-posts.ts`
- `api/usta-sessions.ts`
- `api/contact.ts`
- `src/components/Seo.tsx`
- `src/App.tsx`
- `src/index.css`

Change these only when you know why.

## Things You Should Not Touch Unless Necessary

Avoid editing these unless there is a specific reason:

- `dist/`
- built JS files in `dist/assets/`
- `package-lock.json`
- `node_modules/`
- generated SEO files unless you mean to change SEO behavior
- anything in `api/` unless you are changing backend behavior

Important:
- `dist/` is build output, not source code
- changes there are temporary and should not be used as real edits

## Maintenance: What To Check When Something Breaks

## If Edit Mode breaks

Check:
- Supabase env vars
- [src/lib/supabase.ts]
- [src/lib/editable-content.tsx]
- [src/pages/AdminPage.tsx]

## If blog breaks

Check:
- `https://togethersports.org/api/blog-posts`
- `https://togethersports.substack.com/feed`
- [api/blog-posts.ts]
- [scripts/substack-feed.mjs]

## If tennis live sessions break

Check:
- `https://togethersports.org/api/usta-sessions`
- [api/usta-sessions.ts]
- [src/lib/usta-sessions.ts]

## If contact form breaks

Check:
- Resend env vars
- [api/contact.ts]
- [src/lib/contact-form.ts]

## What To Run Locally

Install:

```sh
npm install
```

Normal local site:

```sh
npm run dev
```

Build test:

```sh
npm run build
```

If you need the Vercel serverless routes locally too:

```sh
npx vercel dev
```

## Final Advice

If the goal is:

- “change wording”
- “swap image”
- “change title”
- “move a section a little”

then edit the relevant page file.

If the goal is:

- “Edit Mode should save a new type of content”
- “blog live logic changed”
- “USTA is broken”
- “contact email stopped sending”
- “SEO / sitemap / icons changed”

then use extra caution, because those are system-level files.

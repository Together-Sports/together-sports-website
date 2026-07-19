// Build-time static prerender. Runs automatically after `vite build`
// (see the postbuild script): it builds an SSR bundle of the app, renders
// every route with the freshest available content (live Supabase content
// when the build environment has credentials, the bundled seed otherwise),
// and writes the result into dist/<route>/index.html so search engines get
// the full page content in the raw HTML — no JavaScript required.
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const serverDir = path.join(rootDir, "dist-server");

const normalizeSiteUrl = (value) => {
  // The Vercel production domain is the bare apex (www redirects to it), so
  // canonical/OG URLs and the sitemap must use the apex too.
  const fallback = "https://togethersports.org";
  const raw = (value || fallback).trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL,
);

const STATIC_ROUTES = [
  "/",
  "/sports",
  "/sports/tennis",
  "/sports/basketball",
  "/sports/football",
  "/sports/soccer",
  "/sports/golf",
  "/team",
  "/experiences",
  "/moments",
  "/blog",
  "/partners",
  "/contact",
  "/get-involved",
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Covers the static page while an intro video is expected so the site never
// flashes before the intro plays; the React IntroVideo component (or the
// timeout) removes the cover. Mirrors the keys used in IntroVideo.tsx.
const INTRO_PREROLL_SCRIPT =
  '<script>(function(){try{if(window.localStorage.getItem("together-sports-intro-src")&&window.sessionStorage.getItem("together-sports-intro-seen")!=="1"){var s=document.createElement("style");s.id="intro-preroll";s.textContent="#root{visibility:hidden}";document.head.appendChild(s);setTimeout(function(){var e=document.getElementById("intro-preroll");if(e)e.remove();},6000);}}catch(e){}})();</script>';

const buildHead = ({ route, meta, structuredData }) => {
  const canonicalUrl = `${siteUrl}${route === "/" ? "/" : route}`;
  const imageUrl = `${siteUrl}/EMBEDPIC.png`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const robots = escapeHtml(meta.robots || "index, follow");

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="Together Sports" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="${route === "/" ? "website" : "article"}" />`,
    `<meta property="og:site_name" content="Together Sports" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:alt" content="Together Sports social preview" />`,
    `<meta property="og:image:width" content="1920" />`,
    `<meta property="og:image:height" content="1080" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    `<meta name="ts-prerender" content="${escapeHtml(route)}" />`,
    `<script type="application/ld+json" data-seo="organization">${JSON.stringify(structuredData)}</script>`,
  ].join("\n    ");
};

const injectIntoTemplate = (template, { head, bodyHtml }) => {
  // Drop the template's route-agnostic title/meta so the per-route block is
  // the only source of those tags.
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(
      /<meta\s[^<]*?(?:name|property)="(?:description|robots|author|og:[^"]+|twitter:[^"]+)"[^<]*?\/?>\s*/g,
      "",
    );

  // The intro cover script goes at the very top of <head>: an inline script
  // that appears after a stylesheet link must wait for that stylesheet and
  // would block HTML parsing; before any stylesheet it runs instantly.
  html = html.replace("<head>", `<head>\n    ${INTRO_PREROLL_SCRIPT}`);
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`,
  );

  return html;
};

const routeOutputPath = (route) =>
  route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.replace(/^\//, ""), "index.html");

const main = async () => {
  console.log("[prerender] building SSR bundle...");
  execSync(
    "npx vite build --ssr src/entry-server.tsx --outDir dist-server --emptyOutDir",
    { cwd: rootDir, stdio: "inherit" },
  );

  const entryUrl = pathToFileURL(
    path.join(serverDir, "entry-server.js"),
  ).href;
  const entry = await import(entryUrl);

  let content = null;
  try {
    content = await Promise.race([
      entry.resolveLiveContent(),
      new Promise((resolve) => setTimeout(() => resolve(null), 20000)),
    ]);
  } catch (error) {
    console.warn(
      `[prerender] live content unavailable (${error?.message || error}); using bundled seed content.`,
    );
  }

  if (content) {
    console.log("[prerender] rendering with LIVE site content.");
  } else {
    console.log("[prerender] rendering with bundled seed content.");
    content = entry.getDefaultContent();
  }

  const blogRoutes = (content.blogPosts || [])
    .filter((post) => post?.slug)
    .map((post) => `/blog/${post.slug}`);
  const routes = [...new Set([...STATIC_ROUTES, ...blogRoutes])];

  const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");

  for (const route of routes) {
    const bodyHtml = entry.render(route, content);
    const meta = entry.getMetaForPath(route, content.blogPosts || []);
    const structuredData = entry.buildStructuredData(route, siteUrl, meta);
    const html = injectIntoTemplate(template, {
      head: buildHead({ route, meta, structuredData }),
      bodyHtml,
    });
    const outPath = routeOutputPath(route);

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, "utf8");
    console.log(`[prerender] ${route} -> ${path.relative(rootDir, outPath)}`);
  }

  // The SSR bundle is only needed during this script.
  await fs.rm(serverDir, { recursive: true, force: true });
  console.log(`[prerender] done: ${routes.length} routes.`);
};

await main();

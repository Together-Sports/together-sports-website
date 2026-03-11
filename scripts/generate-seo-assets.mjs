import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const blogPostsFile = path.join(rootDir, "src", "data", "blogPosts.ts");
const headerLogoFile = path.join(publicDir, "headerlogo.svg");

const normalizeSiteUrl = (value) => {
  const fallback = "https://www.togethersports.org";
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

const staticRoutes = [
  "/",
  "/sports",
  "/sports/tennis",
  "/sports/basketball",
  "/sports/football",
  "/sports/golf",
  "/team",
  "/experiences",
  "/blog",
  "/partners",
  "/contact",
  "/get-involved",
];

const extractBlogSlugs = async () => {
  try {
    const source = await fs.readFile(blogPostsFile, "utf8");
    const slugMatches = [...source.matchAll(/"slug":\s*"([^"]+)"/g)];
    return [...new Set(slugMatches.map((match) => `/blog/${match[1]}`))];
  } catch {
    return [];
  }
};

const buildSitemapXml = (routes) => {
  const lastmod = new Date().toISOString();
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route.startsWith("/sports/") ? "0.8" : "0.7"}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

const buildRobotsTxt = () => `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

const buildManifest = () =>
  JSON.stringify(
    {
      name: "Together Sports",
      short_name: "Together Sports",
      description:
        "Together Sports empowers youth through free sports programs, mentorship, and community building.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#020367",
      icons: [
        {
          src: "/headerlogo.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/favicon.png",
          sizes: "256x256",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  );

const generateIconPngs = async () => {
  const [faviconPng, appleTouchPng] = await Promise.all([
    sharp(headerLogoFile)
      .resize(256, 256, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer(),
    sharp(headerLogoFile)
      .resize(180, 180, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer(),
  ]);

  await Promise.all([
    fs.writeFile(path.join(publicDir, "favicon.png"), faviconPng),
    fs.writeFile(path.join(publicDir, "apple-touch-icon.png"), appleTouchPng),
  ]);
};

const main = async () => {
  const blogRoutes = await extractBlogSlugs();
  const allRoutes = [...new Set([...staticRoutes, ...blogRoutes])];

  await fs.mkdir(publicDir, { recursive: true });
  await generateIconPngs();
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), buildSitemapXml(allRoutes), "utf8");
  await fs.writeFile(path.join(publicDir, "robots.txt"), buildRobotsTxt(), "utf8");
  await fs.writeFile(path.join(publicDir, "site.webmanifest"), buildManifest(), "utf8");
};

await main();

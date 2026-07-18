import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.tsx";
import { resolveLiveContent } from "./lib/editable-content";
import type { EditableContentState } from "./lib/editable-content-format";
import "./index.css";

const container = document.getElementById("root")!;

const mount = (initialContent?: EditableContentState) => {
  createRoot(container).render(
    <>
      <App initialContent={initialContent} />
      <SpeedInsights />
    </>,
  );
};

const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

// Pages are statically prerendered at build time; each prerendered page
// stamps its route into this meta tag. When the served HTML matches the
// current route, the static markup is already showing the site — so fetch
// the live content FIRST and only then let React take over, swapping the
// static page for the live one in a single seamless commit (no loading
// screen, no blank frame).
const marker = document
  .querySelector('meta[name="ts-prerender"]')
  ?.getAttribute("content");
const prerenderMatchesRoute =
  Boolean(marker) &&
  normalizePath(marker as string) === normalizePath(window.location.pathname);

if (container.childElementCount > 0 && !prerenderMatchesRoute) {
  // The SPA fallback served some other route's prerendered HTML (e.g. a
  // blog post URL got the homepage shell). Clear it immediately so the
  // wrong page never flashes, then boot exactly like the classic SPA.
  container.innerHTML = "";
}

if (container.childElementCount > 0 && prerenderMatchesRoute) {
  const timeout = new Promise<null>((resolve) => {
    window.setTimeout(() => resolve(null), 4000);
  });

  Promise.race([resolveLiveContent(), timeout])
    .then((content) => mount(content ?? undefined))
    .catch(() => mount());
} else {
  mount();
}

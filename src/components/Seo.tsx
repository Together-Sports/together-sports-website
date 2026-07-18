import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useEditableContent } from "@/lib/editable-content";
import {
  SITE_NAME,
  getMetaForPath,
  buildStructuredData,
} from "@/lib/seo-meta";

const setMetaContent = (selector: string, content: string, attribute: "name" | "property" = "name") => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${selector}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, selector);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const setLinkHref = (rel: string, href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const Seo = () => {
  const location = useLocation();
  const { blogPosts } = useEditableContent();

  useEffect(() => {
    const { pathname, search } = location;
    const origin = window.location.origin;
    const currentUrl = `${origin}${pathname}${search}`;
    const imageUrl = new URL("/EMBEDPIC.png", origin).toString();
    const appleTouchUrl = new URL("/apple-touch-icon.png?v=6", origin).toString();
    const meta = getMetaForPath(pathname, blogPosts);

    document.title = meta.title;

    setMetaContent("description", meta.description);
    setMetaContent("robots", meta.robots || "index, follow");
    setMetaContent("og:title", meta.title, "property");
    setMetaContent("og:description", meta.description, "property");
    setMetaContent("og:type", pathname === "/" ? "website" : "article", "property");
    setMetaContent("og:site_name", SITE_NAME, "property");
    setMetaContent("og:url", currentUrl, "property");
    setMetaContent("og:image", imageUrl, "property");
    setMetaContent("og:image:alt", "Together Sports social preview", "property");
    setMetaContent("og:image:width", "1920", "property");
    setMetaContent("og:image:height", "1080", "property");
    setMetaContent("twitter:card", "summary_large_image");
    setMetaContent("twitter:title", meta.title);
    setMetaContent("twitter:description", meta.description);
    setMetaContent("twitter:image", imageUrl);
    setLinkHref("canonical", currentUrl);
    setLinkHref("icon", new URL("/favicon.png?v=6", origin).toString());
    setLinkHref("shortcut icon", new URL("/favicon.png?v=6", origin).toString());
    setLinkHref("apple-touch-icon", appleTouchUrl);

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo="organization"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "organization";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(
      buildStructuredData(pathname, origin, meta)
    );
  }, [location, blogPosts]);

  return null;
};

export default Seo;

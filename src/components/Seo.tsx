import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useEditableContent } from "@/lib/editable-content";

type MetaConfig = {
  title: string;
  description: string;
  robots?: string;
};

const SITE_NAME = "Together Sports";
const DEFAULT_DESCRIPTION =
  "Together Sports is a youth-led nonprofit building stronger communities through free sports programs, mentorship, and inclusive access.";

const socialLinks = [
  "https://www.instagram.com/togethertennis/",
  "https://www.tiktok.com/@together_sports",
  "https://www.linkedin.com/company/108267093/",
];

const formatSportName = (value: string) => {
  switch (value) {
    case "basketball":
      return "Basketball";
    case "football":
      return "Football";
    case "golf":
      return "Golf";
    default:
      return "Tennis";
  }
};

const getMetaForPath = (pathname: string, blogPosts: ReturnType<typeof useEditableContent>["blogPosts"]): MetaConfig => {
  if (pathname === "/") {
    return {
      title: `${SITE_NAME} | Play Loud. Build Strong.`,
      description:
        "Together Sports empowers youth through free sports programs, mentorship, and community building across tennis, basketball, football, and golf.",
    };
  }

  if (pathname === "/team") {
    return {
      title: `Meet The Team | ${SITE_NAME}`,
      description:
        "Meet the coaches, mentors, staff, and founders behind Together Sports and the community-first work shaping each program.",
    };
  }

  if (pathname === "/sports") {
    return {
      title: `Our Sports | ${SITE_NAME}`,
      description:
        "Explore Together Sports programs across tennis, basketball, football, and golf, each built to grow skills, confidence, and community.",
    };
  }

  if (pathname === "/experiences") {
    return {
      title: `Our Experiences | ${SITE_NAME}`,
      description:
        "Read athlete and parent testimonials, explore photos, and watch moments from Together Sports programs and community experiences.",
    };
  }

  if (pathname === "/blog") {
    return {
      title: `The Blog | ${SITE_NAME}`,
      description:
        "Stories, updates, and moments from Together Sports, all in one place on the site.",
    };
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    const post = blogPosts.find((entry) => entry.slug === slug);

    return {
      title: post ? `${post.title} | ${SITE_NAME}` : `Blog Post | ${SITE_NAME}`,
      description: post?.excerpt || DEFAULT_DESCRIPTION,
    };
  }

  if (pathname === "/partners") {
    return {
      title: `Partners | ${SITE_NAME}`,
      description:
        "See the organizations and collaborators helping Together Sports expand access, build community, and support youth through athletics.",
    };
  }

  if (pathname === "/contact") {
    return {
      title: `Contact Us | ${SITE_NAME}`,
      description:
        "Contact Together Sports for partnerships, volunteering, program questions, support, and community inquiries.",
    };
  }

  if (pathname === "/get-involved") {
    return {
      title: `Get Involved | ${SITE_NAME}`,
      description:
        "Support Together Sports by donating, volunteering, or partnering to help expand youth access to inclusive sports programming.",
    };
  }

  if (pathname.startsWith("/sports/")) {
    const sportSlug = pathname.replace("/sports/", "");
    const sportName = formatSportName(sportSlug);

    return {
      title: `${sportName} | ${SITE_NAME}`,
      description: `Explore ${sportName.toLowerCase()} programs, registration details, and youth sports opportunities with Together Sports.`,
    };
  }

  if (pathname === "/admin") {
    return {
      title: `Admin | ${SITE_NAME}`,
      description: "Together Sports content administration panel.",
      robots: "noindex, nofollow",
    };
  }

  return {
    title: `${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  };
};

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
    const logoUrl = new URL("/headerlogo.svg", origin).toString();
    const appleTouchUrl = new URL("/apple-touch-icon.png?v=5", origin).toString();
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
    setLinkHref("icon", new URL("/favicon.ico?v=5", origin).toString());
    setLinkHref("shortcut icon", new URL("/favicon.ico?v=5", origin).toString());
    setLinkHref("apple-touch-icon", appleTouchUrl);

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: origin,
      logo: logoUrl,
      image: imageUrl,
      sameAs: socialLinks,
      description: DEFAULT_DESCRIPTION,
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: origin,
      description: DEFAULT_DESCRIPTION,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
      hasPart: [
        `${origin}/sports`,
        `${origin}/team`,
        `${origin}/experiences`,
        `${origin}/blog`,
        `${origin}/partners`,
        `${origin}/contact`,
      ].map((url) => ({
        "@type": "WebPage",
        url,
      })),
    };

    const pageSchema = {
      "@context": "https://schema.org",
      "@type": pathname === "/" ? "WebPage" : pathname.startsWith("/blog/") ? "Article" : "CollectionPage",
      name: meta.title,
      url: currentUrl,
      description: meta.description,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: origin,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    };

    let script = document.head.querySelector<HTMLScriptElement>('script[data-seo="organization"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "organization";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify([organizationSchema, websiteSchema, pageSchema]);
  }, [location, blogPosts]);

  return null;
};

export default Seo;

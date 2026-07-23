import type { BlogPost } from "@/data/blogPosts";

// Single source of truth for per-route SEO metadata. Used by the client-side
// <Seo /> component and by scripts/prerender.mjs (via the SSR bundle), so the
// tags baked into the static HTML and the ones managed at runtime never drift.

export type MetaConfig = {
  title: string;
  description: string;
  robots?: string;
};

export const SITE_NAME = "Together Sports";
export const DEFAULT_DESCRIPTION =
  "Together Sports is a youth-led nonprofit building stronger communities through free sports programs, mentorship, and inclusive access.";

export const socialLinks = [
  "https://www.instagram.com/togethersportsorg",
  "https://www.tiktok.com/@together_sports",
  "https://www.linkedin.com/company/108267093/",
];

const formatSportName = (value: string) => {
  switch (value) {
    case "basketball":
      return "Basketball";
    case "football":
      return "Football";
    case "soccer":
      return "Soccer";
    case "golf":
      return "Golf";
    default:
      return "Tennis";
  }
};

export const getMetaForPath = (
  pathname: string,
  blogPosts: BlogPost[]
): MetaConfig => {
  if (pathname === "/") {
    return {
      title: `${SITE_NAME} | Every Kid Plays. Every Kid Belongs.`,
      description:
        "Together Sports empowers youth through free sports programs, mentorship, and community building across tennis, basketball, football, soccer, and golf.",
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
        "Explore Together Sports programs across tennis, basketball, football, soccer, and golf, each built to grow skills, confidence, and community.",
    };
  }

  if (pathname === "/experiences") {
    return {
      title: `Our Experiences | ${SITE_NAME}`,
      description:
        "Read athlete and parent testimonials about Together Sports programs, coaches, and community experiences.",
    };
  }

  if (pathname === "/moments") {
    return {
      title: `Moments Captured | ${SITE_NAME}`,
      description:
        "Browse photos and videos from Together Sports sessions, events, and communities.",
    };
  }

  if (pathname === "/press") {
    return {
      title: `Press | ${SITE_NAME}`,
      description:
        "Read news coverage and press articles about Together Sports and its mission to expand youth access to inclusive sports.",
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

// Structured data shared by the runtime <Seo /> component and the prerender.
export const buildStructuredData = (
  pathname: string,
  origin: string,
  meta: MetaConfig
) => {
  const currentUrl = `${origin}${pathname === "/" ? "" : pathname}`;
  const imageUrl = `${origin}/EMBEDPIC.png`;
  const logoUrl = `${origin}/SPORTSTOGETHERHANDLOGO.png`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    name: SITE_NAME,
    url: origin,
    logo: logoUrl,
    image: imageUrl,
    sameAs: socialLinks,
    description: DEFAULT_DESCRIPTION,
    areaServed: "New York City",
    nonprofitStatus: "Nonprofit501c3",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "NonprofitOrganization",
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
      `${origin}/moments`,
      `${origin}/blog`,
      `${origin}/press`,
      `${origin}/partners`,
      `${origin}/contact`,
    ].map((url) => ({
      "@type": "WebPage",
      url,
    })),
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type":
      pathname === "/"
        ? "WebPage"
        : pathname.startsWith("/blog/")
          ? "Article"
          : "CollectionPage",
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

  return [organizationSchema, websiteSchema, pageSchema];
};

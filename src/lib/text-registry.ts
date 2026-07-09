// Central registry of editable page text. Each entry's default is the text
// shipped with the site; admins override entries via the Page Text tab and
// overrides are stored in siteText.textOverrides keyed by these ids.
export type TextField = {
  key: string;
  label: string;
  page: string;
  fallback: string;
  multiline?: boolean;
};

export const TEXT_FIELDS: TextField[] = [
  // Home
  { key: "home.missionHeading", label: "Mission Heading", page: "Home", fallback: "Our Mission" },
  { key: "home.valuesHeading", label: "Values Heading", page: "Home", fallback: "What We Stand For" },
  { key: "home.sportsCtaButton", label: "Sports Section Button", page: "Home", fallback: "View All Sports" },
  { key: "home.locationHeading", label: "Location Heading", page: "Home", fallback: "Main Location" },
  { key: "home.locationSubtitle", label: "Location Subtitle", page: "Home", fallback: "Based in New York City, serving communities across the five boroughs.", multiline: true },
  { key: "home.secondServeEyebrow", label: "Second Serve Eyebrow", page: "Home", fallback: "Featured Service" },
  { key: "home.secondServeHeading", label: "Second Serve Heading", page: "Home", fallback: "Every Kid Deserves a Second Serve" },
  { key: "home.secondServeBody", label: "Second Serve Text", page: "Home", fallback: "Second Serve is a service from our partner Rally Forward NYC, and it also inspires a Together Tennis initiative where we collect quality used equipment that would otherwise be thrown away and donate it back into the community.", multiline: true },
  { key: "home.secondServeButton", label: "Second Serve Button", page: "Home", fallback: "Learn More" },

  // Sports overview
  { key: "sports.heroTitle", label: "Hero Title", page: "Sports", fallback: "Our Sports" },
  { key: "sports.heroSubtitle", label: "Hero Subtitle", page: "Sports", fallback: "Five sports. One mission. Building the next generation of leaders through access, mentorship, and play.", multiline: true },
  { key: "sports.footnote", label: "Footnote", page: "Sports", fallback: "Each program is designed to build skills, character, and community.", multiline: true },

  // Sport detail pages (shared by every sport)
  { key: "sport.aboutHeading", label: "About Heading", page: "Sport Pages", fallback: "About the Program" },
  { key: "sport.sessionsHeading", label: "Sessions Heading", page: "Sport Pages", fallback: "Upcoming Sessions" },
  { key: "sport.waitlistHeading", label: "Waitlist Heading", page: "Sport Pages", fallback: "Ready to Enter the Waitlist?" },
  { key: "sport.waitlistBody", label: "Waitlist Text", page: "Sport Pages", fallback: "Join the waitlist and we will reach out as soon as space opens up for this sport.", multiline: true },
  { key: "sport.waitlistButton", label: "Waitlist Button", page: "Sport Pages", fallback: "Join Waitlist →" },
  { key: "sport.registerHeading", label: "Tennis Register Heading", page: "Sport Pages", fallback: "Ready to Register?" },
  { key: "sport.registerBody", label: "Tennis Register Text", page: "Sport Pages", fallback: "Sign up through USTA or contact us directly to join the program.", multiline: true },
  { key: "sport.contactButton", label: "Contact Button", page: "Sport Pages", fallback: "Contact Us" },

  // Team
  { key: "team.heroTitle", label: "Hero Title", page: "Team", fallback: "Meet The Team" },
  { key: "team.heroSubtitle", label: "Hero Subtitle", page: "Team", fallback: "The people behind Together Sports are coaches, mentors, athletes, and community builders creating spaces where young people can grow through sport.", multiline: true },
  { key: "team.ctaButton", label: "Bottom Button", page: "Team", fallback: "Get in Touch" },

  // Experiences
  { key: "experiences.heroTitle", label: "Hero Title", page: "Experiences", fallback: "Our Experiences" },
  { key: "experiences.heroSubtitle", label: "Hero Subtitle", page: "Experiences", fallback: "Hear from the athletes, families, and coaches who make Together Sports what it is — in their own words.", multiline: true },
  { key: "experiences.parentsHeading", label: "Parents Heading", page: "Experiences", fallback: "Parents Speak" },
  { key: "experiences.athletesHeading", label: "Athletes Heading", page: "Experiences", fallback: "Athletes Speak" },
  { key: "experiences.ctaHeading", label: "Bottom CTA Heading", page: "Experiences", fallback: "See the Moments Behind the Words" },
  { key: "experiences.ctaBody", label: "Bottom CTA Text", page: "Experiences", fallback: "Browse photos and videos from sessions, events, and communities across Together Sports.", multiline: true },
  { key: "experiences.ctaButton", label: "Bottom CTA Button", page: "Experiences", fallback: "View Moments Captured →" },

  // Moments
  { key: "moments.heroTitle", label: "Hero Title", page: "Moments", fallback: "Moments Captured" },
  { key: "moments.heroSubtitle", label: "Hero Subtitle", page: "Moments", fallback: "Snapshots from the courts, fields, and communities where Together Sports comes to life.", multiline: true },
  { key: "moments.videosHeading", label: "Videos Heading", page: "Moments", fallback: "On Video" },
  { key: "moments.ctaHeading", label: "Bottom CTA Heading", page: "Moments", fallback: "The Stories Behind the Smiles" },
  { key: "moments.ctaBody", label: "Bottom CTA Text", page: "Moments", fallback: "Hear what athletes and parents say about their time with Together Sports.", multiline: true },
  { key: "moments.ctaButton", label: "Bottom CTA Button", page: "Moments", fallback: "Read Testimonials →" },

  // Blog
  { key: "blog.heroTitle", label: "Hero Title", page: "Blog", fallback: "The Blog" },
  { key: "blog.heroSubtitle", label: "Hero Subtitle", page: "Blog", fallback: "Stories, updates, and moments from Together Sports, all in one place on the site.", multiline: true },

  // Contact
  { key: "contact.heroTitle", label: "Hero Title", page: "Contact", fallback: "Contact Us" },
  { key: "contact.heroSubtitle", label: "Hero Subtitle", page: "Contact", fallback: "Questions, partnerships, volunteering, or support requests, reach out and we will point you in the right direction.", multiline: true },

  // Partners
  { key: "partners.heading", label: "Hero Title", page: "Partners", fallback: "Meet Our Partners" },
  { key: "partners.whyHeading", label: "Why Partner Heading", page: "Partners", fallback: "Why Partner With Us?" },
  { key: "partners.why1Title", label: "Why Card 1 Title", page: "Partners", fallback: "Community Reach" },
  { key: "partners.why1Body", label: "Why Card 1 Text", page: "Partners", fallback: "Your brand connects with hundreds of families across local sports programs, events, and social media.", multiline: true },
  { key: "partners.why2Title", label: "Why Card 2 Title", page: "Partners", fallback: "Shared Values" },
  { key: "partners.why2Body", label: "Why Card 2 Text", page: "Partners", fallback: "Align with a mission that champions teamwork, inclusivity, and youth development through sport.", multiline: true },
  { key: "partners.why3Title", label: "Why Card 3 Title", page: "Partners", fallback: "Digital Feature" },
  { key: "partners.why3Body", label: "Why Card 3 Text", page: "Partners", fallback: "Featured on our website and social media so supporters can see the organizations helping our mission grow.", multiline: true },
  { key: "partners.ctaHeading", label: "Bottom CTA Heading", page: "Partners", fallback: "Get Involved" },
  { key: "partners.ctaBody", label: "Bottom CTA Text", page: "Partners", fallback: "Interested in supporting Together Sports? Head to our Get Involved page to explore ways to partner, volunteer, and help us create more opportunities for youth.", multiline: true },
  { key: "partners.ctaButton", label: "Bottom CTA Button", page: "Partners", fallback: "Get Involved" },
  { key: "partners.perksTitle", label: "Perks Card Title", page: "Partners", fallback: "What You Get" },

  // Get Involved
  { key: "getInvolved.heroTitle", label: "Hero Title", page: "Get Involved", fallback: "Get Involved" },
  { key: "getInvolved.card1Title", label: "Card 1 Title", page: "Get Involved", fallback: "Donate" },
  { key: "getInvolved.card1Body", label: "Card 1 Text", page: "Get Involved", fallback: "Fund equipment, coaching, transportation, and programs that open the door for more young athletes to play.", multiline: true },
  { key: "getInvolved.card1Button", label: "Card 1 Button", page: "Get Involved", fallback: "Give Now" },
  { key: "getInvolved.card2Title", label: "Card 2 Title", page: "Get Involved", fallback: "Volunteer" },
  { key: "getInvolved.card2Body", label: "Card 2 Text", page: "Get Involved", fallback: "Coach, mentor, support sessions, or help organize community events that make every program run stronger.", multiline: true },
  { key: "getInvolved.card2Button", label: "Card 2 Button", page: "Get Involved", fallback: "Sign Up" },
  { key: "getInvolved.card3Title", label: "Card 3 Title", page: "Get Involved", fallback: "Partner" },
  { key: "getInvolved.card3Body", label: "Card 3 Text", page: "Get Involved", fallback: "Bring your school, organization, or business into the mission and help expand access through collaboration.", multiline: true },
  { key: "getInvolved.card3Button", label: "Card 3 Button", page: "Get Involved", fallback: "Learn More" }
];

const fallbackByKey = new Map(TEXT_FIELDS.map((field) => [field.key, field.fallback]));

export const resolveText = (
  overrides: Record<string, string> | undefined,
  key: string
): string => {
  const override = overrides?.[key];

  if (typeof override === "string" && override.trim()) {
    return override;
  }

  return fallbackByKey.get(key) ?? "";
};

export const TEXT_PAGES = [...new Set(TEXT_FIELDS.map((field) => field.page))];

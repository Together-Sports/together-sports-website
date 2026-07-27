import heroImage from "@/assets/hero-sports.jpg";
import image0903 from "@/assets/IMG_0903.jpg";
import image3782 from "@/assets/IMG_3782.jpg";
import mentorshipImg from "@/assets/mentorship.jpg";

export type TeamPerson = {
  id: string;
  name: string;
  role: string;
  location?: string;
  // Shorter location shown on phones. When empty, the site shortens the
  // location automatically (e.g. "Morganville, NJ" -> "New Jersey").
  locationMobile?: string;
  image: string;
  alt: string;
  description?: string;
  socialLinks?: TeamSocialLink[];
};

export type TeamSocialPlatform = "instagram" | "linkedin" | "tiktok";

export type TeamSocialLink = {
  id: string;
  platform: TeamSocialPlatform;
  href: string;
};

export type TeamSection = {
  id: string;
  title: string;
  color: string;
  people: TeamPerson[];
};

const teamSections: TeamSection[] = [
  {
    id: "founder",
    title: "Founder",
    color: "#4f74d6",
    people: [
      {
        id: "founder-1",
        name: "Founder Name",
        role: "Founder & Executive Director",
        image: heroImage,
        alt: "Founder placeholder",
        description: "Builds the long-term vision, partnerships, and day-to-day leadership that keep Together Sports moving.",
      },
    ],
  },
  {
    id: "staff",
    title: "Staff",
    color: "#87cb4a",
    people: [
      {
        id: "staff-1",
        name: "Staff Name",
        role: "Program Manager",
        image: mentorshipImg,
        alt: "Staff placeholder",
        description: "Helps coordinate programming, logistics, and communication so every session runs smoothly for families.",
      },
      {
        id: "staff-2",
        name: "Staff Name",
        role: "Operations Coordinator",
        image: heroImage,
        alt: "Staff placeholder",
        description: "Supports registration, scheduling, and community outreach across sports and events.",
      },
      {
        id: "staff-3",
        name: "Staff Name",
        role: "Community Support",
        image: image3782,
        alt: "Staff placeholder",
        description: "Keeps athletes and families connected to resources, updates, and volunteer support.",
      },
    ],
  },
  {
    id: "coaches",
    title: "Coaches",
    color: "#f6a15c",
    people: [
      {
        id: "coach-1",
        name: "Coach Name",
        role: "Head Coach",
        image: image0903,
        alt: "Coach placeholder",
        description: "Leads sessions with a focus on fundamentals, confidence, and consistent growth.",
      },
      {
        id: "coach-2",
        name: "Coach Name",
        role: "Assistant Coach",
        image: mentorshipImg,
        alt: "Coach placeholder",
        description: "Supports drills, encouragement, and individual attention during practice and events.",
      },
      {
        id: "coach-3",
        name: "Coach Name",
        role: "Youth Development Coach",
        image: heroImage,
        alt: "Coach placeholder",
        description: "Connects mentorship and athletics to help players grow on and off the court.",
      },
    ],
  },
];

export default teamSections;

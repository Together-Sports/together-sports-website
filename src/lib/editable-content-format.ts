import { blogPosts as defaultBlogPosts, type BlogPost } from "@/data/blogPosts";
import type { Experience } from "@/data/experiences";
import { mediaLibrary } from "@/data/mediaLibrary";
import type { Partner } from "@/data/partners";
import type { TeamSection } from "@/data/team";

export type TennisLessonVideo = {
  id: string;
  title: string;
  youtubeUrl: string;
};

export type ImpactMetric = {
  id: string;
  title: string;
  value: string;
  color: string;
};

export type ImpactMetricsSection = {
  isVisible: boolean;
  items: ImpactMetric[];
};

export type OtherLocation = {
  id: string;
  name: string;
  embedUrl: string;
};

export type OtherLocationsSection = {
  title: string;
  items: OtherLocation[];
};

export type SportSession = {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  spotsLabel: string;
  signupUrl: string;
  isRecurring?: boolean;
};

export type SportDescription = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  schedule: string[];
  sessions?: SportSession[];
};

export type SiteNavItem = {
  label: string;
  path: string;
  dropdown?: { label: string; path: string; color?: string }[];
};

export type SiteValue = {
  title: string;
  desc: string;
  bg?: string;
};

export type SiteText = {
  navItems: SiteNavItem[];
  hero: { lines: string[]; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  mission: string[];
  values: SiteValue[];
  sportsSection: { title: string; subtitle: string };
  testimonials: { title: string; subtitle: string };
  heroImage1?: string;
  heroImage2?: string;
  heroImage3?: string;
  missionImage?: string;
  missionVideo?: string;
  introVideo?: string;
  // Lets the intro video be switched off without losing the saved video, so
  // it can be turned back on later. Defaults to enabled (true) when a video
  // is set but this key is absent, for content saved before this existed.
  introVideoEnabled?: boolean;
  // Seconds for one full loop of the partner-logo carousel (default 24).
  partnersMarqueeSeconds?: number;
  textOverrides?: Record<string, string>;
  secondServeImage?: string;
};

export type EditableContentState = {
  blogPosts: BlogPost[];
  experiences: Experience[];
  partners: Partner[];
  teamSections: TeamSection[];
  tennisLessonVideos: TennisLessonVideo[];
  impactMetricsSection: ImpactMetricsSection;
  otherLocationsSection: OtherLocationsSection;
  sportDescriptions: SportDescription[];
  siteText: SiteText;
};

export type PortableEditableContentState = EditableContentState;

export type EditableContentExportFile = {
  version: 1;
  exportedAt: string;
  content: PortableEditableContentState;
};

const MEDIA_PREFIX = "media:";
const POSITION_MARKER = "#pos=";

const mediaIdBySrc = new Map(mediaLibrary.map((item) => [item.src, item.id]));
const mediaSrcById = new Map(mediaLibrary.map((item) => [item.id, item.src]));

// Image values may carry an inline focal point ("...#pos=x,y"); split it off
// before mapping the base src to/from a media id and re-attach it after.
const splitPositionFragment = (value: string): [string, string] => {
  const markerIndex = value.indexOf(POSITION_MARKER);
  return markerIndex === -1
    ? [value, ""]
    : [value.slice(0, markerIndex), value.slice(markerIndex)];
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasLegacyContentShape = (
  value: unknown,
): value is Omit<PortableEditableContentState, "blogPosts"> & { blogPosts?: BlogPost[] } =>
  isPlainObject(value) &&
  Array.isArray(value.experiences) &&
  Array.isArray(value.partners) &&
  Array.isArray(value.teamSections);

const toPortableMediaValue = (value: string | undefined) => {
  if (!value) {
    return value ?? "";
  }

  const [base, fragment] = splitPositionFragment(value);
  const mediaId = mediaIdBySrc.get(base);
  return mediaId ? `${MEDIA_PREFIX}${mediaId}${fragment}` : value;
};

const fromPortableMediaValue = (value: string | undefined) => {
  if (!value) {
    return value ?? "";
  }

  const [base, fragment] = splitPositionFragment(value);

  if (!base.startsWith(MEDIA_PREFIX)) {
    return value;
  }

  const mediaId = base.slice(MEDIA_PREFIX.length);
  const src = mediaSrcById.get(mediaId);
  return src ? `${src}${fragment}` : value;
};

export const serializeEditableContentState = (
  content: EditableContentState,
): PortableEditableContentState => ({
  blogPosts: content.blogPosts.map((item) => ({
    ...item,
    image: item.image ? toPortableMediaValue(item.image) : item.image,
  })),
  experiences: content.experiences.map((item) => ({
    ...item,
    image: toPortableMediaValue(item.image),
    images: Array.isArray(item.images) ? item.images.map((src) => toPortableMediaValue(src)) : undefined,
  })),
  partners: content.partners.map((item) => ({
    ...item,
    logo: toPortableMediaValue(item.logo),
  })),
  teamSections: content.teamSections.map((section) => ({
    ...section,
    people: section.people.map((person) => ({
      ...person,
      image: toPortableMediaValue(person.image),
    })),
  })),
  tennisLessonVideos: content.tennisLessonVideos.map((item) => ({
    ...item,
  })),
  impactMetricsSection: {
    isVisible: Boolean(content.impactMetricsSection?.isVisible),
    items: Array.isArray(content.impactMetricsSection?.items)
      ? content.impactMetricsSection.items.map((item) => ({ ...item }))
      : [],
  },
  otherLocationsSection: {
    title: typeof content.otherLocationsSection?.title === "string" ? content.otherLocationsSection.title : "",
    items: Array.isArray(content.otherLocationsSection?.items)
      ? content.otherLocationsSection.items.map((item) => ({ ...item }))
      : [],
  },
  sportDescriptions: Array.isArray(content.sportDescriptions)
    ? content.sportDescriptions.map((item) => ({
        ...item,
        sessions: Array.isArray(item.sessions)
          ? item.sessions.map((session) => ({ ...session }))
          : [],
      }))
    : [],
  siteText: content.siteText ? {
    ...content.siteText,
    heroImage1: toPortableMediaValue(content.siteText.heroImage1),
    heroImage2: toPortableMediaValue(content.siteText.heroImage2),
    heroImage3: toPortableMediaValue(content.siteText.heroImage3),
    missionImage: toPortableMediaValue(content.siteText.missionImage),
    secondServeImage: toPortableMediaValue(content.siteText.secondServeImage),
    introVideoEnabled: content.siteText.introVideoEnabled !== false
  } : {
    navItems: [],
    hero: { lines: [], subtitle: "", ctaPrimary: "", ctaSecondary: "" },
    mission: [],
    values: [],
    sportsSection: { title: "Our Sports", subtitle: "" },
    testimonials: { title: "Testimonials", subtitle: "" },
    heroImage1: "",
    heroImage2: "",
    heroImage3: "",
    missionImage: "",
    missionVideo: "",
    introVideo: "",
    introVideoEnabled: true,
    secondServeImage: ""
  },
});

export const hydrateEditableContentState = (
  content: PortableEditableContentState,
): EditableContentState => ({
  blogPosts: content.blogPosts.map((item) => ({
    ...item,
    image: item.image ? fromPortableMediaValue(item.image) : item.image,
  })),
  experiences: content.experiences.map((item) => ({
    ...item,
    image: fromPortableMediaValue(item.image),
    images: Array.isArray(item.images) ? item.images.map((src) => fromPortableMediaValue(src)) : undefined,
  })),
  partners: content.partners.map((item) => ({
    ...item,
    logo: fromPortableMediaValue(item.logo),
  })),
  teamSections: content.teamSections.map((section) => ({
    ...section,
    people: section.people.map((person) => ({
      ...person,
      image: fromPortableMediaValue(person.image),
    })),
  })),
  tennisLessonVideos: Array.isArray(content.tennisLessonVideos) ? content.tennisLessonVideos.map((item) => ({ ...item })) : [],
  impactMetricsSection:
    content.impactMetricsSection && Array.isArray(content.impactMetricsSection.items)
      ? {
          isVisible: Boolean(content.impactMetricsSection.isVisible),
          items: content.impactMetricsSection.items.map((item) => ({ ...item })),
        }
      : {
          isVisible: false,
          items: [],
        },
  otherLocationsSection:
    content.otherLocationsSection && Array.isArray(content.otherLocationsSection.items)
      ? {
          title: typeof content.otherLocationsSection.title === "string" ? content.otherLocationsSection.title : "",
          items: content.otherLocationsSection.items.map((item) => ({ ...item })),
        }
      : {
          title: "Other Locations",
          items: [],
        },
  sportDescriptions: Array.isArray(content.sportDescriptions)
    ? content.sportDescriptions.map((item) => ({
        ...item,
        sessions: Array.isArray(item.sessions)
          ? item.sessions.map((session) => ({ ...session }))
          : [],
      }))
    : [],
  siteText:
    content.siteText && isPlainObject(content.siteText)
      ? {
          navItems: Array.isArray((content.siteText as any).navItems)
            ? (content.siteText as any).navItems.map((n: any) => ({ ...n }))
            : [],
          hero: isPlainObject((content.siteText as any).hero)
            ? { ...((content.siteText as any).hero) }
            : { lines: [], subtitle: "", ctaPrimary: "", ctaSecondary: "" },
          mission: Array.isArray((content.siteText as any).mission)
            ? (content.siteText as any).mission.map((p: any) => String(p))
            : [],
          values: Array.isArray((content.siteText as any).values)
            ? (content.siteText as any).values.map((v: any) => ({ ...v }))
            : [],
          sportsSection: isPlainObject((content.siteText as any).sportsSection)
            ? { ...((content.siteText as any).sportsSection) }
            : { title: "Our Sports", subtitle: "" },
          testimonials: isPlainObject((content.siteText as any).testimonials)
            ? { ...((content.siteText as any).testimonials) }
            : { title: "Testimonials", subtitle: "" },
          textOverrides: isPlainObject((content.siteText as any).textOverrides)
            ? Object.fromEntries(
                Object.entries((content.siteText as any).textOverrides).filter(
                  (entry): entry is [string, string] => typeof entry[1] === "string",
                ),
              )
            : {},
          heroImage1: fromPortableMediaValue((content.siteText as any).heroImage1),
          heroImage2: fromPortableMediaValue((content.siteText as any).heroImage2),
          heroImage3: fromPortableMediaValue((content.siteText as any).heroImage3),
          missionImage: fromPortableMediaValue((content.siteText as any).missionImage),
          missionVideo:
            typeof (content.siteText as any).missionVideo === "string"
              ? (content.siteText as any).missionVideo
              : "",
          introVideo:
            typeof (content.siteText as any).introVideo === "string"
              ? (content.siteText as any).introVideo
              : "",
          introVideoEnabled: (content.siteText as any).introVideoEnabled !== false,
          partnersMarqueeSeconds:
            typeof (content.siteText as any).partnersMarqueeSeconds === "number" &&
            Number.isFinite((content.siteText as any).partnersMarqueeSeconds) &&
            (content.siteText as any).partnersMarqueeSeconds > 0
              ? (content.siteText as any).partnersMarqueeSeconds
              : undefined,
          secondServeImage: fromPortableMediaValue((content.siteText as any).secondServeImage)
        }
      : {
          navItems: [],
          hero: { lines: [], subtitle: "", ctaPrimary: "", ctaSecondary: "" },
          mission: [],
          values: [],
          sportsSection: { title: "Our Sports", subtitle: "" },
          testimonials: { title: "Testimonials", subtitle: "" },
          heroImage1: "",
          heroImage2: "",
          heroImage3: "",
          missionImage: "",
          missionVideo: "",
          introVideo: "",
          introVideoEnabled: true,
          secondServeImage: ""
        },
});

const hasContentShape = (value: unknown): value is PortableEditableContentState =>
  hasLegacyContentShape(value) && Array.isArray(value.blogPosts);

export const parseEditableContentImport = (input: unknown): EditableContentState => {
  if (hasContentShape(input)) {
    return hydrateEditableContentState(input);
  }

  if (hasLegacyContentShape(input)) {
    return hydrateEditableContentState({
      ...input,
      blogPosts: defaultBlogPosts,
      tennisLessonVideos: [],
      impactMetricsSection: {
        isVisible: false,
        items: [],
      },
      otherLocationsSection: {
        title: "Other Locations",
        items: [],
      },
      sportDescriptions: [],
    });
  }

  if (
    isPlainObject(input) &&
    input.version === 1 &&
    typeof input.exportedAt === "string" &&
    hasContentShape(input.content)
  ) {
    return hydrateEditableContentState(input.content);
  }

  if (
    isPlainObject(input) &&
    input.version === 1 &&
    typeof input.exportedAt === "string" &&
    hasLegacyContentShape(input.content)
  ) {
    return hydrateEditableContentState({
      ...input.content,
      blogPosts: defaultBlogPosts,
      tennisLessonVideos: [],
      impactMetricsSection: {
        isVisible: false,
        items: [],
      },
      otherLocationsSection: {
        title: "Other Locations",
        items: [],
      },
      sportDescriptions: [],
    });
  }

  throw new Error("Invalid content file. Expected an editable content export JSON file.");
};

export const createEditableContentExport = (
  content: EditableContentState,
): EditableContentExportFile => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  content: serializeEditableContentState(content),
});

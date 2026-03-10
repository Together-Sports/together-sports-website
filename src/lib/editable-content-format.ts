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

export type EditableContentState = {
  blogPosts: BlogPost[];
  experiences: Experience[];
  partners: Partner[];
  teamSections: TeamSection[];
  tennisLessonVideos: TennisLessonVideo[];
  impactMetricsSection: ImpactMetricsSection;
};

export type PortableEditableContentState = EditableContentState;

export type EditableContentExportFile = {
  version: 1;
  exportedAt: string;
  content: PortableEditableContentState;
};

const MEDIA_PREFIX = "media:";

const mediaIdBySrc = new Map(mediaLibrary.map((item) => [item.src, item.id]));
const mediaSrcById = new Map(mediaLibrary.map((item) => [item.id, item.src]));

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

  const mediaId = mediaIdBySrc.get(value);
  return mediaId ? `${MEDIA_PREFIX}${mediaId}` : value;
};

const fromPortableMediaValue = (value: string | undefined) => {
  if (!value) {
    return value ?? "";
  }

  if (!value.startsWith(MEDIA_PREFIX)) {
    return value;
  }

  const mediaId = value.slice(MEDIA_PREFIX.length);
  return mediaSrcById.get(mediaId) ?? value;
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

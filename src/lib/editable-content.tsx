import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";
import type { User } from "@supabase/supabase-js";
import type { BlogPost } from "@/data/blogPosts";
import type { Experience } from "@/data/experiences";
import editableContentSeed from "@/data/editableContentSeed";
import type { Partner } from "@/data/partners";
import type { PressArticle } from "@/data/press";
import type { TeamSection } from "@/data/team";
import {
  createEditableContentExport,
  serializeEditableContentState,
  hydrateEditableContentState,
  parseEditableContentImport,
  type AsSeenOnOutlet,
  type EditableContentExportFile,
  type EditableContentState,
  type ImpactMetricsSection,
  type OtherLocationsSection,
  type TennisLessonVideo,
  type SportDescription,
  type SiteText
} from "@/lib/editable-content-format";
import {
  isSupabaseConfigured,
  isAllowedAdminEmail,
  supabase,
  SUPABASE_SITE_CONTENT_ID,
  SUPABASE_SITE_MEDIA_BUCKET
} from "@/lib/supabase";

type EditableContentContextValue = EditableContentState & {
  setBlogPosts: Dispatch<SetStateAction<BlogPost[]>>;
  setExperiences: Dispatch<SetStateAction<Experience[]>>;
  setPartners: Dispatch<SetStateAction<Partner[]>>;
  pressArticles: PressArticle[];
  setPressArticles: Dispatch<SetStateAction<PressArticle[]>>;
  asSeenOnOutlets: AsSeenOnOutlet[];
  setAsSeenOnOutlets: Dispatch<SetStateAction<AsSeenOnOutlet[]>>;
  setTeamSections: Dispatch<SetStateAction<TeamSection[]>>;
  setTennisLessonVideos: Dispatch<SetStateAction<TennisLessonVideo[]>>;
  setImpactMetricsSection: Dispatch<SetStateAction<ImpactMetricsSection>>;
  setOtherLocationsSection: Dispatch<SetStateAction<OtherLocationsSection>>;
  setSportDescriptions: Dispatch<SetStateAction<SportDescription[]>>;
  siteText: SiteText;
  setSiteText: Dispatch<SetStateAction<SiteText>>;
  resetAll: () => void;
  saveContent: () => Promise<void>;
  refreshContent: () => Promise<void>;
  savePreviewDraft: () => void;
  uploadImage: (file: File) => Promise<string>;
  exportContent: () => EditableContentExportFile;
  importContent: (input: unknown) => void;
  hasUnsavedChanges: boolean;
  isLoadingContent: boolean;
  hasResolvedContent: boolean;
  isSaving: boolean;
  isSupabaseConfigured: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  userEmail: string | null;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const createDefaultContent = (): EditableContentState =>
  hydrateEditableContentState(editableContentSeed);
const createSerializedSnapshot = (content: EditableContentState) =>
  JSON.stringify(serializeEditableContentState(content));
const PREVIEW_DRAFT_STORAGE_KEY = "together-sports-preview-draft";
const UPLOAD_IMAGE_MAX_DIMENSION = 2200;
const UPLOAD_IMAGE_QUALITY = 0.86;

const mergeLiveBlogPosts = (savedPosts: BlogPost[], livePosts: BlogPost[]) =>
  livePosts.map((post) => {
    const savedPost = savedPosts.find((entry) => entry.slug === post.slug);

    return {
      ...post,
      featured: savedPost?.featured ?? false,
      tag: savedPost?.tag ?? ""
    };
  });

const withLiveBlogPosts = async (content: EditableContentState) => {
  if (typeof window === "undefined") {
    return content;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") === "1") {
    return content;
  }

  try {
    const response = await fetch("/api/blog-posts");
    if (!response.ok) {
      return content;
    }

    const payload = (await response.json()) as { posts?: BlogPost[] };
    if (!Array.isArray(payload.posts) || payload.posts.length === 0) {
      return content;
    }

    return {
      ...content,
      blogPosts: mergeLiveBlogPosts(content.blogPosts, payload.posts)
    };
  } catch (error) {
    console.error(error);
    return content;
  }
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to process that image."));
    };

    image.src = objectUrl;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to optimize that image."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });

const optimizeUploadImage = async (file: File) => {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return file;
  }

  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  const image = await loadImageElement(file);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale =
    longestSide > UPLOAD_IMAGE_MAX_DIMENSION
      ? UPLOAD_IMAGE_MAX_DIMENSION / longestSide
      : 1;
  const targetWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const targetHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const optimizedBlob = await canvasToBlob(
    canvas,
    "image/webp",
    UPLOAD_IMAGE_QUALITY
  );

  if (optimizedBlob.size >= file.size) {
    return file;
  }

  const optimizedName = file.name.replace(/\.[^/.]+$/, "") || "upload";
  return new File([optimizedBlob], `${optimizedName}.webp`, {
    type: "image/webp",
    lastModified: Date.now()
  });
};

const EditableContentContext =
  createContext<EditableContentContextValue | null>(null);
const defaultContent = createDefaultContent();
const defaultSnapshot = createSerializedSnapshot(defaultContent);

// Pure loader for the live site content. Used by the provider below, and by
// main.tsx to fetch content BEFORE React takes over from prerendered HTML so
// the static page can be swapped for the live one in a single, seamless
// commit. Returns null when Supabase isn't configured.
export const resolveLiveContent =
  async (): Promise<EditableContentState | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", SUPABASE_SITE_CONTENT_ID)
      .maybeSingle();

    if (error) {
      throw error;
    }

    let nextContent = data?.content
      ? parseEditableContentImport(data.content)
      : createDefaultContent();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const previewDraft = window.localStorage.getItem(
        PREVIEW_DRAFT_STORAGE_KEY
      );

      if (params.get("preview") === "1" && previewDraft) {
        try {
          nextContent = parseEditableContentImport(JSON.parse(previewDraft));
        } catch (error) {
          console.error(error);
        }
      }
    }

    nextContent = await withLiveBlogPosts(nextContent);

    // If the live content in Supabase is missing sport descriptions,
    // fall back to the local seed so detail pages (e.g. /sports/tennis)
    // still render on the deployed site.
    if (
      !Array.isArray(nextContent.sportDescriptions) ||
      nextContent.sportDescriptions.length === 0
    ) {
      nextContent.sportDescriptions = createDefaultContent().sportDescriptions;
    }

    return nextContent;
  };

export const EditableContentProvider = ({
  children,
  initialContent
}: {
  children: ReactNode;
  // When provided (prerender build, or a client boot that fetched live
  // content before mounting), the provider starts fully resolved — no
  // loading gate, no initial fetch.
  initialContent?: EditableContentState;
}) => {
  const bootContent = initialContent ?? defaultContent;
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(
    () => bootContent.blogPosts
  );
  const [experiences, setExperiences] = useState<Experience[]>(
    () => bootContent.experiences
  );
  const [partners, setPartners] = useState<Partner[]>(
    () => bootContent.partners
  );
  const [pressArticles, setPressArticles] = useState<PressArticle[]>(
    () => bootContent.pressArticles ?? []
  );
  const [asSeenOnOutlets, setAsSeenOnOutlets] = useState<AsSeenOnOutlet[]>(
    () => bootContent.asSeenOnOutlets ?? []
  );
  const [teamSections, setTeamSections] = useState<TeamSection[]>(
    () => bootContent.teamSections
  );
  const [tennisLessonVideos, setTennisLessonVideos] = useState<
    TennisLessonVideo[]
  >(() => bootContent.tennisLessonVideos);
  const [impactMetricsSection, setImpactMetricsSection] =
    useState<ImpactMetricsSection>(() => bootContent.impactMetricsSection);
  const [otherLocationsSection, setOtherLocationsSection] =
    useState<OtherLocationsSection>(() => bootContent.otherLocationsSection);
  const [sportDescriptions, setSportDescriptions] = useState<
    SportDescription[]
  >(() => bootContent.sportDescriptions);
  const [siteText, setSiteText] = useState(() => bootContent.siteText);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() =>
    initialContent ? createSerializedSnapshot(initialContent) : defaultSnapshot
  );
  const [isLoadingContent, setIsLoadingContent] = useState(!initialContent);
  // Unlike isLoadingContent (which the fallback timer below can flip early to
  // unblock rendering), this only becomes true once the live-content request
  // has actually settled — success or failure.
  const [hasResolvedContent, setHasResolvedContent] = useState(
    Boolean(initialContent)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);

  const applyContent = (next: EditableContentState) => {
    setBlogPosts(next.blogPosts);
    setExperiences(next.experiences);
    setPartners(next.partners);
    setPressArticles(next.pressArticles ?? []);
    setAsSeenOnOutlets(next.asSeenOnOutlets ?? []);
    setTeamSections(next.teamSections);
    setTennisLessonVideos(next.tennisLessonVideos);
    setImpactMetricsSection(next.impactMetricsSection);
    setOtherLocationsSection(next.otherLocationsSection);
    setSportDescriptions(next.sportDescriptions);
    setSiteText(next.siteText);
  };

  const savePreviewDraft = () => {
    if (typeof window === "undefined") {
      return;
    }

    const previewContent = serializeEditableContentState({
      blogPosts,
      experiences,
      partners,
      pressArticles,
      asSeenOnOutlets,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      otherLocationsSection,
      sportDescriptions,
      siteText
    });

    window.localStorage.setItem(
      PREVIEW_DRAFT_STORAGE_KEY,
      JSON.stringify(previewContent)
    );
  };

  const readLiveContent = async () => {
    if (!supabase) {
      const nextContent = await withLiveBlogPosts(defaultContent);
      applyContent(nextContent);
      setLastSavedSnapshot(createSerializedSnapshot(nextContent));
      setIsLoadingContent(false);
      return;
    }

    setIsLoadingContent(true);
    const nextContent = await resolveLiveContent();

    if (!nextContent) {
      setIsLoadingContent(false);
      return;
    }

    applyContent(nextContent);
    setLastSavedSnapshot(createSerializedSnapshot(nextContent));
    setIsLoadingContent(false);
  };

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      setIsLoadingContent(false);
      return;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) {
          return;
        }

        if (error) {
          console.error(error);
        }

        const nextUser = data.session?.user ?? null;
        if (nextUser?.email && !isAllowedAdminEmail(nextUser.email)) {
          supabase.auth.signOut().catch(console.error);
          setUser(null);
        } else {
          setUser(nextUser);
        }
        setAuthLoading(false);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        console.error(error);
        setAuthLoading(false);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      if (nextUser?.email && !isAllowedAdminEmail(nextUser.email)) {
        supabase.auth.signOut().catch(console.error);
        setUser(null);
      } else {
        setUser(nextUser);
      }
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (initialContent) {
      // Content was already resolved before mounting — nothing to fetch.
      return;
    }

    let active = true;

    // Safety valve: never let a slow/hung network request block the initial
    // render indefinitely. If live content hasn't resolved shortly, reveal
    // the bundled seed content so the site still becomes visible.
    const fallbackTimer = window.setTimeout(() => {
      if (active) {
        setIsLoadingContent(false);
      }
    }, 2500);

    readLiveContent()
      .catch((error) => {
        console.error(error);

        if (active) {
          applyContent(defaultContent);
          setLastSavedSnapshot(defaultSnapshot);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoadingContent(false);
          setHasResolvedContent(true);
        }
      });

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const currentSnapshot = useMemo(
    () =>
      createSerializedSnapshot({
        blogPosts,
        experiences,
        partners,
        pressArticles,
        asSeenOnOutlets,
        teamSections,
        tennisLessonVideos,
        impactMetricsSection,
        otherLocationsSection,
        sportDescriptions,
        siteText
      }),
    [
      blogPosts,
      experiences,
      partners,
      pressArticles,
      asSeenOnOutlets,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      otherLocationsSection,
      sportDescriptions,
      siteText
    ]
  );
  const hasUnsavedChanges = currentSnapshot !== lastSavedSnapshot;

  const value = useMemo<EditableContentContextValue>(
    () => ({
      experiences,
      blogPosts,
      setBlogPosts,
      siteText,
      setSiteText,
      partners,
      pressArticles,
      asSeenOnOutlets,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      otherLocationsSection,
      sportDescriptions,
      setExperiences,
      setPartners,
      setPressArticles,
      setAsSeenOnOutlets,
      setTeamSections,
      setTennisLessonVideos,
      setImpactMetricsSection,
      setOtherLocationsSection,
      setSportDescriptions,
      resetAll: () => {
        const defaults = createDefaultContent();
        applyContent(defaults);
      },
      saveContent: async () => {
        if (!supabase) {
          setLastSavedSnapshot(currentSnapshot);
          return;
        }

        if (!user) {
          throw new Error("Sign in before saving live content.");
        }

        setIsSaving(true);

        try {
          const content = serializeEditableContentState({
            blogPosts,
            experiences,
            partners,
            pressArticles,
            asSeenOnOutlets,
            teamSections,
            tennisLessonVideos,
            impactMetricsSection,
            otherLocationsSection,
            sportDescriptions,
            siteText
          });
          const { error } = await supabase.from("site_content").upsert(
            {
              id: SUPABASE_SITE_CONTENT_ID,
              content,
              updated_at: new Date().toISOString()
            },
            { onConflict: "id" }
          );

          if (error) {
            throw error;
          }

          setLastSavedSnapshot(currentSnapshot);
        } finally {
          setIsSaving(false);
        }
      },
      refreshContent: async () => {
        await readLiveContent();
      },
      savePreviewDraft,
      uploadImage: async (file) => {
        if (!supabase) {
          return readFileAsDataUrl(file);
        }

        if (!user) {
          throw new Error("Sign in before uploading images.");
        }

        const preparedFile = await optimizeUploadImage(file);
        const fileExtension =
          preparedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const fileName =
          preparedFile.name
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "upload";
        const filePath = `admin/${Date.now()}-${fileName}.${fileExtension}`;
        const { data, error } = await supabase.storage
          .from(SUPABASE_SITE_MEDIA_BUCKET)
          .upload(filePath, preparedFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = supabase.storage
          .from(SUPABASE_SITE_MEDIA_BUCKET)
          .getPublicUrl(data.path);
        return publicUrlData.publicUrl;
      },
      exportContent: () =>
        createEditableContentExport({
          blogPosts,
          experiences,
          partners,
          pressArticles,
          asSeenOnOutlets,
          teamSections,
          tennisLessonVideos,
          impactMetricsSection,
          otherLocationsSection,
          sportDescriptions,
          siteText
        }),
      importContent: (input) => {
        const next = parseEditableContentImport(input);
        applyContent(next);
      },
      hasUnsavedChanges,
      isLoadingContent,
      hasResolvedContent,
      isSaving,
      isSupabaseConfigured,
      isAuthenticated: Boolean(user?.email && isAllowedAdminEmail(user.email)),
      authLoading,
      userEmail: user?.email ?? null,
      signInWithMagicLink: async (email) => {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        if (!isAllowedAdminEmail(email)) {
          throw new Error("That email is not allowed to access the admin.");
        }

        const emailRedirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/admin`
            : undefined;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo, shouldCreateUser: false }
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        if (!supabase) {
          return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      }
    }),
    [
      blogPosts,
      experiences,
      partners,
      pressArticles,
      asSeenOnOutlets,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      otherLocationsSection,
      sportDescriptions,
      currentSnapshot,
      hasUnsavedChanges,
      isLoadingContent,
      hasResolvedContent,
      isSaving,
      user,
      authLoading,
      savePreviewDraft,
      siteText
    ]
  );

  return (
    <EditableContentContext.Provider value={value}>
      {children}
    </EditableContentContext.Provider>
  );
};

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);

  if (!context) {
    throw new Error(
      "useEditableContent must be used within EditableContentProvider"
    );
  }

  return context;
};

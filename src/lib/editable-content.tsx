import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { BlogPost } from "@/data/blogPosts";
import type { Experience } from "@/data/experiences";
import editableContentSeed from "@/data/editableContentSeed";
import type { Partner } from "@/data/partners";
import type { TeamSection } from "@/data/team";
import {
  createEditableContentExport,
  serializeEditableContentState,
  hydrateEditableContentState,
  parseEditableContentImport,
  type EditableContentExportFile,
  type EditableContentState,
  type ImpactMetricsSection,
  type TennisLessonVideo,
} from "@/lib/editable-content-format";
import {
  isSupabaseConfigured,
  supabase,
  SUPABASE_SITE_CONTENT_ID,
  SUPABASE_SITE_MEDIA_BUCKET,
} from "@/lib/supabase";

type EditableContentContextValue = EditableContentState & {
  setBlogPosts: Dispatch<SetStateAction<BlogPost[]>>;
  setExperiences: Dispatch<SetStateAction<Experience[]>>;
  setPartners: Dispatch<SetStateAction<Partner[]>>;
  setTeamSections: Dispatch<SetStateAction<TeamSection[]>>;
  setTennisLessonVideos: Dispatch<SetStateAction<TennisLessonVideo[]>>;
  setImpactMetricsSection: Dispatch<SetStateAction<ImpactMetricsSection>>;
  resetAll: () => void;
  saveContent: () => Promise<void>;
  refreshContent: () => Promise<void>;
  savePreviewDraft: () => void;
  uploadImage: (file: File) => Promise<string>;
  exportContent: () => EditableContentExportFile;
  importContent: (input: unknown) => void;
  hasUnsavedChanges: boolean;
  isLoadingContent: boolean;
  isSaving: boolean;
  isSupabaseConfigured: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  userEmail: string | null;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const createDefaultContent = (): EditableContentState => hydrateEditableContentState(editableContentSeed);
const createSerializedSnapshot = (content: EditableContentState) => JSON.stringify(serializeEditableContentState(content));
const PREVIEW_DRAFT_STORAGE_KEY = "together-sports-preview-draft";
const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const EditableContentContext = createContext<EditableContentContextValue | null>(null);
const defaultContent = createDefaultContent();
const defaultSnapshot = createSerializedSnapshot(defaultContent);

export const EditableContentProvider = ({ children }: { children: ReactNode }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => defaultContent.blogPosts);
  const [experiences, setExperiences] = useState<Experience[]>(() => defaultContent.experiences);
  const [partners, setPartners] = useState<Partner[]>(() => defaultContent.partners);
  const [teamSections, setTeamSections] = useState<TeamSection[]>(() => defaultContent.teamSections);
  const [tennisLessonVideos, setTennisLessonVideos] = useState<TennisLessonVideo[]>(() => defaultContent.tennisLessonVideos);
  const [impactMetricsSection, setImpactMetricsSection] = useState<ImpactMetricsSection>(() => defaultContent.impactMetricsSection);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(defaultSnapshot);
  const [isLoadingContent, setIsLoadingContent] = useState(isSupabaseConfigured);
  const [isSaving, setIsSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [user, setUser] = useState<User | null>(null);

  const applyContent = (next: EditableContentState) => {
    setBlogPosts(next.blogPosts);
    setExperiences(next.experiences);
    setPartners(next.partners);
    setTeamSections(next.teamSections);
    setTennisLessonVideos(next.tennisLessonVideos);
    setImpactMetricsSection(next.impactMetricsSection);
  };

  const savePreviewDraft = () => {
    if (typeof window === "undefined") {
      return;
    }

    const previewContent = serializeEditableContentState({
      blogPosts,
      experiences,
      partners,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
    });

    window.localStorage.setItem(PREVIEW_DRAFT_STORAGE_KEY, JSON.stringify(previewContent));
  };

  const readLiveContent = async () => {
    if (!supabase) {
      applyContent(defaultContent);
      setLastSavedSnapshot(defaultSnapshot);
      setIsLoadingContent(false);
      return;
    }

    setIsLoadingContent(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", SUPABASE_SITE_CONTENT_ID)
      .maybeSingle();

    if (error) {
      throw error;
    }

    let nextContent = data?.content ? parseEditableContentImport(data.content) : defaultContent;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const previewDraft = window.localStorage.getItem(PREVIEW_DRAFT_STORAGE_KEY);

      if (params.get("preview") === "1" && previewDraft) {
        try {
          nextContent = parseEditableContentImport(JSON.parse(previewDraft));
        } catch (error) {
          console.error(error);
        }
      }
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

        setUser(data.session?.user ?? null);
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
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    readLiveContent().catch((error) => {
      console.error(error);

      if (active) {
        applyContent(defaultContent);
        setLastSavedSnapshot(defaultSnapshot);
        setIsLoadingContent(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const currentSnapshot = useMemo(
    () => createSerializedSnapshot({ blogPosts, experiences, partners, teamSections, tennisLessonVideos, impactMetricsSection }),
    [blogPosts, experiences, partners, teamSections, tennisLessonVideos, impactMetricsSection],
  );
  const hasUnsavedChanges = currentSnapshot !== lastSavedSnapshot;

  const value = useMemo<EditableContentContextValue>(
    () => ({
      experiences,
      blogPosts,
      setBlogPosts,
      partners,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      setExperiences,
      setPartners,
      setTeamSections,
      setTennisLessonVideos,
      setImpactMetricsSection,
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
            teamSections,
            tennisLessonVideos,
            impactMetricsSection,
          });
          const { error } = await supabase.from("site_content").upsert(
            {
              id: SUPABASE_SITE_CONTENT_ID,
              content,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
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

        const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const fileName = file.name
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "upload";
        const filePath = `admin/${Date.now()}-${fileName}.${fileExtension}`;
        const { data, error } = await supabase.storage.from(SUPABASE_SITE_MEDIA_BUCKET).upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = supabase.storage.from(SUPABASE_SITE_MEDIA_BUCKET).getPublicUrl(data.path);
        return publicUrlData.publicUrl;
      },
      exportContent: () =>
        createEditableContentExport({ blogPosts, experiences, partners, teamSections, tennisLessonVideos, impactMetricsSection }),
      importContent: (input) => {
        const next = parseEditableContentImport(input);
        applyContent(next);
      },
      hasUnsavedChanges,
      isLoadingContent,
      isSaving,
      isSupabaseConfigured,
      isAuthenticated: Boolean(user),
      authLoading,
      userEmail: user?.email ?? null,
      signInWithMagicLink: async (email) => {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo },
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
      },
    }),
    [
      blogPosts,
      experiences,
      partners,
      teamSections,
      tennisLessonVideos,
      impactMetricsSection,
      currentSnapshot,
      hasUnsavedChanges,
      isLoadingContent,
      isSaving,
      user,
      authLoading,
      savePreviewDraft,
    ],
  );

  return <EditableContentContext.Provider value={value}>{children}</EditableContentContext.Provider>;
};

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);

  if (!context) {
    throw new Error("useEditableContent must be used within EditableContentProvider");
  }

  return context;
};

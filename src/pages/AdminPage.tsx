import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Images,
  LoaderCircle,
  LogOut,
  Newspaper,
  RefreshCcw,
  Save,
  Upload,
  Users
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlogPost } from "@/data/blogPosts";
import { mediaLibrary } from "@/data/mediaLibrary";
import type { Experience, ExperienceType } from "@/data/experiences";
import type { Partner } from "@/data/partners";
import type { TeamPerson, TeamSection, TeamSocialPlatform } from "@/data/team";
import type {
  OtherLocation,
  TennisLessonVideo,
  SportDescription,
  SportSession
} from "@/lib/editable-content-format";
import { useEditableContent } from "@/lib/editable-content";
import {
  imageObjectPosition,
  splitImageValue,
  withImagePosition
} from "@/lib/image-position";
import { normalizeYouTubeEmbedUrl } from "@/lib/youtube";

const inputClass =
  "w-full border border-border bg-white px-4 py-3 text-foreground font-body focus:border-accent focus:outline-none";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const labelClass =
  "font-body font-bold uppercase tracking-[0.16em] text-xs text-muted-foreground";

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const socialPlatformOptions: { value: TeamSocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" }
];
const impactMetricColors = ["#ab9bfa", "#f6a15c", "#87cb4a", "#84a6ff"];
const TEAM_DESCRIPTION_MAX_CHARS = 360;

const limitCharacters = (value: string, maxCharacters: number) =>
  value.slice(0, maxCharacters);

const EditorCard = ({ children }: { children: ReactNode }) => (
  <div className="border border-border bg-card p-6 md:p-8 space-y-5">
    {children}
  </div>
);

const FRAMING_PREVIEWS = [
  { label: "Square", boxClass: "aspect-square" },
  { label: "Wide", boxClass: "aspect-video" },
  { label: "Tall", boxClass: "aspect-[3/4]" }
];

const ImageField = ({
  label,
  value,
  onChange,
  onUpload
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const isDraggingRef = useRef(false);
  const { src: baseSrc, position } = splitImageValue(value || "");
  const positionStyle = imageObjectPosition(position);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const nextValue = await onUpload(file);
      onChange(nextValue);
      toast.success(`${file.name} uploaded.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload that image."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const applyFocalPoint = (clientX: number, clientY: number, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    onChange(
      withImagePosition(baseSrc, {
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100
      })
    );
  };

  return (
    <div className="space-y-3">
      <p className={labelClass}>{label}</p>
      <div className="w-full h-40 border border-border bg-white overflow-hidden flex items-center justify-center">
        {baseSrc ? (
          <img
            src={baseSrc}
            alt={label}
            className="w-full h-full object-cover"
            style={positionStyle}
          />
        ) : (
          <span className="text-muted-foreground text-sm">
            No image selected
          </span>
        )}
      </div>
      {baseSrc ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdjusting((current) => !current)}
            className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
          >
            {isAdjusting ? "Done Adjusting" : "Adjust Framing"}
          </button>
          {position ? (
            <span className="text-xs text-muted-foreground font-body">
              Focus: {position.x}% across, {position.y}% down
            </span>
          ) : null}
        </div>
      ) : null}
      {baseSrc && isAdjusting ? (
        <div className="border border-border bg-white p-3 space-y-3">
          <p className="text-xs text-muted-foreground font-body">
            Click or drag on the photo to pick its focal point — the spot that
            stays in view when the image is cropped to fit a box. The previews
            below show how it will be framed.
          </p>
          <div
            className="relative w-full cursor-crosshair select-none touch-none"
            onPointerDown={(event) => {
              isDraggingRef.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              applyFocalPoint(event.clientX, event.clientY, event.currentTarget);
            }}
            onPointerMove={(event) => {
              if (isDraggingRef.current) {
                applyFocalPoint(event.clientX, event.clientY, event.currentTarget);
              }
            }}
            onPointerUp={() => {
              isDraggingRef.current = false;
            }}
          >
            <img
              src={baseSrc}
              alt={`${label} framing`}
              className="w-full h-auto pointer-events-none"
              draggable={false}
            />
            <div
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary/70 shadow-[0_0_0_2px_rgba(0,0,0,0.35)] pointer-events-none"
              style={{
                left: `${position?.x ?? 50}%`,
                top: `${position?.y ?? 50}%`
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {FRAMING_PREVIEWS.map((preview) => (
              <div key={preview.label} className="space-y-1">
                <div
                  className={`w-full overflow-hidden border border-border ${preview.boxClass}`}
                >
                  <img
                    src={baseSrc}
                    alt={`${label} ${preview.label} preview`}
                    className="w-full h-full object-cover"
                    style={positionStyle}
                  />
                </div>
                <p className="text-center text-[10px] font-body font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {preview.label}
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(baseSrc)}
            disabled={!position}
            className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider disabled:opacity-50"
          >
            Reset to Center
          </button>
        </div>
      ) : null}
      <select
        className={inputClass}
        value={mediaLibrary.some((item) => item.src === baseSrc) ? baseSrc : ""}
        onChange={(event) => {
          if (event.target.value) {
            onChange(event.target.value);
          }
        }}
      >
        <option value="">Choose from existing site images</option>
        {mediaLibrary.map((item) => (
          <option key={item.id} value={item.src}>
            {item.label}
          </option>
        ))}
      </select>
      <input
        type="url"
        value={baseSrc}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste an image URL or leave the selected asset path"
        className={inputClass}
      />
      <label className="block">
        <span className="sr-only">Upload image file</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={inputClass}
          disabled={isUploading}
        />
      </label>
      {isUploading ? (
        <p className="text-sm text-muted-foreground">Uploading image...</p>
      ) : null}
    </div>
  );
};

const VideoField = ({
  label,
  description,
  value,
  onChange,
  onUpload
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string>;
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const nextValue = await onUpload(file);
      onChange(nextValue);
      toast.success(`${file.name} uploaded.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload that video."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <p className={labelClass}>{label}</p>
      {description ? (
        <p className="text-xs text-muted-foreground font-body">{description}</p>
      ) : null}
      <div className="w-full h-40 border border-border bg-white overflow-hidden flex items-center justify-center">
        {value ? (
          <video
            src={value}
            controls
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-sm">
            No video selected
          </span>
        )}
      </div>
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste an MP4 video URL"
        className={inputClass}
      />
      <label className="block">
        <span className="sr-only">Upload video file</span>
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          className={inputClass}
          disabled={isUploading}
        />
      </label>
      {isUploading ? (
        <p className="text-sm text-muted-foreground">Uploading video...</p>
      ) : null}
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
        >
          Remove Video
        </button>
      ) : null}
    </div>
  );
};

const TestimonialFields = ({
  item,
  onChange,
  onUpload
}: {
  item: Experience;
  onChange: (next: Experience) => void;
  onUpload: (file: File) => Promise<string>;
}) => {
  const type = item.type;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <p className={labelClass}>Content Type</p>
        <select
          className={inputClass}
          value={type}
          onChange={(event) =>
            onChange({ ...item, type: event.target.value as ExperienceType })
          }
        >
          <option value="quote">Athlete Quote</option>
          <option value="parent">Parent Quote</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      {type === "quote" || type === "parent" ? (
        <div className="space-y-2">
          <p className={labelClass}>Sport</p>
          <input
            className={inputClass}
            value={item.sport || ""}
            onChange={(event) =>
              onChange({ ...item, sport: event.target.value })
            }
            placeholder="Tennis"
          />
        </div>
      ) : null}

      {type === "quote" || type === "parent" ? (
        <>
          <div className="space-y-2">
            <p className={labelClass}>Name</p>
            <input
              className={inputClass}
              value={item.name || ""}
              onChange={(event) =>
                onChange({ ...item, name: event.target.value })
              }
              placeholder="Name"
            />
          </div>
          <div className="space-y-2">
            <p className={labelClass}>Age / Label</p>
            <input
              className={inputClass}
              value={item.age || ""}
              onChange={(event) =>
                onChange({ ...item, age: event.target.value })
              }
              placeholder="16 or Parent"
            />
          </div>
          <div className="space-y-2">
            <p className={labelClass}>Location</p>
            <input
              className={inputClass}
              value={item.location || ""}
              onChange={(event) =>
                onChange({ ...item, location: event.target.value })
              }
              placeholder="New York, NY"
            />
          </div>
          <div className="space-y-2">
            <p className={labelClass}>Star Rating</p>
            <select
              className={inputClass}
              value={String(item.rating || "")}
              onChange={(event) =>
                onChange({
                  ...item,
                  rating: event.target.value
                    ? Number(event.target.value)
                    : undefined
                })
              }
            >
              <option value="">No rating</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Quote</p>
            <textarea
              className={textareaClass}
              value={item.quote || ""}
              onChange={(event) =>
                onChange({ ...item, quote: event.target.value })
              }
              placeholder="Quote text"
            />
          </div>
        </>
      ) : null}

      {type === "photo" ? (
        <>
          <div className="md:col-span-2">
            <p className={labelClass}>Photos</p>
            <div className="space-y-4">
              {(item.images && item.images.length > 0
                ? item.images
                : item.image
                  ? [item.image]
                  : []
              ).map((img, idx) => (
                <div key={idx} className="border border-border bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-heading font-bold uppercase text-sm">
                      Photo {idx + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const nextImages =
                          (item.images && [...item.images]) ||
                          (item.image ? [item.image] : []);
                        nextImages.splice(idx, 1);
                        onChange({
                          ...item,
                          images: nextImages.length ? nextImages : undefined,
                          image: nextImages[0]
                        });
                      }}
                      className="px-3 py-1 border border-border bg-card text-foreground text-xs uppercase"
                    >
                      Remove
                    </button>
                  </div>
                  <ImageField
                    label={`Photo ${idx + 1}`}
                    value={img || ""}
                    onChange={(value) => {
                      const nextImages =
                        (item.images && [...item.images]) ||
                        (item.image ? [item.image] : []);
                      nextImages[idx] = value;
                      onChange({
                        ...item,
                        images: nextImages,
                        image: nextImages[0]
                      });
                    }}
                    onUpload={onUpload}
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const nextImages =
                      (item.images && [...item.images]) ||
                      (item.image ? [item.image] : []);
                    nextImages.push("");
                    onChange({
                      ...item,
                      images: nextImages,
                      image: nextImages[0]
                    });
                  }}
                  className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Image
                </button>
                <p className="self-center text-sm text-muted-foreground">
                  Add multiple images to create a slideshow.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Caption</p>
            <textarea
              className={textareaClass}
              value={item.caption || ""}
              onChange={(event) =>
                onChange({ ...item, caption: event.target.value })
              }
              placeholder="Caption"
            />
          </div>
        </>
      ) : null}

      {type === "video" ? (
        <>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Video Embed URL</p>
            <input
              className={inputClass}
              value={item.videoUrl || ""}
              onChange={(event) =>
                onChange({ ...item, videoUrl: event.target.value })
              }
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Video Title</p>
            <input
              className={inputClass}
              value={item.videoTitle || ""}
              onChange={(event) =>
                onChange({ ...item, videoTitle: event.target.value })
              }
              placeholder="Video title"
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

const AdminPage = () => {
  const {
    blogPosts,
    experiences,
    partners,
    teamSections,
    tennisLessonVideos,
    impactMetricsSection,
    otherLocationsSection,
    sportDescriptions,
    setBlogPosts,
    setExperiences,
    setPartners,
    setTeamSections,
    setTennisLessonVideos,
    setImpactMetricsSection,
    setOtherLocationsSection,
    setSportDescriptions,
    resetAll,
    saveContent,
    refreshContent,
    uploadImage,
    exportContent,
    importContent,
    hasUnsavedChanges,
    isLoadingContent,
    isSaving,
    isSupabaseConfigured,
    isAuthenticated,
    authLoading,
    siteText,
    setSiteText,
    userEmail,
    signInWithMagicLink,
    signOut
  } = useEditableContent();

  const [activeTab, setActiveTab] = useState("testimonials");
  const [statusMessage, setStatusMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const exportFile = exportContent();
    const blob = new Blob([JSON.stringify(exportFile, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "editable-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage(
      "Exported editable-content.json as a backup of the current live draft."
    );
    toast.success("JSON exported.");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      importContent(JSON.parse(raw));
      setStatusMessage(`Imported ${file.name} into the current draft.`);
      toast.success(`${file.name} imported.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to import that JSON file.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      await saveContent();
      setStatusMessage("Live content saved to Supabase.");
      toast.success("Live content saved.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save content.";
      setStatusMessage(message);
      toast.error(message);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshContent();
      setStatusMessage("Pulled the latest live content from Supabase.");
      toast.success("Live content refreshed.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to refresh content.";
      setStatusMessage(message);
      toast.error(message);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      toast.error("Enter an email first.");
      return;
    }

    setIsSendingMagicLink(true);

    try {
      await signInWithMagicLink(email.trim());
      setStatusMessage(`Magic link sent to ${email.trim()}.`);
      toast.success("Magic link sent.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send magic link.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const updateExperience = (id: string, next: Experience) => {
    setExperiences((current) =>
      current.map((item) => (item.id === id ? next : item))
    );
  };

  const moveExperience = (id: string, direction: -1 | 1) => {
    setExperiences((current) => {
      const index = current.findIndex((item) => item.id === id);

      if (index < 0) {
        return current;
      }

      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const updateBlogPost = (
    slug: string,
    updater: (post: BlogPost) => BlogPost
  ) => {
    setBlogPosts((current) =>
      current.map((post) => (post.slug === slug ? updater(post) : post))
    );
  };

  const setFeaturedPost = (slug: string, featured: boolean) => {
    setBlogPosts((current) =>
      current.map((post) => ({
        ...post,
        featured: featured
          ? post.slug === slug
          : post.slug === slug
            ? false
            : post.featured
      }))
    );
  };

  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    setPartners((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const updateSection = (sectionId: string, next: TeamSection) => {
    setTeamSections((current) =>
      current.map((section) => (section.id === sectionId ? next : section))
    );
  };

  const updatePerson = (
    sectionId: string,
    personId: string,
    next: TeamPerson
  ) => {
    setTeamSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              people: section.people.map((person) =>
                person.id === personId ? next : person
              )
            }
          : section
      )
    );
  };

  const moveTeamSection = (id: string, direction: -1 | 1) => {
    setTeamSections((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index < 0) return current;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const moveTeamPerson = (
    sectionId: string,
    personId: string,
    direction: -1 | 1
  ) => {
    setTeamSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section;
        const index = section.people.findIndex((item) => item.id === personId);
        if (index < 0) return section;
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= section.people.length) return section;
        const nextPeople = [...section.people];
        const [moved] = nextPeople.splice(index, 1);
        nextPeople.splice(nextIndex, 0, moved);
        return { ...section, people: nextPeople };
      })
    );
  };


  const updateTennisLessonVideo = (id: string, next: TennisLessonVideo) => {
    setTennisLessonVideos((current) =>
      current.map((item) => (item.id === id ? next : item))
    );
  };

  const updateImpactMetric = (
    id: string,
    field: "title" | "value",
    value: string
  ) => {
    setImpactMetricsSection((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateOtherLocation = (
    id: string,
    field: keyof Omit<OtherLocation, "id">,
    value: string
  ) => {
    setOtherLocationsSection((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateSportDescription = (id: string, next: SportDescription) => {
    setSportDescriptions((current) =>
      current.map((item) => (item.id === id ? next : item))
    );
  };

  const updateSportSession = (
    sport: SportDescription,
    sessionId: string,
    patch: Partial<SportSession>
  ) => {
    updateSportDescription(sport.id, {
      ...sport,
      sessions: (sport.sessions ?? []).map((session) =>
        session.id === sessionId ? { ...session, ...patch } : session
      )
    });
  };

  const hasInvalidTennisLessonVideos = tennisLessonVideos.some(
    (item) =>
      item.youtubeUrl.trim() && !normalizeYouTubeEmbedUrl(item.youtubeUrl)
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <LoaderCircle
            className="mx-auto animate-spin text-primary"
            size={40}
          />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-border bg-card p-8 md:p-10 space-y-6">
              <div>
                <p className="font-body font-bold uppercase tracking-[0.3em] text-primary text-sm mb-3">
                  Admin Access
                </p>
                <h1 className="font-heading text-4xl md:text-6xl font-black uppercase mb-4">
                  Sign In To Edit
                </h1>
                <p className="text-muted-foreground">
                  This admin route is powered by Supabase. Enter your email and
                  we will send you a magic link to open `/admin` with edit
                  access.
                </p>
              </div>

              <div className="space-y-2">
                <p className={labelClass}>Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isSendingMagicLink}
                  className="px-5 py-3 bg-primary text-white font-heading font-bold uppercase tracking-wider text-sm disabled:opacity-60"
                >
                  {isSendingMagicLink ? "Sending..." : "Send Magic Link"}
                </button>
                <Link
                  to="/"
                  className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm"
                >
                  Back To Site
                </Link>
              </div>

              {statusMessage ? (
                <p className="text-sm text-primary">{statusMessage}</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-14 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-4xl md:text-6xl font-black uppercase">
                Edit Mode
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="px-5 py-3 bg-primary text-white font-heading font-bold uppercase tracking-wider text-sm"
              >
                View Site
              </Link>
              <Link
                to="/experiences"
                className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm"
              >
                View Experiences
              </Link>
              <button
                type="button"
                onClick={handleRefresh}
                className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isSaving ||
                  hasInvalidTennisLessonVideos ||
                  (isSupabaseConfigured && !hasUnsavedChanges)
                }
                className="px-5 py-3 bg-accent text-white font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Live
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2"
              >
                <Download size={16} />
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Import JSON
              </button>
              {isSupabaseConfigured && isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    signOut().then(
                      () => toast.success("Signed out."),
                      (error) =>
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "Unable to sign out."
                        )
                    );
                  }}
                  className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset the current draft back to the default site content?"
                    )
                  ) {
                    resetAll();
                  }
                }}
                className="px-5 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase tracking-wider text-sm"
              >
                Reset Draft
              </button>
            </div>
          </div>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
          <p className="mt-5 text-sm text-muted-foreground">
            Source:{" "}
            {isSupabaseConfigured
              ? "Supabase live content"
              : "default repo seed"}{" "}
            | Draft: {hasUnsavedChanges ? "unsaved changes" : "up to date"}
            {userEmail ? ` | Signed in as ${userEmail}` : ""}
          </p>
          {isLoadingContent ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Loading live content...
            </p>
          ) : null}
          {hasInvalidTennisLessonVideos ? (
            <p className="mt-2 text-sm text-[#8d5120]">
              Fix the tennis lesson videos so they are valid YouTube links
              before saving.
            </p>
          ) : null}
          {statusMessage ? (
            <p className="mt-2 text-sm text-primary">{statusMessage}</p>
          ) : null}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger
              value="site"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <FileText size={16} className="mr-2" />
              Site Copy
            </TabsTrigger>
            <TabsTrigger
              value="home"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <FileText size={16} className="mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <FileText size={16} className="mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              value="sports"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Images size={16} className="mr-2" />
              Sports
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Newspaper size={16} className="mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger
              value="partners"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Images size={16} className="mr-2" />
              Partners
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Users size={16} className="mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site">
            <div className="space-y-6">
              <EditorCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-2xl font-black uppercase">
                      Hero Copy
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Top-of-page hero lines and CTAs.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className={labelClass}>Hero Line 1</p>
                    <input
                      className={inputClass}
                      value={siteText?.hero?.lines?.[0] ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          hero: {
                            ...(current.hero || {}),
                            lines: [
                              e.target.value,
                              current.hero?.lines?.[1] ?? ""
                            ]
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={labelClass}>Hero Line 2</p>
                    <input
                      className={inputClass}
                      value={siteText?.hero?.lines?.[1] ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          hero: {
                            ...(current.hero || {}),
                            lines: [
                              current.hero?.lines?.[0] ?? "",
                              e.target.value
                            ]
                          }
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={labelClass}>Hero Subtitle</p>
                  <textarea
                    className={textareaClass}
                    value={siteText?.hero?.subtitle ?? ""}
                    onChange={(e) =>
                      setSiteText((current) => ({
                        ...current,
                        hero: {
                          ...(current.hero || {}),
                          subtitle: e.target.value
                        }
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className={labelClass}>Primary CTA Label</p>
                    <input
                      className={inputClass}
                      value={siteText?.hero?.ctaPrimary ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          hero: {
                            ...(current.hero || {}),
                            ctaPrimary: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={labelClass}>Secondary CTA Label</p>
                    <input
                      className={inputClass}
                      value={siteText?.hero?.ctaSecondary ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          hero: {
                            ...(current.hero || {}),
                            ctaSecondary: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Mission Paragraphs
                </p>
                <p className="text-muted-foreground text-sm">
                  Edit top mission paragraphs shown on the home page.
                </p>
                <div className="space-y-4">
                  {(siteText?.mission ?? []).map((p, idx) => (
                    <div key={`mission-${idx}`} className="space-y-2">
                      <p className={labelClass}>Paragraph {idx + 1}</p>
                      <textarea
                        className={textareaClass}
                        value={p}
                        onChange={(e) =>
                          setSiteText((current) => {
                            const next = [...(current.mission || [])];
                            next[idx] = e.target.value;
                            return { ...current, mission: next };
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSiteText((current) => ({
                            ...current,
                            mission: (current.mission || []).filter(
                              (_, i) => i !== idx
                            )
                          }))
                        }
                        className="px-3 py-2 border border-border bg-card text-foreground text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setSiteText((current) => ({
                        ...current,
                        mission: [...(current.mission || []), "New paragraph"]
                      }))
                    }
                    className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                  >
                    + Add Paragraph
                  </button>
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Values / What We Stand For
                </p>
                <p className="text-muted-foreground text-sm">
                  Edit the three values shown on the home page.
                </p>
                <div className="space-y-4">
                  {(siteText?.values ?? []).map((v, idx) => (
                    <div
                      key={`value-${idx}`}
                      className="border border-border bg-white p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <p className={labelClass}>Title</p>
                          <input
                            className={inputClass}
                            value={v.title}
                            onChange={(e) =>
                              setSiteText((current) => {
                                const next = [...(current.values || [])];
                                next[idx] = {
                                  ...next[idx],
                                  title: e.target.value
                                };
                                return { ...current, values: next };
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <p className={labelClass}>Description</p>
                          <input
                            className={inputClass}
                            value={v.desc}
                            onChange={(e) =>
                              setSiteText((current) => {
                                const next = [...(current.values || [])];
                                next[idx] = {
                                  ...next[idx],
                                  desc: e.target.value
                                };
                                return { ...current, values: next };
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                          Background color (CSS class or color):
                        </p>
                        <input
                          className={inputClass}
                          value={v.bg ?? ""}
                          onChange={(e) =>
                            setSiteText((current) => {
                              const next = [...(current.values || [])];
                              next[idx] = { ...next[idx], bg: e.target.value };
                              return { ...current, values: next };
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setSiteText((current) => ({
                              ...current,
                              values: (current.values || []).filter(
                                (_, i) => i !== idx
                              )
                            }))
                          }
                          className="px-3 py-2 border border-border bg-card text-foreground text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setSiteText((current) => ({
                        ...current,
                        values: [
                          ...(current.values || []),
                          { title: "New", desc: "", bg: "" }
                        ]
                      }))
                    }
                    className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                  >
                    + Add Value
                  </button>
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Sports & Testimonials
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className={labelClass}>Sports Section Title</p>
                    <input
                      className={inputClass}
                      value={siteText?.sportsSection?.title ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          sportsSection: {
                            ...(current.sportsSection || {}),
                            title: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={labelClass}>Sports Section Subtitle</p>
                    <input
                      className={inputClass}
                      value={siteText?.sportsSection?.subtitle ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          sportsSection: {
                            ...(current.sportsSection || {}),
                            subtitle: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className={labelClass}>Testimonials Title</p>
                    <input
                      className={inputClass}
                      value={siteText?.testimonials?.title ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          testimonials: {
                            ...(current.testimonials || {}),
                            title: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className={labelClass}>Testimonials Subtitle</p>
                    <input
                      className={inputClass}
                      value={siteText?.testimonials?.subtitle ?? ""}
                      onChange={(e) =>
                        setSiteText((current) => ({
                          ...current,
                          testimonials: {
                            ...(current.testimonials || {}),
                            subtitle: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Navigation Labels
                </p>
                <p className="text-muted-foreground text-sm">
                  Edit the top-level nav labels (dropdowns remain unchanged).
                </p>
                <div className="space-y-3 mt-4">
                  {(siteText?.navItems ?? []).map((n, idx) => (
                    <div
                      key={`nav-${idx}`}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                    >
                      <div className="space-y-2 md:col-span-2">
                        <p className={labelClass}>Label</p>
                        <input
                          className={inputClass}
                          value={n.label}
                          onChange={(e) =>
                            setSiteText((current) => {
                              const next = [...(current.navItems || [])];
                              next[idx] = {
                                ...next[idx],
                                label: e.target.value
                              };
                              return { ...current, navItems: next };
                            })
                          }
                        />
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSiteText((current) => ({
                              ...current,
                              navItems: (current.navItems || []).filter(
                                (_, i) => i !== idx
                              )
                            }))
                          }
                          className="px-3 py-2 border border-border bg-card text-foreground text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setSiteText((current) => ({
                        ...current,
                        navItems: [
                          ...(current.navItems || []),
                          { label: "New", path: "/" }
                        ]
                      }))
                    }
                    className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                  >
                    + Add Nav Item
                  </button>
                </div>
              </EditorCard>
            </div>
          </TabsContent>
          <TabsContent value="home">
            <div className="space-y-6">
              <EditorCard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-2xl font-black uppercase">
                      Impact Metrics
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Controls the home-page metrics block under the hero.
                    </p>
                  </div>
                  <label className="flex min-h-[54px] items-center gap-3 border border-border bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={impactMetricsSection.isVisible}
                      onChange={(event) =>
                        setImpactMetricsSection((current) => ({
                          ...current,
                          isVisible: event.target.checked
                        }))
                      }
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    <span className="text-sm text-foreground">
                      {impactMetricsSection.isVisible
                        ? "Section is visible on the live site."
                        : "Section is hidden on the live site."}
                    </span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setImpactMetricsSection((current) => ({
                        ...current,
                        items:
                          current.items.length >= 6
                            ? current.items
                            : [
                                ...current.items,
                                {
                                  id: createId("metric"),
                                  title: "New Metric",
                                  value: "0",
                                  color:
                                    impactMetricColors[
                                      current.items.length %
                                        impactMetricColors.length
                                    ]
                                }
                              ]
                      }))
                    }
                    disabled={impactMetricsSection.items.length >= 6}
                    className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider disabled:opacity-60"
                  >
                    + Add Metric
                  </button>
                  <p className="self-center text-sm text-muted-foreground">
                    Keep between 4 and 6 metrics.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {impactMetricsSection.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border bg-white p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="inline-flex rounded-sm px-3 py-2 font-heading text-sm font-black uppercase"
                          style={{
                            color: item.color,
                            backgroundColor: `${item.color}1A`
                          }}
                        >
                          {item.color}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setImpactMetricsSection((current) => ({
                              ...current,
                              items: current.items.filter(
                                (entry) => entry.id !== item.id
                              )
                            }))
                          }
                          disabled={impactMetricsSection.items.length <= 4}
                          className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Metric Title</p>
                        <input
                          className={inputClass}
                          value={item.title}
                          onChange={(event) =>
                            updateImpactMetric(
                              item.id,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="Metric title"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className={labelClass}>Metric Value</p>
                        <input
                          className={inputClass}
                          value={item.value}
                          onChange={(event) =>
                            updateImpactMetric(
                              item.id,
                              "value",
                              event.target.value
                            )
                          }
                          placeholder="250+"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </EditorCard>

              <EditorCard>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-2xl font-black uppercase">
                      Other Locations
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Controls the small location maps shown under the main
                      location on the home page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setOtherLocationsSection((current) => ({
                        ...current,
                        items: [
                          ...current.items,
                          {
                            id: createId("location"),
                            name: "New Location",
                            embedUrl: ""
                          }
                        ]
                      }))
                    }
                    className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                  >
                    + Add Location
                  </button>
                </div>

                <div className="space-y-2">
                  <p className={labelClass}>Section Title</p>
                  <input
                    className={inputClass}
                    value={otherLocationsSection.title}
                    onChange={(event) =>
                      setOtherLocationsSection((current) => ({
                        ...current,
                        title: event.target.value
                      }))
                    }
                    placeholder="Other Locations"
                  />
                </div>

                <div className="space-y-4">
                  {otherLocationsSection.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No extra locations added yet.
                    </p>
                  ) : null}

                  {otherLocationsSection.items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border bg-white p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-heading text-xl font-black uppercase">
                          {item.name || "Location"}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setOtherLocationsSection((current) => ({
                              ...current,
                              items: current.items.filter(
                                (entry) => entry.id !== item.id
                              )
                            }))
                          }
                          className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className={labelClass}>Location Name</p>
                          <input
                            className={inputClass}
                            value={item.name}
                            onChange={(event) =>
                              updateOtherLocation(
                                item.id,
                                "name",
                                event.target.value
                              )
                            }
                            placeholder="New York, USA"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className={labelClass}>Google Maps Embed URL</p>
                          <input
                            type="url"
                            className={inputClass}
                            value={item.embedUrl}
                            onChange={(event) =>
                              updateOtherLocation(
                                item.id,
                                "embedUrl",
                                event.target.value
                              )
                            }
                            placeholder="https://www.google.com/maps/embed?pb=..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Homepage Photos
                </p>
                <p className="text-muted-foreground text-sm">
                  Change the photos displayed on the home page.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <ImageField
                    label="Top Left Hero Photo (Action Moment)"
                    value={siteText?.heroImage1 || ""}
                    onChange={(value) =>
                      setSiteText((current) => ({
                        ...current,
                        heroImage1: value
                      }))
                    }
                    onUpload={uploadImage}
                  />
                  <ImageField
                    label="Middle Right Hero Photo (Community Moment)"
                    value={siteText?.heroImage2 || ""}
                    onChange={(value) =>
                      setSiteText((current) => ({
                        ...current,
                        heroImage2: value
                      }))
                    }
                    onUpload={uploadImage}
                  />
                  <ImageField
                    label="Bottom Left Hero Photo (Team Moment)"
                    value={siteText?.heroImage3 || ""}
                    onChange={(value) =>
                      setSiteText((current) => ({
                        ...current,
                        heroImage3: value
                      }))
                    }
                    onUpload={uploadImage}
                  />
                  <ImageField
                    label="Mission Section Photo"
                    value={siteText?.missionImage || ""}
                    onChange={(value) =>
                      setSiteText((current) => ({
                        ...current,
                        missionImage: value
                      }))
                    }
                    onUpload={uploadImage}
                  />
                  <VideoField
                    label="Mission Section Video (Optional)"
                    description="When a video is set, it plays automatically in place of the mission photo (shown straight, without the photo tilt). Remove the video to switch back to the photo."
                    value={siteText?.missionVideo || ""}
                    onChange={(value) =>
                      setSiteText((current) => ({
                        ...current,
                        missionVideo: value
                      }))
                    }
                    onUpload={uploadImage}
                  />
                  <div className="md:col-span-2">
                    <ImageField
                      label="Second Serve Section Photo"
                      value={siteText?.secondServeImage || ""}
                      onChange={(value) =>
                        setSiteText((current) => ({
                          ...current,
                          secondServeImage: value
                        }))
                      }
                      onUpload={uploadImage}
                    />
                  </div>
                </div>
              </EditorCard>

              <EditorCard>
                <p className="font-heading text-2xl font-black uppercase">
                  Opening Intro Video
                </p>
                <p className="text-muted-foreground text-sm">
                  Plays full screen when someone first opens the site, then
                  fades into the page. It shows once per visit, plays muted,
                  and visitors can skip it at any time. Keep it short — a few
                  seconds works best.
                </p>
                <VideoField
                  label="Intro Video (Optional)"
                  value={siteText?.introVideo || ""}
                  onChange={(value) =>
                    setSiteText((current) => ({
                      ...current,
                      introVideo: value
                    }))
                  }
                  onUpload={uploadImage}
                />
              </EditorCard>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) => [
                      ...current,
                      {
                        id: createId("quote"),
                        type: "quote",
                        sport: "Tennis",
                        name: "New Name",
                        age: "16",
                        location: "",
                        quote: "New quote",
                        rating: 5
                      }
                    ])
                  }
                  className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Quote
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) => [
                      ...current,
                      {
                        id: createId("parent"),
                        type: "parent",
                        sport: "Tennis",
                        name: "Parent Name",
                        location: "",
                        quote: "Parent quote",
                        rating: 5
                      }
                    ])
                  }
                  className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Parent
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) => [
                      ...current,
                      {
                        id: createId("photo"),
                        type: "photo",
                        image: "",
                        caption: "New photo caption"
                      }
                    ])
                  }
                  className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Photo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) => [
                      ...current,
                      {
                        id: createId("video"),
                        type: "video",
                        videoUrl: "",
                        videoTitle: "New video"
                      }
                    ])
                  }
                  className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Video
                </button>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {experiences.map((item, index) => (
                <EditorCard key={item.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">
                        {item.type === "quote" && "Athlete Quote"}
                        {item.type === "parent" && "Parent Quote"}
                        {item.type === "photo" && "Photo Item"}
                        {item.type === "video" && "Video Item"}
                      </p>
                      <p className="text-muted-foreground text-sm">{item.id}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveExperience(item.id, -1)}
                        disabled={index === 0}
                        className="px-3 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <ArrowUp size={14} />
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(item.id, 1)}
                        disabled={index === experiences.length - 1}
                        className="px-3 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <ArrowDown size={14} />
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setExperiences((current) =>
                            current.filter((entry) => entry.id !== item.id)
                          )
                        }
                        className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <TestimonialFields
                    item={item}
                    onChange={(next) => updateExperience(item.id, next)}
                    onUpload={uploadImage}
                  />
                </EditorCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sports">
            <EditorCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl font-black uppercase">
                    Sports Content
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Edit sport descriptions, taglines, schedules, and upcoming
                    sessions with sign-ups. Changes appear on the sport detail
                    pages.
                  </p>
                </div>
              </div>

              <div className="border border-border bg-white p-5 md:p-6 space-y-5">
                <div>
                  <p className="font-heading text-2xl font-black uppercase">
                    Tennis How Lessons Work
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Add up to 2 YouTube videos for the tennis page. If none are
                    saved, the section stays hidden.
                  </p>
                </div>

                <div className="space-y-4">
                  {tennisLessonVideos.length === 0 ? (
                    <p className="text-muted-foreground">
                      No lesson videos added yet.
                    </p>
                  ) : null}

                  {tennisLessonVideos.map((video) => {
                    const normalizedUrl = normalizeYouTubeEmbedUrl(
                      video.youtubeUrl
                    );
                    const hasInvalidUrl =
                      video.youtubeUrl.trim().length > 0 && !normalizedUrl;

                    return (
                      <div
                        key={video.id}
                        className="border border-border bg-white p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-heading text-xl font-black uppercase">
                            {video.title || "Lesson Video"}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setTennisLessonVideos((current) =>
                                current.filter((item) => item.id !== video.id)
                              )
                            }
                            className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className={labelClass}>Video Title</p>
                            <input
                              className={inputClass}
                              value={video.title}
                              onChange={(event) =>
                                updateTennisLessonVideo(video.id, {
                                  ...video,
                                  title: event.target.value
                                })
                              }
                              placeholder="Lesson walkthrough"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className={labelClass}>YouTube URL</p>
                            <input
                              type="url"
                              className={inputClass}
                              value={video.youtubeUrl}
                              onChange={(event) =>
                                updateTennisLessonVideo(video.id, {
                                  ...video,
                                  youtubeUrl: event.target.value
                                })
                              }
                              onBlur={(event) => {
                                const normalized = normalizeYouTubeEmbedUrl(
                                  event.target.value
                                );
                                if (normalized) {
                                  updateTennisLessonVideo(video.id, {
                                    ...video,
                                    youtubeUrl: normalized
                                  });
                                }
                              }}
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p
                              className={`text-xs ${hasInvalidUrl ? "text-[#8d5120]" : "text-muted-foreground"}`}
                            >
                              YouTube only. Watch, share, shorts, and embed
                              links are all accepted.
                            </p>
                          </div>
                          {normalizedUrl ? (
                            <div className="md:col-span-2 border border-border overflow-hidden">
                              <div
                                className="relative w-full"
                                style={{ paddingBottom: "56.25%" }}
                              >
                                <iframe
                                  src={normalizedUrl}
                                  title={
                                    video.title || "Tennis lesson video preview"
                                  }
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute inset-0 h-full w-full"
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setTennisLessonVideos((current) =>
                        [
                          ...current,
                          {
                            id: createId("lesson-video"),
                            title: "Lesson Video",
                            youtubeUrl: ""
                          }
                        ].slice(0, 2)
                      )
                    }
                    disabled={tennisLessonVideos.length >= 2}
                    className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider disabled:opacity-60"
                  >
                    + Add Lesson Video
                  </button>
                </div>
              </div>
            </EditorCard>

            <EditorCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl font-black uppercase">
                    Sport Descriptions
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Edit each sport's tagline, description, schedule times, and
                    upcoming sessions with sign-up links.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {sportDescriptions.map((sport) => (
                  <div
                    key={sport.id}
                    className="border border-border bg-white p-5 md:p-6 space-y-4"
                  >
                    <p className="font-heading text-xl font-black uppercase">
                      {sport.name}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className={labelClass}>Tagline</p>
                        <input
                          className={inputClass}
                          value={sport.tagline}
                          onChange={(event) =>
                            updateSportDescription(sport.id, {
                              ...sport,
                              tagline: event.target.value
                            })
                          }
                          placeholder="Short inspirational phrase"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <p className={labelClass}>Description</p>
                        <textarea
                          className={textareaClass}
                          value={sport.description}
                          onChange={(event) =>
                            updateSportDescription(sport.id, {
                              ...sport,
                              description: event.target.value
                            })
                          }
                          placeholder="Full program description"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <p className={labelClass}>Schedule</p>
                        <div className="space-y-2">
                          {sport.schedule.map((time, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                className={inputClass}
                                value={time}
                                onChange={(event) => {
                                  const newSchedule = [...sport.schedule];
                                  newSchedule[index] = event.target.value;
                                  updateSportDescription(sport.id, {
                                    ...sport,
                                    schedule: newSchedule
                                  });
                                }}
                                placeholder="e.g., Monday & Wednesday: 4:00-6:00 PM"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  updateSportDescription(sport.id, {
                                    ...sport,
                                    schedule: sport.schedule.filter(
                                      (_, i) => i !== index
                                    )
                                  });
                                }}
                                className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider whitespace-nowrap"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              updateSportDescription(sport.id, {
                                ...sport,
                                schedule: [...sport.schedule, ""]
                              });
                            }}
                            className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                          >
                            + Add Time
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <p className={labelClass}>Upcoming Sessions</p>
                        <p className="text-muted-foreground text-xs">
                          Sessions appear on the {sport.name} page with a sign-up
                          button. Paste a Google Form (or any sign-up page) link
                          for each session — if left empty, the button links to
                          the contact page instead.
                        </p>
                        <div className="space-y-3">
                          {(sport.sessions ?? []).map((session, index) => (
                            <div
                              key={session.id}
                              className="border border-border bg-card p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-heading font-bold uppercase text-sm tracking-wider">
                                  Session {index + 1}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSportDescription(sport.id, {
                                      ...sport,
                                      sessions: (sport.sessions ?? []).filter(
                                        (entry) => entry.id !== session.id
                                      )
                                    })
                                  }
                                  className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider whitespace-nowrap"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1 md:col-span-2">
                                  <p className={labelClass}>Title</p>
                                  <input
                                    className={inputClass}
                                    value={session.title}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        title: event.target.value
                                      })
                                    }
                                    placeholder="e.g., Saturday Youth Clinic"
                                  />
                                </div>
                                <label className="flex items-center gap-2 md:col-span-2">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(session.isRecurring)}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        isRecurring: event.target.checked
                                      })
                                    }
                                    className="h-4 w-4 accent-primary"
                                  />
                                  <span className="font-body text-sm text-foreground">
                                    Recurring session (repeats on a schedule,
                                    e.g. every Saturday)
                                  </span>
                                </label>
                                <div className="space-y-1">
                                  <p className={labelClass}>
                                    {session.isRecurring ? "Schedule" : "Date"}
                                  </p>
                                  <input
                                    className={inputClass}
                                    value={session.dateLabel}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        dateLabel: event.target.value
                                      })
                                    }
                                    placeholder={
                                      session.isRecurring
                                        ? "e.g., Every Saturday"
                                        : "e.g., Saturday, July 12"
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className={labelClass}>Time</p>
                                  <input
                                    className={inputClass}
                                    value={session.timeLabel}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        timeLabel: event.target.value
                                      })
                                    }
                                    placeholder="e.g., 10:00 AM - 12:00 PM"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className={labelClass}>Location</p>
                                  <input
                                    className={inputClass}
                                    value={session.location}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        location: event.target.value
                                      })
                                    }
                                    placeholder="e.g., Riverside Park Courts"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <p className={labelClass}>
                                    Availability (optional)
                                  </p>
                                  <input
                                    className={inputClass}
                                    value={session.spotsLabel}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        spotsLabel: event.target.value
                                      })
                                    }
                                    placeholder="e.g., 8 spots left"
                                  />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <p className={labelClass}>Sign-Up Link</p>
                                  <input
                                    className={inputClass}
                                    value={session.signupUrl}
                                    onChange={(event) =>
                                      updateSportSession(sport, session.id, {
                                        signupUrl: event.target.value
                                      })
                                    }
                                    placeholder="https://forms.gle/..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              updateSportDescription(sport.id, {
                                ...sport,
                                sessions: [
                                  ...(sport.sessions ?? []),
                                  {
                                    id: createId("session"),
                                    title: "",
                                    dateLabel: "",
                                    timeLabel: "",
                                    location: "",
                                    spotsLabel: "",
                                    signupUrl: "",
                                    isRecurring: false
                                  }
                                ]
                              })
                            }
                            className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                          >
                            + Add Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>
          </TabsContent>

          <TabsContent value="blog">
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <EditorCard key={post.slug}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">
                        {post.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {post.slug}
                      </p>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                    >
                      View Post
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={labelClass}>Tag Label</p>
                      <input
                        className={inputClass}
                        value={post.tag || ""}
                        onChange={(event) =>
                          updateBlogPost(post.slug, (current) => ({
                            ...current,
                            tag: event.target.value
                          }))
                        }
                        placeholder="Optional tag text"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank for no custom tag. Only one tag shows at a
                        time.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Featured Badge</p>
                      <label className="flex min-h-[54px] items-center gap-3 border border-border bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          checked={Boolean(post.featured)}
                          onChange={(event) =>
                            setFeaturedPost(post.slug, event.target.checked)
                          }
                          className="h-4 w-4 accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm text-foreground">
                          {post.featured
                            ? "Showing Featured badge on this post."
                            : "No Featured badge on this post."}
                        </span>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Turning this on removes Featured from the other blog
                        posts.
                      </p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <p className={labelClass}>Read Only Post Info</p>
                      <div className="border border-border bg-white px-4 py-3 text-sm text-muted-foreground space-y-1">
                        <p>Date: {post.publishedAt}</p>
                        <p>Author: {post.author}</p>
                        <p>Source: {post.sourceUrl}</p>
                      </div>
                    </div>
                  </div>
                </EditorCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPartners((current) => [
                      ...current,
                      {
                        id: createId("partner"),
                        name: "Partner Name",
                        href: "https://",
                        logo: ""
                      }
                    ])
                  }
                  className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Partner
                </button>
              </div>

              {partners.map((partner) => (
                <EditorCard key={partner.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">
                        {partner.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {partner.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPartners((current) =>
                          current.filter((item) => item.id !== partner.id)
                        )
                      }
                      className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={labelClass}>Partner Name</p>
                      <input
                        className={inputClass}
                        value={partner.name}
                        onChange={(event) =>
                          updatePartner(partner.id, "name", event.target.value)
                        }
                        placeholder="Partner name"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Partner Link</p>
                      <input
                        className={inputClass}
                        value={partner.href}
                        onChange={(event) =>
                          updatePartner(partner.id, "href", event.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageField
                        label="Partner Logo"
                        value={partner.logo}
                        onChange={(value) =>
                          updatePartner(partner.id, "logo", value)
                        }
                        onUpload={uploadImage}
                      />
                    </div>
                  </div>
                </EditorCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setTeamSections((current) => [
                      ...current,
                      {
                        id: createId("section"),
                        title: "New Category",
                        color: "#4f74d6",
                        people: []
                      }
                    ])
                  }
                  className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Category
                </button>
              </div>
              {teamSections.map((section, index) => (
                <EditorCard key={section.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">
                        {section.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {section.id}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveTeamSection(section.id, -1)}
                        disabled={index === 0}
                        className="px-3 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <ArrowUp size={14} />
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTeamSection(section.id, 1)}
                        disabled={index === teamSections.length - 1}
                        className="px-3 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <ArrowDown size={14} />
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTeamSections((current) =>
                            current.filter((item) => item.id !== section.id)
                          )
                        }
                        className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                      >
                        Remove Category
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={labelClass}>Category Title</p>
                      <input
                        className={inputClass}
                        value={section.title}
                        onChange={(event) =>
                          updateSection(section.id, {
                            ...section,
                            title: event.target.value
                          })
                        }
                        placeholder="Staff"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Accent Color</p>
                      <input
                        className={inputClass}
                        value={section.color}
                        onChange={(event) =>
                          updateSection(section.id, {
                            ...section,
                            color: event.target.value
                          })
                        }
                        placeholder="#4f74d6"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {section.people.map((person, personIndex) => (
                      <div
                        key={person.id}
                        className="border border-border bg-white p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-heading text-xl font-black uppercase">
                            {person.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveTeamPerson(section.id, person.id, -1)}
                              disabled={personIndex === 0}
                              className="px-3 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                            >
                              <ArrowUp size={14} />
                              Up
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTeamPerson(section.id, person.id, 1)}
                              disabled={personIndex === section.people.length - 1}
                              className="px-3 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                            >
                              <ArrowDown size={14} />
                              Down
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSection(section.id, {
                                  ...section,
                                  people: section.people.filter(
                                    (item) => item.id !== person.id
                                  )
                                })
                              }
                              className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                            >
                              Remove Card
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className={labelClass}>Name</p>
                            <input
                              className={inputClass}
                              value={person.name}
                              onChange={(event) =>
                                updatePerson(section.id, person.id, {
                                  ...person,
                                  name: event.target.value
                                })
                              }
                              placeholder="Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className={labelClass}>Role</p>
                            <input
                              className={inputClass}
                              value={person.role}
                              onChange={(event) =>
                                updatePerson(section.id, person.id, {
                                  ...person,
                                  role: event.target.value
                                })
                              }
                              placeholder="Role"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className={labelClass}>Location</p>
                            <input
                              className={inputClass}
                              value={person.location || ""}
                              onChange={(event) =>
                                updatePerson(section.id, person.id, {
                                  ...person,
                                  location: event.target.value
                                })
                              }
                              placeholder="Brooklyn, NY"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <p className={labelClass}>Description</p>
                            <textarea
                              className={textareaClass}
                              value={person.description || ""}
                              maxLength={TEAM_DESCRIPTION_MAX_CHARS}
                              onChange={(event) =>
                                updatePerson(section.id, person.id, {
                                  ...person,
                                  description: limitCharacters(
                                    event.target.value,
                                    TEAM_DESCRIPTION_MAX_CHARS
                                  )
                                })
                              }
                              placeholder="Optional short description"
                            />
                            <p className="text-xs text-muted-foreground">
                              {(person.description || "").length}/
                              {TEAM_DESCRIPTION_MAX_CHARS} characters
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <ImageField
                              label="Card Image"
                              value={person.image}
                              onChange={(value) =>
                                updatePerson(section.id, person.id, {
                                  ...person,
                                  image: value
                                })
                              }
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="md:col-span-2 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className={labelClass}>Social Links</p>
                              <button
                                type="button"
                                onClick={() =>
                                  updatePerson(section.id, person.id, {
                                    ...person,
                                    socialLinks: [
                                      ...(person.socialLinks || []).slice(0, 3),
                                      {
                                        id: createId("social"),
                                        platform: "instagram",
                                        href: ""
                                      }
                                    ].slice(0, 3)
                                  })
                                }
                                disabled={
                                  (person.socialLinks?.length || 0) >= 3
                                }
                                className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider disabled:opacity-60"
                              >
                                + Add Social
                              </button>
                            </div>

                            {(person.socialLinks || [])
                              .slice(0, 3)
                              .map((socialLink) => (
                                <div
                                  key={socialLink.id}
                                  className="grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)_auto] gap-3"
                                >
                                  <select
                                    className={inputClass}
                                    value={socialLink.platform}
                                    onChange={(event) =>
                                      updatePerson(section.id, person.id, {
                                        ...person,
                                        socialLinks: (
                                          person.socialLinks || []
                                        ).map((item) =>
                                          item.id === socialLink.id
                                            ? {
                                                ...item,
                                                platform: event.target
                                                  .value as TeamSocialPlatform
                                              }
                                            : item
                                        )
                                      })
                                    }
                                  >
                                    {socialPlatformOptions.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    className={inputClass}
                                    value={socialLink.href}
                                    onChange={(event) =>
                                      updatePerson(section.id, person.id, {
                                        ...person,
                                        socialLinks: (
                                          person.socialLinks || []
                                        ).map((item) =>
                                          item.id === socialLink.id
                                            ? {
                                                ...item,
                                                href: event.target.value
                                              }
                                            : item
                                        )
                                      })
                                    }
                                    placeholder="https://..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updatePerson(section.id, person.id, {
                                        ...person,
                                        socialLinks: (
                                          person.socialLinks || []
                                        ).filter(
                                          (item) => item.id !== socialLink.id
                                        )
                                      })
                                    }
                                    className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        updateSection(section.id, {
                          ...section,
                          people: [
                            ...section.people,
                            {
                              id: createId("person"),
                              name: "New Name",
                              role: "New Role",
                              location: "",
                              image: "",
                              alt: "Team member",
                              description: "",
                              socialLinks: []
                            }
                          ]
                        })
                      }
                      className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider"
                    >
                      + Add Card
                    </button>
                  </div>
                </EditorCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;

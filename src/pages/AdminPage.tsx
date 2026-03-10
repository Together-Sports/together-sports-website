import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Download, FileText, Images, LoaderCircle, LogOut, Newspaper, RefreshCcw, Save, Upload, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BlogPost } from "@/data/blogPosts";
import { mediaLibrary } from "@/data/mediaLibrary";
import type { Experience, ExperienceType } from "@/data/experiences";
import type { Partner } from "@/data/partners";
import type { TeamPerson, TeamSection, TeamSocialPlatform } from "@/data/team";
import type { TennisLessonVideo } from "@/lib/editable-content-format";
import { useEditableContent } from "@/lib/editable-content";
import { normalizeYouTubeEmbedUrl } from "@/lib/youtube";

const inputClass =
  "w-full border border-border bg-white px-4 py-3 text-foreground font-body focus:border-accent focus:outline-none";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const labelClass = "font-body font-bold uppercase tracking-[0.16em] text-xs text-muted-foreground";

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const socialPlatformOptions: { value: TeamSocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];
const impactMetricColors = ["#ab9bfa", "#f6a15c", "#87cb4a", "#84a6ff"];
const TEAM_DESCRIPTION_MAX_CHARS = 360;

const limitCharacters = (value: string, maxCharacters: number) => value.slice(0, maxCharacters);

const EditorCard = ({ children }: { children: ReactNode }) => (
  <div className="border border-border bg-card p-6 md:p-8 space-y-5">{children}</div>
);

const ImageField = ({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
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
      toast.error(error instanceof Error ? error.message : "Unable to upload that image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <p className={labelClass}>{label}</p>
      <div className="w-full h-40 border border-border bg-white overflow-hidden flex items-center justify-center">
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-muted-foreground text-sm">No image selected</span>
        )}
      </div>
      <select
        className={inputClass}
        value={mediaLibrary.some((item) => item.src === value) ? value : ""}
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste an image URL or leave the selected asset path"
        className={inputClass}
      />
      <label className="block">
        <span className="sr-only">Upload image file</span>
        <input type="file" accept="image/*" onChange={handleFileSelect} className={inputClass} disabled={isUploading} />
      </label>
      {isUploading ? <p className="text-sm text-muted-foreground">Uploading image...</p> : null}
    </div>
  );
};

const TestimonialFields = ({
  item,
  onChange,
  onUpload,
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
          onChange={(event) => onChange({ ...item, type: event.target.value as ExperienceType })}
        >
          <option value="quote">Athlete Quote</option>
          <option value="parent">Parent Quote</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      {(type === "quote" || type === "parent") ? (
        <div className="space-y-2">
          <p className={labelClass}>Sport</p>
          <input
            className={inputClass}
            value={item.sport || ""}
            onChange={(event) => onChange({ ...item, sport: event.target.value })}
            placeholder="Tennis"
          />
        </div>
      ) : null}

      {(type === "quote" || type === "parent") ? (
        <>
          <div className="space-y-2">
            <p className={labelClass}>Name</p>
            <input
              className={inputClass}
              value={item.name || ""}
              onChange={(event) => onChange({ ...item, name: event.target.value })}
              placeholder="Name"
            />
          </div>
          <div className="space-y-2">
            <p className={labelClass}>Age / Label</p>
            <input
              className={inputClass}
              value={item.age || ""}
              onChange={(event) => onChange({ ...item, age: event.target.value })}
              placeholder="16 or Parent"
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
                  rating: event.target.value ? Number(event.target.value) : undefined,
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
              onChange={(event) => onChange({ ...item, quote: event.target.value })}
              placeholder="Quote text"
            />
          </div>
        </>
      ) : null}

      {type === "photo" ? (
        <>
          <div className="md:col-span-2">
            <ImageField
              label="Photo"
              value={item.image || ""}
              onChange={(value) => onChange({ ...item, image: value })}
              onUpload={onUpload}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Caption</p>
            <textarea
              className={textareaClass}
              value={item.caption || ""}
              onChange={(event) => onChange({ ...item, caption: event.target.value })}
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
              onChange={(event) => onChange({ ...item, videoUrl: event.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className={labelClass}>Video Title</p>
            <input
              className={inputClass}
              value={item.videoTitle || ""}
              onChange={(event) => onChange({ ...item, videoTitle: event.target.value })}
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
    setBlogPosts,
    setExperiences,
    setPartners,
    setTeamSections,
    setTennisLessonVideos,
    setImpactMetricsSection,
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
    userEmail,
    signInWithMagicLink,
    signOut,
  } = useEditableContent();

  const [activeTab, setActiveTab] = useState("testimonials");
  const [statusMessage, setStatusMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const exportFile = exportContent();
    const blob = new Blob([JSON.stringify(exportFile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "editable-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Exported editable-content.json as a backup of the current live draft.");
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
      const message = error instanceof Error ? error.message : "Unable to import that JSON file.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!window.confirm("Save these changes live? This will update the deployed site content after save.")) {
      return;
    }

    try {
      await saveContent();
      setStatusMessage("Live content saved to Supabase.");
      toast.success("Live content saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save content.";
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
      const message = error instanceof Error ? error.message : "Unable to refresh content.";
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
      const message = error instanceof Error ? error.message : "Unable to send magic link.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const updateExperience = (id: string, next: Experience) => {
    setExperiences((current) => current.map((item) => (item.id === id ? next : item)));
  };

  const updateBlogPost = (slug: string, updater: (post: BlogPost) => BlogPost) => {
    setBlogPosts((current) => current.map((post) => (post.slug === slug ? updater(post) : post)));
  };

  const setFeaturedPost = (slug: string, featured: boolean) => {
    setBlogPosts((current) =>
      current.map((post) => ({
        ...post,
        featured: featured ? post.slug === slug : post.slug === slug ? false : post.featured,
      })),
    );
  };

  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    setPartners((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateSection = (sectionId: string, next: TeamSection) => {
    setTeamSections((current) => current.map((section) => (section.id === sectionId ? next : section)));
  };

  const updatePerson = (sectionId: string, personId: string, next: TeamPerson) => {
    setTeamSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, people: section.people.map((person) => (person.id === personId ? next : person)) }
          : section,
      ),
    );
  };

  const updateTennisLessonVideo = (id: string, next: TennisLessonVideo) => {
    setTennisLessonVideos((current) => current.map((item) => (item.id === id ? next : item)));
  };

  const updateImpactMetric = (id: string, field: "title" | "value", value: string) => {
    setImpactMetricsSection((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const hasInvalidTennisLessonVideos = tennisLessonVideos.some(
    (item) => item.youtubeUrl.trim() && !normalizeYouTubeEmbedUrl(item.youtubeUrl),
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <LoaderCircle className="mx-auto animate-spin text-primary" size={40} />
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
                <p className="font-body font-bold uppercase tracking-[0.3em] text-primary text-sm mb-3">Admin Access</p>
                <h1 className="font-heading text-4xl md:text-6xl font-black uppercase mb-4">Sign In To Edit</h1>
                <p className="text-muted-foreground">
                  This admin route is powered by Supabase. Enter your email and we will send you a magic link to open
                  `/admin` with edit access.
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

              {statusMessage ? <p className="text-sm text-primary">{statusMessage}</p> : null}
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
              <h1 className="font-heading text-4xl md:text-6xl font-black uppercase">Edit Mode</h1>
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
                disabled={isSaving || hasInvalidTennisLessonVideos || (isSupabaseConfigured && !hasUnsavedChanges)}
                className="px-5 py-3 bg-accent text-white font-heading font-bold uppercase tracking-wider text-sm inline-flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
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
                      (error) => toast.error(error instanceof Error ? error.message : "Unable to sign out."),
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
                  if (window.confirm("Reset the current draft back to the default site content?")) {
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
            Source: {isSupabaseConfigured ? "Supabase live content" : "default repo seed"} | Draft:{" "}
            {hasUnsavedChanges ? "unsaved changes" : "up to date"}
            {userEmail ? ` | Signed in as ${userEmail}` : ""}
          </p>
          {isLoadingContent ? <p className="mt-2 text-sm text-muted-foreground">Loading live content...</p> : null}
          {hasInvalidTennisLessonVideos ? (
            <p className="mt-2 text-sm text-[#8d5120]">Fix the tennis lesson videos so they are valid YouTube links before saving.</p>
          ) : null}
          {statusMessage ? <p className="mt-2 text-sm text-primary">{statusMessage}</p> : null}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger value="home" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText size={16} className="mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText size={16} className="mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="sports" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Images size={16} className="mr-2" />
              Sports
            </TabsTrigger>
            <TabsTrigger value="blog" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Newspaper size={16} className="mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="partners" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Images size={16} className="mr-2" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="team" className="px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users size={16} className="mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <EditorCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl font-black uppercase">Impact Metrics</p>
                  <p className="text-muted-foreground text-sm">Controls the home-page metrics block under the hero.</p>
                </div>
                <label className="flex min-h-[54px] items-center gap-3 border border-border bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked={impactMetricsSection.isVisible}
                    onChange={(event) =>
                      setImpactMetricsSection((current) => ({
                        ...current,
                        isVisible: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  <span className="text-sm text-foreground">
                    {impactMetricsSection.isVisible ? "Section is visible on the live site." : "Section is hidden on the live site."}
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
                                color: impactMetricColors[current.items.length % impactMetricColors.length],
                              },
                            ],
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
                  <div key={item.id} className="border border-border bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="inline-flex rounded-sm px-3 py-2 font-heading text-sm font-black uppercase"
                        style={{ color: item.color, backgroundColor: `${item.color}1A` }}
                      >
                        {item.color}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setImpactMetricsSection((current) => ({
                            ...current,
                            items: current.items.filter((entry) => entry.id !== item.id),
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
                        onChange={(event) => updateImpactMetric(item.id, "title", event.target.value)}
                        placeholder="Metric title"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Metric Value</p>
                      <input
                        className={inputClass}
                        value={item.value}
                        onChange={(event) => updateImpactMetric(item.id, "value", event.target.value)}
                        placeholder="250+"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </EditorCard>
          </TabsContent>

          <TabsContent value="testimonials">
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  type="button"
                  onClick={() =>
                    setExperiences((current) => [
                      ...current,
                      { id: createId("quote"), type: "quote", sport: "Tennis", name: "New Name", age: "16", quote: "New quote", rating: 5 },
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
                      { id: createId("parent"), type: "parent", sport: "Tennis", name: "Parent Name", quote: "Parent quote", rating: 5 },
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
                      { id: createId("photo"), type: "photo", image: "", caption: "New photo caption" },
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
                      { id: createId("video"), type: "video", videoUrl: "", videoTitle: "New video" },
                    ])
                  }
                  className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Video
                </button>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {experiences.map((item) => (
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
                    <button
                      type="button"
                      onClick={() => setExperiences((current) => current.filter((entry) => entry.id !== item.id))}
                      className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                    >
                      Remove
                    </button>
                  </div>

                  <TestimonialFields item={item} onChange={(next) => updateExperience(item.id, next)} onUpload={uploadImage} />
                </EditorCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sports">
            <EditorCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl font-black uppercase">Sports Content</p>
                  <p className="text-muted-foreground text-sm">
                    Use this section for editable sport-page content. Tennis lesson videos live here now, and the other sports can be added here later.
                  </p>
                </div>
              </div>

              <div className="border border-border bg-white p-5 md:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-2xl font-black uppercase">Tennis How Lessons Work</p>
                    <p className="text-muted-foreground text-sm">
                      Add up to 2 YouTube videos for the tennis page. If none are saved, the section stays hidden.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTennisLessonVideos((current) => [
                        ...current,
                        { id: createId("lesson-video"), title: "Lesson Video", youtubeUrl: "" },
                      ].slice(0, 2))
                    }
                    disabled={tennisLessonVideos.length >= 2}
                    className="px-4 py-3 border border-border bg-white text-foreground font-heading font-bold uppercase text-sm tracking-wider disabled:opacity-60"
                  >
                    + Add Lesson Video
                  </button>
                </div>

                <div className="space-y-4">
                  {tennisLessonVideos.length === 0 ? (
                    <p className="text-muted-foreground">No lesson videos added yet.</p>
                  ) : null}

                  {tennisLessonVideos.map((video) => {
                    const normalizedUrl = normalizeYouTubeEmbedUrl(video.youtubeUrl);
                    const hasInvalidUrl = video.youtubeUrl.trim().length > 0 && !normalizedUrl;

                    return (
                      <div key={video.id} className="border border-border bg-white p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-heading text-xl font-black uppercase">{video.title || "Lesson Video"}</p>
                          <button
                            type="button"
                            onClick={() =>
                              setTennisLessonVideos((current) => current.filter((item) => item.id !== video.id))
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
                                updateTennisLessonVideo(video.id, { ...video, title: event.target.value })
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
                                updateTennisLessonVideo(video.id, { ...video, youtubeUrl: event.target.value })
                              }
                              onBlur={(event) => {
                                const normalized = normalizeYouTubeEmbedUrl(event.target.value);
                                if (normalized) {
                                  updateTennisLessonVideo(video.id, { ...video, youtubeUrl: normalized });
                                }
                              }}
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className={`text-xs ${hasInvalidUrl ? "text-[#8d5120]" : "text-muted-foreground"}`}>
                              YouTube only. Watch, share, shorts, and embed links are all accepted.
                            </p>
                          </div>
                          {normalizedUrl ? (
                            <div className="md:col-span-2 border border-border overflow-hidden">
                              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                                <iframe
                                  src={normalizedUrl}
                                  title={video.title || "Tennis lesson video preview"}
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
                </div>
              </div>
            </EditorCard>
          </TabsContent>

          <TabsContent value="blog">
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <EditorCard key={post.slug}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">{post.title}</p>
                      <p className="text-muted-foreground text-sm">{post.slug}</p>
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
                            tag: event.target.value,
                          }))
                        }
                        placeholder="Optional tag text"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank for no custom tag. Only one tag shows at a time.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Featured Badge</p>
                      <label className="flex min-h-[54px] items-center gap-3 border border-border bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          checked={Boolean(post.featured)}
                          onChange={(event) => setFeaturedPost(post.slug, event.target.checked)}
                          className="h-4 w-4 accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm text-foreground">
                          {post.featured ? "Showing Featured badge on this post." : "No Featured badge on this post."}
                        </span>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Turning this on removes Featured from the other blog posts.
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
                      { id: createId("partner"), name: "Partner Name", href: "https://", logo: "" },
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
                      <p className="font-heading text-2xl font-black uppercase">{partner.name}</p>
                      <p className="text-muted-foreground text-sm">{partner.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPartners((current) => current.filter((item) => item.id !== partner.id))}
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
                        onChange={(event) => updatePartner(partner.id, "name", event.target.value)}
                        placeholder="Partner name"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Partner Link</p>
                      <input
                        className={inputClass}
                        value={partner.href}
                        onChange={(event) => updatePartner(partner.id, "href", event.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageField
                        label="Partner Logo"
                        value={partner.logo}
                        onChange={(value) => updatePartner(partner.id, "logo", value)}
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
                      { id: createId("section"), title: "New Category", color: "#4f74d6", people: [] },
                    ])
                  }
                  className="px-4 py-3 bg-primary text-white font-heading font-bold uppercase text-sm tracking-wider"
                >
                  + Add Category
                </button>
              </div>
              {teamSections.map((section) => (
                <EditorCard key={section.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-heading text-2xl font-black uppercase">{section.title}</p>
                      <p className="text-muted-foreground text-sm">{section.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTeamSections((current) => current.filter((item) => item.id !== section.id))}
                      className="px-4 py-2 border border-border bg-white text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                    >
                      Remove Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className={labelClass}>Category Title</p>
                      <input
                        className={inputClass}
                        value={section.title}
                        onChange={(event) => updateSection(section.id, { ...section, title: event.target.value })}
                        placeholder="Staff"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={labelClass}>Accent Color</p>
                      <input
                        className={inputClass}
                        value={section.color}
                        onChange={(event) => updateSection(section.id, { ...section, color: event.target.value })}
                        placeholder="#4f74d6"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    {section.people.map((person) => (
                      <div key={person.id} className="border border-border bg-white p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-heading text-xl font-black uppercase">{person.name}</p>
                          <button
                            type="button"
                            onClick={() =>
                              updateSection(section.id, {
                                ...section,
                                people: section.people.filter((item) => item.id !== person.id),
                              })
                            }
                            className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider"
                          >
                            Remove Card
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className={labelClass}>Name</p>
                            <input
                              className={inputClass}
                              value={person.name}
                              onChange={(event) => updatePerson(section.id, person.id, { ...person, name: event.target.value })}
                              placeholder="Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className={labelClass}>Role</p>
                            <input
                              className={inputClass}
                              value={person.role}
                              onChange={(event) => updatePerson(section.id, person.id, { ...person, role: event.target.value })}
                              placeholder="Role"
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
                                  description: limitCharacters(event.target.value, TEAM_DESCRIPTION_MAX_CHARS),
                                })
                              }
                              placeholder="Optional short description"
                            />
                            <p className="text-xs text-muted-foreground">
                              {(person.description || "").length}/{TEAM_DESCRIPTION_MAX_CHARS} characters
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <ImageField
                              label="Card Image"
                              value={person.image}
                              onChange={(value) => updatePerson(section.id, person.id, { ...person, image: value })}
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
                                      { id: createId("social"), platform: "instagram", href: "" },
                                    ].slice(0, 3),
                                  })
                                }
                                disabled={(person.socialLinks?.length || 0) >= 3}
                                className="px-4 py-2 border border-border bg-card text-foreground font-heading font-bold uppercase text-xs tracking-wider disabled:opacity-60"
                              >
                                + Add Social
                              </button>
                            </div>

                            {(person.socialLinks || []).slice(0, 3).map((socialLink) => (
                              <div key={socialLink.id} className="grid grid-cols-1 md:grid-cols-[160px_minmax(0,1fr)_auto] gap-3">
                                <select
                                  className={inputClass}
                                  value={socialLink.platform}
                                  onChange={(event) =>
                                    updatePerson(section.id, person.id, {
                                      ...person,
                                      socialLinks: (person.socialLinks || []).map((item) =>
                                        item.id === socialLink.id
                                          ? { ...item, platform: event.target.value as TeamSocialPlatform }
                                          : item,
                                      ),
                                    })
                                  }
                                >
                                  {socialPlatformOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
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
                                      socialLinks: (person.socialLinks || []).map((item) =>
                                        item.id === socialLink.id ? { ...item, href: event.target.value } : item,
                                      ),
                                    })
                                  }
                                  placeholder="https://..."
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePerson(section.id, person.id, {
                                      ...person,
                                      socialLinks: (person.socialLinks || []).filter((item) => item.id !== socialLink.id),
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
                              image: "",
                              alt: "Team member",
                              description: "",
                              socialLinks: [],
                            },
                          ],
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

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditableContent } from "@/lib/editable-content";
import { formatUstaSession, type TennisSession, type UstaSearchItem } from "@/lib/usta-sessions";
import { normalizeYouTubeEmbedUrl } from "@/lib/youtube";
import tennisAction from "@/assets/tennis-action.jpg";
import basketballAction from "@/assets/basketball-action.jpg";
import footballAction from "@/assets/football-action.jpg";
import golfAction from "@/assets/golf-action.jpg";
import secondServe from "@/assets/second-serve.jpg";

const sportData: Record<
  string,
  { name: string; image: string; tagline: string; description: string; schedule: string[] }
> = {
  tennis: {
    name: "Tennis",
    image: tennisAction,
    tagline: "Every serve is a fresh start.",
    description:
      "Our tennis program provides free coaching, equipment, and court time to youth aged 8-18. From beginners to competitive players, we build skills and confidence through structured lessons and match play.",
    schedule: ["Monday & Wednesday: 4:00-6:00 PM", "Saturday: 9:00 AM-12:00 PM", "Summer Intensive: June-August"],
  },
  basketball: {
    name: "Basketball",
    image: basketballAction,
    tagline: "The court is where leaders are made.",
    description:
      "Our basketball program teaches fundamentals, teamwork, and game strategy. Open to all skill levels, we focus on building confidence through competitive play and mentorship.",
    schedule: ["Tuesday & Thursday: 4:00-6:00 PM", "Saturday: 1:00-4:00 PM"],
  },
  football: {
    name: "Football",
    image: footballAction,
    tagline: "Every play counts. Every player matters.",
    description:
      "Our football program emphasizes discipline, teamwork, and sportsmanship. We provide equipment and coaching for flag and tackle football across multiple age groups.",
    schedule: ["Monday & Wednesday: 4:30-6:30 PM", "Saturday: 10:00 AM-1:00 PM"],
  },
  golf: {
    name: "Golf",
    image: golfAction,
    tagline: "The long game starts here.",
    description:
      "Our golf program introduces youth to the sport of patience and precision. With access to courses and professional instruction, we open doors that many thought were closed.",
    schedule: ["Wednesday: 3:30-5:30 PM", "Saturday: 8:00-11:00 AM"],
  },
};

const sportTheme: Record<
  string,
  {
    heroBackground: string;
    accentText: string;
    shapeClassNames: string[];
  }
> = {
  tennis: {
    heroBackground: "bg-[hsl(var(--sport-tennis))]",
    accentText: "text-accent",
    shapeClassNames: [
      "absolute left-6 top-10 h-12 w-12 rounded-full bg-white/12 md:left-10 md:h-20 md:w-20",
      "absolute left-[18%] top-8 h-8 w-8 bg-white/10 scrapbook-rotate-1 md:h-14 md:w-14",
      "absolute right-8 top-12 h-10 w-10 rotate-45 bg-white/12 md:right-12 md:h-16 md:w-16",
      "absolute right-[16%] bottom-12 h-14 w-14 rounded-full bg-white/10 md:h-24 md:w-24",
      "absolute right-[28%] top-[42%] h-6 w-6 rounded-full bg-white/10 md:h-10 md:w-10",
      "absolute left-[12%] bottom-10 h-10 w-10 rounded-full bg-white/10 md:h-16 md:w-16",
    ],
  },
  basketball: {
    heroBackground: "bg-[hsl(var(--sport-basketball))]",
    accentText: "text-[hsl(var(--sport-basketball))]",
    shapeClassNames: [
      "absolute left-8 top-10 h-14 w-14 rounded-full bg-white/12 md:h-24 md:w-24",
      "absolute left-[18%] top-8 h-10 w-10 rotate-12 bg-white/10 md:h-14 md:w-14",
      "absolute right-10 top-12 h-12 w-12 rotate-45 bg-white/12 md:h-24 md:w-24",
      "absolute right-[22%] bottom-10 h-8 w-8 rounded-full bg-white/10 md:h-12 md:w-12",
      "absolute right-[32%] top-[40%] h-6 w-6 bg-white/10 scrapbook-rotate-2 md:h-10 md:w-10",
      "absolute left-[12%] bottom-8 h-9 w-9 rounded-full bg-white/10 md:h-14 md:w-14",
    ],
  },
  football: {
    heroBackground: "bg-[hsl(var(--sport-football))]",
    accentText: "text-[hsl(var(--sport-football))]",
    shapeClassNames: [
      "absolute left-10 top-10 h-12 w-12 rounded-full bg-white/14 md:h-20 md:w-20",
      "absolute left-[26%] top-7 h-10 w-10 bg-white/10 scrapbook-rotate-2 md:h-14 md:w-14",
      "absolute right-10 top-14 h-14 w-14 rotate-45 bg-white/12 md:h-20 md:w-20",
      "absolute right-[20%] bottom-12 h-8 w-8 rounded-full bg-white/12 md:h-12 md:w-12",
      "absolute right-[30%] top-[42%] h-7 w-7 rounded-full bg-white/10 md:h-11 md:w-11",
      "absolute left-[14%] bottom-10 h-10 w-10 rounded-full bg-white/10 md:h-14 md:w-14",
    ],
  },
  golf: {
    heroBackground: "bg-[hsl(var(--sport-golf))]",
    accentText: "text-[hsl(var(--sport-golf))]",
    shapeClassNames: [
      "absolute left-8 top-12 h-12 w-12 rounded-full bg-white/12 md:h-24 md:w-24",
      "absolute left-[21%] top-9 h-9 w-9 bg-white/10 scrapbook-rotate-3 md:h-14 md:w-14",
      "absolute right-12 top-10 h-12 w-12 rotate-45 bg-white/12 md:h-24 md:w-24",
      "absolute right-[18%] bottom-8 h-8 w-8 rounded-full bg-white/10 md:h-12 md:w-12",
      "absolute right-[28%] top-[44%] h-6 w-6 bg-white/10 scrapbook-rotate-1 md:h-10 md:w-10",
      "absolute left-[16%] bottom-9 h-9 w-9 rounded-full bg-white/10 md:h-14 md:w-14",
    ],
  },
};

const fetchUstaSessionsDirect = async (signal: AbortSignal): Promise<TennisSession[]> => {
  const filtersResponse = await fetch(
    "https://playtennis.usta.com/togethertennis/Coaching/GetSearchFilters?subCategory=GroupCoaching",
    { signal },
  );

  if (!filtersResponse.ok) {
    throw new Error("Unable to load tennis filters.");
  }

  const rawFilters = await filtersResponse.json();
  const filtersData = typeof rawFilters === "string" ? JSON.parse(rawFilters) : rawFilters;

  const searchResponse = await fetch(
    "https://prd-usta-kube.clubspark.pro/unified-search-api/api/Search/classic-coaching/Query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        options: {
          size: 12,
          from: 0,
          sortKey: "date",
          // USTA/ClubSpark returns these two fields flipped in the filters payload.
          latitude: filtersData.longitude,
          longitude: filtersData.latitude,
        },
        filters: filtersData.filters.background,
      }),
      signal,
    },
  );

  if (!searchResponse.ok) {
    throw new Error("Unable to load tennis sessions.");
  }

  const searchData = await searchResponse.json();
  return (searchData.searchResults ?? []).map((result: { item: UstaSearchItem }) => formatUstaSession(result.item));
};

const SportDetailPage = () => {
  const { sport } = useParams<{ sport: string }>();
  const { tennisLessonVideos } = useEditableContent();
  const data = sportData[sport || ""];
  const [tennisSessions, setTennisSessions] = useState<TennisSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const isTennis = sport === "tennis";
  const theme = sportTheme[sport || "tennis"] ?? sportTheme.tennis;
  const aboutAccentClass = isTennis ? "brush-underline" : theme.accentText;
  const validTennisLessonVideos = tennisLessonVideos
    .map((video) => ({
      ...video,
      youtubeUrl: normalizeYouTubeEmbedUrl(video.youtubeUrl) || "",
    }))
    .filter((video) => video.youtubeUrl)
    .slice(0, 2);

  useEffect(() => {
    if (!isTennis) {
      return;
    }

    const abortController = new AbortController();

    const loadTennisSessions = async () => {
      try {
        setSessionsLoading(true);
        setSessionsError(null);

        if (!import.meta.env.DEV) {
          try {
            const apiResponse = await fetch("/api/usta-sessions", {
              signal: abortController.signal,
            });

            if (!apiResponse.ok) {
              throw new Error("Unable to load tennis sessions.");
            }

            const apiSessions = await apiResponse.json();
            setTennisSessions(apiSessions);
            return;
          } catch {
            const fallbackSessions = await fetchUstaSessionsDirect(abortController.signal);
            setTennisSessions(fallbackSessions);
            return;
          }
        }

        const directSessions = await fetchUstaSessionsDirect(abortController.signal);
        setTennisSessions(directSessions);
      } catch {
        if (!abortController.signal.aborted) {
          setSessionsError("Live USTA sessions are unavailable right now.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setSessionsLoading(false);
        }
      }
    };

    void loadTennisSessions();

    return () => {
      abortController.abort();
    };
  }, [isTennis]);

  if (!data) {
    return (
      <div className="py-32 text-center">
        <h1 className="font-heading text-4xl font-black uppercase">Sport not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className={`relative overflow-hidden ${theme.heroBackground}`}>
        {theme.shapeClassNames.map((shapeClassName, index) => (
          <div key={`${sport}-shape-${index}`} className={shapeClassName} />
        ))}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 md:pt-28 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="mb-4 font-heading text-5xl font-black uppercase leading-[0.95] text-white md:text-7xl">
              {data.name}
            </h1>
            <p className="max-w-2xl font-body text-lg text-white md:text-xl">{data.tagline}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="mb-6 font-heading text-4xl font-black uppercase md:text-5xl">
              About the <span className={aboutAccentClass}>Program</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{data.description}</p>
          </ScrollReveal>
        </div>
      </section>

      {isTennis ? (
        <>
          {validTennisLessonVideos.length > 0 ? (
            <section className="bg-card py-16 md:py-24 scratchy-overlay">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                  <h2 className="mb-8 font-heading text-4xl font-black uppercase md:text-5xl">
                    How Lessons <span className="text-accent">Work</span>
                  </h2>
                  <div className={`grid gap-8 ${validTennisLessonVideos.length > 1 ? "md:grid-cols-2" : ""}`}>
                    {validTennisLessonVideos.map((video) => (
                      <div key={video.id} className="overflow-hidden border border-border bg-background">
                        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                          <iframe
                            src={video.youtubeUrl}
                            title={video.title || "How tennis lessons work"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                            loading="lazy"
                          />
                        </div>
                        {video.title ? (
                          <div className="p-4">
                            <p className="font-heading text-xl font-black uppercase">{video.title}</p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </section>
          ) : null}

          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <h2 className="mb-8 font-heading text-4xl font-black uppercase md:text-5xl">
                  Live <span className="brush-underline">USTA Sessions</span>
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                  Discover our range of tennis programs designed for all skill levels, from beginner to advanced. Join
                  us for group sessions, fun community events, and the joy of learning tennis in a supportive
                  environment. Private lessons are also available, please contact us directly to arrange.
                </p>

                {sessionsLoading ? (
                  <div className="border border-border bg-card p-6 font-body text-lg text-foreground">
                    Loading live USTA sessions...
                  </div>
                ) : sessionsError ? (
                  <div className="space-y-4">
                    <div className="border border-border bg-card p-6 font-body text-lg text-foreground">
                      {sessionsError}
                    </div>
                    <a
                      href="https://playtennis.usta.com/togethertennis/Coaching"
                      className="inline-block bg-primary px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
                    >
                      View USTA Page
                    </a>
                  </div>
                ) : (
                  <div className="relative mx-auto w-full max-w-3xl overflow-hidden border-2 border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <p className="font-body text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                        Upcoming Classes
                      </p>
                      <p className="font-body text-xs font-bold uppercase tracking-[0.16em] text-accent">
                        Scroll For More
                      </p>
                    </div>
                    <ScrollArea className="h-[30rem] sm:h-[34rem] md:h-[40rem]">
                      <div className="space-y-4 p-4 pr-6">
                        {tennisSessions.map((session) => (
                          <a
                            key={session.id}
                            href={session.link}
                            className="block border-2 border-border bg-background p-6 transition-colors duration-200 hover:border-accent"
                          >
                            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h3 className="mb-2 font-heading text-3xl font-black uppercase text-foreground md:text-4xl">
                                  {session.name}
                                </h3>
                                <p className="text-lg text-foreground md:text-xl">{session.nextSessionLabel}</p>
                              </div>

                              <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-foreground sm:grid-cols-2">
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">Location</p>
                                  <p className="text-lg">{session.locationName}</p>
                                </div>
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">Coach</p>
                                  <p className="text-lg">{session.coachName}</p>
                                </div>
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">Level</p>
                                  <p className="text-lg">{session.levelLabel}</p>
                                </div>
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">
                                    Next Session
                                  </p>
                                  <p className="text-lg">{session.nextSessionLabel}</p>
                                </div>
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">Date</p>
                                  <p className="text-lg">{session.dateLabel}</p>
                                </div>
                                <div>
                                  <p className="mb-1 font-body text-xs font-bold uppercase tracking-[0.16em]">Time</p>
                                  <p className="text-lg">{session.timeLabel}</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="pointer-events-none absolute inset-x-0 top-[3.625rem] h-10 bg-gradient-to-b from-card to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
                  </div>
                )}
              </ScrollReveal>
            </div>
          </section>
        </>
      ) : null}

      <section className="bg-card py-16 md:py-24 scratchy-overlay">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 font-heading text-4xl font-black uppercase md:text-5xl">
              Ready to <span className="text-accent">{isTennis ? "Register?" : "Enter the Waitlist?"}</span>
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
              {isTennis
                ? "Sign up through USTA or contact us directly to join the program."
                : "Join the waitlist and we will reach out as soon as space opens up for this sport."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isTennis ? (
                <a
                  href="https://playtennis.usta.com/togethertennis/Coaching"
                  className="inline-block bg-primary px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
                >
                  USTA Registration →
                </a>
              ) : (
                <a
                  href="https://forms.gle/3eQTjDbrti2ghwW17"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-primary px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
                >
                  Join Waitlist →
                </a>
              )}
              <Link
                to="/contact"
                className="inline-block bg-accent px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {isTennis ? (
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <ScrollReveal direction="left">
                <div className="scrapbook-rotate-1">
                  <img
                    src={secondServe}
                    alt="Second Serve"
                    loading="lazy"
                    decoding="async"
                    className="h-[400px] w-full object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <p className="mb-4 font-body text-sm font-bold uppercase tracking-[0.2em] text-accent">
                  Partner Service + Initiative
                </p>
                <h2 className="mb-6 font-heading text-5xl font-black uppercase leading-[0.9] md:text-6xl">
                  Second Serve
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Second Serve is a service from our partner Rally Forward NYC. Alongside that partnership, Together Tennis
                  is building its own Second Serve effort focused on collecting quality used tennis equipment that
                  people would otherwise throw away and donating it back into the community.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  The goal is simple: keep rackets, bags, balls, and gear in circulation so more kids can play with
                  what they need instead of being priced out of the sport.
                </p>
                <Link
                  to="/get-involved"
                  className="inline-block bg-accent px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105 hover:rotate-1"
                >
                  Support Second Serve
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default SportDetailPage;

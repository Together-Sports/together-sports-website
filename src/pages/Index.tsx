import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { IS_SERVER } from "@/lib/ssr";
import ScrollReveal from "@/components/ScrollReveal";
import heroImage from "@/assets/hero-sports.jpg";
import secondServe from "@/assets/second-serve.jpg";
import partnerOne from "@/assets/partner-1.png";
import image0903 from "@/assets/IMG_0903.jpg";
import image3782 from "@/assets/IMG_3782.jpg";
import communityImg from "@/assets/community.jpg";
import spinBall from "@/assets/spinball.svg";
import basketSpin from "@/assets/BASKETSPIN.svg";
import footballSpin from "@/assets/FOOTBALLSPIN.svg";
import golfSpin from "@/assets/GOLFSPIN.svg";
import soccerSpin from "@/assets/SOCCERSPIN.svg";
import { useEditableContent } from "@/lib/editable-content";
import { imgProps } from "@/lib/image-position";
import { useSiteText } from "@/lib/use-site-text";

const heroSpins = [
  {
    image: spinBall,
    className:
      "absolute bottom-10 left-12 z-0 w-52 sm:bottom-12 sm:left-16 sm:w-60 md:bottom-10 md:left-24 md:w-72 lg:bottom-12 lg:left-16 lg:w-[20rem]",
    rotate: -360,
    duration: 24,
    delay: 0,
    scaleX: 1
  },
  {
    image: golfSpin,
    className:
      "absolute right-10 top-24 z-0 hidden w-28 sm:block sm:right-14 sm:top-28 sm:w-32 md:right-16 md:top-24 md:w-44 lg:right-12 lg:top-32 lg:w-48",
    rotate: 360,
    duration: 18,
    delay: 1.5,
    scaleX: 1
  },
  {
    image: basketSpin,
    className:
      "absolute left-[-8rem] top-10 z-0 hidden w-72 sm:block sm:left-[-9rem] sm:top-14 sm:w-80 md:left-[-10rem] md:top-16 md:w-96 lg:left-[-11rem] lg:top-18 lg:w-[29rem]",
    rotate: 360,
    duration: 28,
    delay: 3,
    scaleX: 1
  },
  {
    image: footballSpin,
    className:
      "absolute bottom-8 right-4 z-0 hidden w-64 sm:block sm:bottom-10 sm:right-6 sm:w-72 md:bottom-10 md:right-6 md:w-80 lg:bottom-12 lg:right-4 lg:w-[23rem]",
    rotate: 0,
    duration: 0,
    delay: 0,
    scaleX: -1
  },
  {
    image: soccerSpin,
    className:
      "absolute left-[38%] top-4 z-0 hidden w-28 md:block md:w-32 lg:top-6 lg:w-36",
    rotate: 360,
    duration: 22,
    delay: 0.8,
    scaleX: 1
  }
];

const sportsCtaSpins = [
  {
    image: spinBall,
    className:
      "absolute left-16 top-[62%] hidden w-40 -translate-y-1/2 xl:block",
    rotate: -360,
    duration: 24,
    delay: 0,
    scaleX: 1
  },
  {
    image: basketSpin,
    className:
      "absolute left-[17%] top-[32%] hidden w-40 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 28,
    delay: 1.5,
    scaleX: 1
  },
  {
    image: golfSpin,
    className:
      "absolute right-[17%] top-[32%] hidden w-40 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 18,
    delay: 0.8,
    scaleX: 1
  },
  {
    image: footballSpin,
    className:
      "absolute right-16 top-[62%] hidden w-40 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 30,
    delay: 2.2,
    scaleX: -1
  },
  {
    image: soccerSpin,
    className:
      "absolute left-[8%] top-6 hidden w-28 xl:block",
    rotate: 360,
    duration: 22,
    delay: 1.1,
    scaleX: 1
  }
];

const resolveValueCardAppearance = (bg?: string) => {
  const fallbackClass = "bg-[#87cb4a]";
  const token = bg?.trim() ?? "";
  const normalizedToken = token.toLowerCase();

  const knownColorMap: Record<
    string,
    { className: string; textClass: string }
  > = {
    "#f6a15c": { className: "bg-[#f6a15c]", textClass: "text-white" },
    "#87cb4a": { className: "bg-[#87cb4a]", textClass: "text-white" },
    "#ab9bfa": { className: "bg-[#ab9bfa]", textClass: "text-white" },
    "#84a6ff": { className: "bg-[#84a6ff]", textClass: "text-white" },
    white: { className: "bg-white", textClass: "text-foreground" },
    "#fff": { className: "bg-white", textClass: "text-foreground" },
    "#ffffff": { className: "bg-white", textClass: "text-foreground" }
  };

  const knownColor = knownColorMap[normalizedToken];
  if (knownColor) {
    return knownColor;
  }

  if (!token) {
    return { className: fallbackClass, textClass: "text-white" };
  }

  if (token.startsWith("bg-")) {
    const usesLightBackground =
      /white|slate-50|stone-50|zinc-50|neutral-50|gray-50|amber-50|yellow-50|lime-50|emerald-50|cyan-50|sky-50|blue-50|indigo-50|violet-50|purple-50|fuchsia-50|pink-50|rose-50/i.test(
        token
      );

    return {
      className: token,
      textClass: usesLightBackground ? "text-foreground" : "text-white"
    };
  }

  return { className: fallbackClass, textClass: "text-white" };
};

// Splits a metric value like "2000+", "100%", or "$1.5k" into the number to
// count up to and the text around it. Returns null when there's no number.
const parseMetricValue = (value: string) => {
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);

  if (!match) {
    return null;
  }

  const target = parseFloat(match[2].replace(/,/g, ""));

  if (!Number.isFinite(target)) {
    return null;
  }

  return {
    prefix: match[1],
    target,
    suffix: match[3],
    decimals: (match[2].split(".")[1] || "").length
  };
};

const COUNT_UP_DURATION_MS = 1600;

const CountUpValue = ({
  value,
  className
}: {
  value: string;
  className: string;
}) => {
  const parsed = parseMetricValue(value);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  // On the server (build-time prerender) there's no scroll/animation, so start
  // fully counted — otherwise the static HTML search engines read would freeze
  // every stat at its "0" starting frame. The client still starts at 0 and
  // animates up when the section scrolls into view.
  const [progress, setProgress] = useState(() => (IS_SERVER ? 1 : 0));

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
      // ease-out cubic: fast start, gentle landing on the final number
      setProgress(1 - Math.pow(1 - elapsed, 3));

      if (elapsed < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  const display = parsed
    ? `${parsed.prefix}${(parsed.target * progress).toFixed(parsed.decimals)}${parsed.suffix}`
    : value;

  return (
    <p ref={ref} className={className}>
      {display}
    </p>
  );
};

const MapEmbedCard = ({
  embedUrl,
  title,
  className
}: {
  embedUrl: string;
  title: string;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden border-2 border-border bg-white ${className ?? ""}`}
    onWheel={(event) => event.preventDefault()}
  >
    <iframe
      src={embedUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
    />
    <div
      className="absolute inset-0"
      style={{ background: "transparent", cursor: "default" }}
      onClick={(event) => {
        const rect = (
          event.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        const y = event.clientY - rect.top;
        const x = event.clientX - rect.left;
        if (y > rect.height - 80 && x > rect.width - 80) {
          event.currentTarget.style.pointerEvents = "none";
          setTimeout(() => {
            (event.currentTarget as HTMLDivElement).style.pointerEvents =
              "auto";
          }, 100);
        }
      }}
    />
  </div>
);

const Index = () => {
  const {
    asSeenOnSection,
    experiences,
    impactMetricsSection,
    otherLocationsSection,
    siteText
  } = useEditableContent();
  const t = useSiteText();
  const missionWords = t("home.missionHeading").split(" ");
  const missionLast = missionWords.pop() ?? "";
  const valuesWords = t("home.valuesHeading").split(" ");
  const resolvedHeroImage1 = imgProps(siteText?.heroImage1 || image0903);
  const resolvedHeroImage2 = imgProps(siteText?.heroImage2 || heroImage);
  const resolvedHeroImage3 = imgProps(siteText?.heroImage3 || image3782);
  const resolvedMissionImage = imgProps(siteText?.missionImage || communityImg);
  const missionVideo = siteText?.missionVideo?.trim() || "";
  const resolvedSecondServeImage = imgProps(
    siteText?.secondServeImage || secondServe
  );
  const featuredTestimonials = experiences
    .filter((item) => item.type === "quote" || item.type === "parent")
    .slice(0, 3);
  const heroLines = siteText?.hero?.lines || ["Play Loud.", "Build Strong."];
  const heroSubtitle =
    siteText?.hero?.subtitle ||
    "Together Sports is a 501(c)(3) nonprofit empowering youth through sports, mentorship, and community one game at a time.";
  const heroCtaPrimary = siteText?.hero?.ctaPrimary || "Our Sports";
  const heroCtaSecondary = siteText?.hero?.ctaSecondary || "Donate Now";
  const missionParagraphs = siteText?.mission?.length
    ? siteText.mission
    : [
        "Together Sports is a nonprofit dedicated to building stronger communities through athletics. We provide free youth sports programs across NYC and create opportunities for youth to connect, grow, and thrive.",
        "We believe every kid deserves a chance to play. Through free sports programs, mentorship, and community building, we're creating the next generation of leaders — on and off the field.",
        "From tennis courts to basketball hoops, from football fields to golf courses — we meet kids where they are and take them where they want to go."
      ];
  const values = siteText?.values?.length
    ? siteText.values
    : [
        {
          title: "Access",
          desc: "Every kid plays, regardless of background or income.",
          bg: "bg-[#f6a15c]"
        },
        {
          title: "Growth",
          desc: "Sports build character, discipline, and confidence.",
          bg: "bg-[#87cb4a]"
        },
        {
          title: "Community",
          desc: "We rise together — athletes, mentors, families.",
          bg: "bg-[#ab9bfa]"
        }
      ];
  const sportsSection = siteText?.sportsSection ?? {
    title: "Our Sports",
    subtitle: "Explore all five Together Sports programs in one place."
  };
  const testimonialsText = siteText?.testimonials ?? {
    title: "Testimonials",
    subtitle:
      "The little stories that show the big picture: connection, encouragement, and growth."
  };
  const otherLocations = otherLocationsSection.items.filter((item) =>
    item.embedUrl.trim()
  );

  // Outlets for the "As Seen On" strip under the hero, fully controlled from
  // the admin's Home tab: the section can be hidden, outlets are whatever the
  // admin added, and the logo size is adjustable.
  const seenOnOutlets = asSeenOnSection.isVisible
    ? asSeenOnSection.items
        .map((outlet) => ({
          name: outlet.name.trim(),
          logo: outlet.logo?.trim() || undefined
        }))
        .filter((outlet) => outlet.name || outlet.logo)
    : [];
  const seenOnLogoSize = asSeenOnSection.logoSize;

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#84a6ff]/18 via-background to-[#4f74d6]/12">
        {heroSpins.map((item) => (
          <motion.div
            key={item.image}
            className={item.className}
            whileHover={{ scale: 1.08, y: -6 }}
            transition={{
              scale: { duration: 0.2, ease: "easeOut" },
              y: { duration: 0.2, ease: "easeOut" }
            }}
          >
            <motion.img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="block w-full h-auto"
              initial={
                item.duration > 0
                  ? { rotate: 0, scaleX: item.scaleX }
                  : { scaleX: item.scaleX }
              }
              animate={
                item.duration > 0
                  ? { rotate: item.rotate, scaleX: item.scaleX }
                  : { scaleX: item.scaleX }
              }
              transition={
                item.duration > 0
                  ? {
                      rotate: {
                        duration: item.duration,
                        delay: item.delay,
                        ease: "linear",
                        repeat: Infinity
                      }
                    }
                  : undefined
              }
            />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-[87.5rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.5fr)] gap-10 sm:gap-14 lg:gap-10 items-center">
            <motion.div
              initial={IS_SERVER ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-none"
            >
              <h1 className="font-heading text-[clamp(1.75rem,8.5vw,5.75rem)] lg:text-[clamp(3rem,5.9vw,5.75rem)] font-black uppercase leading-[0.94] mb-6 sm:mb-8 text-foreground">
                <span className="block text-balance">{heroLines[0]}</span>
                <span className="block text-balance text-[#4f74d6]">
                  {heroLines[1] ?? ""}
                </span>
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl max-w-xl mb-8 font-body">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/sports"
                  className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
                >
                  {heroCtaPrimary}
                </Link>
                <Link
                  to="/get-involved#donate"
                  className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
                >
                  {heroCtaSecondary}
                </Link>
                <Link
                  to="/team"
                  className="inline-block px-8 py-4 bg-[#87cb4a] text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
                >
                  {t("home.heroCtaTeam")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={IS_SERVER ? false : { opacity: 0, y: 50, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="relative h-[420px] sm:h-[600px] md:h-[680px] lg:h-[780px] w-full max-w-[680px] lg:max-w-[820px] mx-auto -translate-y-4 sm:-translate-y-8 md:-translate-y-12 lg:mx-0 lg:ml-8 lg:-translate-y-20"
            >
              <div className="absolute left-10 -top-6 w-[68%] h-[40%] overflow-hidden border-[10px] border-white bg-white scrapbook-rotate-2 z-10">
                <img
                  {...resolvedHeroImage1}
                  alt="Together Sports action moment"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  className="block w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-2 top-[22%] w-[82%] h-[46%] overflow-hidden border-[12px] border-white bg-white scrapbook-rotate-1 z-10">
                <img
                  {...resolvedHeroImage2}
                  alt="Together Sports community moment"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  className="block w-full h-full object-cover"
                />
              </div>
              <div className="absolute left-[-2%] bottom-[2%] w-[74%] h-[42%] overflow-hidden border-[10px] border-white bg-white scrapbook-rotate-2 z-20">
                <img
                  {...resolvedHeroImage3}
                  alt="Together Sports team moment"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  className="block w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AS SEEN ON — fully managed in the admin's Home tab */}
      {seenOnOutlets.length > 0 ? (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <ScrollReveal>
              <p className="mb-8 text-center font-heading text-sm font-black uppercase tracking-[0.32em] text-foreground/40 md:mb-10 md:text-base">
                {t("home.asSeenOnLabel")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 md:gap-x-20">
                {seenOnOutlets.map((outlet, outletIndex) => (
                  <Link
                    key={`${outlet.name}-${outletIndex}`}
                    to="/press"
                    title={`${outlet.name} coverage of Together Sports`}
                    className="inline-flex items-center transition-transform duration-200 hover:scale-105"
                  >
                    {outlet.logo ? (
                      <img
                        src={outlet.logo}
                        alt={outlet.name}
                        loading="lazy"
                        decoding="async"
                        className="w-auto object-contain"
                        style={{
                          height: `min(${seenOnLogoSize}px, 15vw)`,
                          maxWidth: `min(${seenOnLogoSize * 4}px, 60vw)`
                        }}
                      />
                    ) : (
                      <span
                        className="font-heading font-black uppercase tracking-wide text-foreground/60 transition-colors duration-200 hover:text-foreground"
                        style={{
                          fontSize: `min(${Math.round(seenOnLogoSize * 0.5)}px, 7.5vw)`
                        }}
                      >
                        {outlet.name}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* ABOUT MISSION */}
      <section className="py-14 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <ScrollReveal direction="right">
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-6 text-foreground">
                {missionWords.join(" ")}{missionWords.length ? " " : ""}
                <span className="brush-underline">{missionLast}</span>
              </h2>
              {missionParagraphs.map((p, i) => (
                <p
                  key={`mission-${i}`}
                  className="text-muted-foreground text-lg leading-relaxed mb-4"
                >
                  {p}
                </p>
              ))}
            </ScrollReveal>

            <ScrollReveal direction="left">
              {missionVideo ? (
                <video
                  src={missionVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Together Sports community video"
                  className="w-full h-[340px] md:h-[420px] object-cover"
                />
              ) : (
                <div className="scrapbook-rotate-2">
                  <img
                    {...resolvedMissionImage}
                    alt="Together Sports community"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[340px] md:h-[420px] object-cover"
                  />
                </div>
              )}
            </ScrollReveal>
          </div>

          <div className="mt-12 md:mt-20">
            <ScrollReveal>
              <h3 className="font-heading text-4xl md:text-6xl font-black uppercase mb-8 md:mb-12 text-foreground">
                {valuesWords.map((word, wordIndex) => (
                  <span key={`values-word-${wordIndex}`}>
                    {wordIndex > 0 ? " " : ""}
                    {wordIndex === 1 ? (
                      <span className="relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-2 after:w-full after:skew-x-[-12deg] after:rounded-[2px] after:bg-[#87cb4a] after:content-['']">
                        <span className="relative z-10">{word}</span>
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </h3>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {values.map((value, index) => {
                const appearance = resolveValueCardAppearance(value.bg);

                return (
                  <ScrollReveal key={value.title} delay={index * 0.12}>
                    <div
                      className={`group border-2 border-transparent p-6 md:p-10 transition-all duration-200 hover:scale-105 ${appearance.className}`}
                    >
                      <h4
                        className={`font-heading text-3xl md:text-4xl font-black uppercase mb-4 ${appearance.textClass}`}
                      >
                        {value.title}
                      </h4>
                      <p
                        className={`text-lg md:text-xl leading-relaxed ${appearance.textClass}`}
                      >
                        {value.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      {impactMetricsSection.isVisible &&
      impactMetricsSection.items.length > 0 ? (
        <section className="py-10 md:py-12 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {impactMetricsSection.items.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.08}>
                  <div
                    className="flex h-full min-h-[150px] md:min-h-[190px] w-full flex-col justify-center items-center gap-3 bg-white border-4 px-3 py-6 text-center md:gap-5 md:px-7 md:py-10"
                    style={{ borderColor: item.color }}
                  >
                    <p
                      className="font-heading text-base sm:text-xl md:text-2xl font-black uppercase leading-tight"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </p>
                    <CountUpValue
                      value={item.value}
                      className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase text-foreground leading-none"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* SPORTS CTA */}
      <section id="sports" className="py-14 md:py-24 bg-white relative">
        {sportsCtaSpins.map((item) => (
          <motion.div
            key={`sports-cta-${item.image}`}
            className={item.className}
          >
            <motion.img
              src={item.image}
              alt=""
              aria-hidden="true"
              decoding="async"
              className="block w-full h-auto"
              initial={{ rotate: 0, scaleX: item.scaleX }}
              animate={{ rotate: item.rotate, scaleX: item.scaleX }}
              transition={{
                rotate: {
                  duration: item.duration,
                  delay: item.delay,
                  ease: "linear",
                  repeat: Infinity
                }
              }}
            />
          </motion.div>
        ))}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4">
                {sportsSection.title}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                {sportsSection.subtitle}
              </p>
              <Link
                to="/sports"
                className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
              >
                {t("home.sportsCtaButton")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-16 bg-[#87cb4a] relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="absolute -top-8 -left-8 h-28 w-28 rounded-full bg-white/10 scrapbook-rotate-2" />
        <div className="absolute left-1/4 top-10 h-20 w-20 rounded-full bg-white/10 xl:left-[26%] xl:top-12 xl:h-24 xl:w-24" />
        <div className="absolute top-10 right-8 h-14 w-14 bg-white/10 scrapbook-rotate-3" />
        <div className="absolute -bottom-10 right-0 h-40 w-40 bg-white/10 scrapbook-rotate-1" />
        <div className="absolute left-6 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/10 xl:h-64 xl:w-64" />
        <div className="absolute right-32 top-20 h-24 w-24 rotate-45 bg-white/10 xl:right-40 xl:top-24 xl:h-32 xl:w-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4 text-white text-center">
                {testimonialsText.title}
              </h2>
              <p className="text-white font-bold text-lg mb-10 md:mb-20 max-w-lg mx-auto text-center">
                {testimonialsText.subtitle}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredTestimonials.map((testimonial, i) => (
                <ScrollReveal key={testimonial.id} delay={i * 0.15}>
                  <div
                    className={`relative bg-white p-6 md:p-10 transition-all duration-200 hover:scale-105 ${
                      i === 1
                        ? "md:-translate-y-6 scrapbook-rotate-2 hover:rotate-1"
                        : i === 2
                          ? "scrapbook-rotate-3 hover:-rotate-1"
                          : "scrapbook-rotate-1 hover:-rotate-1"
                    }`}
                  >
                    <span
                      className="absolute -top-5 left-6 font-heading text-8xl leading-none select-none pointer-events-none"
                      style={{
                        color:
                          i === 0 ? "#ab9bfa" : i === 1 ? "#f6a15c" : "#84a6ff",
                        WebkitTextStroke: "2px white"
                      }}
                    >
                      &ldquo;
                    </span>
                    <p className="text-foreground text-base md:text-lg leading-relaxed mb-6 relative z-10 italic">
                      &ldquo;{testimonial.quote || ""}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-1 ${i === 0 ? "bg-[#ab9bfa]" : i === 1 ? "bg-[#f6a15c]" : "bg-[#84a6ff]"}`}
                      />
                      <span className="font-heading font-bold uppercase text-sm tracking-wider text-foreground">
                        {testimonial.name}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECOND SERVE */}
      <section className="pt-14 pb-12 md:pt-20 md:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="scrapbook-rotate-1">
                  <img
                    {...resolvedSecondServeImage}
                    alt="Second Serve service"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 border-[8px] border-accent bg-white p-3 scrapbook-rotate-2 flex items-center justify-center">
                  <img
                    src={partnerOne}
                    alt="Second Serve partner logo"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <p className="font-body font-bold uppercase tracking-[0.2em] text-accent text-sm mb-4">
                {t("home.secondServeEyebrow")}
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-6">
                {t("home.secondServeHeading")}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {t("home.secondServeBody")}
              </p>
              <a
                href="https://www.instagram.com/rallyforwardnyc?igsh=c3dpbGNpeWZnOXRj"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
              >
                {t("home.secondServeButton")}
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-14 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-[clamp(2.25rem,10vw,3rem)] sm:text-5xl md:text-7xl font-black uppercase mb-4 text-center">
              <span className="mr-2 hidden text-[0.9em] normal-case align-[0.02em] sm:inline-block md:mr-3">
                📍
              </span>
              {t("home.locationHeading")}
              <span className="ml-2 hidden text-[0.9em] normal-case align-[0.02em] sm:inline-block md:ml-3">
                📍
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 md:mb-12 text-center">
              {t("home.locationSubtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <MapEmbedCard
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949658!2d-74.11976389828046!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1e0!2e0"
              title="Together Sports main location"
              className="h-[300px] w-full sm:h-[400px] md:h-[500px]"
            />
          </ScrollReveal>

          {otherLocations.length > 0 ? (
            <div className="mt-16 md:mt-20">
              <ScrollReveal>
                <h3 className="font-heading text-[clamp(2rem,9.4vw,3rem)] sm:text-5xl md:text-7xl font-black uppercase mb-4 text-center">
                  {otherLocationsSection.title?.trim().toLowerCase() ===
                  "other locations" ? (
                    <>
                      <span className="mr-2 hidden text-[0.9em] normal-case align-[0.02em] sm:inline-block md:mr-3">
                        🌍
                      </span>
                      <span className="brush-underline inline-block">
                        Other
                      </span>{" "}
                      Locations
                    </>
                  ) : (
                    <span className="inline-block">
                      <span className="mr-2 hidden text-[0.9em] normal-case align-[0.02em] sm:inline-block md:mr-3">
                        🌍
                      </span>
                      {otherLocationsSection.title || "Other Locations"}
                    </span>
                  )}
                  <span className="ml-2 hidden text-[0.9em] normal-case align-[0.02em] sm:inline-block md:ml-3">
                    🌎
                  </span>
                </h3>
              </ScrollReveal>

              <div className="mx-auto mt-12 flex max-w-[1016px] flex-wrap justify-center gap-8">
                {otherLocations.map((location, index) => (
                  <ScrollReveal key={location.id} delay={index * 0.08}>
                    <div className="w-[320px] shrink-0">
                      <MapEmbedCard
                        embedUrl={location.embedUrl}
                        title={location.name || "Together Sports location"}
                        className="h-[220px] w-[320px]"
                      />
                      <p className="mt-4 text-center font-heading text-2xl font-black uppercase text-foreground">
                        {location.name}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* DONATE CTA */}
      <section className="py-20 md:py-28 bg-[#84a6ff] relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#bcd2ff]/30" />
        <div className="absolute right-0 top-4 h-32 w-32 rotate-45 bg-[#bcd2ff]/30" />
        <div className="absolute left-[20%] bottom-2 h-28 w-28 rounded-full bg-[#bcd2ff]/30" />
        <div className="absolute right-[18%] bottom-16 h-24 w-24 bg-[#bcd2ff]/30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="scale">
            <h2 className="font-heading text-[clamp(2rem,9.2vw,3rem)] sm:text-5xl md:text-7xl font-black uppercase text-white leading-[0.9] mb-6">
              <span className="block whitespace-nowrap">Change the Game.</span>
              <span className="block whitespace-nowrap text-white">
                Donate Today.
              </span>
            </h2>
            <p className="text-white font-bold text-lg mb-8 max-w-lg mx-auto font-body">
              Your contribution puts a racket, a ball, or a dream in a
              kid&apos;s hands. Every dollar counts.
            </p>
            <Link
              to="/get-involved"
              className="inline-block px-10 py-5 border-4 border-white bg-accent text-white font-heading font-bold text-xl uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
            >
              Give Now →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;

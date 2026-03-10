import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { useEditableContent } from "@/lib/editable-content";
import type { TeamPerson, TeamSocialPlatform } from "@/data/team";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M8 0C5.826 0 5.555.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76c-.198.509-.333 1.09-.371 1.943C.01 5.555 0 5.826 0 8c0 2.174.01 2.445.048 3.297.038.852.173 1.434.371 1.943a3.9 3.9 0 0 0 .923 1.417 3.9 3.9 0 0 0 1.417.923c.509.198 1.09.333 1.943.371C5.555 15.99 5.826 16 8 16c2.174 0 2.445-.01 3.297-.048.852-.038 1.434-.173 1.943-.371a4 4 0 0 0 2.34-2.34c.198-.509.333-1.09.371-1.943C15.99 10.445 16 10.174 16 8c0-2.174-.01-2.445-.048-3.297-.038-.852-.173-1.434-.371-1.943a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.509-.198-1.09-.333-1.943-.371C10.445.01 10.174 0 8 0m0 1.441c2.137 0 2.39.008 3.232.046.779.035 1.203.166 1.484.275.372.145.637.318.916.597s.452.544.597.916c.109.281.24.705.275 1.484.038.842.046 1.095.046 3.232s-.008 2.39-.046 3.232c-.035.779-.166 1.203-.275 1.484a2.46 2.46 0 0 1-.597.916 2.46 2.46 0 0 1-.916.597c-.281.109-.705.24-1.484.275-.842.038-1.095.046-3.232.046s-2.39-.008-3.232-.046c-.779-.035-1.203-.166-1.484-.275a2.46 2.46 0 0 1-.916-.597 2.46 2.46 0 0 1-.597-.916c-.109-.281-.24-.705-.275-1.484C1.45 10.39 1.441 10.137 1.441 8s.008-2.39.046-3.232c.035-.779.166-1.203.275-1.484.145-.372.318-.637.597-.916s.544-.452.916-.597c.281-.109.705-.24 1.484-.275.842-.038 1.095-.046 3.232-.046" />
    <path d="M8 4.324A3.676 3.676 0 1 0 8 11.676 3.676 3.676 0 0 0 8 4.324m0 6.065A2.389 2.389 0 1 1 8 5.61a2.389 2.389 0 0 1 0 4.778m4.684-6.211a.86.86 0 1 1-1.72 0 .86.86 0 0 1 1.72 0" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M9.75 0h2.165c.17 1.47 1.005 2.64 2.335 3.36v2.203a5.45 5.45 0 0 1-2.321-.697v5.062c0 2.68-2.117 4.572-4.566 4.572-2.598 0-4.933-1.987-4.933-4.817 0-2.988 2.58-4.92 5.205-4.836v2.287c-1.313-.04-2.666.656-2.666 2.26 0 1.46 1.2 2.215 2.1 2.215.86 0 2.11-.55 2.11-2.145z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zM4.943 13.5V6.169H2.542V13.5zm-1.2-8.333c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.21 2.4 3.919c0 .694.521 1.248 1.327 1.248zm2.649 8.333h2.401V9.407c0-.219.016-.438.081-.594.176-.438.577-.891 1.25-.891.881 0 1.233.672 1.233 1.656V13.5h2.401V9.297c0-2.252-1.201-3.3-2.804-3.3-1.292 0-1.862.711-2.183 1.21h.016v-1.04H6.392c.03.688 0 7.333 0 7.333" />
  </svg>
);

const socialIconMap: Record<TeamSocialPlatform, ({ className }: { className?: string }) => JSX.Element> = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,
};

const TeamCard = ({
  person,
  color,
  isFounder,
  canHover,
}: {
  person: TeamPerson;
  color: string;
  isFounder: boolean;
  canHover: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  useEffect(() => {
    if (!person.description || !descriptionRef.current) {
      setDescriptionHeight(0);
      return;
    }

    const element = descriptionRef.current;
    const updateHeight = () => setDescriptionHeight(element.scrollHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [person.description]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  return (
    <div className="flex h-full flex-col bg-white border border-border overflow-hidden">
      <img
        src={person.image}
        alt={person.alt}
        className={`w-full object-cover ${isFounder ? "h-[320px] md:h-[400px]" : "h-[320px] md:h-[310px]"}`}
      />
      <div className={`flex flex-1 flex-col ${isFounder ? "p-7 md:p-9" : "p-7 md:p-7"}`}>
        <p className="font-body font-bold uppercase tracking-[0.22em] text-sm mb-3" style={{ color }}>
          {person.role}
        </p>
        <div
          ref={cardRef}
          className="relative"
          onMouseEnter={canHover && person.description ? () => setIsOpen(true) : undefined}
          onMouseLeave={canHover ? () => setIsOpen(false) : undefined}
        >
          <button
            type="button"
            onClick={() => {
              if (!person.description || canHover) {
                return;
              }
              setIsOpen((current) => !current);
            }}
            className={`text-left ${
              person.description ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <h4
              className={`font-heading font-black uppercase ${
                isFounder ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
              }`}
            >
              {person.name}
            </h4>
          </button>

          {person.description ? (
            <div
              className={`overflow-hidden transition-all duration-200 ${isOpen ? "mt-3 opacity-100" : "opacity-0"}`}
              style={{ maxHeight: isOpen ? `${descriptionHeight}px` : "0px" }}
            >
              <div ref={descriptionRef}>
                <p className="font-body text-sm md:text-base leading-relaxed text-foreground break-words [overflow-wrap:anywhere]">
                  {person.description}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {person.socialLinks && person.socialLinks.length > 0 ? (
          <div className="mt-5 flex items-center gap-3">
            {person.socialLinks.slice(0, 3).map((socialLink) => {
              const Icon = socialIconMap[socialLink.platform];

              return (
                <a
                  key={socialLink.id}
                  href={socialLink.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${person.name} ${socialLink.platform}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-transform duration-200 hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { teamSections } = useEditableContent();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverMode = () => setCanHover(mediaQuery.matches);

    updateHoverMode();
    mediaQuery.addEventListener("change", updateHoverMode);

    return () => mediaQuery.removeEventListener("change", updateHoverMode);
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#87cb4a]">
        <div className="absolute left-4 top-8 h-12 w-12 rounded-full bg-white/10 sm:left-10 sm:top-10 sm:h-20 sm:w-20" />
        <div className="absolute left-[18%] top-24 hidden h-12 w-12 rotate-45 bg-white/10 sm:block" />
        <div className="absolute right-4 top-10 h-10 w-10 bg-white/10 scrapbook-rotate-2 sm:right-12 sm:top-12 sm:h-16 sm:w-16" />
        <div className="absolute left-10 bottom-8 h-8 w-8 bg-white/10 scrapbook-rotate-3 sm:left-16 sm:h-10 sm:w-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="sm:whitespace-nowrap">Meet The </span>
              <span className="sm:whitespace-nowrap">Team</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              The people behind Together Sports are coaches, mentors, athletes, and community builders creating spaces where young people can grow through sport.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#87cb4a] py-12 md:py-16">
        <div className="absolute left-4 top-14 h-14 w-14 rounded-full bg-white/10 sm:h-20 sm:w-20" />
        <div className="absolute left-10 top-1/3 hidden h-12 w-12 rotate-45 bg-white/10 sm:block" />
        <div className="absolute left-6 bottom-28 hidden h-16 w-16 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute left-[22%] top-8 h-8 w-8 rounded-full bg-white/10 sm:h-10 sm:w-10" />
        <div className="absolute right-4 top-16 h-12 w-12 rotate-45 bg-white/10 sm:h-16 sm:w-16" />
        <div className="absolute right-10 top-[30%] hidden h-14 w-14 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute right-6 bottom-24 hidden h-20 w-20 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-[22%] top-10 hidden h-10 w-10 bg-white/10 scrapbook-rotate-3 sm:block" />
        <div className="absolute left-1/2 top-6 h-6 w-6 -translate-x-1/2 rounded-full bg-white/10 sm:h-8 sm:w-8" />
        <div className="absolute left-1/2 bottom-6 hidden h-12 w-12 -translate-x-1/2 rotate-45 bg-white/10 sm:block" />

        <div className="relative z-10 max-w-[92rem] mx-auto px-3 sm:px-4 lg:px-5">
          <div className="bg-white px-6 py-10 md:px-10 md:py-12">
            <div className="space-y-16 md:space-y-20">
              {teamSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  <ScrollReveal>
                    <div className="mb-8 md:mb-10 text-center">
                      <p className="font-body font-bold uppercase tracking-[0.3em] text-sm mb-3" style={{ color: section.color }}>
                        Together Sports
                      </p>
                      <h3 className="font-heading text-4xl md:text-6xl font-black uppercase">{section.title}</h3>
                    </div>
                  </ScrollReveal>

                  <div
                    className={
                      section.title === "Founder"
                        ? "max-w-md md:max-w-lg mx-auto"
                        : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7"
                    }
                  >
                    {section.people.map((person, personIndex) => (
                      <ScrollReveal
                        key={`${section.title}-${person.name}-${personIndex}`}
                        delay={(sectionIndex * 0.05) + (personIndex * 0.1)}
                        direction={personIndex % 2 === 0 ? "left" : "right"}
                      >
                        <TeamCard
                          person={person}
                          color={section.color}
                          isFounder={section.title === "Founder"}
                          canHover={canHover}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <ScrollReveal>
              <div className="mt-14 md:mt-16 text-center">
                <Link
                  to="/contact"
                  className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
                >
                  Get in Touch
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

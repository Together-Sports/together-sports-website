import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useEditableContent } from "@/lib/editable-content";
import { useSiteText } from "@/lib/use-site-text";

const partnerPerkColors = ["#87cb4a", "#84a6ff", "#ab9bfa", "#f6a15c"];

const PartnersPage = () => {
  const t = useSiteText();
  const { partners } = useEditableContent();

  return (
    <div className="overflow-hidden">
      {/* INFINITE CAROUSEL */}
      <section className="pb-16 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-28 mb-14 md:mb-20">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase text-foreground">
                {t("partners.heading")}
              </h2>
            </div>
          </ScrollReveal>
        </div>

        <div className="relative w-full overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex w-max will-change-transform animate-partner-marquee hover:[animation-play-state:paused]">
            {[partners, partners, partners].map((group, groupIndex) => (
              <div
                key={groupIndex}
                aria-hidden={groupIndex > 0}
                className="flex shrink-0 items-stretch gap-6 pr-6 md:gap-10 md:pr-10"
              >
                {group.map((partner) => (
                  <a
                    key={`${partner.id}-${groupIndex}`}
                    href={partner.href}
                    target={partner.href ? "_blank" : undefined}
                    rel={partner.href ? "noreferrer" : undefined}
                    aria-label={partner.href ? partner.name : undefined}
                    className="group flex-shrink-0 w-48 md:w-56 flex flex-col items-center justify-between gap-3 border-2 border-border bg-white p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[6px_6px_0_0_hsl(var(--accent))]"
                  >
                    <span className="flex h-20 md:h-24 w-full items-center justify-center">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        loading={groupIndex === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchpriority={groupIndex === 0 ? "high" : "low"}
                        className="max-w-full max-h-full object-contain"
                      />
                    </span>
                    <span className="w-full truncate text-center font-heading text-sm font-black uppercase tracking-wider text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-14 md:py-20 bg-accent scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-8 md:mb-12 text-white text-center">
              {t("partners.whyHeading")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t("partners.why1Title"),
                desc: t("partners.why1Body"),
                titleColor: "#84a6ff"
              },
              {
                title: t("partners.why2Title"),
                desc: t("partners.why2Body"),
                titleColor: "#ab9bfa"
              },
              {
                title: t("partners.why3Title"),
                desc: t("partners.why3Body"),
                titleColor: "#f6a15c"
              }
            ].map((item, i) => (
              <ScrollReveal
                key={item.title}
                delay={i * 0.15}
                direction="up"
                className="h-full"
              >
                <div className="h-full p-8 md:p-8 bg-background border border-border hover:border-accent transition-colors duration-300">
                  <h3
                    className="font-heading text-3xl font-black uppercase mb-3"
                    style={{ color: item.titleColor }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-10 items-center">
            <ScrollReveal direction="left">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase mb-6">
                Get{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Involved</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-2 rounded-sm -skew-x-12 bg-[#f6a15c]"
                  />
                </span>
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-[#8496c6]">
                {t("partners.ctaBody")}
              </p>
              <Link
                to="/get-involved"
                className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
              >
                {t("partners.ctaButton")}
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="p-8 md:p-9 bg-white border border-border scrapbook-rotate-2">
                <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">
                  {t("partners.perksTitle")}
                </p>
                {[
                  t("partners.perk1"),
                  t("partners.perk2"),
                  t("partners.perk3"),
                  t("partners.perk4")
                ].map((perk, index) => (
                  <div
                    key={perk}
                    className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: partnerPerkColors[index] }}
                    />
                    <span className="font-body text-foreground">{perk}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;

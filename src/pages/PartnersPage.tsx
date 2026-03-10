import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useEditableContent } from "@/lib/editable-content";

const partnerPerkColors = ["#87cb4a", "#84a6ff", "#ab9bfa", "#f6a15c"];

const PartnersPage = () => {
  const { partners } = useEditableContent();

  return (
    <div className="overflow-hidden">
      {/* INFINITE CAROUSEL */}
      <section className="pb-32 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 mb-24 md:mb-20">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-heading text-6xl md:text-[5.25rem] font-black uppercase text-foreground">
                Meet Our Partners
              </h2>
            </div>
          </ScrollReveal>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex w-max will-change-transform animate-partner-marquee">
            {[partners, partners, partners].map((group, groupIndex) => (
              <div
                key={groupIndex}
                aria-hidden={groupIndex > 0}
                className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24"
              >
                {group.map((partner) => (
                  <a
                    key={`${partner.id}-${groupIndex}`}
                    href={partner.href}
                    target={partner.href ? "_blank" : undefined}
                    rel={partner.href ? "noreferrer" : undefined}
                    aria-label={partner.href ? partner.name : undefined}
                    className="flex-shrink-0 w-40 h-28 md:w-44 md:h-[7.5rem] flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      loading="eager"
                      className="max-w-full max-h-full object-contain"
                    />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 md:py-20 bg-accent scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12 text-white text-center">
              Why Partner With Us?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Community Reach",
                desc: "Your brand connects with hundreds of families across local sports programs, events, and social media.",
                titleColor: "#84a6ff",
              },
              {
                title: "Shared Values",
                desc: "Align with a mission that champions teamwork, inclusivity, and youth development through sport.",
                titleColor: "#ab9bfa",
              },
              {
                title: "Digital Feature",
                desc: "Featured on our website and social media so supporters can see the organizations helping our mission grow.",
                titleColor: "#f6a15c",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15} direction="up">
                <div className="p-8 md:p-8 bg-background border border-border hover:border-accent transition-colors duration-300">
                  <h3 className="font-heading text-3xl font-black uppercase mb-3" style={{ color: item.titleColor }}>{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-10 items-center">
            <ScrollReveal direction="left">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase mb-6">
                Get{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Involved</span>
                  <span aria-hidden className="absolute inset-x-0 -bottom-1 h-2 rounded-sm -skew-x-12 bg-[#f6a15c]" />
                </span>
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-[#8496c6]">
                Interested in supporting Together Sports? Head to our Get Involved page to explore
                ways to partner, volunteer, and help us create more opportunities for youth.
              </p>
              <Link
                to="/get-involved"
                className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
              >
                Get Involved
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="p-8 md:p-9 bg-white border border-border scrapbook-rotate-2">
                <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">What You Get</p>
                {[
                  "Positive community impact and youth development",
                  "Featured on our website & social media",
                  "Meaningful volunteer opportunities for staff and students",
                  "Opportunities to collaborate on programming and events",
                ].map((perk, index) => (
                  <div key={perk} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: partnerPerkColors[index] }} />
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

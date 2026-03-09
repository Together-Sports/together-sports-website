import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { useEditableContent } from "@/lib/editable-content";

const AboutPage = () => {
  const { teamSections } = useEditableContent();

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#87cb4a]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="whitespace-nowrap">Meet The </span>
              <span className="whitespace-nowrap">Team</span>
            </h1>
            <p className="text-foreground text-lg md:text-xl max-w-2xl mx-auto font-body">
              The people behind Together Sports are coaches, mentors, athletes, and community builders creating spaces where young people can grow through sport.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                      ? "max-w-md mx-auto"
                      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                  }
                >
                  {section.people.map((person, personIndex) => (
                    <ScrollReveal
                      key={`${section.title}-${person.name}-${personIndex}`}
                      delay={(sectionIndex * 0.05) + (personIndex * 0.1)}
                      direction={personIndex % 2 === 0 ? "left" : "right"}
                    >
                      <div className="bg-white border border-border overflow-hidden">
                        <img src={person.image} alt={person.alt} className="w-full h-[320px] md:h-[360px] object-cover" />
                        <div className="p-7 md:p-8">
                          <p className="font-body font-bold uppercase tracking-[0.22em] text-sm mb-3" style={{ color: section.color }}>
                            {person.role}
                          </p>
                          <h4 className="font-heading text-3xl md:text-4xl font-black uppercase">{person.name}</h4>
                        </div>
                      </div>
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
                className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

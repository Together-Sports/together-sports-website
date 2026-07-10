import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useEditableContent } from "@/lib/editable-content";
import type { Experience } from "@/data/experiences";
import { useSiteText } from "@/lib/use-site-text";

const sportAccent: Record<string, string> = {
  Tennis: "text-[hsl(var(--sport-tennis))]",
  Basketball: "text-[hsl(var(--sport-basketball))]",
  Football: "text-[hsl(var(--sport-football))]",
  Soccer: "text-[hsl(var(--sport-soccer))]",
  Mentor: "text-[hsl(var(--sport-mentor))]",
  Golf: "text-[hsl(var(--sport-golf))]"
};

const renderStars = (rating?: number) => {
  if (!rating || rating < 1) {
    return null;
  }

  return "★".repeat(Math.min(Math.max(rating, 1), 5));
};

const QuoteCard = ({ item, index }: { item: Experience; index: number }) => {
  return (
    <ScrollReveal direction="up" delay={index * 0.1}>
      <div className="h-full p-6 md:p-8 bg-background border border-border hover:border-accent transition-colors duration-300 text-center">
        <p
          className={`font-heading font-bold uppercase text-sm mb-4 ${sportAccent[item.sport || ""] || "text-accent"}`}
        >
          {item.sport || "Together Sports"}
        </p>
        <p className="text-foreground text-xl leading-relaxed mb-6 font-body italic">
          "{item.quote}"
        </p>
        <p className="text-muted-foreground font-heading font-bold uppercase">
          {item.age ? `- ${item.name}, ${item.age}` : `- ${item.name}`}
        </p>
        {item.location ? (
          <p className="mt-2 inline-flex items-center justify-center gap-2 text-xs font-body font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
            <MapPin className="h-3.5 w-3.5 text-[#f6a15c]" strokeWidth={2.5} />
            <span>{item.location}</span>
          </p>
        ) : null}
        {item.rating ? (
          <p className="mt-3 font-heading text-lg tracking-[0.22em] text-[#f6a15c]">
            {renderStars(item.rating)}
          </p>
        ) : null}
      </div>
    </ScrollReveal>
  );
};

const ExperiencesPage = () => {
  const t = useSiteText();
  const { experiences } = useEditableContent();
  const athleteQuotes = experiences.filter((e) => e.type === "quote");
  const parentQuotes = experiences.filter((e) => e.type === "parent");

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#45c0b2]">
        <div className="absolute left-4 top-10 h-12 w-12 rounded-full bg-white/10 sm:left-8 sm:top-12 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24" />
        <div className="absolute left-[20%] top-8 hidden h-14 w-14 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute right-6 top-10 h-12 w-12 rotate-45 bg-white/10 sm:right-10 sm:h-20 sm:w-20 md:h-24 md:w-24" />
        <div className="absolute right-[22%] top-28 hidden h-12 w-12 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-12 bottom-8 hidden h-0 w-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent border-b-white/10 md:block" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="text-balance">{t("experiences.heroTitle")}</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              {t("experiences.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {parentQuotes.length > 0 ? (
        <section className="pt-14 pb-8 md:pt-28 md:pb-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-8 md:mb-12 text-center">
                {t("experiences.parentsHeading")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parentQuotes.map((q, i) => (
                <QuoteCard key={q.id} item={q} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {athleteQuotes.length > 0 ? (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-8 md:mb-12 text-center">
                {t("experiences.athletesHeading")}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athleteQuotes.map((q, i) => (
                <QuoteCard key={q.id} item={q} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-card py-14 md:py-20 scratchy-overlay">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 font-heading text-4xl md:text-5xl font-black uppercase">
              {t("experiences.ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
              {t("experiences.ctaBody")}
            </p>
            <Link
              to="/moments"
              className="inline-block bg-accent px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
            >
              {t("experiences.ctaButton")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ExperiencesPage;

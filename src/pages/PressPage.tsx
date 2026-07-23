import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import type { PressArticle } from "@/data/press";
import { useEditableContent } from "@/lib/editable-content";
import { IS_SERVER } from "@/lib/ssr";
import { useSiteText } from "@/lib/use-site-text";

const outletColors = ["#87cb4a", "#84a6ff", "#ab9bfa", "#f6a15c"];

const ArticleCard = ({
  article,
  index,
  featured
}: {
  article: PressArticle;
  index: number;
  featured?: boolean;
}) => {
  const color = outletColors[index % outletColors.length];
  const hasImage = Boolean(article.image?.trim());

  return (
    <ScrollReveal
      delay={(index % 3) * 0.12}
      direction="up"
      className={featured ? "md:col-span-2" : ""}
    >
      <a
        href={article.href || undefined}
        target={article.href ? "_blank" : undefined}
        rel={article.href ? "noreferrer" : undefined}
        className={`group flex h-full flex-col overflow-hidden border-2 border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[8px_8px_0_0_hsl(var(--accent))] ${
          featured && hasImage ? "md:flex-row" : ""
        }`}
      >
        {hasImage ? (
          <div
            className={`overflow-hidden bg-muted ${
              featured
                ? "aspect-[16/9] md:aspect-auto md:w-1/2 md:shrink-0"
                : "aspect-[16/9]"
            }`}
          >
            <img
              src={article.image}
              alt={article.title}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className="px-3 py-1 font-heading text-xs font-black uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: color }}
            >
              {article.outlet || "Press"}
            </span>
            {article.date?.trim() ? (
              <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {article.date}
              </span>
            ) : null}
          </div>

          <h3
            className={`mb-3 font-heading font-black uppercase leading-tight text-foreground ${
              featured ? "text-3xl md:text-4xl" : "text-2xl"
            }`}
          >
            {article.title}
          </h3>

          {article.excerpt?.trim() ? (
            <p className="mb-5 font-body leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          ) : null}

          <span className="mt-auto inline-flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-accent">
            Read the article
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </a>
    </ScrollReveal>
  );
};

const PressPage = () => {
  const t = useSiteText();
  const { pressArticles } = useEditableContent();

  return (
    <div className="overflow-hidden">
      {/* Navy hero */}
      <section className="relative overflow-hidden bg-[#1e2b4f]">
        <div className="absolute left-4 top-10 h-12 w-12 rounded-full bg-white/10 sm:left-8 sm:top-12 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24" />
        <div className="absolute left-[20%] top-8 hidden h-14 w-14 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute right-6 top-10 h-12 w-12 rotate-45 bg-white/10 sm:right-10 sm:h-20 sm:w-20 md:h-24 md:w-24" />
        <div className="absolute right-[22%] top-28 hidden h-12 w-12 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-12 bottom-8 hidden h-0 w-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent border-b-white/10 md:block" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-28 md:pb-24">
          <motion.div
            initial={IS_SERVER ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="text-balance">{t("press.heroTitle")}</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              {t("press.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {pressArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {pressArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  featured={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border-2 border-dashed border-border bg-white p-10 text-center">
              <p className="mb-2 font-heading text-2xl font-black uppercase text-foreground">
                Press features coming soon
              </p>
              <p className="font-body text-muted-foreground">
                We're just getting started — check back for news stories about
                Together Sports.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card py-14 md:py-20 scratchy-overlay">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 font-heading text-4xl md:text-5xl font-black uppercase">
              {t("press.ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
              {t("press.ctaBody")}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-primary px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
            >
              {t("press.ctaButton")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default PressPage;

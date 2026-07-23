import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import type { PressArticle } from "@/data/press";
import { useEditableContent } from "@/lib/editable-content";
import { IS_SERVER } from "@/lib/ssr";
import { useSiteText } from "@/lib/use-site-text";

// Newsprint palette for the newspaper treatment.
const INK = "#1b1a17";
const FADED = "#8a8578";
const HAIRLINE = "#cfc9ba";
const BODY_INK = "#3a362f";

// Outlet name, or the publication's logo when one is uploaded.
const OutletTag = ({
  article,
  variant
}: {
  article: PressArticle;
  variant: "lead" | "column";
}) => {
  if (article.logo?.trim()) {
    return (
      <img
        src={article.logo}
        alt={article.outlet || "Publication logo"}
        loading="lazy"
        decoding="async"
        className={
          variant === "lead"
            ? "h-8 w-auto max-w-[190px] object-contain"
            : "h-6 w-auto max-w-[150px] object-contain"
        }
      />
    );
  }

  if (variant === "lead") {
    return (
      <span className="bg-[#87cb4a] px-3 py-1.5 font-['Oswald',sans-serif] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#12240a]">
        {article.outlet || "Press"}
      </span>
    );
  }

  return (
    <span className="font-['Oswald',sans-serif] text-xs font-semibold uppercase tracking-[0.12em] text-[#4a63d6]">
      {article.outlet || "Press"}
    </span>
  );
};

const ReadLink = ({ href, lead }: { href: string; lead?: boolean }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-block border-b-2 border-[#87cb4a] pb-0.5 font-['Oswald',sans-serif] font-semibold uppercase text-[#1b1a17] transition-colors hover:text-[#2f6d2f] ${
        lead ? "text-sm tracking-[0.1em]" : "text-[13px] tracking-[0.08em]"
      }`}
    >
      {lead ? "Read the full article →" : "Read →"}
    </a>
  ) : null;

// The first article runs as the lead story: photo on the left, headline and
// pull quote on the right, like a front page.
const LeadStory = ({ article }: { article: PressArticle }) => {
  const hasImage = Boolean(article.image?.trim());

  return (
    <ScrollReveal>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <OutletTag article={article} variant="lead" />
        <span
          className="font-['Oswald',sans-serif] text-[13px] uppercase tracking-[0.14em]"
          style={{ color: FADED }}
        >
          {[article.date?.trim(), "Lead Story"].filter(Boolean).join(" · ")}
        </span>
        <span
          aria-hidden
          className="hidden flex-1 -translate-y-1 border-t sm:block"
          style={{ borderColor: HAIRLINE }}
        />
      </div>

      <div
        className={`grid grid-cols-1 items-start gap-8 md:gap-11 ${
          hasImage ? "md:grid-cols-[1.15fr_1fr]" : ""
        }`}
      >
        {hasImage ? (
          <div className="border" style={{ borderColor: INK }}>
            <img
              src={article.image}
              alt={article.title}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="block w-full object-cover"
            />
          </div>
        ) : null}

        <div className={hasImage ? "" : "max-w-3xl"}>
          <h2
            className="mb-2 font-['Playfair_Display',serif] text-3xl font-extrabold leading-[1.04] sm:text-4xl md:text-[2.6rem]"
            style={{ color: INK }}
          >
            {article.title}
          </h2>
          {article.outlet?.trim() ? (
            <p
              className="mb-5 font-['Oswald',sans-serif] text-[13px] uppercase tracking-[0.1em]"
              style={{ color: FADED }}
            >
              From {article.outlet}
            </p>
          ) : null}

          {article.excerpt?.trim() ? (
            <p
              className="mb-5 font-['PT_Serif',serif] text-lg leading-relaxed"
              style={{ color: INK }}
            >
              <span
                aria-hidden
                className="float-left pr-2.5 pt-2 font-['Playfair_Display',serif] text-[3.4rem] font-extrabold leading-[0.7]"
              >
                “
              </span>
              {article.excerpt}
            </p>
          ) : null}

          <ReadLink href={article.href} lead />
        </div>
      </div>
    </ScrollReveal>
  );
};

const ColumnStory = ({
  article,
  columnIndex
}: {
  article: PressArticle;
  columnIndex: number;
}) => (
  <div
    className={`py-8 first:pt-0 md:px-7 md:py-0 ${
      columnIndex % 3 === 0 ? "" : "md:border-l"
    } border-t md:border-t-0 first:border-t-0`}
    style={{ borderColor: HAIRLINE }}
  >
    <div className="mb-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <OutletTag article={article} variant="column" />
      {article.date?.trim() ? (
        <span
          className="font-['Oswald',sans-serif] text-xs font-medium uppercase tracking-[0.12em]"
          style={{ color: FADED }}
        >
          · {article.date}
        </span>
      ) : null}
    </div>

    {article.image?.trim() ? (
      <div className="mb-3.5 border" style={{ borderColor: INK }}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover"
        />
      </div>
    ) : null}

    <h3
      className="mb-2.5 font-['Playfair_Display',serif] text-2xl font-bold leading-[1.1]"
      style={{ color: INK }}
    >
      {article.title}
    </h3>

    {article.excerpt?.trim() ? (
      <p
        className="mb-3.5 font-['PT_Serif',serif] text-[15px] leading-relaxed"
        style={{ color: BODY_INK }}
      >
        {article.excerpt}
      </p>
    ) : null}

    <ReadLink href={article.href} />
  </div>
);

const PressPage = () => {
  const t = useSiteText();
  const { pressArticles } = useEditableContent();
  const [lead, ...rest] = pressArticles;

  return (
    <div className="overflow-hidden bg-[#f4f1e9] pb-20 md:pb-28">
      {/* Masthead / nameplate */}
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 md:pt-20 lg:px-8">
        <motion.div
          initial={IS_SERVER ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="flex items-end justify-between border-b pb-2 font-['Oswald',sans-serif] text-xs uppercase tracking-[0.14em]"
            style={{ borderColor: INK, color: FADED }}
          >
            <span>{t("press.mastheadLeft")}</span>
            <span>{t("press.mastheadRight")}</span>
          </div>

          <div
            className="border-b-4 border-double px-2 pb-4 pt-6 text-center md:pb-5 md:pt-8"
            style={{ borderColor: INK }}
          >
            <p
              className="mb-3 font-['Oswald',sans-serif] text-[13px] uppercase tracking-[0.5em]"
              style={{ color: FADED }}
            >
              {t("press.heroTitle")}
            </p>
            <h1
              className="font-['Playfair_Display',serif] text-5xl font-black leading-[0.92] tracking-[-0.01em] sm:text-7xl md:text-[5.5rem]"
              style={{ color: INK }}
            >
              {t("press.mastheadTitle")}
            </h1>
            <p
              className="mt-3.5 font-['PT_Serif',serif] text-base italic sm:text-lg md:text-[19px]"
              style={{ color: "#54504a" }}
            >
              {t("press.heroSubtitle")}
            </p>
          </div>
          <div
            className="mt-[3px] border-t"
            style={{ borderColor: INK }}
          />
        </motion.div>
      </div>

      {lead ? (
        <>
          {/* Lead story */}
          <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
            <LeadStory article={lead} />
          </div>

          {rest.length > 0 ? (
            <>
              {/* Column rule */}
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div
                  className="mt-11 border-t-4 border-double"
                  style={{ borderColor: INK }}
                />
              </div>

              {/* Secondary stories in ruled columns */}
              <div className="mx-auto max-w-6xl px-4 pt-9 sm:px-6 lg:px-8">
                <ScrollReveal>
                  <p
                    className="mb-6 font-['Oswald',sans-serif] text-[13px] uppercase tracking-[0.14em]"
                    style={{ color: FADED }}
                  >
                    More Coverage
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {rest.map((article, index) => (
                      <ColumnStory
                        key={article.id}
                        article={article}
                        columnIndex={index}
                      />
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </>
          ) : null}
        </>
      ) : (
        // Empty state, in the same newsprint voice.
        <div className="mx-auto max-w-2xl px-4 pt-14 text-center sm:px-6">
          <p
            className="mb-2 font-['Playfair_Display',serif] text-3xl font-extrabold"
            style={{ color: INK }}
          >
            Press features coming soon
          </p>
          <p
            className="font-['PT_Serif',serif] italic"
            style={{ color: BODY_INK }}
          >
            We're just getting started — check back for news stories about
            Together Sports.
          </p>
        </div>
      )}

      {/* CTA, kept in the newspaper voice */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="mt-14 border-t-4 border-double md:mt-20"
          style={{ borderColor: INK }}
        />
        <ScrollReveal>
          <div className="mx-auto max-w-xl pt-10 text-center md:pt-12">
            <h2
              className="mb-3 font-['Playfair_Display',serif] text-3xl font-extrabold md:text-4xl"
              style={{ color: INK }}
            >
              {t("press.ctaHeading")}
            </h2>
            <p
              className="mb-6 font-['PT_Serif',serif] italic leading-relaxed"
              style={{ color: BODY_INK }}
            >
              {t("press.ctaBody")}
            </p>
            <Link
              to="/contact"
              className="inline-block border-b-2 border-[#87cb4a] pb-0.5 font-['Oswald',sans-serif] text-sm font-semibold uppercase tracking-[0.1em] transition-colors hover:text-[#2f6d2f]"
              style={{ color: INK }}
            >
              {t("press.ctaButton")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PressPage;

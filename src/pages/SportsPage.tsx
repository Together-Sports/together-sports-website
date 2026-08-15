import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IS_SERVER } from "@/lib/ssr";
import ScrollReveal from "@/components/ScrollReveal";
import tennisBall from "@/assets/TennisBall.webp";
import basketballBall from "@/assets/BasketballBall.webp";
import footballBall from "@/assets/FootballBall.webp";
import golfBall from "@/assets/GolfBall.webp";
import soccerBall from "@/assets/SoccerBall.webp";
import { useSiteText } from "@/lib/use-site-text";

// The site header already carries the Together Sports brand, so the cards
// show just the ball marks with the sport name (in each wordmark's color)
// instead of the full "TOGETHER <sport>" lockups.
const sports = [
  {
    name: "Together Tennis",
    label: "Tennis",
    color: "#87cb4a",
    image: tennisBall,
    path: "/sports/tennis"
  },
  {
    name: "Together Basketball",
    label: "Basketball",
    color: "#f6a15c",
    image: basketballBall,
    path: "/sports/basketball"
  },
  {
    name: "Together Football",
    label: "Football",
    color: "#a87878",
    image: footballBall,
    path: "/sports/football"
  },
  {
    name: "Together Golf",
    label: "Golf",
    color: "#a898f8",
    image: golfBall,
    path: "/sports/golf"
  },
  {
    name: "Together Soccer",
    label: "Soccer",
    color: "#78a8e8",
    image: soccerBall,
    path: "/sports/soccer"
  }
];

const SportsPage = () => {
  const t = useSiteText();
  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#f6a15c]">
        <div className="absolute left-6 top-10 h-14 w-14 rounded-full bg-white/10 sm:left-10 sm:h-20 sm:w-20" />
        <div className="absolute left-[18%] top-24 hidden h-12 w-12 rotate-45 bg-white/10 md:block" />
        <div className="absolute left-12 bottom-12 h-10 w-10 bg-white/10 scrapbook-rotate-2 sm:h-14 sm:w-14" />
        <div className="absolute right-8 top-12 h-12 w-12 bg-white/10 scrapbook-rotate-1 sm:h-16 sm:w-16" />
        <div className="absolute right-[16%] top-28 hidden h-24 w-24 rounded-full bg-white/10 md:block" />
        <div className="absolute right-12 bottom-10 h-16 w-16 rotate-45 bg-white/10 sm:h-24 sm:w-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-28 md:pb-24">
          <motion.div
            initial={IS_SERVER ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="text-balance">{t("sports.heroTitle")}</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              {t("sports.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-12 items-center">
            {sports.map((sport, i) => (
              <ScrollReveal
                key={sport.name}
                delay={i * 0.1}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <Link
                  to={sport.path}
                  className="group flex flex-col items-center justify-center gap-4 py-4 md:gap-5 md:py-6"
                >
                  <img
                    src={sport.image}
                    alt={sport.name}
                    loading="eager"
                    decoding="async"
                    className="h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:h-56 md:h-64"
                  />
                  <span
                    className="font-heading text-3xl font-black uppercase tracking-wide md:text-4xl"
                    style={{ color: sport.color }}
                  >
                    {sport.label}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-8 md:mt-14 text-center">
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                {t("sports.footnote")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default SportsPage;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import togetherTennis from "@/assets/TogetherTennis.webp";
import togetherBasketball from "@/assets/TogetherBB.webp";
import togetherFootball from "@/assets/TogetherFB.webp";
import togetherGolf from "@/assets/TogetherGolf.webp";
import togetherSoccer from "@/assets/TogetherSoccer.webp";

const sports = [
  { name: "Together Tennis", image: togetherTennis, path: "/sports/tennis" },
  { name: "Together Basketball", image: togetherBasketball, path: "/sports/basketball" },
  { name: "Together Football", image: togetherFootball, path: "/sports/football" },
  { name: "Together Golf", image: togetherGolf, path: "/sports/golf" },
  { name: "Together Soccer", image: togetherSoccer, path: "/sports/soccer" },
];

const SportsPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute left-6 top-10 h-14 w-14 rounded-full bg-white/10 sm:left-10 sm:h-20 sm:w-20" />
        <div className="absolute left-[18%] top-24 hidden h-12 w-12 rotate-45 bg-white/10 md:block" />
        <div className="absolute left-12 bottom-12 h-10 w-10 bg-white/10 scrapbook-rotate-2 sm:h-14 sm:w-14" />
        <div className="absolute right-8 top-12 h-12 w-12 bg-white/10 scrapbook-rotate-1 sm:h-16 sm:w-16" />
        <div className="absolute right-[16%] top-28 hidden h-24 w-24 rounded-full bg-white/10 md:block" />
        <div className="absolute right-12 bottom-10 h-16 w-16 rotate-45 bg-white/10 sm:h-24 sm:w-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="sm:whitespace-nowrap">Our </span>
              <span className="sm:whitespace-nowrap">Sports</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              Five sports. One mission. Building the next generation of leaders through access, mentorship, and play.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-center">
            {sports.map((sport, i) => (
              <ScrollReveal key={sport.name} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <Link to={sport.path} className="group flex items-center justify-center py-4 md:py-6">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    loading="eager"
                    decoding="async"
                    className="w-full max-w-[18rem] md:max-w-[22rem] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-12 md:mt-14 text-center">
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Each program is designed to build skills, character, and community.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default SportsPage;

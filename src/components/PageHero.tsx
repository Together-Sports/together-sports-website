import type { ReactNode } from "react";
import { motion } from "framer-motion";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
};

const PageHero = ({ eyebrow, title, description }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#84a6ff]/18 via-background to-[#4f74d6]/12">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-28 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-body font-bold uppercase tracking-[0.3em] text-primary text-sm md:text-base mb-3">
            {eyebrow}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-4 text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto font-body">{description}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;

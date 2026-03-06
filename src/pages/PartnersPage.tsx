import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import partner1 from "@/assets/partner-1.png";
import partner2 from "@/assets/partner-2.png";
import partner3 from "@/assets/partner-3.png";
import partner4 from "@/assets/partner-4.png";
import partner5 from "@/assets/partner-5.png";
import partner6 from "@/assets/partner-6.png";

const partners = [
  { name: "SportGear Pro", logo: partner1 },
  { name: "FitKids Foundation", logo: partner2 },
  { name: "PlayFields", logo: partner3 },
  { name: "HydraPower", logo: partner4 },
  { name: "CityFirst Bank", logo: partner5 },
  { name: "ActiveWear Co", logo: partner6 },
];

// Duplicate for seamless infinite scroll
const carouselItems = [...partners, ...partners];

const PartnersPage = () => {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative py-28 md:py-36 bg-primary">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body font-bold uppercase tracking-[0.3em] text-primary-foreground/70 text-sm mb-4">
              Together We Go Further
            </p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black uppercase text-primary-foreground mb-6">
              Our <span className="brush-underline">Partners</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
              We're proud to work alongside organizations that share our mission of building stronger communities through sport.
            </p>
          </motion.div>
        </div>
      </section>

      {/* INFINITE CAROUSEL */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4 text-center">
              Trusted By
            </p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-foreground text-center">
              Meet Our Partners
            </h2>
          </ScrollReveal>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-center gap-16 md:gap-24 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {carouselItems.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-40 h-28 md:w-52 md:h-36 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="py-20 md:py-28 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">
                Why Partner With Us
              </p>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-foreground mb-6">
                Make an <span className="brush-underline">Impact</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Together Sports partners gain visibility in the community while helping kids discover the joy of athletics.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Community Reach",
                description:
                  "Your brand connects with hundreds of families across local sports programs, events, and social media.",
                color: "bg-sport-tennis",
              },
              {
                title: "Shared Values",
                description:
                  "Align with a mission that champions teamwork, inclusivity, and youth development through sport.",
                color: "bg-sport-football",
              },
              {
                title: "Real Visibility",
                description:
                  "Logo placement on gear, courts, fields, and digital channels — your support is seen and appreciated.",
                color: "bg-sport-basketball",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15}>
                <div className="bg-background border-2 border-border p-8 md:p-10 hover:border-accent transition-colors duration-300">
                  <div className={`w-12 h-1.5 ${item.color} mb-6`} />
                  <h3 className="font-heading text-xl font-black uppercase mb-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase text-secondary-foreground mb-6">
              Become a Partner
            </h2>
            <p className="text-secondary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
              Interested in partnering with Together Sports? We'd love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-block bg-accent text-accent-foreground font-heading font-bold uppercase tracking-wider px-10 py-4 text-lg hover:scale-105 transition-transform duration-200"
            >
              Get in Touch
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;

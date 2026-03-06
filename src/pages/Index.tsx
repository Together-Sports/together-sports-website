import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import heroImage from "@/assets/hero-sports.jpg";
import tennisAction from "@/assets/tennis-action.jpg";
import basketballAction from "@/assets/basketball-action.jpg";
import footballAction from "@/assets/football-action.jpg";
import golfAction from "@/assets/golf-action.jpg";
import secondServe from "@/assets/second-serve.jpg";

const sports = [
  { name: "Tennis", image: tennisAction, path: "/sports/tennis" },
  { name: "Basketball", image: basketballAction, path: "/sports/basketball" },
  { name: "Football", image: footballAction, path: "/sports/football" },
  { name: "Golf", image: golfAction, path: "/sports/golf" },
];

const Index = () => {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative h-[100vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Youth sports action" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-deep-blue/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm md:text-base mb-4">
              Together Sports
            </p>
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] mb-6 text-white">
              Play Loud.
              <br />
              <span className="text-stroke-light">Build Strong.</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-lg mb-8 font-body">
              Empowering youth through sports, mentorship, and community — one game at a time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/sports"
                className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
              >
                Our Sports
              </Link>
              <Link
                to="/get-involved"
                className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
              >
                Donate Now
              </Link>
            </div>
          </motion.div>

          {/* Background text */}
          <div className="absolute -bottom-4 right-0 font-heading text-[12vw] font-black uppercase text-white/[0.05] leading-none select-none pointer-events-none hidden md:block">
            TOGETHER
          </div>
        </div>
      </section>

      {/* FEATURED SPORTS */}
      <section className="py-20 md:py-32 bg-card scratchy-overlay relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4">
              Our <span className="brush-underline">Sports</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md">
              Four sports. One mission. Building the next generation of leaders.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {sports.map((sport, i) => (
              <ScrollReveal key={sport.name} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <Link
                  to={sport.path}
                  className={`group relative block overflow-hidden h-[300px] md:h-[400px] ${
                    i % 2 === 1 ? "md:translate-y-8" : ""
                  }`}
                >
                  <img
                    src={sport.image}
                    alt={sport.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <h3 className="font-heading text-4xl md:text-5xl font-black uppercase text-white group-hover:text-accent transition-colors duration-300">
                      {sport.name}
                    </h3>
                    <span className="inline-block mt-2 text-sm font-body font-semibold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Explore →
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND SERVE */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="scrapbook-rotate-1">
                  <img
                    src={secondServe}
                    alt="Second Serve program"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent scrapbook-rotate-2 flex items-center justify-center">
                  <span className="font-heading text-white font-black text-xl uppercase text-center leading-tight">
                    Second<br />Serve
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <p className="font-body font-bold uppercase tracking-[0.2em] text-accent text-sm mb-4">Featured Program</p>
              <h2 className="font-heading text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-6">
                Every Kid Deserves a Second Serve
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Our flagship tennis program provides free coaching, equipment, and mentorship 
                to underserved youth. Because missing your first shot doesn't mean the game is over.
              </p>
              <Link
                to="/sports/tennis"
                className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
              >
                Learn More
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-32 bg-card scratchy-overlay relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-sport-tennis text-sm mb-4">
              Real Stories
            </p>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4 text-foreground">
              Together <span className="brush-underline">Tennis</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-lg">
              The little stories that show the big picture — connection, encouragement, and growth.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote: "My 4-year-old had her first tennis lesson with Coach Harry, and it couldn't have gone better. He met her where she was—encouraging, kind, and full of energy. Together Tennis makes tennis feel welcoming for families at every level.",
                name: "Leigh H.",
              },
              {
                quote: "Zoe had a great experience practicing tennis with Harry. He did an excellent job teaching her techniques to improve her game. I would highly recommend Harry to any students who are looking to become better tennis players.",
                name: "Michael B.",
              },
              {
                quote: "Theo has always been quite shy, especially in new environments where he would normally stay close to me. Seeing him open up with you has been truly special, thank you for helping him come out of his shell!",
                name: "Rachel L.",
              },
            ].map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.15}>
                <div
                  className={`relative bg-background p-8 md:p-10 border-2 border-border hover:border-sport-tennis transition-colors duration-300 ${
                    i === 1 ? "md:-translate-y-6 scrapbook-rotate-2" : i === 2 ? "scrapbook-rotate-3" : "scrapbook-rotate-1"
                  }`}
                >
                  <span className="absolute -top-5 left-6 font-heading text-8xl text-sport-tennis/30 leading-none select-none pointer-events-none">
                    &ldquo;
                  </span>
                  <p className="text-foreground text-base md:text-lg leading-relaxed mb-6 relative z-10 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-1 bg-sport-tennis" />
                    <span className="font-heading font-bold uppercase text-sm tracking-wider text-foreground">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-muted-foreground text-base md:text-lg">
              {[
                "The first time a ball clears the net",
                "The confidence that builds with each swing",
                "The laughter after a missed shot",
              ].map((moment) => (
                <span key={moment} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-sport-tennis rounded-full inline-block shrink-0" />
                  {moment}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Where We Are</p>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4">
              Our <span className="text-stroke">Location</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md">
              Based in New York City, serving communities across the five boroughs.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative w-full h-[400px] md:h-[500px] border-2 border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949658!2d-74.11976389828046!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: "none" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Together Sports NYC Location"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DONATE CTA */}
      <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full scrapbook-rotate-2" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 scrapbook-rotate-1" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="scale">
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase text-white leading-[0.85] mb-6">
              Change the Game.
              <br />
              <span className="text-white/60">Donate Today.</span>
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto font-body">
              Your contribution puts a racket, a ball, or a dream in a kid's hands. Every dollar counts.
            </p>
            <Link
              to="/get-involved"
              className="inline-block px-10 py-5 bg-accent text-white font-heading font-bold text-xl uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
            >
              Give Now →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;

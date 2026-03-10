import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import heroImage from "@/assets/hero-sports.jpg";
import secondServe from "@/assets/second-serve.jpg";
import partnerOne from "@/assets/partner-1.png";
import image0903 from "@/assets/IMG_0903.jpg";
import image3782 from "@/assets/IMG_3782.jpg";
import communityImg from "@/assets/community.jpg";
import spinBall from "@/assets/spinball.svg";
import basketSpin from "@/assets/BASKETSPIN.svg";
import footballSpin from "@/assets/FOOTBALLSPIN.svg";
import golfSpin from "@/assets/GOLFSPIN.svg";
import { useEditableContent } from "@/lib/editable-content";

const heroSpins = [
  {
    image: spinBall,
    className:
      "absolute bottom-10 left-12 z-0 w-44 sm:bottom-12 sm:left-16 sm:w-52 md:bottom-10 md:left-24 md:w-60 lg:bottom-12 lg:left-16 lg:w-[17rem]",
    rotate: -360,
    duration: 24,
    delay: 0,
    scaleX: 1,
  },
  {
    image: golfSpin,
    className:
      "absolute right-10 top-24 z-0 hidden w-24 sm:block sm:right-14 sm:top-28 sm:w-28 md:right-20 md:top-24 md:w-36 lg:right-28 lg:top-32 lg:w-40",
    rotate: 360,
    duration: 18,
    delay: 1.5,
    scaleX: 1,
  },
  {
    image: basketSpin,
    className:
      "absolute left-[-8rem] top-10 z-0 hidden w-60 sm:block sm:left-[-9rem] sm:top-14 sm:w-72 md:left-[-10rem] md:top-16 md:w-80 lg:left-[-11rem] lg:top-18 lg:w-[26rem]",
    rotate: 360,
    duration: 28,
    delay: 3,
    scaleX: 1,
  },
  {
    image: footballSpin,
    className:
      "absolute bottom-8 right-4 z-0 hidden w-56 sm:block sm:bottom-10 sm:right-6 sm:w-64 md:bottom-10 md:right-8 md:w-72 lg:bottom-12 lg:right-10 lg:w-[20rem]",
    rotate: 0,
    duration: 0,
    delay: 0,
    scaleX: -1,
  },
];

const sportsCtaSpins = [
  {
    image: spinBall,
    className: "absolute left-20 top-1/2 hidden w-32 -translate-y-1/2 xl:block",
    rotate: -360,
    duration: 24,
    delay: 0,
    scaleX: 1,
  },
  {
    image: basketSpin,
    className: "absolute left-[19%] top-1/2 hidden w-32 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 28,
    delay: 1.5,
    scaleX: 1,
  },
  {
    image: golfSpin,
    className: "absolute right-[19%] top-1/2 hidden w-32 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 18,
    delay: 0.8,
    scaleX: 1,
  },
  {
    image: footballSpin,
    className: "absolute right-20 top-1/2 hidden w-32 -translate-y-1/2 xl:block",
    rotate: 360,
    duration: 30,
    delay: 2.2,
    scaleX: -1,
  },
];

const Index = () => {
  const { experiences, impactMetricsSection } = useEditableContent();
  const featuredTestimonials = experiences
    .filter((item) => item.type === "quote" || item.type === "parent")
    .slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#84a6ff]/18 via-background to-[#4f74d6]/12">
        {heroSpins.map((item) => (
          <motion.div
            key={item.image}
            className={item.className}
            whileHover={{ scale: 1.08, y: -6 }}
            transition={{ scale: { duration: 0.2, ease: "easeOut" }, y: { duration: 0.2, ease: "easeOut" } }}
          >
            <motion.img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="block w-full h-auto"
              initial={item.duration > 0 ? { rotate: 0, scaleX: item.scaleX } : { scaleX: item.scaleX }}
              animate={item.duration > 0 ? { rotate: item.rotate, scaleX: item.scaleX } : { scaleX: item.scaleX }}
              transition={
                item.duration > 0
                  ? { rotate: { duration: item.duration, delay: item.delay, ease: "linear", repeat: Infinity } }
                  : undefined
              }
            />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-32 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] gap-14 lg:gap-28 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[6.4rem] xl:text-[7rem] font-black uppercase leading-[0.94] mb-8 text-foreground">
                <span className="block whitespace-nowrap">Play Loud.</span>
                <span className="block whitespace-nowrap text-[#4f74d6]">Build Strong.</span>
              </h1>
              <p className="text-foreground/70 text-lg md:text-xl max-w-xl mb-8 font-body">
                Together Sports is empowering youth through sports, mentorship, and community — one game at a time.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#sports"
                  className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
                >
                  Our Sports
                </a>
                <Link
                  to="/get-involved"
                  className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
                >
                  Donate Now
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="relative h-[420px] sm:h-[600px] md:h-[680px] w-full max-w-[680px] mx-auto -translate-y-4 sm:-translate-y-8 md:-translate-y-12 lg:mx-0 lg:ml-20 lg:-translate-y-20"
            >
              <div className="absolute left-10 -top-6 w-[68%] h-[40%] overflow-hidden border-[10px] border-white bg-white scrapbook-rotate-2 z-10">
                <img
                  src={image0903}
                  alt="Together Sports action moment"
                  className="block w-full h-full object-cover"
                />
              </div>
              <div className="absolute right-2 top-[22%] w-[82%] h-[46%] overflow-hidden border-[12px] border-white bg-white scrapbook-rotate-1 z-10">
                <img
                  src={heroImage}
                  alt="Together Sports community moment"
                  className="block w-full h-full object-cover"
                />
              </div>
              <div className="absolute left-[-2%] bottom-[2%] w-[74%] h-[42%] overflow-hidden border-[10px] border-white bg-white scrapbook-rotate-2 z-20">
                <img
                  src={image3782}
                  alt="Together Sports team moment"
                  className="block w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT MISSION */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <ScrollReveal direction="right">
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-6 text-foreground">
                Our <span className="brush-underline">Mission</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Together Sports is a nonprofit dedicated to building stronger communities through athletics. We provide
                accessible sports programs and create opportunities for youth to connect, grow, and thrive.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                We believe every kid deserves a chance to play. Through free sports programs, mentorship, and community
                building, we&apos;re creating the next generation of leaders — on and off the field.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                From tennis courts to basketball hoops, from football fields to golf courses — we meet kids where they are
                and take them where they want to go.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div className="scrapbook-rotate-2">
                <img src={communityImg} alt="Together Sports community" className="w-full h-[340px] md:h-[420px] object-cover" />
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-16 md:mt-20">
            <ScrollReveal>
              <h3 className="font-heading text-4xl md:text-6xl font-black uppercase mb-12 text-foreground">
                What{" "}
                <span className="relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-2 after:w-full after:skew-x-[-12deg] after:rounded-[2px] after:bg-[#87cb4a] after:content-['']">
                  <span className="relative z-10">We</span>
                </span>
                {" "}Stand For
              </h3>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {[
                {
                  title: "Access",
                  desc: "Every kid plays, regardless of background or income.",
                  bg: "bg-[#f6a15c]",
                  hoverMotion: "hover:-rotate-1",
                },
                {
                  title: "Growth",
                  desc: "Sports build character, discipline, and confidence.",
                  bg: "bg-[#87cb4a]",
                  hoverMotion: "hover:rotate-1",
                },
                {
                  title: "Community",
                  desc: "We rise together — athletes, mentors, families.",
                  bg: "bg-[#ab9bfa]",
                  hoverMotion: "hover:-rotate-1",
                },
              ].map((value, index) => (
                <ScrollReveal key={value.title} delay={index * 0.12}>
                  <div
                    className={`group border-2 border-transparent p-8 md:p-10 transition-all duration-200 hover:scale-105 ${value.bg} ${value.hoverMotion}`}
                  >
                    <h4 className="font-heading text-3xl md:text-4xl font-black uppercase mb-4 text-white">
                      {value.title}
                    </h4>
                    <p className="text-lg md:text-xl leading-relaxed text-white">
                      {value.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPORTS CTA */}
      <section id="sports" className="py-20 md:py-24 bg-white relative">
        {sportsCtaSpins.map((item) => (
          <motion.div
            key={`sports-cta-${item.image}`}
            className={item.className}
          >
            <motion.img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="block w-full h-auto"
              initial={{ rotate: 0, scaleX: item.scaleX }}
              animate={{ rotate: item.rotate, scaleX: item.scaleX }}
              transition={{ rotate: { duration: item.duration, delay: item.delay, ease: "linear", repeat: Infinity } }}
            />
          </motion.div>
        ))}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4">
                Our Sports
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Explore all four Together Sports programs in one place.
              </p>
              <Link
                to="/sports"
                className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:-rotate-1 transition-all duration-200"
              >
                View All Sports
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-16 bg-[#87cb4a] relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="absolute -top-8 -left-8 h-28 w-28 rounded-full bg-white/10 scrapbook-rotate-2" />
        <div className="absolute left-1/4 top-10 h-20 w-20 rounded-full bg-white/10 xl:left-[26%] xl:top-12 xl:h-24 xl:w-24" />
        <div className="absolute top-10 right-8 h-14 w-14 bg-white/10 scrapbook-rotate-3" />
        <div className="absolute -bottom-10 right-0 h-40 w-40 bg-white/10 scrapbook-rotate-1" />
        <div className="absolute left-6 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/10 xl:h-64 xl:w-64" />
        <div className="absolute right-32 top-20 h-24 w-24 rotate-45 bg-white/10 xl:right-40 xl:top-24 xl:h-32 xl:w-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="px-6 py-8 md:px-10 md:py-10 lg:px-12">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4 text-white text-center">
                Testimonials
              </h2>
              <p className="text-white font-bold text-lg mb-20 max-w-lg mx-auto text-center">
                The little stories that show the big picture: connection, encouragement, and growth.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredTestimonials.map((testimonial, i) => (
                <ScrollReveal key={testimonial.id} delay={i * 0.15}>
                  <div
                    className={`relative bg-white p-8 md:p-10 transition-all duration-200 hover:scale-105 ${
                      i === 1
                        ? "md:-translate-y-6 scrapbook-rotate-2 hover:rotate-1"
                        : i === 2
                          ? "scrapbook-rotate-3 hover:-rotate-1"
                          : "scrapbook-rotate-1 hover:-rotate-1"
                    }`}
                  >
                    <span
                      className="absolute -top-5 left-6 font-heading text-8xl leading-none select-none pointer-events-none"
                      style={{
                        color: i === 0 ? "#ab9bfa" : i === 1 ? "#f6a15c" : "#84a6ff",
                        WebkitTextStroke: "2px white",
                      }}
                    >
                      &ldquo;
                    </span>
                    <p className="text-foreground text-base md:text-lg leading-relaxed mb-6 relative z-10 italic">
                      &ldquo;{testimonial.quote || ""}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-1 ${i === 0 ? 'bg-[#ab9bfa]' : i === 1 ? 'bg-[#f6a15c]' : 'bg-[#84a6ff]'}`} />
                      <span className="font-heading font-bold uppercase text-sm tracking-wider text-foreground">
                        {testimonial.name}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {impactMetricsSection.isVisible && impactMetricsSection.items.length > 0 ? (
        <section className="py-10 md:py-12 bg-white relative">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-5 md:flex-row md:flex-nowrap md:justify-center md:items-stretch md:gap-6">
              {impactMetricsSection.items.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.08}>
                  <div
                    className="flex h-full min-h-[220px] w-full max-w-[360px] flex-col justify-between bg-white border-4 px-6 py-7 text-center md:min-h-[240px] md:w-[220px] md:max-w-none md:px-6 md:py-8 lg:w-[240px] lg:px-6 xl:w-[260px] xl:px-7"
                    style={{ borderColor: item.color }}
                  >
                    <p
                      className="font-heading text-xl md:text-2xl font-black uppercase leading-tight"
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </p>
                    <p className="font-heading text-5xl md:text-6xl font-black uppercase text-foreground leading-none">
                      {item.value}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* SECOND SERVE */}
      <section className="pt-20 pb-16 md:pt-20 md:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="scrapbook-rotate-1">
                  <img
                    src={secondServe}
                    alt="Second Serve service"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-[8px] border-accent bg-white p-3 scrapbook-rotate-2 flex items-center justify-center">
                  <img
                    src={partnerOne}
                    alt="Second Serve partner logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <p className="font-body font-bold uppercase tracking-[0.2em] text-accent text-sm mb-4">Featured Service</p>
              <h2 className="font-heading text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-6">
                Every Kid Deserves a Second Serve
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Second Serve is a service from our partner Second Serve, and it also inspires a Together Tennis
                initiative where we collect quality used equipment that would otherwise be thrown away and donate it
                back into the community.
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

      {/* LOCATION */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-4 whitespace-nowrap">
              Our <span className="brush-underline inline-block">Location</span>
              <span className="ml-2 inline-block text-[0.9em] normal-case align-[0.02em] md:ml-3">
                📍
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Based in New York City, serving communities across the five boroughs.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div
              className="relative w-full h-[400px] md:h-[500px] border-2 border-border overflow-hidden"
              onWheel={(e) => e.preventDefault()}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949658!2d-74.11976389828046!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1e0!2e0"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Together Sports NYC Location"
              />
              <div
                className="absolute inset-0"
                style={{ background: "transparent", cursor: "default" }}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const x = e.clientX - rect.left;
                  if (y > rect.height - 80 && x > rect.width - 80) {
                    e.currentTarget.style.pointerEvents = "none";
                    setTimeout(() => {
                      (e.currentTarget as HTMLDivElement).style.pointerEvents = "auto";
                    }, 100);
                  }
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* DONATE CTA */}
      <section className="py-20 md:py-28 bg-[#84a6ff] relative overflow-hidden">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#bcd2ff]/30" />
        <div className="absolute right-0 top-4 h-32 w-32 rotate-45 bg-[#bcd2ff]/30" />
        <div className="absolute left-[20%] bottom-2 h-28 w-28 rounded-full bg-[#bcd2ff]/30" />
        <div className="absolute right-[18%] bottom-16 h-24 w-24 bg-[#bcd2ff]/30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="scale">
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase text-white leading-[0.85] mb-6">
              Change the Game.
              <br />
              <span className="text-white">Donate Today.</span>
            </h2>
            <p className="text-white font-bold text-lg mb-8 max-w-lg mx-auto font-body">
              Your contribution puts a racket, a ball, or a dream in a kid&apos;s hands. Every dollar counts.
            </p>
            <Link
              to="/get-involved"
              className="inline-block px-10 py-5 border-4 border-white bg-accent text-white font-heading font-bold text-xl uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
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

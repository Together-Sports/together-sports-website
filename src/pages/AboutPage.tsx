import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import communityImg from "@/assets/community.jpg";
import mentorshipImg from "@/assets/mentorship.jpg";

const AboutPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">About Us</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-6">
              More Than<br /><span className="text-stroke">A Game</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Together Sports is a nonprofit dedicated to building stronger communities through athletics.
              We provide accessible sports programs and create opportunities for youth to connect, grow, and thrive.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="scrapbook-rotate-3">
                <img src={communityImg} alt="Community" className="w-full h-[400px] object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase mb-6">
                Our <span className="brush-underline">Mission</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                We believe every kid deserves a chance to play. Through free sports programs, mentorship, and community building,
                we're creating the next generation of leaders — on and off the field.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                From tennis courts to basketball hoops, from football fields to golf courses — we meet kids where they are 
                and take them where they want to go.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12 text-center">
              What We <span className="text-accent">Stand For</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Access", desc: "Every kid plays, regardless of background or income." },
              { title: "Growth", desc: "Sports build character, discipline, and confidence." },
              { title: "Community", desc: "We rise together — athletes, mentors, families." },
            ].map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.15}>
                <div className={`p-8 bg-background border border-border hover:border-accent transition-colors duration-300 ${i === 1 ? 'md:-translate-y-4' : ''}`}>
                  <h3 className="font-heading text-3xl font-black uppercase mb-3 text-accent">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase mb-6">
                Built By <span className="brush-underline">People</span> Who Care
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our team is made up of coaches, former athletes, educators, and community leaders
                who share one belief: sport changes lives.
              </p>
              <Link
                to="/contact"
                className="inline-block px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
              >
                Meet the Team
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="scrapbook-rotate-2">
                <img src={mentorshipImg} alt="Our Team" className="w-full h-[400px] object-cover" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

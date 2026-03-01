import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const GetInvolvedPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 md:py-32 bg-primary">
        <div className="absolute inset-0 scratchy-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-white/70 text-sm mb-4">Join the Movement</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85] text-white">
              Get <span className="text-stroke-light">Involved</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Ways to help */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Donate", desc: "Fund equipment, coaches, and programs that change lives.", cta: "Give Now", icon: "💛" },
              { title: "Volunteer", desc: "Coach, mentor, or help organize events in your community.", cta: "Sign Up", icon: "🤝" },
              { title: "Partner", desc: "Corporate sponsors and local businesses — let's build together.", cta: "Learn More", icon: "🏢" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15} direction="up">
                <div className={`p-8 md:p-10 bg-card border border-border hover:border-accent transition-all duration-300 h-full flex flex-col ${i === 1 ? "md:-translate-y-6" : ""}`}>
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-heading text-3xl font-black uppercase mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{item.desc}</p>
                  <a href="#" className="inline-block px-6 py-3 bg-accent text-white font-heading font-bold uppercase tracking-wider text-sm hover:scale-105 hover:rotate-1 transition-all duration-200 self-start">
                    {item.cta} →
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stripe placeholder */}
      <section className="py-16 md:py-24 bg-card scratchy-overlay">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="scale">
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">
              Make a <span className="brush-underline">Donation</span>
            </h2>
            <p className="text-muted-foreground mb-8">Secure payments powered by Stripe.</p>
            <div className="p-8 bg-background border-2 border-dashed border-border">
              <p className="text-muted-foreground font-body text-sm mb-4">Stripe Checkout Integration</p>
              <div className="space-y-3">
                {["$25", "$50", "$100", "$250"].map((amount) => (
                  <button
                    key={amount}
                    className="w-full p-4 bg-card border border-border font-heading font-bold text-lg uppercase hover:border-accent hover:text-accent transition-colors"
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 p-4 bg-accent text-white font-heading font-bold text-lg uppercase hover:scale-[1.02] transition-all">
                Donate →
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-heading text-4xl font-black uppercase mb-4">Stay in the <span className="text-accent">Loop</span></h2>
            <p className="text-muted-foreground mb-6">Get updates on programs, events, and impact stories.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              <button className="px-6 py-4 bg-primary text-white font-heading font-bold uppercase tracking-wider hover:scale-105 transition-all">
                Join
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default GetInvolvedPage;

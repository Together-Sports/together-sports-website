import ScrollReveal from "@/components/ScrollReveal";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 md:py-32 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Reach Out</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85]">
              Contact <span className="text-stroke">Us</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <h2 className="font-heading text-3xl font-black uppercase mb-8">
                Send Us a <span className="brush-underline">Message</span>
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                  <input type="text" placeholder="Last Name" className="p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                </div>
                <input type="email" placeholder="Email" className="w-full p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                <select className="w-full p-4 bg-card border border-border text-muted-foreground font-body focus:border-accent focus:outline-none">
                  <option>What's this about?</option>
                  <option>General Inquiry</option>
                  <option>Volunteer</option>
                  <option>Partnerships</option>
                  <option>Donations</option>
                  <option>Media</option>
                </select>
                <textarea rows={5} placeholder="Your message..." className="w-full p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-accent focus:outline-none resize-none" />
                <button type="submit" className="px-8 py-4 bg-accent text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200">
                  Send It →
                </button>
              </form>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-8 lg:pt-16">
                {[
                  { icon: Mail, label: "Email", value: "hello@togethersports.org" },
                  { icon: Phone, label: "Phone", value: "(555) 123-4567" },
                  { icon: MapPin, label: "Location", value: "Serving communities nationwide" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-accent" size={20} />
                    </div>
                    <div>
                      <p className="font-heading font-bold uppercase text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-foreground font-body text-lg">{item.value}</p>
                    </div>
                  </div>
                ))}

                <div className="p-6 bg-card border border-border mt-8">
                  <h3 className="font-heading text-xl font-black uppercase mb-2">Follow Us</h3>
                  <p className="text-muted-foreground text-sm">
                    Stay connected on social media for the latest updates, events, and stories from the field.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import contactImage from "@/assets/contact-community.jpg";

const ContactPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#f6a15c]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="whitespace-nowrap">Contact </span>
              <span className="whitespace-nowrap">Us</span>
            </h1>
            <p className="text-foreground text-lg md:text-xl max-w-2xl mx-auto font-body">
              Questions, partnerships, volunteering, or support requests, reach out and we will point you in the right direction.
            </p>
          </motion.div>
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
              <div className="relative h-full min-h-[400px]">
                <img
                  src={contactImage}
                  alt="Youth tennis coaching session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-accent scrapbook-rotate-2 flex items-center justify-center">
                  <span className="font-heading text-white font-black text-sm uppercase text-center leading-tight">
                    Let's<br />Connect
                  </span>
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

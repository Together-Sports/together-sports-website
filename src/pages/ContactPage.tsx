import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import contactLogo from "@/assets/SPORTSTOGETHERHANDLOGO.png";

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#f6a15c]">
        <div className="absolute left-4 top-8 h-14 w-14 rounded-full bg-white/10 sm:left-8 sm:top-10 sm:h-20 sm:w-20" />
        <div className="absolute left-[22%] top-20 hidden h-12 w-12 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute right-4 top-10 h-12 w-12 rotate-45 bg-white/10 sm:right-12 sm:top-12 sm:h-16 sm:w-16" />
        <div className="absolute right-[24%] top-24 hidden h-14 w-14 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-10 bottom-8 h-8 w-8 bg-white/10 scrapbook-rotate-3 sm:right-20 sm:h-10 sm:w-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="sm:whitespace-nowrap">Contact </span>
              <span className="sm:whitespace-nowrap">Us</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              Questions, partnerships, volunteering, or support requests, reach out and we will point you in the right
              direction.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-10 lg:items-stretch">
            <ScrollReveal direction="left">
              <div className="h-full flex flex-col">
                <h2 className="font-heading text-3xl font-black uppercase mb-8 md:mb-6">
                  Send Us a <span className="text-[#f6a15c]">Message</span>
                </h2>
                <form
                  className="space-y-4 flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsSubmitted(true);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-[#f6a15c] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-[#f6a15c] focus:outline-none"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-[#f6a15c] focus:outline-none"
                  />
                  <select className="w-full p-4 bg-card border border-border text-foreground font-body focus:border-[#f6a15c] focus:outline-none">
                    <option>What&apos;s this about?</option>
                    <option>General Inquiry</option>
                    <option>Volunteer</option>
                    <option>Partnerships</option>
                    <option>Donations</option>
                    <option>Media</option>
                  </select>
                  <textarea
                    rows={5}
                    placeholder="Your message..."
                    className="w-full p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-[#f6a15c] focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#f6a15c] text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200"
                  >
                    Send It →
                  </button>
                  {isSubmitted ? (
                    <p className="text-[#f6a15c] font-body font-bold text-base">
                      Your message has been sent.
                    </p>
                  ) : null}
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="h-full min-h-[260px] flex items-center justify-center p-6 sm:min-h-[320px] md:min-h-[390px] md:p-10">
                <img src={contactLogo} alt="Together Sports logo" className="w-full max-w-md h-auto object-contain" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

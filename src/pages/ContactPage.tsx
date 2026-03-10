import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import ScrollReveal from "@/components/ScrollReveal";
import contactLogo from "@/assets/SPORTSTOGETHERHANDLOGO.png";
import {
  CONTACT_MESSAGE_MAX_CHARS,
  contactFormSchema,
  contactTopicOptions,
  type ContactFormValues,
} from "@/lib/contact-form";

const fieldClass =
  "w-full p-4 bg-card border border-border text-foreground font-body placeholder:text-muted-foreground focus:border-[#f6a15c] focus:outline-none";

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      topic: "General Inquiry",
      message: "",
      website: "",
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitted(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        const message = data?.error || "Unable to send your message right now.";
        toast.error(message);
        return;
      }

      setIsSubmitted(true);
      reset();
      toast.success("Your message has been sent.");
    } catch {
      toast.error("Unable to send your message right now.");
    }
  };

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
                <form className="space-y-4 flex-1" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input type="text" placeholder="First Name" className={fieldClass} {...register("firstName")} />
                      {errors.firstName ? <p className="text-sm text-[#8d5120]">{errors.firstName.message}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <input type="text" placeholder="Last Name" className={fieldClass} {...register("lastName")} />
                      {errors.lastName ? <p className="text-sm text-[#8d5120]">{errors.lastName.message}</p> : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input type="email" placeholder="Email" className={fieldClass} {...register("email")} />
                    {errors.email ? <p className="text-sm text-[#8d5120]">{errors.email.message}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <select className={fieldClass} {...register("topic")}>
                      {contactTopicOptions.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    {errors.topic ? <p className="text-sm text-[#8d5120]">{errors.topic.message}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      placeholder="Your message..."
                      className={`${fieldClass} resize-none`}
                      maxLength={CONTACT_MESSAGE_MAX_CHARS}
                      {...register("message")}
                    />
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{messageLength}/{CONTACT_MESSAGE_MAX_CHARS}</span>
                      {errors.message ? <span className="text-[#8d5120]">{errors.message.message}</span> : null}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-[#f6a15c] text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 hover:rotate-1 transition-all duration-200 disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Send It →"}
                  </button>

                  {isSubmitted ? (
                    <p className="text-[#f6a15c] font-body font-bold text-base">Your message has been sent.</p>
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

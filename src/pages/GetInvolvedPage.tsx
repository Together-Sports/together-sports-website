import { useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import StripeDonateSection from "@/components/StripeDonateSection";
import {
  HandCoins,
  Handshake,
  HeartHandshake,
  type LucideIcon
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSiteText } from "@/lib/use-site-text";

const getInvolvedItems: {
  title: string;
  desc: string;
  cta: string;
  Icon: LucideIcon;
  color: string;
  href: string;
  external: boolean;
}[] = [
  {
    title: "Donate",
    desc: "Fund equipment, coaching, transportation, and programs that open the door for more young athletes to play.",
    cta: "Give Now",
    Icon: HandCoins,
    color: "#f6a15c",
    href: "#donate",
    external: false
  },
  {
    title: "Volunteer",
    desc: "Coach, mentor, support sessions, or help organize community events that make every program run stronger.",
    cta: "Sign Up",
    Icon: HeartHandshake,
    color: "#ab9bfa",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSes2__aGaa25i1By5o-fc_pBHDxSnjnaBDJGzHsDOaKR_FKDw/viewform?usp=publish-editor",
    external: true
  },
  {
    title: "Partner",
    desc: "Bring your school, organization, or business into the mission and help expand access through collaboration.",
    cta: "Learn More",
    Icon: Handshake,
    color: "#87cb4a",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSePxWPnfSmEIF77mppapcF8fMcIhBC4uhE1c5EVux0dAK6pmA/viewform?usp=header",
    external: true
  }
];

const GetInvolvedPage = () => {
  const t = useSiteText();
  const cards = getInvolvedItems.map((item, index) => ({
    ...item,
    title: t(`getInvolved.card${index + 1}Title`),
    desc: t(`getInvolved.card${index + 1}Body`),
    cta: t(`getInvolved.card${index + 1}Button`)
  }));
  const location = useLocation();
  const showDonationSuccess =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("donation") === "success";

  useEffect(() => {
    // Bring the donate section into view both for #donate links and when
    // Stripe sends the donor back with ?donation=success.
    if (location.hash !== "#donate" && !showDonationSuccess) {
      return;
    }

    const donateSection = document.getElementById("donate");
    donateSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, showDonationSuccess]);

  return (
    <div className="overflow-hidden">
      <section className="bg-primary min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] py-12 md:py-16">
        <div className="absolute left-6 top-10 h-16 w-16 rounded-full bg-white/10 sm:left-10 sm:top-12 sm:h-24 sm:w-24 md:h-32 md:w-32" />
        <div className="absolute left-[28%] top-14 h-10 w-10 rounded-full bg-white/10 sm:h-14 sm:w-14 md:h-20 md:w-20" />
        <div className="absolute right-8 top-12 h-8 w-8 rounded-full bg-white/10 sm:right-12 sm:h-10 sm:w-10 md:h-14 md:w-14" />
        <div className="absolute right-6 top-28 h-28 w-28 rounded-full bg-white/10 sm:right-10 sm:h-36 sm:w-36 md:right-14 md:h-56 md:w-56" />
        <div className="absolute left-0 bottom-10 h-24 w-24 rounded-full bg-white/10 sm:h-32 sm:w-32 md:h-44 md:w-44" />
        <div className="absolute right-10 bottom-14 h-10 w-10 rounded-full bg-white/10 sm:h-12 sm:w-12 md:h-16 md:w-16" />
        <div className="absolute right-[22%] bottom-8 h-8 w-8 rotate-45 bg-white/10 sm:h-10 sm:w-10 md:h-14 md:w-14" />
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8 md:min-h-[calc(100vh-5rem)]">
          <div className="relative z-10 w-full max-w-6xl">
            <div className="mb-10 text-center md:mb-12">
              <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] text-white">
                {t("getInvolved.heroTitle")}
              </h1>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8">
              {cards.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.15} direction="up">
                  <div className="flex h-full min-h-[400px] flex-col bg-white p-8 md:min-h-[500px] md:p-10">
                    <div className="mb-6">
                      <item.Icon
                        className="h-12 w-12 md:h-14 md:w-14"
                        strokeWidth={2.2}
                        style={{ color: item.color }}
                      />
                    </div>
                    <h3 className="mb-4 font-heading text-4xl font-black uppercase leading-[0.95] md:text-5xl">
                      {item.title}
                    </h3>
                    <p className="mb-8 flex-1 text-xl leading-relaxed text-muted-foreground md:text-2xl">
                      {item.desc}
                    </p>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="inline-block self-start px-8 py-4 font-heading text-base font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105 hover:rotate-1 md:text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.cta} →
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="donate" className="scroll-mt-24 bg-[#f4f8ff] py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {showDonationSuccess ? (
            <div className="relative mb-8 overflow-hidden rounded-2xl border-2 border-[#87cb4a] bg-white p-8 text-center shadow-[8px_8px_0_0_#87cb4a] md:p-12">
              <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[#84a6ff]/15" />
              <div className="absolute -right-3 top-8 h-10 w-10 rotate-45 bg-[#f6a15c]/20" />
              <div className="absolute bottom-4 left-8 h-8 w-8 rounded-full bg-[#ab9bfa]/20" />
              <p className="mb-2 text-4xl" aria-hidden>
                🎉💚🎉
              </p>
              <h2 className="mb-3 font-heading text-4xl font-black uppercase leading-none text-foreground md:text-5xl">
                Thank{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">You!</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-3 -skew-x-12 rounded-sm bg-[#87cb4a]/60"
                  />
                </span>
              </h2>
              <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Your donation just put another kid in the game. Equipment,
                coaching, and free programs — that's what your generosity
                funds, and it starts right away.
              </p>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
                A receipt for your records is on its way to your email.
                Together Sports is a 501(c)(3) nonprofit, so your charitable
                donation is tax-deductible to the extent allowed by law.
              </p>
            </div>
          ) : null}

          <StripeDonateSection />
        </div>
      </section>
    </div>
  );
};

export default GetInvolvedPage;

import { Link } from "react-router-dom";
import type { SVGProps } from "react";
import footerLogo from "@/assets/SPORTSTOGETHERHANDLOGOFORDARKBACKS.png";

type SocialIconProps = SVGProps<SVGSVGElement>;

const InstagramIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8 0C5.826 0 5.555.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76c-.198.509-.333 1.09-.371 1.943C.01 5.555 0 5.826 0 8c0 2.174.01 2.445.048 3.297.038.852.173 1.434.371 1.943a3.9 3.9 0 0 0 .923 1.417 3.9 3.9 0 0 0 1.417.923c.509.198 1.09.333 1.943.371C5.555 15.99 5.826 16 8 16c2.174 0 2.445-.01 3.297-.048.852-.038 1.434-.173 1.943-.371a4 4 0 0 0 2.34-2.34c.198-.509.333-1.09.371-1.943C15.99 10.445 16 10.174 16 8c0-2.174-.01-2.445-.048-3.297-.038-.852-.173-1.434-.371-1.943a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.509-.198-1.09-.333-1.943-.371C10.445.01 10.174 0 8 0m0 1.441c2.137 0 2.39.008 3.232.046.779.035 1.203.166 1.484.275.372.145.637.318.916.597s.452.544.597.916c.109.281.24.705.275 1.484.038.842.046 1.095.046 3.232s-.008 2.39-.046 3.232c-.035.779-.166 1.203-.275 1.484a2.46 2.46 0 0 1-.597.916 2.46 2.46 0 0 1-.916.597c-.281.109-.705.24-1.484.275-.842.038-1.095.046-3.232.046s-2.39-.008-3.232-.046c-.779-.035-1.203-.166-1.484-.275a2.46 2.46 0 0 1-.916-.597 2.46 2.46 0 0 1-.597-.916c-.109-.281-.24-.705-.275-1.484C1.45 10.39 1.441 10.137 1.441 8s.008-2.39.046-3.232c.035-.779.166-1.203.275-1.484.145-.372.318-.637.597-.916s.544-.452.916-.597c.281-.109.705-.24 1.484-.275.842-.038 1.095-.046 3.232-.046" />
    <path d="M8 4.324A3.676 3.676 0 1 0 8 11.676 3.676 3.676 0 0 0 8 4.324m0 6.065A2.389 2.389 0 1 1 8 5.61a2.389 2.389 0 0 1 0 4.778m4.684-6.211a.86.86 0 1 1-1.72 0 .86.86 0 0 1 1.72 0" />
  </svg>
);

const TikTokIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M9.75 0h2.165c.17 1.47 1.005 2.64 2.335 3.36v2.203a5.45 5.45 0 0 1-2.321-.697v5.062c0 2.68-2.117 4.572-4.566 4.572-2.598 0-4.933-1.987-4.933-4.817 0-2.988 2.58-4.92 5.205-4.836v2.287c-1.313-.04-2.666.656-2.666 2.26 0 1.46 1.2 2.215 2.1 2.215.86 0 2.11-.55 2.11-2.145z" />
  </svg>
);

const LinkedInIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zM4.943 13.5V6.169H2.542V13.5zm-1.2-8.333c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.21 2.4 3.919c0 .694.521 1.248 1.327 1.248zm2.649 8.333h2.401V9.407c0-.219.016-.438.081-.594.176-.438.577-.891 1.25-.891.881 0 1.233.672 1.233 1.656V13.5h2.401V9.297c0-2.252-1.201-3.3-2.804-3.3-1.292 0-1.862.711-2.183 1.21h.016v-1.04H6.392c.03.688 0 7.333 0 7.333" />
  </svg>
);

const MailFillIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414z" />
    <path d="M0 4.697v7.104l5.803-3.558z" />
    <path d="M6.761 8.83 0 12.97V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.03L9.239 8.83 8 9.586z" />
    <path d="M16 11.801V4.697l-5.803 3.546z" />
  </svg>
);

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Team", path: "/team" },
  { label: "Experiences", path: "/experiences" },
  { label: "Blog", path: "/blog" },
  { label: "Partners", path: "/partners" },
  { label: "Contact", path: "/contact" }
];

const sportLinks = [
  { label: "Tennis", path: "/sports/tennis", color: "#87cb4a" },
  { label: "Basketball", path: "/sports/basketball", color: "#f6a15c" },
  { label: "Football", path: "/sports/football", color: "#84a6ff" },
  { label: "Soccer", path: "/sports/soccer", color: "#39b870" },
  { label: "Golf", path: "/sports/golf", color: "#ab9bfa" }
];

const involvementLinks = [
  { label: "Get Involved", path: "/get-involved", external: false },
  {
    label: "Volunteer",
    path: "https://docs.google.com/forms/d/e/1FAIpQLSes2__aGaa25i1By5o-fc_pBHDxSnjnaBDJGzHsDOaKR_FKDw/viewform?usp=publish-editor",
    external: true
  },
  { label: "Donate", path: "/contact", external: false },
  {
    label: "Become a Partner",
    path: "https://docs.google.com/forms/d/e/1FAIpQLSePxWPnfSmEIF77mppapcF8fMcIhBC4uhE1c5EVux0dAK6pmA/viewform?usp=header",
    external: true
  }
];

const socialLinks = [
  {
    href: "https://www.instagram.com/togethertennis/",
    label: "Instagram",
    Icon: InstagramIcon
  },
  {
    href: "https://www.tiktok.com/@together_sports",
    label: "TikTok",
    Icon: TikTokIcon
  },
  {
    href: "https://www.linkedin.com/company/108267093/",
    label: "LinkedIn",
    Icon: LinkedInIcon
  },
  { href: "/contact", label: "Email", Icon: MailFillIcon }
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-deep-blue">
      <div className="absolute left-4 top-6 h-12 w-12 rounded-full bg-white/5 sm:left-8 sm:top-8 sm:h-16 sm:w-16" />
      <div className="absolute right-4 top-8 hidden h-10 w-10 rotate-45 bg-white/5 sm:block sm:right-10 sm:top-10 sm:h-12 sm:w-12" />
      <div className="absolute bottom-6 right-[12%] hidden h-8 w-8 rounded-full bg-white/5 sm:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <Link to="/" className="inline-flex items-end gap-2 sm:gap-3">
            <img
              src={footerLogo}
              alt="Together Sports logo"
              className="relative -translate-y-1.5 h-12 w-auto shrink-0 sm:-translate-y-2 sm:h-16 md:h-20"
            />
            <span className="pb-1 font-heading text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-wide text-white leading-none">
              Together Sports
            </span>
          </Link>

          <div className="flex flex-wrap gap-3 lg:justify-end lg:self-center">
            {socialLinks.map(({ href, label, Icon }) => {
              const isExternal = href.startsWith("http");

              if (isExternal) {
                return (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/8 text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-primary"
                  >
                    <Icon width={20} height={20} />
                  </a>
                );
              }

              return (
                <Link
                  key={label}
                  to={href}
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/8 text-white transition-all duration-200 hover:scale-105 hover:bg-white hover:text-primary"
                >
                  <Icon width={20} height={20} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mb-3 font-heading text-lg md:text-2xl font-black uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-base font-[Montserrat] font-semibold text-white transition-colors duration-200 hover:text-white/75"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-lg md:text-2xl font-black uppercase tracking-wider text-white">
              Sports
            </h4>
            <ul className="space-y-2.5">
              {sportLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-base font-[Montserrat] font-semibold transition-opacity duration-200 hover:opacity-100"
                    style={{ color: item.color, opacity: 0.92 }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-lg md:text-2xl font-black uppercase tracking-wider text-white">
              Ways To Help
            </h4>
            <ul className="space-y-2.5">
              {involvementLinks.map((item) => (
                <li key={`${item.label}-${item.path}`}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-[Montserrat] font-semibold text-white transition-colors duration-200 hover:text-white/75"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-base font-[Montserrat] font-semibold text-white transition-colors duration-200 hover:text-white/75"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-lg md:text-2xl font-black uppercase tracking-wider text-white">
              Reach Us
            </h4>
            <div className="space-y-3 text-white">
              <Link
                to="/contact"
                className="text-base font-[Montserrat] font-semibold transition-colors duration-200 hover:text-white/75"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10">
          <p className="text-xs md:text-sm text-white/60">
            Together Sports is a 501(c)(3) nonprofit organization.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

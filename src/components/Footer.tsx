import { Link } from "react-router-dom";
import { createLucideIcon, Instagram, Linkedin, Mail } from "lucide-react";

const Tiktok = createLucideIcon("Tiktok", [
  ["path", { d: "M14 4c.4 1.8 1.5 3.4 3 4.5 1 .7 2.1 1.1 3 1.2", key: "1" }],
  ["path", { d: "M14 8.5V16a4 4 0 1 1-4-4", key: "2" }],
  ["path", { d: "M14 4v6.5", key: "3" }],
]);

const socialLinks = [
  {
    href: "https://www.instagram.com/togethertennis/",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/@together_sports",
    label: "TikTok",
    Icon: Tiktok,
  },
  {
    href: "https://www.linkedin.com/company/108267093/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  {
    href: "/contact",
    label: "Email",
    Icon: Mail,
  },
];

const Footer = () => {
  return (
    <footer className="bg-deep-blue scratchy-overlay border-t border-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <span className="font-heading text-2xl font-black uppercase tracking-wider text-white block mb-4">Together Sports</span>
            <p className="text-soft-blue text-sm leading-relaxed">
              Building stronger communities through the power of athletics. Every kid deserves a chance to play.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Navigate</h4>
            <ul className="space-y-2">
              {["About", "How We Teach", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-soft-blue hover:text-white transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Get Involved</h4>
            <ul className="space-y-2">
              {["Volunteer", "Donate", "Partner", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Contact" ? "/contact" : "/get-involved"}
                    className="text-soft-blue hover:text-white transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Stay Connected</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="w-10 h-10 bg-white/10 text-white flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-200 hover:rotate-3 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-soft-blue text-xs">
              © {new Date().getFullYear()} Together Sports. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

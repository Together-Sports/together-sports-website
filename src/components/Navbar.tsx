import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import headerLogo from "@/assets/headerlogo.svg";
import { useEditableContent } from "@/lib/editable-content";

const defaultNavItems = [
  {
    label: "Home",
    path: "/",
    dropdown: [
      { label: "Tennis", path: "/sports/tennis", color: "#87cb4a" },
      { label: "Basketball", path: "/sports/basketball", color: "#f6a15c" },
      { label: "Football", path: "/sports/football", color: "#84a6ff" },
      { label: "Soccer", path: "/sports/soccer", color: "#39b870" },
      { label: "Golf", path: "/sports/golf", color: "#ab9bfa" }
    ]
  },
  { label: "Sports", path: "/sports" },
  { label: "Team", path: "/team" },
  { label: "Experiences", path: "/experiences" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
  { label: "Partners", path: "/partners" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { siteText } = useEditableContent();
  const navItems = siteText?.navItems?.length
    ? siteText.navItems
    : defaultNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20 md:gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <img
              src={headerLogo}
              alt="Together Sports logo"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="relative -translate-y-0.5 h-7 w-auto shrink-0 sm:h-8 md:h-10"
            />
            <span className="flex items-center font-heading text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-[0.08em] sm:tracking-wider leading-none text-[#ffffff]">
              Together Sports
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="ml-auto hidden lg:flex flex-1 items-center justify-end gap-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() =>
                    setOpenDropdown(item.dropdown ? item.path : null)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className="px-3 py-2 text-sm font-[Montserrat] font-bold uppercase tracking-wider text-[#ffffff] transition-colors duration-200 hover:text-[#84a6ff]"
                  >
                    {item.label}
                  </Link>
                  <AnimatePresence>
                    {item.dropdown && openDropdown === item.path ? (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-0 top-full mt-7 hidden w-56 border-2 border-primary bg-white shadow-lg lg:block"
                      >
                        <div className="p-2 text-left">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block px-4 py-3 text-sm font-[Montserrat] font-bold uppercase tracking-wider transition-colors duration-200 hover:bg-primary/5"
                              style={{ color: subItem.color ?? "#4f74d6" }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <Link
              to="/get-involved"
              className="ml-4 inline-flex shrink-0 items-center justify-center rounded-sm bg-[#ffffff] px-5 py-3 text-sm font-[Montserrat] font-bold uppercase tracking-wider text-primary transition-transform duration-200 hover:scale-105"
            >
              Get Involved
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#ffffff] lg:hidden"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-b border-primary/80 overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base sm:text-lg font-[Montserrat] font-bold uppercase tracking-wider text-[#ffffff] transition-colors hover:text-[#84a6ff]"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/get-involved"
                onClick={() => setIsOpen(false)}
                className="block bg-[#ffffff] px-4 py-3 text-base sm:text-lg font-[Montserrat] font-bold uppercase tracking-wider text-primary"
              >
                Get Involved
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

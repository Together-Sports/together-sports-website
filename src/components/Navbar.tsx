import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import headerLogo from "@/assets/headerlogo.svg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Team", path: "/team" },
  { label: "Experiences", path: "/experiences" },
  { label: "Blog", path: "/blog" },
  { label: "Get Involved", path: "/get-involved" },
  { label: "Partners", path: "/partners" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={headerLogo}
              alt="Together Sports logo"
              className="relative -translate-y-0.5 h-8 w-auto shrink-0 md:h-10"
            />
            <span className="flex items-center font-heading text-2xl md:text-3xl font-black uppercase tracking-wider leading-none text-[#ffffff]">
              Together Sports
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-1 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-2 text-sm font-body font-semibold uppercase tracking-wider text-[#ffffff] transition-colors duration-200 hover:text-[#84a6ff]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#ffffff]"
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
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 font-heading font-bold text-lg uppercase tracking-wider text-[#ffffff] transition-colors hover:text-[#84a6ff]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

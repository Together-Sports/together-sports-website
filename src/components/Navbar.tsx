import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Sports", path: "/sports" },
  { label: "How We Teach", path: "/how-we-teach" },
  { label: "Blog", path: "/blog" },
  { label: "Get Involved", path: "/get-involved" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-xl md:text-2xl font-black uppercase tracking-wider text-foreground">Together Sports</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-body font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-accent ${
                  location.pathname === item.path ? "text-accent" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
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
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 font-heading font-bold text-lg uppercase tracking-wider transition-colors ${
                    location.pathname === item.path ? "text-accent" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/get-involved"
                onClick={() => setIsOpen(false)}
                className="block mx-4 mt-4 px-5 py-3 bg-accent text-accent-foreground font-heading font-bold text-center uppercase tracking-wider"
              >
                Donate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

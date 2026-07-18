import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { IS_SERVER } from "@/lib/ssr";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

const variants = {
  up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
};

const ScrollRevealClient = ({ children, direction = "up", delay = 0, className = "" }: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// On the server (build-time prerender) the reveal animation is meaningless
// and its initial "hidden" style would ship invisible text in the static
// HTML — render a plain, fully visible wrapper instead.
const ScrollReveal = (props: ScrollRevealProps) =>
  IS_SERVER ? (
    <div className={props.className ?? ""}>{props.children}</div>
  ) : (
    <ScrollRevealClient {...props} />
  );

export default ScrollReveal;

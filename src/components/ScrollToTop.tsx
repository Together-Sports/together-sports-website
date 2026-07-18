import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const isFirstRender = useRef(true);

  // useLayoutEffect + instant jump: a smooth scroll here gets cancelled by
  // the new page's content mounting mid-animation, which strands the visitor
  // at the previous page's scroll depth.
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      // Stop the browser from re-applying the old scroll position on
      // client-side navigations; we manage it ourselves.
      window.history.scrollRestoration = "manual";
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;

      // On the very first render React may be taking over from prerendered
      // HTML the visitor has already scrolled — don't yank them to the top.
      // Fresh documents start at the top anyway; only honor a hash target.
      if (!hash) {
        return;
      }
    }

    if (hash) {
      const scrollToHash = () => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView();
          return true;
        }
        return false;
      };

      // The anchor target may not exist until the new page has rendered.
      if (!scrollToHash()) {
        window.scrollTo(0, 0);
        window.setTimeout(scrollToHash, 100);
      }
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;

import { useEffect, useRef, useState } from "react";
import { useEditableContent } from "@/lib/editable-content";

const INTRO_SEEN_KEY = "together-sports-intro-seen";
// Remembers the intro video URL between visits. The URL normally lives in the
// live site content, which takes a moment to load — without this cache the
// site can render first and the intro pops in late. With it, the overlay
// covers the screen from the very first paint and the video starts
// downloading immediately, in parallel with the content fetch.
const INTRO_SRC_CACHE_KEY = "together-sports-intro-src";
// If the video can't start playing within this window (slow network,
// blocked autoplay, bad URL), skip straight to the site.
const START_TIMEOUT_MS = 5000;

const hasSeenIntro = () => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return true;
  }
};

const markIntroSeen = () => {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode) — the intro just won't be remembered.
  }
};

const readCachedIntroSrc = () => {
  try {
    return window.localStorage.getItem(INTRO_SRC_CACHE_KEY) ?? "";
  } catch {
    return "";
  }
};

const cacheIntroSrc = (src: string) => {
  try {
    if (src) {
      window.localStorage.setItem(INTRO_SRC_CACHE_KEY, src);
    } else {
      window.localStorage.removeItem(INTRO_SRC_CACHE_KEY);
    }
  } catch {
    // Storage unavailable — the next visit falls back to waiting for the
    // live content before showing the intro.
  }
};

const IntroVideo = () => {
  const { siteText, hasResolvedContent } = useEditableContent();
  const liveSrc = siteText?.introVideo?.trim() || "";
  const [dismissed, setDismissed] = useState(hasSeenIntro);
  const [isFading, setIsFading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const [src, setSrc] = useState(() =>
    hasSeenIntro() ? "" : readCachedIntroSrc()
  );
  const showIntro = Boolean(src) && !dismissed;

  const dismiss = () => {
    markIntroSeen();
    setIsFading(true);
    window.setTimeout(() => setDismissed(true), 500);
  };

  // Reconcile the cached URL against the live content once it has actually
  // resolved. (isLoadingContent isn't enough here — a slow fetch flips it
  // early via the fallback timer, before the real content is known.)
  useEffect(() => {
    if (!hasResolvedContent) {
      return;
    }

    cacheIntroSrc(liveSrc);

    if (!liveSrc) {
      // No intro is configured (anymore) — drop any stale cached overlay.
      setDismissed(true);
      return;
    }

    if (!hasStartedRef.current) {
      setSrc(liveSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasResolvedContent, liveSrc]);

  useEffect(() => {
    if (!showIntro) {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (!hasStartedRef.current) {
        dismiss();
      }
    }, START_TIMEOUT_MS);

    return () => window.clearTimeout(timeout);
    // The timer restarts when the live content confirms the URL, so a video
    // shown early from cache gets a fresh window after the content settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro, hasResolvedContent]);

  if (!showIntro) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-deep-blue transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label="Together Sports intro video"
        className="h-full w-full object-cover"
        onPlaying={() => {
          hasStartedRef.current = true;
          setHasStarted(true);
        }}
        onEnded={dismiss}
        onError={dismiss}
      />
      {!hasStarted && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden
            className="h-12 w-12 animate-spin rounded-full border-4 border-white/25 border-t-white"
          />
        </div>
      )}
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-6 right-6 border border-white/40 bg-black/40 px-5 py-2.5 font-heading text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/60"
      >
        Skip Intro →
      </button>
    </div>
  );
};

export default IntroVideo;

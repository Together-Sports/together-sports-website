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
// Absolute anti-trap cap: the overlay is NEVER allowed to stay up longer than
// this, no matter what (a video that stalls mid-playback on a slow phone, or a
// mobile browser that never fires `ended`). Escaping should never depend on the
// video behaving.
const MAX_INTRO_MS = 20000;
// If playback stalls (buffering) this long after it had started, give up and
// go to the site rather than leaving the visitor staring at a frozen frame.
const STALL_TIMEOUT_MS = 6000;

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
  const dismissedRef = useRef(false);
  const stallTimerRef = useRef<number | null>(null);
  const [src, setSrc] = useState(() =>
    hasSeenIntro() ? "" : readCachedIntroSrc()
  );
  const showIntro = Boolean(src) && !dismissed;

  const clearStallTimer = () => {
    if (stallTimerRef.current !== null) {
      window.clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  };

  const dismiss = () => {
    // Guard so the many escape paths (tap, button, ended, stall, timeouts)
    // can all call this without double-firing the fade.
    if (dismissedRef.current) {
      return;
    }
    dismissedRef.current = true;
    clearStallTimer();
    markIntroSeen();
    setIsFading(true);
    window.setTimeout(() => setDismissed(true), 500);
  };

  // While the video is playing, a stall (buffering) that lasts too long means
  // the visitor is staring at a frozen frame — bail to the site.
  const armStallTimer = () => {
    if (!hasStartedRef.current) {
      return;
    }
    clearStallTimer();
    stallTimerRef.current = window.setTimeout(dismiss, STALL_TIMEOUT_MS);
  };

  useEffect(() => {
    // Prerendered pages ship a tiny inline script that covers the static
    // HTML while an intro video is expected (see scripts/prerender.mjs).
    // Once React is mounted this component owns the overlay, so drop the
    // temporary cover.
    document.getElementById("intro-preroll")?.remove();
  }, []);

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

    // Skip if the video never even starts playing.
    const startTimer = window.setTimeout(() => {
      if (!hasStartedRef.current) {
        dismiss();
      }
    }, START_TIMEOUT_MS);

    // Hard ceiling: the overlay can never trap a visitor past this point.
    const hardCap = window.setTimeout(dismiss, MAX_INTRO_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(hardCap);
    };
    // The timers restart when the live content confirms the URL, so a video
    // shown early from cache gets a fresh window after the content settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro, hasResolvedContent]);

  if (!showIntro) {
    return null;
  }

  return (
    // The whole overlay is tap-to-skip so a visitor can always get out with a
    // single tap anywhere — the automatic timers above are only a backstop.
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip intro video"
      onClick={dismiss}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
          dismiss();
        }
      }}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-deep-blue transition-opacity duration-500 ${
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
          clearStallTimer();
        }}
        onTimeUpdate={clearStallTimer}
        onWaiting={armStallTimer}
        onStalled={armStallTimer}
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

      {/* Big, obvious close button — the primary way out. onClick also bubbles
          to the overlay, which is fine since both just dismiss. */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Skip intro"
        className="absolute right-4 top-4 flex h-11 items-center gap-2 rounded-full border border-white/50 bg-black/55 pl-4 pr-4 font-heading text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/70 sm:right-6 sm:top-6"
      >
        Skip
        <span aria-hidden className="text-lg leading-none">
          ✕
        </span>
      </button>

      <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
        Tap anywhere to skip
      </p>
    </div>
  );
};

export default IntroVideo;

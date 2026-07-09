import { useEffect, useRef, useState } from "react";
import { useEditableContent } from "@/lib/editable-content";

const INTRO_SEEN_KEY = "together-sports-intro-seen";
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

const IntroVideo = () => {
  const { siteText, isLoadingContent } = useEditableContent();
  const src = siteText?.introVideo?.trim() || "";
  const [dismissed, setDismissed] = useState(hasSeenIntro);
  const [isFading, setIsFading] = useState(false);
  const hasStartedRef = useRef(false);
  const showIntro = Boolean(src) && !isLoadingContent && !dismissed;

  const dismiss = () => {
    markIntroSeen();
    setIsFading(true);
    window.setTimeout(() => setDismissed(true), 500);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro]);

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
        }}
        onEnded={dismiss}
        onError={dismiss}
      />
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

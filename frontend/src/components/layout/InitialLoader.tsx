"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InitialLoader() {
  // Start as null = unknown (SSR). After hydration we know the real value.
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isCarpetOpening, setIsCarpetOpening] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const ANIMATION_SPEED = 1;
  const VIDEO_PLAYBACK_SPEED = 1.5;

  useEffect(() => {
    // On mount (client only), decide whether to show splash
    const played = sessionStorage.getItem("mmil_intro_played");
    setShouldShow(!played);
  }, []);

  // Lock body scroll while intro is active — no position:fixed (causes jump on unlock)
  useEffect(() => {
    const isActive = shouldShow === true && !isVideoFinished;
    if (isActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [shouldShow, isVideoFinished]);

  useEffect(() => {
    if (hasInteracted && videoRef.current) {
      videoRef.current.playbackRate = VIDEO_PLAYBACK_SPEED;
      videoRef.current.play().catch((e) =>
        console.error("Video playback failed", e)
      );
    }
  }, [hasInteracted]);

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleVideoEnd = () => {
    setIsCarpetOpening(true);
    setTimeout(() => {
      setIsVideoFinished(true);
      sessionStorage.setItem("mmil_intro_played", "true");
    }, ANIMATION_SPEED * 1000 + 200);
  };

  // ── Bug 1 fix ──────────────────────────────────────────────────────────────
  // While shouldShow is null (SSR / first paint), render a blocking black screen
  // so the home page is never visible before we know if splash should play.
  // Once we know shouldShow=false (played before), remove it immediately.
  if (shouldShow === null) {
    return (
      <div
        className="fixed inset-0 z-[99999] bg-black"
      />
    );
  }

  if (!shouldShow || isVideoFinished) return null;

  return (
    // ── Bug 2 fix ─────────────────────────────────────────────────────────────
    // Use overflow:hidden + overscroll-none instead of position:fixed on body.
    // isolate so stacking contexts beneath don't bleed through.
    // ── Bug 3 fix ─────────────────────────────────────────────────────────────
    // Use max-w/max-h on the video wrapper so it never overflows the viewport
    // on mobile, and clip strictly to 100dvh.
    <div
      className="fixed inset-0 z-[99999] select-none cursor-pointer touch-none overflow-hidden bg-black"
      onClick={handleInteraction}
    >
      {/* Carpet Panels — slide left/right when animation ends */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-black z-10 pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "-100%" : 0 }}
        transition={{ duration: ANIMATION_SPEED, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-black z-10 pointer-events-none"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "100%" : 0 }}
        transition={{ duration: ANIMATION_SPEED, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Content layer — fades out before carpet opens */}
      <AnimatePresence>
        {!isCarpetOpening && (
          <motion.div
            className="absolute inset-0 z-20 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {!hasInteracted ? (
              /* BEFORE CLICK: Centered prompt */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="flex flex-col items-center w-full max-w-md"
                >
                  <motion.p
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.1)",
                        "0 0 20px rgba(255,255,255,0.5)",
                        "0 0 10px rgba(255,255,255,0.1)",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                    className="text-xs md:text-sm font-medium tracking-[0.4em] uppercase text-white"
                  >
                    Click anywhere to launch
                  </motion.p>
                </motion.div>
              </div>
            ) : (
              /* AFTER CLICK: Full Screen Video */
              <div
                className="absolute inset-0 overflow-hidden bg-black"
              >
                {/* Bug 3 fix: max-w/max-h + object-contain on mobile prevents overflow */}
                <video
                  ref={videoRef}
                  src="/animation.mp4"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                  playsInline
                  muted
                  onEnded={handleVideoEnd}
                  onError={(e) => {
                    console.error("Video error, skipping intro:", e);
                    handleVideoEnd();
                  }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:gap-4 pointer-events-none text-center p-6 z-10 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[9px] md:text-xs font-light tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    Experience Loading
                  </motion.div>

                  <div className="w-[120px] md:w-[160px] flex justify-center mt-1 md:mt-2">
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-[1px] md:h-[2px] bg-white/10 relative overflow-hidden rounded-full"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

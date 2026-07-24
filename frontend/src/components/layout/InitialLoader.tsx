"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function InitialLoader() {
  const [mounted, setMounted] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false); 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isCarpetOpening, setIsCarpetOpening] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const ANIMATION_SPEED = 1;
  const VIDEO_PLAYBACK_SPEED = 1.5;

  useEffect(() => {
    setMounted(true);
    
    // Check if the intro has already played in this session
    const played = sessionStorage.getItem("mmil_intro_played");
    if (played) {
      setHasPlayedOnce(true);
    }
  }, []);

  // Lock body scroll while intro animation is active
  useEffect(() => {
    if (mounted && !hasPlayedOnce && !isVideoFinished) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mounted, hasPlayedOnce, isVideoFinished]);

  useEffect(() => {
    if (hasInteracted && videoRef.current) {
      videoRef.current.playbackRate = VIDEO_PLAYBACK_SPEED;
      videoRef.current.play().catch(e => console.error("Video playback failed", e));
    }
  }, [hasInteracted]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleVideoEnd = () => {
    setIsCarpetOpening(true);
    setTimeout(() => {
      setIsVideoFinished(true);
      sessionStorage.setItem("mmil_intro_played", "true");
    }, (ANIMATION_SPEED * 1000) + 200);
  };

  if (!mounted || hasPlayedOnce || isVideoFinished) {
    return null; 
  }

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[99999] bg-transparent select-none cursor-pointer touch-none overscroll-none overflow-hidden"
      onClick={handleInteraction}
    >
      {/* Carpet Panels - Split Left & Right when ending (Background) */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-black z-10 pointer-events-none border-r border-white/10"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "-100%" : 0 }}
        transition={{ duration: ANIMATION_SPEED, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-black z-10 pointer-events-none border-l border-white/10"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "100%" : 0 }}
        transition={{ duration: ANIMATION_SPEED, ease: [0.76, 0, 0.24, 1] }}
      />

      {!isCarpetOpening && (
        <div className="absolute inset-0 z-20">
          {!hasInteracted ? (
            /* BEFORE CLICK: Centered Elegant Script Text */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <motion.div 
                  animate={{ textShadow: ["0 0 10px rgba(255,255,255,0.2)", "0 0 25px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.2)"] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="text-5xl md:text-7xl text-white font-medium leading-tight"
                  style={{ fontFamily: 'var(--font-script)' }}
                >
                  Enter Experience
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="text-[10px] md:text-xs font-light tracking-[0.4em] uppercase mt-4 md:mt-6" 
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Click anywhere to launch
                </motion.p>
              </motion.div>
            </div>
          ) : (
            /* AFTER CLICK: Full Screen Video + Minimalist Loading Bar */
            <div className="absolute inset-0 overflow-hidden bg-black">
              <video
                ref={videoRef}
                src="/animation.mp4"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                playsInline
                autoPlay
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
                
                {/* Responsive Width Container for Loading Bar */}
                <div className="w-[120px] md:w-[160px] flex justify-center mt-1 md:mt-2">
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-[1px] md:h-[2px] bg-white/10 relative overflow-hidden rounded-full"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

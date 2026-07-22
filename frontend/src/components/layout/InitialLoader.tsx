"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InitialLoader() {
  const [hasPlayedOnce, setHasPlayedOnce] = useState(true); // Default true to prevent hydration mismatch flash
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [isCarpetOpening, setIsCarpetOpening] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Only run on client
    const played = sessionStorage.getItem("mmil_intro_played");
    if (!played) {
      setHasPlayedOnce(false);
    }
  }, []);

  useEffect(() => {
    if (hasInteracted && videoRef.current) {
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
    }, 1200); // Wait for carpet animation to finish before removing from DOM
  };

  if (hasPlayedOnce || isVideoFinished) {
    return null; // Don't render anything if already played
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent overflow-hidden"
      onClick={handleInteraction}
    >
      <AnimatePresence>
        {!isCarpetOpening && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
          >
            {!hasInteracted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-xl font-light tracking-[0.2em] animate-pulse cursor-pointer p-8 text-center"
              >
                CLICK ANYWHERE TO ENTER
              </motion.div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src="/video.mp4"
                  className="w-full h-full object-cover opacity-60"
                  playsInline
                  onEnded={handleVideoEnd}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-white/80 text-sm md:text-base font-light tracking-[0.5em] uppercase"
                  >
                    Experience Loading
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 192 }}
                    transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
                    className="h-[1px] bg-white/20 relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-white/80"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carpet Panels - Left & Right */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-black z-20 pointer-events-none border-r border-white/10"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "-100%" : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />
      
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-black z-20 pointer-events-none border-l border-white/10"
        initial={{ x: 0 }}
        animate={{ x: isCarpetOpening ? "100%" : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  );
}

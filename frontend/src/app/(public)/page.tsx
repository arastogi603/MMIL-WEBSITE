"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BentoGrid } from "@/components/layout/BentoGrid";

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Hero section scale-down & fade effect as user scrolls down
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  // Bento sheet elevation animation: peeks at bottom on page load, covers hero on scroll
  // removed sheetY to rely on native sticky scroll and fix extra empty space

  return (
    <main style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }} className="relative w-full">
      {/* Scroll animation target container */}
      <div ref={targetRef} className="relative w-full">
        {/* ───── HERO SECTION (FULL VIEWPORT STICKY) ───── */}
        <motion.section 
          className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-0 pointer-events-none"
          style={{ 
            scale: heroScale, 
            opacity: heroOpacity, 
            y: heroY,
            willChange: "transform, opacity" 
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center px-4 -mt-12"
          >
            <motion.h1 
              className="hero-title select-none"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              MMIL
            </motion.h1>
            <motion.h2 
              className="hero-subtitle text-[clamp(2.2rem,6vw,5.5rem)] text-center font-black select-none tracking-tight"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              PRESENTS
            </motion.h2>
          </motion.div>
        </motion.section>

        {/* ───── BENTO SHEET (PEEKS AT BOTTOM ON LOAD, COVER ANIMATION ON SCROLL) ───── */}
        <motion.div 
          className="relative z-10 -mt-[15vh] sm:-mt-[18vh] md:-mt-[25vh] lg:-mt-[30vh] w-[96%] md:w-[94%] max-w-[1400px] mx-auto bg-[var(--card-bg)] dark:bg-[#07171F]/90 backdrop-blur-3xl border border-[var(--card-border)] dark:border-white/10 rounded-t-[2.5rem] md:rounded-t-[3.5rem] pt-8 md:pt-14 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.7)] flex flex-col items-center justify-start transition-colors duration-300"
        >
          {/* Peek Handle Indicator */}
          <div className="w-16 h-1.5 bg-black/20 dark:bg-white/20 rounded-full mb-6 md:mb-8" />

          <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16 md:mb-14">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-[var(--text-secondary)]">Explore Our Ecosystem</span>
              <h2 className="text-2xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mt-2">Everything MMIL Has To Offer</h2>
            </div>
            <BentoGrid />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth.store";
import { BentoGrid } from "@/components/layout/BentoGrid";
import { recruitmentApi } from "@/lib/api/recruitment";
import { projectsApi } from "@/lib/api/projects";



/* ─────────────────────────────────────────────
   HOME PAGE COMPONENT
   ───────────────────────────────────────────── */

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }} ref={containerRef} className="relative w-full overflow-hidden">
      {/* ───── HERO SECTION ───── */}
      <motion.section 
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-0"
        style={{ willChange: "transform, opacity" }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            MMIL
          </motion.h1>
          <motion.h2 
            className="hero-subtitle text-[clamp(2rem,6vw,5rem)] text-center font-black"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            PRESENTS
          </motion.h2>
        </motion.div>
      </motion.section>

      {/* ───── BENTO GRID OVERLAP ───── */}
      <div className="relative z-10 mt-[80vh] md:mt-[100vh] bg-white/30 dark:bg-black/10 backdrop-blur-md rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] pt-20 pb-24 min-h-[80vh] flex items-center justify-center transition-colors duration-300 border-t border-white/30 dark:border-white/5">
        <BentoGrid />
      </div>
    </main>
  );
}

"use client";

import Smooth3DSlideshow from "@/components/Coverflow";
import { ArrowRight, Calendar, Code, Rocket, Users, ChevronRight, Zap, Quote } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FadeIn, FadeInStaggerItem } from "@/components/animations/FadeIn";
import { Parallax } from "@/components/animations/Parallax";
import { ScrollImageSequence } from "@/components/animations/ScrollImageSequence";
import { useAuthStore } from "@/lib/store/auth.store";
import { useEffect, useState, useLayoutEffect } from "react";
import { recruitmentApi } from "@/lib/api/recruitment";
import Image from "next/image";

// Suppress useLayoutEffect warning on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const quotes = [
  "Any sufficiently advanced technology is indistinguishable from magic.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Innovation distinguishes between a leader and a follower.",
  "The best way to predict the future is to invent it.",
  "Talk is cheap. Show me the code."
];

export default function Home() {
  const { scrollY } = useScroll();
  const textFillOpacity = useTransform(scrollY, [0, 200, 4800, 5000], [1, 0, 0, 1]);

  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Loading Screen State (Default true for server hydration)
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Synchronously hide loader before paint if already loaded in this session
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem("mmil_app_loaded")) {
      setIsFirstVisit(false);
      setIsAppLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // Simple daily quote rotation
    setQuoteIndex(new Date().getDay() % quotes.length);
    
    recruitmentApi.getActiveCycles().then(cycles => {
      if (cycles && cycles.length > 0) setActiveCycle(cycles[0]);
    }).catch(console.error);

    // If already loaded, do nothing
    if (!isAppLoading) return;

    // Simulate progress for the loading screen
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsAppLoading(false);
          sessionStorage.setItem("mmil_app_loaded", "true");
        }, 500); // Wait at 100% for 500ms
      }
      setLoadingProgress(progress);
    }, 150);

    return () => clearInterval(interval);
  }, [isAppLoading]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <>
      {/* Global Preloader Screen */}
      <AnimatePresence mode="wait">
        {isAppLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isFirstVisit ? 0.8 : 0, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          >
            {/* Background Video */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/flower-arc.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Image src="/logo.png" alt="MMIL" width={64} height={64} className="w-16 h-16 mx-auto mb-4 drop-shadow-xl brightness-200" />
                <h2 className="text-white font-black tracking-widest text-lg uppercase mb-2">MMIL</h2>
                <p className="text-white/60 text-sm font-medium tracking-wide">Experience loading...</p>
              </motion.div>

              {/* Progress Slider */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>
              <div className="text-white/40 text-xs font-bold font-mono tracking-widest">
                {loadingProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen text-[#111] relative font-['Outfit'] bg-transparent overflow-x-hidden">
        
        {/* Fixed Flower Arc Video Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/flower-arc.mp4" type="video/mp4" />
          </video>
          {/* Subtle overlay to ensure the text remains legible across the entire scrolling page */}
          <div className="absolute inset-0 bg-white/10" />
        </div>

        {/* GSAP Canvas Image Sequence Animation (Z-10) */}
        <ScrollImageSequence />

      {/* Hero Section - Fixed dead-center during entire animation (Z-20) */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-screen z-20 pointer-events-none flex items-center justify-center"
        style={{ opacity: useTransform(scrollY, [0, 5000, 5200], [1, 1, 0]) }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center w-full px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center w-full max-w-full"
          >
            {/* Glass Text Container */}
            <div className="relative inline-block max-w-full overflow-hidden">
              {/* Glass Outline Layer */}
              <motion.h1 variants={fadeUp} className="text-[5rem] sm:text-[8rem] md:text-[14rem] font-black tracking-tighter leading-[0.8] text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.4)]">
                MMIL
              </motion.h1>
              {/* Individual Colored Letters Fill Layer */}
              <motion.h1 
                style={{ opacity: textFillOpacity }}
                className="absolute inset-0 text-[5rem] sm:text-[8rem] md:text-[14rem] font-black tracking-tighter leading-[0.8]"
              >
                <span className="text-orange-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.8)]">M</span>
                <span className="text-blue-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]">M</span>
                <span className="text-green-500 drop-shadow-[0_0_40px_rgba(34,197,94,0.8)]">I</span>
                <span className="text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]">L</span>
              </motion.h1>
            </div>

            <div className="relative inline-block mt-4 mb-4">
              <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]">
                PRESENTS
              </motion.h2>
              <motion.h2 
                style={{ opacity: textFillOpacity }}
                className="absolute inset-0 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-[#111]"
              >
                PRESENTS
              </motion.h2>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Massive Bento Grid - Sliding Page Effect */}
      <motion.section 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.2 }}
        className="relative z-20 w-full bg-white/20 backdrop-blur-md md:backdrop-blur-3xl border-t border-white/40 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[4rem] pt-16 px-6 pb-24 mt-[10vh]"
      >
        {/* Subtle pull tab at the top of the sliding page */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-black/20 rounded-full" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
          
          {/* Events - Large Box */}
          <Link href="/events" className="col-span-1 md:col-span-2 row-span-2 relative rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden group flex flex-col p-8 transition-transform hover:scale-[1.02] cursor-pointer">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/20 blur-3xl rounded-full" />
            <h3 className="text-4xl font-black uppercase mb-4 z-10">Explore Events</h3>
            <p className="text-neutral-600 font-medium z-10 max-w-sm text-lg">Join our hackathons, tech talks, and flagship events. Be part of the innovation.</p>
            <div className="mt-auto self-end w-16 h-16 rounded-full bg-[#111] text-white flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg z-10">
              <ArrowRight className="w-8 h-8" />
            </div>
          </Link>

          {/* Projects - Medium Box */}
          <Link href="/projects" className="col-span-1 md:col-span-2 row-span-1 relative rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden group flex items-center justify-between p-8 transition-transform hover:scale-[1.02] cursor-pointer">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/20 blur-3xl rounded-full" />
            <div className="z-10">
              <h3 className="text-3xl font-black uppercase mb-2">See Projects</h3>
              <p className="text-neutral-600 font-medium">Discover open-source student work.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg z-10">
              <ArrowRight className="w-6 h-6" />
            </div>
          </Link>

          {/* Team - Medium Box */}
          <Link href="/team" className="col-span-1 md:col-span-1 row-span-1 relative rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden group flex flex-col items-center justify-center text-center p-8 transition-transform hover:scale-[1.02] cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 to-transparent" />
            <Users className="w-12 h-12 mb-4 text-[#111] z-10" />
            <h3 className="text-2xl font-black uppercase z-10">Meet the Team</h3>
          </Link>

          <div className="col-span-1 md:col-span-1 row-span-1 relative rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-center items-center">
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/microsoft-mobile-innovation-lab-mmil-7b78a7392/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_2px_5px_rgba(255,255,255,1)] flex items-center justify-center text-[#0a66c2] hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-inner cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/jssmmil/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_2px_5px_rgba(255,255,255,1)] flex items-center justify-center text-[#e1306c] hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-inner cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:mmiljssaten@gmail.com" className="w-14 h-14 rounded-2xl bg-white border border-black/5 shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_2px_5px_rgba(255,255,255,1)] flex items-center justify-center text-[#ea4335] hover:-translate-y-1 transition-transform active:translate-y-1 active:shadow-inner cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </a>
            </div>
          </div>

          {/* Daily Quote Box */}
          <div className="col-span-1 md:col-span-4 row-span-1 relative rounded-[3rem] bg-[#111] overflow-hidden group flex flex-col justify-center items-center p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
            <Quote className="w-8 h-8 text-white/20 mb-4" />
            <p className="text-xl md:text-3xl font-medium text-white italic text-center max-w-4xl z-10">"{quotes[quoteIndex]}"</p>
            <span className="text-xs uppercase tracking-widest text-neutral-400 mt-4 font-bold z-10">— Daily Innovation Quote</span>
          </div>

        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-black/10 flex flex-col md:flex-row items-center justify-between text-sm bg-white/40 backdrop-blur-md md:backdrop-blur-xl z-20 relative">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="MMIL Logo" width={36} height={36} className="w-9 h-9 rounded object-contain" />
          <span className="text-sm font-black tracking-tight text-[#111] uppercase leading-tight">MMIL</span>
        </div>
        
        <div className="text-center font-bold text-neutral-800 flex flex-col items-center my-6 md:my-0">
          <span>Empowering Innovation • Inspiring Creativity • Building the Future</span>
          <span className="mt-1">Designed with ❤️ by the MMIL Team</span>
        </div>
      </footer>
    </main>
    </>
  );
}

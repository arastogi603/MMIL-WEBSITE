"use client";

import { motion } from "framer-motion";
import { Users, Code, Award, Target, Rocket } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollRevealText } from "@/components/animations/ScrollRevealText";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-40 pb-24 relative overflow-hidden font-['Outfit']">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/10 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md text-[var(--text-secondary)]">
            <Rocket className="w-4 h-4 text-[#eb4d6d]" /> Since 2018
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-[5rem] font-bold tracking-tighter leading-none mb-8 text-[var(--text-primary)]">
            We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb4d6d] to-pink-500">MMIL</span>
          </motion.h1>
          <div className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-light tracking-wide flex justify-center px-4">
            <ScrollRevealText text="The premier technical society dedicated to fostering a culture of innovation, collaboration, and continuous learning among student developers and designers." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
          <FadeIn delay={0.1}>
            <div className="p-6 md:p-10 rounded-[2rem] bg-[var(--background)]/60 border border-[var(--text-primary)]/10 text-center hover:bg-[var(--background)]/80 hover:border-[var(--text-primary)]/20 transition-colors backdrop-blur-md shadow-sm hover:shadow-md h-full">
              <div className="w-14 h-14 rounded-full bg-[var(--text-primary)]/5 text-[var(--text-primary)] mx-auto flex items-center justify-center mb-8">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Our Mission</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">To bridge the gap between academic learning and industry standards through hands-on projects and peer mentorship.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="p-6 md:p-10 rounded-[2rem] bg-[var(--background)]/60 border border-[var(--text-primary)]/10 text-center hover:bg-[var(--background)]/80 hover:border-[var(--text-primary)]/20 transition-colors backdrop-blur-md shadow-sm hover:shadow-md h-full">
              <div className="w-14 h-14 rounded-full bg-[var(--text-primary)]/5 text-[var(--text-primary)] mx-auto flex items-center justify-center mb-8">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Our Vision</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">To be the most impactful student-run tech community, producing world-class engineers and visionary designers.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="p-6 md:p-10 rounded-[2rem] bg-[var(--background)]/60 border border-[var(--text-primary)]/10 text-center hover:bg-[var(--background)]/80 hover:border-[var(--text-primary)]/20 transition-colors backdrop-blur-md shadow-sm hover:shadow-md h-full">
              <div className="w-14 h-14 rounded-full bg-[var(--text-primary)]/5 text-[var(--text-primary)] mx-auto flex items-center justify-center mb-8">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Our Values</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">Inclusivity, technical excellence, open-source contribution, and continuous iteration.</p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.4}>
          <div className="rounded-[2rem] bg-[var(--background)]/60 border border-[var(--text-primary)]/10 backdrop-blur-md overflow-hidden flex flex-col md:flex-row shadow-sm">
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">What We Do</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[var(--text-primary)]/5 text-[#eb4d6d] flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Hackathons & Competitions</h4>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Organizing flagship events where students build solutions to real-world problems in 48 hours.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[var(--text-primary)]/5 text-[#eb4d6d] flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Workshops & Bootcamps</h4>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Conducting hands-on technical sessions covering Web, AI, App Dev, and UI/UX design.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[var(--text-primary)]/5 text-[#eb4d6d] flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">Open Source Projects</h4>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Building and maintaining tools for the university ecosystem and participating in global open source initiatives.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 bg-transparent border-t md:border-t-0 md:border-l border-[var(--text-primary)]/10 relative min-h-[300px] md:min-h-[400px]">
               <img src="/community.jpg" alt="MMIL Community" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

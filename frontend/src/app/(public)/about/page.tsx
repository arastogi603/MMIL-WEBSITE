"use client";

import { motion } from "framer-motion";
import { Code, Award, Target, Rocket } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollRevealText } from "@/components/animations/ScrollRevealText";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-40 pb-24 relative font-['Outfit']">
      {/* Hide the global background shapes on this page */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-shapes-layer { display: none !important; }
      `}} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/10 text-xs font-bold uppercase tracking-[0.2em] mb-8 text-[var(--text-secondary)]">
            <Rocket className="w-4 h-4 text-[#eb4d6d]" /> Since 2018
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }} className="text-5xl md:text-[5rem] font-bold tracking-tighter leading-none mb-8 text-[var(--text-primary)]">
            We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb4d6d] to-pink-500">MMIL</span>
          </motion.h1>
          <div className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-light tracking-wide flex justify-center px-4">
            <ScrollRevealText text="The premier technical society dedicated to fostering a culture of innovation, collaboration, and continuous learning among student developers and designers." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
          {/* Mission — pink tint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0, ease: "easeOut" }}
            whileHover={{ y: -5, borderColor: "#eb4d6d", transition: { duration: 0.15 } }}
            className="p-6 md:p-10 rounded-[2rem] border border-[var(--text-primary)]/10 h-full cursor-default bg-white dark:bg-[var(--background)]"
          >
            <Code className="w-6 h-6 text-[#eb4d6d] mb-5" />
            <h3 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">Our Mission</h3>
            <div className="w-full h-[2px] mb-4" style={{ background: "#eb4d6d" }} />
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">To equip student developers and designers with industry relevant skills through hackathons, open source projects, and peer led mentorship building careers before graduation.</p>
          </motion.div>

          {/* Vision — white */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, borderColor: "#eb4d6d", transition: { duration: 0.15 } }}
            className="p-6 md:p-10 rounded-[2rem] border border-[var(--text-primary)]/10 h-full cursor-default bg-white dark:bg-[var(--background)]"
          >
            <Target className="w-6 h-6 text-[#eb4d6d] mb-5" />
            <h3 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">Our Vision</h3>
            <div className="w-full h-[2px] mb-4" style={{ background: "#eb4d6d" }} />
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">To be the most impactful student-run tech community at JSS, where every member ships real products, contributes to open source, and grows into a visionary engineer or designer.</p>
          </motion.div>

          {/* Values — white */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -5, borderColor: "#eb4d6d", transition: { duration: 0.15 } }}
            className="p-6 md:p-10 rounded-[2rem] border border-[var(--text-primary)]/10 h-full cursor-default bg-white dark:bg-[var(--background)]"
          >
            <Award className="w-6 h-6 text-[#eb4d6d] mb-5" />
            <h3 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">Our Values</h3>
            <div className="w-full h-[2px] mb-4" style={{ background: "#eb4d6d" }} />
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">Inclusivity, technical excellence, open source contribution, and continuous iteration
              we build together, ship together, and grow together.</p>
          </motion.div>
        </div>

        <FadeIn delay={0.4}>
          <div className="rounded-[2rem] bg-white dark:bg-[var(--background)] border border-[var(--text-primary)]/10 overflow-hidden flex flex-col md:flex-row">
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
            <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-[var(--text-primary)]/10 relative min-h-[300px] md:min-h-[400px]">
              <Image
                src="/orientation.jpg"
                alt="MMIL Orientation"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

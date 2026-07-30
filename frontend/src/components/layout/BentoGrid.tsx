"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 220, damping: 22 } },
};

export const BentoGrid = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-12 gap-4 md:gap-6 w-full"
    >
      {/* ─── 1. EVENTS & WORKSHOPS (FULL WIDTH) ─── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="col-span-12 group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        <Link href="/events" className="flex flex-col justify-between p-6 sm:p-7 md:p-8 text-decoration-none">
          {/* Top Row: Calendar Icon + Date Pill + Arrow */}
          <div className="flex justify-between items-start w-full">
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-xs border border-black/5 dark:border-white/10 text-blue-500 dark:text-blue-400">
              <Calendar size={22} strokeWidth={2.2} />
            </div>


          </div>

          {/* Middle Row: Visual Content (Date Strip & Next Event) */}
          <div className="my-5 space-y-2.5">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10">
              {[
                { day: "MON", date: "10", active: false },
                { day: "TUE", date: "11", active: false },
                { day: "WED", date: "12", active: true },
                { day: "THU", date: "13", active: false },
                { day: "FRI", date: "14", active: false },
              ].map((item) => (
                <div
                  key={item.day}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${item.active
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/25 font-bold"
                    : "bg-white/70 dark:bg-white/5 text-[var(--text-secondary)] border border-black/5 dark:border-white/5"
                    }`}
                >
                  <span className={`text-[10px] font-semibold tracking-wider ${item.active ? "text-blue-100" : "opacity-60"}`}>
                    {item.day}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold leading-none mt-0.5">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>


          </div>

          {/* Bottom Row: Heading + Subtitle */}
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Events & Workshops
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed opacity-90">
              Hackathons, technical sessions, and hands-on build challenges
            </p>
          </div>
        </Link>
      </motion.div>

      {/* ─── 2. INNOVATION PROJECTS (LARGE FEATURE) ─── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="col-span-12 lg:col-span-6 group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between"
      >
        <Link href="/projects" className="flex flex-col justify-between p-6 sm:p-7 h-full text-decoration-none">
          {/* Top Row: Arrow Only */}
          <div className="flex justify-end items-start w-full">
            <div className="p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
              <ArrowUpRight size={18} strokeWidth={2.5} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Middle Visual: Simple list of 3 project names as plain text rows */}
          <div className="my-4 space-y-2.5">
            <div className="space-y-1.5 p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
              {[
                { name: "VoxTrace.AI", label: "Shipped", dot: "bg-emerald-500" },
                { name: "VaultMeet", label: "Shipped", dot: "bg-emerald-500" },
                { name: "ClientFlow", label: "Shipped", dot: "bg-emerald-500" },
              ].map((proj) => (
                <div key={proj.name} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${proj.dot}`} />
                    <span className="text-xs font-medium text-[var(--text-primary)]">{proj.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] opacity-70">{proj.label}</span>
                </div>
              ))}
            </div>

            {/* Single Natural Stat Row */}

          </div>

          {/* Bottom Row */}
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Innovation Projects
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-1 leading-relaxed opacity-90">
              Real-world web & app builds created by MMIL members
            </p>
          </div>
        </Link>
      </motion.div>

      {/* ─── 3. MOMENTS & GALLERY (LARGE FEATURE) ─── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="col-span-12 lg:col-span-6 group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between"
      >
        <Link href="/gallery" className="flex flex-col justify-between p-6 sm:p-7 h-full text-decoration-none">
          {/* Top Row: Arrow Only */}
          <div className="flex justify-end items-start w-full">
            <div className="p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
              <ArrowUpRight size={18} strokeWidth={2.5} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Middle Visual: 3 Overlapping Photo Tiles from Real Event Images */}
          <div className="my-5 flex items-center justify-center relative h-32">
            {/* Photo 1 (Left, rotated -6 deg) */}
            <div className="absolute left-6 sm:left-12 top-1 w-24 sm:w-28 h-20 sm:h-24 rounded-2xl overflow-hidden border border-black/10 dark:border-white/20 shadow-md transform -rotate-6">
              <img
                src="/images/gallery/WhatsApp Image 2026-07-25 at 4.07.40 PM.jpeg"
                alt="MMIL Event Photo 1"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 2 (Center, rotated 1 deg, elevated z-10) */}
            <div className="relative z-10 w-28 sm:w-32 h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-[#11222C] shadow-lg transform rotate-1">
              <img
                src="/community.jpg"
                alt="MMIL Community Photo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Photo 3 (Right, rotated 6 deg) */}
            <div className="absolute right-6 sm:right-12 top-2 w-24 sm:w-28 h-20 sm:h-24 rounded-2xl overflow-hidden border border-black/10 dark:border-white/20 shadow-md transform rotate-6">
              <img
                src="/images/gallery/WhatsApp Image 2026-07-25 at 3.36.46 PM.jpeg"
                alt="MMIL Event Photo 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Moments & Gallery
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-1 leading-relaxed opacity-90">
              Visual highlights from lab sessions & events
            </p>
          </div>
        </Link>
      </motion.div>

      {/* ─── 4. CORE TEAM (COMPACT) ─── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="col-span-12 sm:col-span-6 group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between"
      >
        <Link href="/team" className="flex flex-col justify-between p-6 sm:p-7 h-full text-decoration-none">
          {/* Top Row: Arrow Only */}
          <div className="flex justify-end items-start w-full">
            <div className="p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
              <ArrowUpRight size={18} strokeWidth={2.5} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Visual: Avatars pulled tight above heading */}
          <div className="mt-4 mb-3 flex items-center">
            <div className="flex items-center -space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#11222C] shadow-sm">
                TK
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#11222C] shadow-sm">
                AR
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#11222C] shadow-sm">
                PS
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#11222C] shadow-sm">
                VN
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#11222C] shadow-sm">
                RM
              </div>
              <div className="px-2.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold text-xs border border-amber-500/30 backdrop-blur-md z-10">
                +10
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Core Team
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-relaxed opacity-90">
              Meet our domain leads and organizers
            </p>
          </div>
        </Link>
      </motion.div>

      {/* ─── 5. ALUMNI NETWORK (COMPACT) ─── */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="col-span-12 sm:col-span-6 group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between"
      >
        <Link href="/alumni" className="flex flex-col justify-between p-6 sm:p-7 h-full text-decoration-none">
          {/* Top Row: Arrow Only */}
          <div className="flex justify-end items-start w-full">
            <div className="p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
              <ArrowUpRight size={18} strokeWidth={2.5} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Visual: Company Chips pulled tight above heading */}
          <div className="mt-4 mb-3 flex flex-wrap items-center gap-1.5">
            {["Microsoft", "Google", "Amazon", "+12"].map((company) => (
              <span
                key={company}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${company.startsWith("+")
                  ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-bold"
                  : "bg-white/80 dark:bg-white/10 text-[var(--text-secondary)] border-black/5 dark:border-white/10"
                  }`}
              >
                {company}
              </span>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              Alumni Network
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-relaxed opacity-90">
              Seniors in top global tech companies
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};



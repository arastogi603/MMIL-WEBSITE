"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FolderOpen, Users, ImageIcon, GraduationCap, BookOpen, ArrowUpRight, Sparkles } from "lucide-react";

const bentoItems = [
  {
    title: "Events & Workshops",
    subtitle: "Hackathons, technical sessions, and hands-on build challenges",
    href: "/events",
    icon: Calendar,
    color: "text-blue-500 dark:text-blue-400",
    badge: "Upcoming",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    size: "col-span-12 md:col-span-8 row-span-2",
  },
  {
    title: "Innovation Projects",
    subtitle: "Real-world web & app builds created by MMIL members",
    href: "/projects",
    icon: FolderOpen,
    color: "text-emerald-500 dark:text-emerald-400",
    badge: "Featured",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    size: "col-span-6 md:col-span-4 row-span-1",
  },
  {
    title: "Core Team",
    subtitle: "Meet our domain leads and organizers",
    href: "/team",
    icon: Users,
    color: "text-amber-500 dark:text-amber-400",
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    size: "col-span-6 md:col-span-4 row-span-1",
  },
  {
    title: "Moments & Gallery",
    subtitle: "Visual highlights from lab sessions & events",
    href: "/gallery",
    icon: ImageIcon,
    color: "text-pink-500 dark:text-pink-400",
    gradient: "from-pink-500/10 via-pink-500/5 to-transparent",
    size: "col-span-12 md:col-span-4 row-span-1",
  },
  {
    title: "Alumni Network",
    subtitle: "Seniors in top global tech companies",
    href: "/alumni",
    icon: GraduationCap,
    color: "text-indigo-500 dark:text-indigo-400",
    gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    size: "col-span-6 md:col-span-4 row-span-1",
  },
  {
    title: "Learning Hub",
    subtitle: "Curated roadmaps, repos, and dev resources",
    href: "/resources",
    icon: BookOpen,
    color: "text-purple-500 dark:text-purple-400",
    badge: "Free Resources",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    size: "col-span-6 md:col-span-4 row-span-1",
  },
];

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
      className="grid grid-cols-12 auto-rows-[160px] md:auto-rows-[200px] gap-4 md:gap-6 w-full"
    >
      {bentoItems.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            variants={itemVariants}
            whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.96 }}
            className={`${item.size} group relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#11222C] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.6)] dark:hover:border-white/20 transition-all duration-300`}
          >
            {/* Background Accent Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 dark:opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            <Link href={item.href} className="absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 text-decoration-none">

              {/* Top Row: Icon + Badge + Arrow */}
              <div className="flex justify-between items-start w-full">
                <div className={`p-3 rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/10 transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                  <Icon size={26} strokeWidth={2.2} />
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 text-[var(--text-secondary)] border border-black/5 dark:border-white/10 backdrop-blur-md">
                      <Sparkles size={12} className="text-amber-400" />
                      {item.badge}
                    </span>
                  )}
                  <div className="p-2 sm:p-2.5 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 transition-all duration-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                    <ArrowUpRight size={18} strokeWidth={2.5} className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Title + Subtitle */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)] group-hover:translate-x-1 transition-transform duration-300 leading-tight">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed opacity-90 mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

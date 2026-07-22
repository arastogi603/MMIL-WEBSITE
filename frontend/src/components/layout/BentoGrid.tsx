"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FolderOpen, Users, ImageIcon, GraduationCap, BookOpen, ArrowUpRight } from "lucide-react";

const bentoItems = [
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
    color: "text-blue-500",
    bgHover: "hover:bg-blue-500/10 dark:hover:bg-blue-500/20",
    size: "col-span-12 md:col-span-8 row-span-2",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
    color: "text-emerald-500",
    bgHover: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
    size: "col-span-12 md:col-span-4 row-span-1",
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    color: "text-orange-500",
    bgHover: "hover:bg-orange-500/10 dark:hover:bg-orange-500/20",
    size: "col-span-6 md:col-span-4 row-span-1",
  },
  {
    title: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
    color: "text-pink-500",
    bgHover: "hover:bg-pink-500/10 dark:hover:bg-pink-500/20",
    size: "col-span-6 md:col-span-6 row-span-1",
  },
  {
    title: "Alumni",
    href: "/alumni",
    icon: GraduationCap,
    color: "text-indigo-500",
    bgHover: "hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20",
    size: "col-span-6 md:col-span-3 row-span-1",
  },
  {
    title: "Resources",
    href: "/resources",
    icon: BookOpen,
    color: "text-purple-500",
    bgHover: "hover:bg-purple-500/10 dark:hover:bg-purple-500/20",
    size: "col-span-6 md:col-span-3 row-span-1",
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

export const BentoGrid = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-12 auto-rows-[140px] md:auto-rows-[180px] gap-4 md:gap-5 w-full max-w-5xl mx-auto p-4 md:p-6"
    >
      {bentoItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            variants={itemVariants}
            whileHover={{ scale: 0.98, transition: { type: "spring" as const, stiffness: 400, damping: 15 } }}
            whileTap={{ scale: 0.94 }}
            className={`${item.size} group relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.2)] transition-colors duration-300 ${item.bgHover}`}
          >
            <Link href={item.href} className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8 text-decoration-none">
              
              {/* Top Row: Icon + Arrow */}
              <div className="flex justify-between items-start w-full">
                <div className={`p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-sm border border-black/5 dark:border-white/5 transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300">
                  <div className={`p-2 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md ${item.color}`}>
                    <ArrowUpRight size={20} strokeWidth={3} />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Title */}
              <div>
                <h3 className="text-xl md:text-3xl font-bold tracking-wide text-[var(--text-primary)] leading-tight">
                  {item.title}
                </h3>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

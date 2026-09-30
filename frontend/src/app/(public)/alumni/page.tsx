"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import { alumniApi } from "@/lib/api/alumni";
import { useEffect } from "react";

interface AlumniMember {
  id: string;
  name: string;
  batchYear: number;
  linkedInUrl: string;
  linkedInUsername: string;
  avatarUrl: string;
  company: string;
}



function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PosterImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-white select-none">
        <span className="text-4xl font-black tracking-wider text-zinc-300">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover object-top transition-transform duration-200 ease-out group-hover:scale-[1.03]"
      onError={() => setHasError(true)}
    />
  );
}

function AlumniCard({ member, index }: { member: AlumniMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative group rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] h-[370px] sm:h-[420px] md:h-[460px] lg:h-[480px] cursor-pointer bg-black/5 dark:bg-white/5"
    >
      <PosterImage src={member.avatarUrl} alt={member.name} name={member.name} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      <a
        href={member.linkedInUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${member.name}'s LinkedIn profile`}
        className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 shadow-md z-10"
      >
        <LinkIcon className="w-4 h-4" />
      </a>

      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 text-white z-10 pointer-events-none">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-0.5">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/80">
          {member.company.toLowerCase().startsWith("pursuing") ||
            member.company.toLowerCase().startsWith("studying") ||
            member.company.toLowerCase().startsWith("self") ||
            member.company.toLowerCase().startsWith("masters") ? (
            <span className="text-white font-bold">{member.company}</span>
          ) : (
            <>
              Working at <span className="text-white font-bold">{member.company}</span>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [activeYear, setActiveYear] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    alumniApi.getAllAlumni().then(data => {
      const mapped = data.map((a: any) => ({
        id: a.id,
        name: a.name,
        batchYear: a.batchYear,
        company: a.company,
        role: a.role,
        linkedInUrl: a.linkedInUrl,
        linkedInUsername: "",
        avatarUrl: a.imageUrl || ""
      }));
      setAlumni(mapped);
      const years: number[] = Array.from(new Set<number>(mapped.map((a: any) => Number(a.batchYear)))).sort((a, b) => b - a);
      if (years.length > 0) setActiveYear(years[0]);
      setIsLoading(false);
    });
  }, []);

  const batchYears: number[] = Array.from(new Set<number>(alumni.map((a) => Number(a.batchYear)))).sort((a, b) => b - a);
  const filteredAlumni = alumni.filter((a) => a.batchYear === activeYear);

  if (isLoading) {
    return <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 md:pt-40 pb-24 relative font-['Outfit']"><div className="text-center">Loading...</div></main>;
  }

  return (

    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 md:pt-40 pb-24 relative font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none mb-6 text-[var(--text-primary)]"
          >
            OUR ALUMNI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-medium"
          >
            Meet the brilliant minds who helped shape MMIL. Connect with them on
            LinkedIn and follow their journey.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-14"
        >
          <div className="flex gap-3 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-[var(--card-border)]">
            {batchYears.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeYear === year
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105"
                  : "hover:bg-white/10 text-[var(--text-secondary)]"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
          <span className="px-6 text-xl sm:text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">
            Batch of {activeYear}
          </span>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {filteredAlumni.map((member, idx) => (
              <AlumniCard key={member.id} member={member} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Code2, Users, CalendarClock, Briefcase } from "lucide-react";
import Link from "next/link";
import { recruitmentApi } from "@/lib/api/recruitment";

export default function RecruitmentLandingPage() {
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCycle = async () => {
      try {
        const cycles = await recruitmentApi.getActiveCycles();
        if (cycles && cycles.length > 0) {
          setActiveCycle(cycles[0]);
        }
      } catch (err) {
        console.error("Failed to fetch active recruitment cycles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveCycle();
  }, []);

  const steps = [
    {
      title: "Resume Shortlisting",
      description: "Submit your resume highlighting your skills, past projects, and passion for technology.",
      icon: <FileText className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Technical Interview",
      description: "A deep dive into your technical fundamentals, problem-solving skills, and domain knowledge.",
      icon: <Code2 className="w-8 h-8 text-purple-400" />
    },
    {
      title: "HR Interview",
      description: "A cultural fit round to understand your mindset, teamwork abilities, and dedication.",
      icon: <Users className="w-8 h-8 text-emerald-400" />
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide uppercase ${
              activeCycle 
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" 
                : "border-slate-500/30 bg-slate-500/10 text-slate-300"
            }`}
          >
            {isLoading ? (
              <>
                <CalendarClock className="w-4 h-4 animate-pulse" /> Loading Status...
              </>
            ) : activeCycle ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                {activeCycle.name} - APPLICATIONS OPEN
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" /> APPLICATIONS CLOSED
              </>
            )}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
          >
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Core Team</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed mb-10"
          >
            We are looking for passionate developers, designers, and innovators to lead the next generation of tech initiatives. Review our recruitment process below.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <button disabled className="px-8 py-4 rounded-xl bg-slate-800 text-slate-400 font-bold text-lg opacity-50 cursor-not-allowed">
                Checking Status...
              </button>
            ) : activeCycle ? (
              <Link 
                href={`/recruitment/${activeCycle.cycleSlug}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-colors group"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button disabled className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 font-bold text-lg cursor-not-allowed">
                Recruitment Currently Closed
              </button>
            )}
          </motion.div>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            Recruitment Process
          </motion.h2>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2" />
            
            {/* Connecting Line (Mobile) */}
            <div className="md:hidden absolute top-0 left-8 w-1 h-full bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-emerald-500/20" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col md:items-center relative pl-20 md:pl-0"
                >
                  {/* Number Badge */}
                  <div className="absolute left-4 md:left-1/2 md:-top-6 w-8 h-8 md:-ml-4 rounded-full bg-[#050505] border border-white/20 flex items-center justify-center text-sm font-bold text-slate-300 z-20 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div className="glassmorphism p-8 rounded-3xl border border-white/10 text-left md:text-center hover:border-white/20 hover:bg-white/[0.03] transition-colors w-full relative z-10 bg-[#0a0a0a]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 md:mx-auto">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

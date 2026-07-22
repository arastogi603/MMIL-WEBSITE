"use client";

import React, { useEffect, useState } from "react";
import { alumniApi, Alumni } from "@/lib/api/alumni";
import { Link as LinkIcon, Briefcase, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    alumniApi.getAllAlumni().then((data) => {
      setAlumni(data);
      if (data.length > 0) {
        setActiveYear(data[0].batchYear);
      }
    });
  }, []);

  const batchYears = Array.from(new Set(alumni.map(a => a.batchYear))).sort((a, b) => b - a);
  const filteredAlumni = alumni.filter(a => a.batchYear === activeYear);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black mb-6 text-[var(--text-primary)]">OUR ALUMNI</h1>
        <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
          Meet the brilliant minds who helped shape MMIL. See where they are now and connect with them.
        </p>
      </div>

      {/* Horizontal Timeline */}
      <div className="flex justify-center mb-16">
        <div className="flex gap-4 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-[var(--card-border)] overflow-x-auto max-w-full">
          {batchYears.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
                activeYear === year 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "hover:bg-white/10 text-[var(--text-secondary)]"
              }`}
            >
              {year}
            </button>
          ))}
          {batchYears.length === 0 && <span className="px-6 py-2 text-gray-500">No batches found</span>}
        </div>
      </div>

      {/* Alumni Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeYear || 'empty'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAlumni.map((alum, idx) => (
            <motion.div
              key={alum.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-[var(--background)] shadow-inner">
                  {alum.imageUrl ? (
                    <img src={alum.imageUrl} alt={alum.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-500">{alum.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{alum.name}</h3>
                
                <div className="flex items-center justify-center gap-2 text-blue-500 font-medium text-sm mb-4">
                  <Briefcase size={16} />
                  <span>{alum.role} at {alum.company}</span>
                </div>
                
                {alum.linkedInUrl && (
                  <a 
                    href={alum.linkedInUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 p-3 rounded-full bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <LinkIcon size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

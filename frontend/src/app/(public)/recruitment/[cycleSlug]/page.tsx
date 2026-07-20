"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const domains = [
  { id: 'web', name: 'Web Development', icon: '🌐', desc: 'Build scalable frontends and robust backends.' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', desc: 'Train models and build intelligent systems.' },
  { id: 'design', name: 'UI/UX Design', icon: '✨', desc: 'Craft beautiful and intuitive user experiences.' },
  { id: 'app', name: 'App Development', icon: '📱', desc: 'Create seamless mobile applications for iOS & Android.' },
];

export default function DomainSelectionPage() {
  const params = useParams();
  const cycleSlug = params.cycleSlug as string;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-semibold tracking-wide uppercase"
          >
            {cycleSlug.replace(/-/g, ' ')} CYCLE
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
          >
            Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Domain</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl font-light"
          >
            Choose the track where you want to make an impact and help lead the next generation of tech initiatives.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domains.map((domain, i) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link 
                  href={`/recruitment/${cycleSlug}/apply/${domain.id}`}
                  className="block glassmorphism p-8 rounded-3xl border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.03] transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {domain.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{domain.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{domain.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code, Globe, Layout, Cpu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { recruitmentApi } from "@/lib/api/recruitment";

const domainData = [
  {
    id: "programming",
    name: "Programming",
    icon: Code,
    need: "In a world driven by data and automation, strong problem-solving skills and algorithmic thinking are the bedrock of software engineering.",
    societyHelp: "We conduct regular contests, peer-programming sessions, and deep dives into advanced data structures to sharpen your logic and competitive programming skills.",
    lead: {
      name: "TBA",
      role: "Programming Lead",
      avatar: "https://i.pravatar.cc/150?u=programming"
    }
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: Globe,
    need: "Every modern business and organization relies on scalable, robust, and fast web applications to reach their audience and deliver services globally.",
    societyHelp: "We provide hands-on experience building full-stack applications with modern frameworks (React, Next.js, Spring Boot) and deploying them to production.",
    lead: {
      name: "Sarah Chen",
      role: "Web Dev Lead",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    }
  },
  {
    id: "technical",
    name: "Technical",
    icon: Cpu,
    need: "Understanding the deep foundations of systems, infrastructure, open-source tech, and cutting-edge paradigms is essential for creating performant backends.",
    societyHelp: "From foundational architecture to cloud pipelines and system design, we explore how to build resilient systems and deploy complex tech stacks.",
    lead: {
      name: "David Kim",
      role: "Technical Lead",
      avatar: "https://i.pravatar.cc/150?u=david"
    }
  },
  {
    id: "design",
    name: "Design",
    icon: Layout,
    need: "A powerful backend is useless if the user interface is confusing. Intuitive, accessible, and beautiful design is critical for product success.",
    societyHelp: "Learn wireframing, prototyping, user research, and design systems in Figma. We work closely with developers to bring designs to life.",
    lead: {
      name: "Elena Martinez",
      role: "Design Lead",
      avatar: "https://i.pravatar.cc/150?u=elena"
    }
  }
];

export default function DomainsPage() {
  const router = useRouter();
  const [activeCycles, setActiveCycles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkRecruitment() {
      try {
        const cycles = await recruitmentApi.getActiveCycles();
        setActiveCycles(cycles);
      } catch (error) {
        console.error("Failed to load recruitment cycles", error);
      } finally {
        setIsLoading(false);
      }
    }
    checkRecruitment();
  }, []);

  const handleApplyClick = (domainId: string) => {
    if (activeCycles.length > 0) {
      // Route to the most recent active cycle's specific domain application
      router.push(`/recruitment/${activeCycles[0].cycleSlug}/apply/${domainId}`);
    } else {
      setToastMessage("Recruitments are currently closed. Please check back later!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-[var(--background)] pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Domains</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-lg text-[var(--text-secondary)]"
          >
            Explore the core areas of expertise at MMIL. Join a community of passionate learners and builders.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domainData.map((domain, index) => (
            <motion.div 
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--background)]/50 border border-[var(--border)] rounded-3xl p-8 backdrop-blur-sm hover:border-[var(--text-secondary)] transition-all group relative overflow-hidden flex flex-col"
            >
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-emerald-500/0 group-hover:from-blue-500/50 group-hover:via-emerald-400 group-hover:to-blue-500/50 transition-all duration-500" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <domain.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold">{domain.name}</h2>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <h3 className="text-emerald-400 font-semibold mb-2 tracking-wide text-sm uppercase">The Need</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{domain.need}</p>
                </div>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2 tracking-wide text-sm uppercase">How We Help</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{domain.societyHelp}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border)] relative">
                    <Image src={domain.lead.avatar} alt={domain.lead.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{domain.lead.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{domain.lead.role}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleApplyClick(domain.id)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-[var(--border)] transition-all flex items-center gap-2 font-medium w-full sm:w-auto justify-center disabled:opacity-50"
                >
                  Join Domain
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          className="fixed bottom-10 left-1/2 z-50 px-6 py-3 bg-red-500/90 text-white font-medium rounded-full shadow-lg border border-red-400 backdrop-blur-md"
        >
          {toastMessage}
        </motion.div>
      )}
    </main>
  );
}

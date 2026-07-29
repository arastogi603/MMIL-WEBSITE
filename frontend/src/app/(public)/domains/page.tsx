"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code, Globe, Layout, Cpu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { recruitmentApi } from "@/lib/api/recruitment";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

const domainData = [
  {
    id: "programming",
    name: "Programming",
    icon: Code,
    accent: {
      color: "#0d9488",        // teal-600
      bg: "rgba(13,148,136,0.10)",
      dot: "bg-teal-500",
      dotGlow: "rgba(20,184,166,0.5)",
      border: "#0d9488",
      label: "text-teal-600 dark:text-teal-400",
    },
    need: "In a world driven by data and automation, strong problem-solving skills and algorithmic thinking are the bedrock of software engineering.",
    societyHelp: "We conduct regular contests, peer-programming sessions, and deep dives into advanced data structures to sharpen your logic and competitive programming skills.",
    lead: {
      name: "Tanmay Kalra",
      role: "Programming Lead",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQHdOVvvjrtoaQ/profile-displayphoto-crop_800_800/B56Z.U0t6jHYAI-/0/1784908276336?e=1786579200&v=beta&t=lgOoi4ELPSBTYkEPfRQ357XNpbdbZveqlnaOOyHdNOU"
    }
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: Globe,
    accent: {
      color: "#2563eb",        // blue-600
      bg: "rgba(37,99,235,0.10)",
      dot: "bg-blue-500",
      dotGlow: "rgba(59,130,246,0.5)",
      border: "#2563eb",
      label: "text-blue-600 dark:text-blue-400",
    },
    need: "Every modern business and organization relies on scalable, robust, and fast web applications to reach their audience and deliver services globally.",
    societyHelp: "We provide hands-on experience building full-stack applications with modern frameworks (React, Next.js, Spring Boot) and deploying them to production.",
    lead: {
      name: "Disha Agrawal",
      role: "Web Dev Lead",
      avatar: "https://media.licdn.com/dms/image/v2/D5635AQEkSyHkUmXTSw/profile-framedphoto-shrink_800_800/B56Z0VRC_bJwAg-/0/1774178283808?e=1785315600&v=beta&t=CIe8dDQu7QMFDxJg9vyi37mfWwLyV2dEkWbvqvYJj64"
    }
  },
  {
    id: "technical",
    name: "Technical",
    icon: Cpu,
    accent: {
      color: "#d97706",        // amber-600
      bg: "rgba(217,119,6,0.10)",
      dot: "bg-amber-500",
      dotGlow: "rgba(245,158,11,0.5)",
      border: "#d97706",
      label: "text-amber-600 dark:text-amber-400",
    },
    need: "Understanding the deep foundations of systems, infrastructure, open-source tech, and cutting-edge paradigms is essential for creating performant backends.",
    societyHelp: "From foundational architecture to cloud pipelines and system design, we explore how to build resilient systems and deploy complex tech stacks.",
    lead: {
      name: "Vaishnav Gupta",
      role: "Technical Lead",
      avatar: "https://media.licdn.com/dms/image/v2/D5635AQHfu0yPDmJkHw/profile-framedphoto-shrink_800_800/B56Z4kv4peHEAg-/0/1778732993418?e=1785355200&v=beta&t=nKmKhCi0gcmSyI5Kmts3KN0aWcn1DDyXaD6B4xCt4co"
    }
  },
  {
    id: "design",
    name: "Design",
    icon: Layout,
    accent: {
      color: "#eb4d6d",        // brand pink
      bg: "rgba(235,77,109,0.10)",
      dot: "bg-pink-500",
      dotGlow: "rgba(236,72,153,0.5)",
      border: "#eb4d6d",
      label: "text-pink-600 dark:text-pink-400",
    },
    need: "A powerful backend is useless if the user interface is confusing. Intuitive, accessible, and beautiful design is critical for product success.",
    societyHelp: "Learn wireframing, prototyping, user research, and design systems in Figma. We work closely with developers to bring designs to life.",
    lead: {
      name: "Aarsh Upadhyay",
      role: "Design Lead",
      avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFc7G8FNXP2Cw/profile-displayphoto-shrink_800_800/B4DZXWd3q2HwAc-/0/1743059910043?e=1786579200&v=beta&t=gngRgGef8mSj5cJYciKYSDny_u6J4jhxFIsfMCTwavs"
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
      router.push(`/recruitment/${activeCycles[0].cycleSlug}/apply/${domainId}`);
    } else {
      setToastMessage("Recruitments are currently closed. Please check back later!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <main className="text-[var(--text-primary)] bg-transparent font-['Outfit'] relative z-10 w-full min-h-screen pt-20 pb-0">
      {/* Background gradients */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-[160px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none z-[-1]" />

      {/* Full-screen Hero Title Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 z-0 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black mb-6 tracking-tight leading-none">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500 drop-shadow-[0_0_35px_rgba(52,211,153,0.35)]">Domains</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] font-light tracking-wide max-w-2xl mx-auto leading-relaxed px-4"
        >
          Discover the pillars driving innovation at MMIL. Scroll down to explore our interactive domain stack.
        </motion.p>
      </section>

      {/* Scroll Stack Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <ScrollStack
          useWindowScroll={true}
          itemDistance={140}
          itemStackDistance={35}
          stackPosition="12%"
          baseScale={0.88}
          itemScale={0.03}
        >
          {domainData.map((domain) => (
            <ScrollStackItem key={domain.id}>
              <div
                className="w-full rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 lg:p-16 flex flex-col relative shadow-[0_30px_70px_rgba(0,0,0,0.14)] border border-[var(--border)] overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--background) 94%, transparent) 0%, color-mix(in srgb, var(--background) 99%, transparent) 100%)",
                  backdropFilter: "blur(25px)"
                }}
              >
                {/* Glossy top highlight */}
                <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-[var(--text-primary)]/5 to-transparent pointer-events-none rounded-t-[2.5rem] md:rounded-t-[4rem]" />

                <div className="relative z-10 flex flex-col h-full gap-8 md:gap-10">
                  {/* Domain Header */}
                  <div className="flex items-center gap-5 md:gap-8">
                    {/* Icon with accent tint background */}
                    <div
                      className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: domain.accent.bg }}
                    >
                      <domain.icon
                        className="w-8 h-8 md:w-12 md:h-12"
                        style={{ color: domain.accent.color }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-widest block mb-1" style={{ color: domain.accent.color }}>
                        DOMAIN INITIATIVE
                      </span>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-none">
                        {domain.name}
                      </h2>
                    </div>
                  </div>

                  {/* Body Content — left-border accent blocks, no box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* The Need */}
                    <div
                      className="pl-5 py-1 flex flex-col justify-center"
                      style={{ borderLeft: `3px solid ${domain.accent.border}` }}
                    >
                      <h3 className="font-bold mb-3 tracking-widest text-xs md:text-sm uppercase flex items-center gap-2.5" style={{ color: domain.accent.color }}>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: domain.accent.color }}
                        />
                        The Need
                      </h3>
                      <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl font-light leading-relaxed">
                        {domain.need}
                      </p>
                    </div>

                    {/* How We Help */}
                    <div
                      className="pl-5 py-1 flex flex-col justify-center"
                      style={{ borderLeft: `3px solid ${domain.accent.border}` }}
                    >
                      <h3 className="font-bold mb-3 tracking-widest text-xs md:text-sm uppercase flex items-center gap-2.5" style={{ color: domain.accent.color }}>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: domain.accent.color }}
                        />
                        How We Help
                      </h3>
                      <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl font-light leading-relaxed">
                        {domain.societyHelp}
                      </p>
                    </div>
                  </div>

                  {/* Lead & Apply Button Footer */}
                  <div className="pt-6 border-t border-[var(--border)] flex flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 md:border-[3px] border-[var(--background)] relative shadow-lg shrink-0">
                        <Image src={domain.lead.avatar} alt={domain.lead.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-extrabold text-lg md:text-2xl text-[var(--text-primary)] leading-tight">{domain.lead.name}</p>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] font-bold tracking-wide uppercase mt-1">{domain.lead.role}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApplyClick(domain.id)}
                      disabled={isLoading}
                      className="px-6 py-3.5 md:px-10 md:py-5 rounded-full bg-[var(--text-primary)] text-[var(--background)] hover:opacity-85 transition-opacity flex items-center gap-3 font-bold text-sm md:text-lg justify-center disabled:opacity-50 shadow-xl shrink-0"
                    >
                      <span className="hidden sm:inline">Join Domain</span>
                      <span className="inline sm:hidden">Join</span>
                      <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-50 px-8 py-4 bg-red-500/90 text-white font-bold rounded-full shadow-[0_10px_40px_rgba(239,68,68,0.4)] border border-red-400 backdrop-blur-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


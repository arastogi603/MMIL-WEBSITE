"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      name: "Tanmay kalra",
      role: "Programming Lead",
      avatar: "https://media.licdn.com/dms/image/v2/D5635AQESFxT8g3npeA/profile-framedphoto-shrink_800_800/B56ZdA80ANGsAk-/0/1749141373315?e=1785315600&v=beta&t=mkpwguPAwqxMAi7qdzyocxQ_8hK7njJ5wxaO6ccXBeo"
    }
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: Globe,
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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Hide scrollbar for the snap container */
        .snap-container::-webkit-scrollbar {
          display: none;
        }
        .snap-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .site-footer {
          display: none !important;
        }
      `}} />
      <main className="snap-container text-[var(--text-primary)] bg-transparent font-['Outfit'] relative w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory pb-0">
        {/* Background gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[150px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none z-[-1]" />

        {/* Hero Title Section */}
        <section className="h-[100dvh] w-full shrink-0 snap-start flex flex-col items-center justify-center px-4 z-0 relative">
          <div className="text-center max-w-3xl mx-auto relative group cursor-default">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-5xl md:text-8xl font-bold mb-4 md:mb-6 pt-10 md:pt-20 relative z-10"
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-teal-500 to-emerald-500 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Domains</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-[var(--text-secondary)] font-light tracking-wide px-4"
            >
              Explore the core areas of expertise at MMIL. Scroll down to discover our domains.
            </motion.p>
          </div>
        </section>

        {/* Domain Sections - Snap Scrolling with Spatial UI */}
        {domainData.map((domain, index) => {
          return (
            <section
              key={domain.id}
              className="h-[100dvh] w-full shrink-0 snap-start flex items-center justify-center px-3 md:px-4 pt-16 md:pt-20 pb-4 relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
                whileHover={{ y: -5, boxShadow: "0 30px 80px rgba(0,0,0,0.15), inset 0 2px 2px color-mix(in srgb, var(--text-primary) 10%, transparent)" }}
                className="w-full h-full max-h-[85vh] md:max-h-none md:h-auto max-w-5xl mx-auto rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-14 flex flex-col overflow-y-auto md:overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out border border-[var(--border)] custom-scrollbar"
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--background) 92%, transparent) 0%, color-mix(in srgb, var(--background) 98%, transparent) 100%)",
                  willChange: "transform, opacity"
                }}>

                {/* Liquid Glossy Reflection Highlights */}
                <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[var(--text-primary)]/5 to-transparent pointer-events-none rounded-t-[2rem] md:rounded-t-[3.5rem]" />

                <div className="relative z-10 flex flex-col h-full gap-4 md:gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ willChange: "transform, opacity" }}
                    className="flex items-center gap-4 md:gap-6"
                  >
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 md:w-24 md:h-24 rounded-xl md:rounded-[1.8rem] bg-[var(--background)]/50 border border-[var(--border)] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1),inset_0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-xl group transition-all shrink-0"
                    >
                      <domain.icon className="w-7 h-7 md:w-12 md:h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-colors duration-300" />
                    </motion.div>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] drop-shadow-sm leading-tight">{domain.name}</h2>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ y: -5, backgroundColor: "color-mix(in srgb, var(--text-primary) 5%, transparent)" }}
                      className="bg-[var(--background)]/60 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-[var(--border)] shadow-sm transition-all duration-300 relative overflow-hidden group flex flex-col justify-center"
                    >
                      <h3 className="text-emerald-500 font-bold mb-2 md:mb-4 tracking-widest text-xs md:text-sm uppercase flex items-center gap-2 md:gap-3">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        The Need
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg leading-snug md:leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-300 line-clamp-4 md:line-clamp-none">{domain.need}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ y: -5, backgroundColor: "color-mix(in srgb, var(--text-primary) 5%, transparent)" }}
                      className="bg-[var(--background)]/60 p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-[var(--border)] shadow-sm transition-all duration-300 relative overflow-hidden group flex flex-col justify-center"
                    >
                      <h3 className="text-blue-500 font-bold mb-2 md:mb-4 tracking-widest text-xs md:text-sm uppercase flex items-center gap-2 md:gap-3">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        How We Help
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg leading-snug md:leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-300 line-clamp-4 md:line-clamp-none">{domain.societyHelp}</p>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 md:mt-4 pt-4 md:pt-8 border-t border-[var(--border)] flex flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 md:gap-6">
                      <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className="w-12 h-12 md:w-20 md:h-20 rounded-full overflow-hidden border-2 md:border-[3px] border-[var(--background)] relative shadow-md shrink-0">
                        <Image src={domain.lead.avatar} alt={domain.lead.name} fill className="object-cover" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-lg md:text-2xl text-[var(--text-primary)] drop-shadow-sm leading-tight">{domain.lead.name}</p>
                        <p className="text-xs md:text-base text-[var(--text-secondary)] font-semibold tracking-wide uppercase mt-0.5">{domain.lead.role}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px color-mix(in srgb, var(--text-primary) 20%, transparent)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApplyClick(domain.id)}
                      disabled={isLoading}
                      className="px-6 py-3 md:px-10 md:py-5 rounded-full bg-[var(--text-primary)] text-[var(--background)] hover:opacity-80 transition-colors flex items-center gap-2 md:gap-3 font-bold md:font-black text-sm md:text-lg justify-center disabled:opacity-50 relative overflow-hidden group shadow-lg shrink-0"
                    >
                      <span className="hidden sm:inline">Join Domain</span>
                      <span className="inline sm:hidden">Join</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </section>
          );
        })}

        {/* Footer Snapping (Optional: ensure footer also snaps) */}
        <section className="h-[20vh] w-full shrink-0 snap-end flex items-center justify-center">
          {/* Transparent spacer so the actual footer can be seen if it's below the layout */}
        </section>

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
    </>
  );
}

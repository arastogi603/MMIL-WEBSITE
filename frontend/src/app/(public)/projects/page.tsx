"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { ExternalLink, Plus } from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import Smooth3DSlideshow from '@/components/Coverflow';
import { useAuthStore } from '@/lib/store/auth.store';
import { isCoreTeam } from "@/lib/roles";

// Mock Projects
const mockProjects = [
  {
    id: 1, title: 'Nexus AI', 
    description: 'A generative AI coding assistant built on top of LLMs to automatically generate UI components from text prompts.',
    tech: ['React', 'Python', 'FastAPI'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2, title: 'DeFi Swap', 
    description: 'Decentralized exchange protocol on Ethereum allowing automated liquidity provision for ERC20 tokens.',
    tech: ['Solidity', 'Next.js', 'Ethers.js'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec8ce?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3, title: 'CloudMonitor', 
    description: 'Real-time observability dashboard for Kubernetes clusters aggregating logs and metrics.',
    tech: ['Go', 'Kubernetes', 'Prometheus'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState(mockProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await projectsApi.getPublicProjects();
        if (data && data.length > 0) {
          setProjectsList(data);
        }
      } catch (error) {
        console.error("Failed to fetch live projects, using fallbacks.", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const activeProject: any = projectsList[activeIndex];
  const slides = projectsList.map((p: any) => ({
    image: { src: p.thumbnailImage || p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
    title: p.title
  }));

  return (
    <main className="min-h-screen text-[#111] bg-[#faf7f3] relative font-['Outfit'] pt-40 pb-24 overflow-hidden">
      
      <div className="relative z-10 pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10 relative w-full">
          {isAuthenticated && user && isCoreTeam(user.role) && (
            <div className="absolute right-0 top-0">
              <Link href="/projects/submit" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111] text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-black hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Submit Project</span>
              </Link>
            </div>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[3.5rem] sm:text-[4rem] md:text-[6rem] font-black tracking-tight leading-none text-[#111] mb-4"
          >
            OUR PROJECTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 font-medium max-w-2xl mx-auto mb-6 px-4"
          >
            Explore the innovative solutions built by our community. Swipe or click to navigate.
          </motion.p>
          {isAuthenticated && user && isCoreTeam(user.role) && (
            <div className="flex justify-center md:hidden">
              <Link href="/projects/submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111] text-white font-bold text-sm transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-black active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Submit Project</span>
              </Link>
            </div>
          )}
        </div>

        {/* 3D Coverflow Slider from Custom Component */}
        <div className="relative w-full max-w-[100vw] sm:max-w-6xl h-[450px] md:h-[550px]">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <Smooth3DSlideshow 
              slides={slides}
              showTitle={false}
              cardWidth={typeof window !== 'undefined' && window.innerWidth < 768 ? 300 : 557}
              cardHeight={typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 420}
              onActiveChange={setActiveIndex}
              radius={2}
            />
          )}
        </div>

        {/* Active Project Details */}
        {!isLoading && activeProject && (
          <div className="w-full max-w-3xl mx-auto mt-12 text-center h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center px-4"
              >
                <h2 className="text-4xl font-black text-[#111] tracking-tight mb-4">{activeProject.title}</h2>
                <p className="text-neutral-500 font-medium leading-relaxed mb-8 max-w-xl">
                  {activeProject.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {(activeProject.technologies || activeProject.tech || []).map((tech: string, i: number) => (
                    <span key={i} className="px-4 py-1.5 bg-neutral-100 rounded-full text-neutral-600 text-xs font-black uppercase tracking-wider border border-black/5">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <Link href={`/projects/${activeProject.slug || activeProject.id}`} passHref>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-[#111] text-white font-black tracking-wide text-sm transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-black hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]"
                  >
                    <span>VIEW DETAILS</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}

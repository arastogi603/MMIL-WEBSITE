"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import { useAuthStore } from '@/lib/store/auth.store';
import { isCoreTeam } from "@/lib/roles";
import { ProjectPageBackground } from "@/components/layout/ProjectPageBackground";
import './diamond.css';

const mockProjects = [
  { id: 1, title: 'Nexus AI', description: 'Generative AI coding assistant built on LLMs to generate UI from text.', tech: ['React', 'Python', 'FastAPI'], image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'DeFi Swap', description: 'Decentralized exchange protocol allowing automated liquidity for ERC20 tokens.', tech: ['Solidity', 'Next.js', 'Ethers.js'], image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec8ce?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'CloudMonitor', description: 'Real-time observability dashboard for Kubernetes aggregating logs and metrics.', tech: ['Go', 'Kubernetes', 'Prometheus'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'EcoTrack', description: 'Mobile app to track and offset personal carbon footprint.', tech: ['React Native', 'Node.js', 'MongoDB'], image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'FinDash', description: 'Interactive financial dashboard for tracking cryptocurrency portfolios.', tech: ['Vue.js', 'Tailwind', 'Firebase'], image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'LearnSpace', description: 'Collaborative online workspace for remote learning and tutoring.', tech: ['React', 'WebRTC', 'Socket.io'], image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'HealthSync', description: 'IoT platform for synchronizing data from wearable health devices.', tech: ['Python', 'AWS IoT', 'React'], image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'PixelArt Gen', description: 'AI-powered tool that converts standard images into retro pixel art.', tech: ['Python', 'TensorFlow', 'Svelte'], image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
  { id: 9, title: 'SupplyChainX', description: 'Blockchain-based supply chain tracking for transparency and auditability.', tech: ['Hyperledger', 'Express', 'React'], image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800' },
  { id: 10, title: 'MusicMatcher', description: 'Algorithm that analyzes music taste and pairs users with similar listeners.', tech: ['Spotify API', 'Django', 'PostgreSQL'], image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
  { id: 11, title: 'CyberShield', description: 'Enterprise firewall monitoring tool with real-time threat visualization.', tech: ['C++', 'Qt', 'Elasticsearch'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800' },
  { id: 12, title: 'RecipeRoam', description: 'Social platform for sharing and discovering global culinary recipes.', tech: ['Angular', 'Node.js', 'MongoDB'], image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=800' },
  { id: 13, title: 'SmartHome Hub', description: 'Centralized control system for various smart home IoT protocols.', tech: ['Rust', 'Raspberry Pi', 'React'], image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800' },
  { id: 14, title: 'TransitNow', description: 'Live public transit tracking application with delay predictions.', tech: ['Flutter', 'Google Maps API', 'Firebase'], image: 'https://images.unsplash.com/photo-1570125909232-eb263c85f48c?auto=format&fit=crop&q=80&w=800' },
  { id: 15, title: 'GameForge', description: 'Browser-based 2D game engine for hobbyist developers.', tech: ['HTML5 Canvas', 'TypeScript', 'WebGL'], image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800' },
  { id: 16, title: 'CryptoWallet', description: 'Secure, multi-signature cryptocurrency wallet with biometric authentication.', tech: ['Swift', 'Kotlin', 'Web3.js'], image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800' },
  { id: 17, title: 'AR Navigator', description: 'Augmented reality indoor navigation system for large shopping malls.', tech: ['Unity', 'C#', 'ARCore'], image: 'https://images.unsplash.com/photo-1592424001835-1887e5ee5932?auto=format&fit=crop&q=80&w=800' },
  { id: 18, title: 'VoiceAssist', description: 'Customizable voice assistant for elderly care and emergency response.', tech: ['Python', 'Dialogflow', 'Node.js'], image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800' },
  { id: 19, title: 'DataViz Pro', description: 'Advanced data visualization library for rendering complex 3D graphs.', tech: ['Three.js', 'D3.js', 'React'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
  { id: 20, title: 'QuantumSim', description: 'Educational quantum computing simulator for high school students.', tech: ['Qiskit', 'Python', 'Vue'], image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800' },
  { id: 21, title: 'AgriSense', description: 'Precision agriculture drone mapping software for crop health analysis.', tech: ['C++', 'OpenCV', 'React'], image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800' }
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<any[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<any | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (!isAuthenticated) {
          setProjectsList(mockProjects);
        } else {
          const data = await projectsApi.getPublicProjects();
          if (data && data.length > 0) {
            setProjectsList(data);
          } else {
            setProjectsList(mockProjects);
          }
        }
      } catch (error) {
        console.error("Failed to fetch live projects, using fallbacks.", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [isAuthenticated]);

  const handleProjectClick = (e: React.MouseEvent, p: any) => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && hoveredProject?.id !== p.id) {
      e.preventDefault();
      setHoveredProject(p);
    } else {
      router.push(`/projects/${p.slug || p.id}`);
    }
  };

  return (
    <main className="min-h-screen text-[var(--text-primary)] relative font-['Outfit'] pt-40 overflow-x-hidden">
      <ProjectPageBackground />
      <div className="relative z-10 pt-4 pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto flex flex-col items-center">
        <div className="text-center mb-2 relative w-full max-w-7xl mx-auto">
          {isAuthenticated && user && isCoreTeam(user.role) && (
            <div className="absolute right-0 top-0">
              <Link href="/projects/submit" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:bg-gray-100 hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Submit Project</span>
              </Link>
            </div>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(255 255 255 / 0.3)" }}
            transition={{ duration: 0.3 }}
            className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[9rem] font-black tracking-tight leading-none text-[var(--text-primary)] mb-2 font-['Bebas_Neue'] cursor-default"
          >
            OUR PROJECTS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-secondary)] font-medium max-w-2xl mx-auto mb-6 px-4"
          >
            Explore the innovative solutions built by our community. Hover or tap to learn more.
          </motion.p>
          {isAuthenticated && user && isCoreTeam(user.role) && (
            <div className="flex justify-center md:hidden mt-6">
              <Link href="/projects/submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm transition-all shadow-lg hover:bg-gray-100 active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Submit Project</span>
              </Link>
            </div>
          )}
        </div>

        <div className="diamond-grid-wrapper mt-12 mb-16 relative z-10 w-full">
          {isLoading ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-[var(--text-primary)] rounded-full animate-spin" />
            </div>
          ) : projectsList.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-4">
                <Plus size={48} className="text-white/50" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
              <p className="text-[var(--text-secondary)] mb-6 max-w-md">
                There are currently no published projects. Submit yours today to be featured!
              </p>
            </div>
          ) : (
            <ul className="diamond-grid">
              {projectsList.map((p: any, index: number) => {
                const isHoveredOnMobile = hoveredProject?.id === p.id;
                return (
                  <motion.li 
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ margin: "-25% 0px -25% 0px" }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 250, 
                      damping: 25, 
                      delay: (index % 3) * 0.1 
                    }}
                    style={{ willChange: "opacity, transform, filter" }}
                    className={`diamond-item group ${isHoveredOnMobile ? 'hovered' : ''}`}
                    onClick={(e) => handleProjectClick(e, p)}
                    onMouseEnter={() => setHoveredProject(p)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="diamond-glass-bg"></div>
                    <div className="diamond-image-container relative rounded-lg overflow-hidden">
                      <img 
                        src={p.thumbnailImage || p.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'} 
                        alt={p.title} 
                        className="diamond-image block z-0" 
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                    </div>
                    {/* Centered over the entire diamond card, completely unaffected by the image tilting */}
                    <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 group-[.hovered]:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center pointer-events-none">
                      <span className="bg-black/50 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-bold text-xs sm:text-sm tracking-[0.2em] shadow-xl flex items-center gap-2 border border-white/20 pointer-events-auto">
                        CLICK ME <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-24 left-1/2 w-[90%] max-w-sm z-50 pointer-events-none"
          >
            <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] shadow-2xl rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={hoveredProject.thumbnailImage || hoveredProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'} alt={hoveredProject.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold text-lg leading-tight">{hoveredProject.title}</h3>
                  <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">Project Preview</p>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2">
                {hoveredProject.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(hoveredProject.technologies || hoveredProject.tech || []).map((tech: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-[var(--background)] border border-[var(--border)] rounded-md text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

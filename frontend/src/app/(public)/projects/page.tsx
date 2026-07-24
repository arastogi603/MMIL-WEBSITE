"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from 'lucide-react';
import { projectsApi } from '@/lib/api/projects';
import { useAuthStore } from '@/lib/store/auth.store';
import { isCoreTeam } from "@/lib/roles";
import { ProjectPageBackground } from "@/components/layout/ProjectPageBackground";
import InfiniteMenu from '@/components/InfiniteMenu';

const mockProjects = [
  { id: 2, title: 'DeFi Swap', description: 'Decentralized exchange protocol allowing automated liquidity for ERC20 tokens.', tech: ['Solidity', 'Next.js', 'Ethers.js'], image: 'https://picsum.photos/seed/2/800/800' },
  { id: 3, title: 'CloudMonitor', description: 'Real-time observability dashboard for Kubernetes aggregating logs and metrics.', tech: ['Go', 'Kubernetes', 'Prometheus'], image: 'https://picsum.photos/seed/3/800/800' },
  { id: 4, title: 'EcoTrack', description: 'Mobile app to track and offset personal carbon footprint.', tech: ['React Native', 'Node.js', 'MongoDB'], image: 'https://picsum.photos/seed/4/800/800' },
  { id: 5, title: 'FinDash', description: 'Interactive financial dashboard for tracking cryptocurrency portfolios.', tech: ['Vue.js', 'Tailwind', 'Firebase'], image: 'https://picsum.photos/seed/5/800/800' },
  { id: 6, title: 'LearnSpace', description: 'Collaborative online workspace for remote learning and tutoring.', tech: ['React', 'WebRTC', 'Socket.io'], image: 'https://picsum.photos/seed/6/800/800' },
  { id: 7, title: 'HealthSync', description: 'IoT platform for synchronizing data from wearable health devices.', tech: ['Python', 'AWS IoT', 'React'], image: 'https://picsum.photos/seed/7/800/800' },
  { id: 8, title: 'PixelArt Gen', description: 'AI-powered tool that converts standard images into retro pixel art.', tech: ['Python', 'TensorFlow', 'Svelte'], image: 'https://picsum.photos/seed/8/800/800' },
  { id: 9, title: 'SupplyChainX', description: 'Blockchain-based supply chain tracking for transparency and auditability.', tech: ['Hyperledger', 'Express', 'React'], image: 'https://picsum.photos/seed/9/800/800' },
  { id: 10, title: 'MusicMatcher', description: 'Algorithm that analyzes music taste and pairs users with similar listeners.', tech: ['Spotify API', 'Django', 'PostgreSQL'], image: 'https://picsum.photos/seed/10/800/800' },
  { id: 11, title: 'CyberShield', description: 'Enterprise firewall monitoring tool with real-time threat visualization.', tech: ['C++', 'Qt', 'Elasticsearch'], image: 'https://picsum.photos/seed/11/800/800' },
  { id: 12, title: 'RecipeRoam', description: 'Social platform for sharing and discovering global culinary recipes.', tech: ['Angular', 'Node.js', 'MongoDB'], image: 'https://picsum.photos/seed/12/800/800' },
  { id: 13, title: 'SmartHome Hub', description: 'Centralized control system for various smart home IoT protocols.', tech: ['Rust', 'Raspberry Pi', 'React'], image: 'https://picsum.photos/seed/13/800/800' },
  { id: 14, title: 'TransitNow', description: 'Live public transit tracking application with delay predictions.', tech: ['Flutter', 'Google Maps API', 'Firebase'], image: 'https://picsum.photos/seed/14/800/800' },
  { id: 15, title: 'GameForge', description: 'Browser-based 2D game engine for hobbyist developers.', tech: ['HTML5 Canvas', 'TypeScript', 'WebGL'], image: 'https://picsum.photos/seed/15/800/800' },
  { id: 16, title: 'CryptoWallet', description: 'Secure, multi-signature cryptocurrency wallet with biometric authentication.', tech: ['Swift', 'Kotlin', 'Web3.js'], image: 'https://picsum.photos/seed/16/800/800' },
  { id: 17, title: 'AR Navigator', description: 'Augmented reality indoor navigation system for large shopping malls.', tech: ['Unity', 'C#', 'ARCore'], image: 'https://picsum.photos/seed/17/800/800' },
  { id: 18, title: 'VoiceAssist', description: 'Customizable voice assistant for elderly care and emergency response.', tech: ['Python', 'Dialogflow', 'Node.js'], image: 'https://picsum.photos/seed/18/800/800' },
  { id: 19, title: 'DataViz Pro', description: 'Advanced data visualization library for rendering complex 3D graphs.', tech: ['Three.js', 'D3.js', 'React'], image: 'https://picsum.photos/seed/19/800/800' },
  { id: 20, title: 'QuantumSim', description: 'Educational quantum computing simulator for high school students.', tech: ['Qiskit', 'Python', 'Vue'], image: 'https://picsum.photos/seed/20/800/800' },
  { id: 21, title: 'AgriSense', description: 'Precision agriculture drone mapping software for crop health analysis.', tech: ['C++', 'OpenCV', 'React'], image: 'https://picsum.photos/seed/21/800/800' }
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<any[]>(mockProjects);
  const [isMenuMoving, setIsMenuMoving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const formattedProjects = useMemo(() => {
    return projectsList.map((p, i) => ({
      image: p.thumbnailImage || p.image || `https://picsum.photos/seed/${i + 10}/800/800`,
      link: `/projects/${p.slug || p.id}`,
      title: p.title,
      description: p.description,
      tech: p.technologies || p.tech || []
    }));
  }, [projectsList]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <>
      <main 
        className="text-[var(--text-primary)] font-['Outfit'] relative w-full min-h-[100vh] overflow-x-hidden bg-light-bg dark:bg-dark-bg flex flex-col"
      >
        <ProjectPageBackground isVisible={isMenuMoving} />

        {/* Hero Section Overlay */}
        <section className="absolute top-0 w-full flex flex-col justify-start items-center px-4 z-10 pt-20 pointer-events-none">
          <div className="text-center max-w-7xl mx-auto w-full relative pointer-events-auto">
            {isAuthenticated && user && isCoreTeam(user.role) && (
              <div className="absolute right-0 top-0 hidden md:block">
                <Link href="/projects/submit" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm transition-all shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95">
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
              className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tight leading-none text-[var(--text-primary)] mb-2 font-['Bebas_Neue'] cursor-default uppercase"
            >
              OUR PROJECTS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[var(--text-secondary)] font-medium max-w-2xl mx-auto mb-6 px-4 text-base md:text-xl drop-shadow-md"
            >
              Explore the innovative solutions built by our community. Swipe to view.
            </motion.p>
          </div>
        </section>

        <div className="relative w-full h-[100vh] z-0 mt-8 md:mt-16">
          {!isLoading && projectsList.length > 0 && (
            <InfiniteMenu 
              scale={0.55}
              onMovementChange={setIsMenuMoving}
              items={formattedProjects}
            />
          )}
        </div>


        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          </div>
        )}
        
        {!isLoading && projectsList.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="p-6 rounded-full bg-[var(--background)]/50 border border-[var(--border)] mb-4">
              <Plus size={48} className="text-[var(--text-secondary)]/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Projects Yet</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md">
              There are currently no published projects. Submit yours today to be featured!
            </p>
          </div>
        )}
      </main>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code, ExternalLink, Check, X, ArrowLeft, User, GitBranch, Globe, CheckCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { withRoleGuard } from "@/components/auth/RoleGuard";

function ProjectReviewPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this fetches all pending projects from an admin endpoint
    async function loadPendingProjects() {
      try {
        const data = await apiClient.get("/projects/pending");
        setProjects(data.data);
      } catch (err) {
        // Fallback for UI demo
        setProjects([
          { slug: 'ai-trading-bot', title: 'AI Crypto Trading Bot', description: 'Automated trading bot using LSTM neural networks.', status: 'pending', submittedByUserId: 'User-A' }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    loadPendingProjects();
  }, []);

  const handleStatusUpdate = async (slug: string, status: string) => {
    try {
      await apiClient.post(`/projects/${slug}/status?status=${status}`);
      // Remove from list
      setProjects(projects.filter(p => p.slug !== slug));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="font-['Outfit'] relative">
      
      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-[#111] font-bold text-sm transition-colors mb-8 w-fit bg-white/70 backdrop-blur-xl px-4 py-2 rounded-xl border border-white shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Center</span>
        </Link>
        
        <header className="mb-10">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight mb-2">Review Projects Queue</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium">Review and approve student submissions for the public showcase.</motion.p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/70 backdrop-blur-xl p-12 rounded-[2rem] text-center border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
               <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-[#111]">Inbox Zero!</h2>
            <p className="text-neutral-500 font-medium mt-2">There are no pending project submissions.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                key={project.slug} 
                className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
                       <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-[#111]">{project.title}</h3>
                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                      PENDING
                    </span>
                  </div>
                  <p className="text-neutral-600 font-medium text-sm md:text-base mb-5">{project.description}</p>
                  
                  {/* Links */}
                  <div className="flex flex-wrap gap-4 mb-5">
                    {project.repositoryUrl && (
                      <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                        <GitBranch className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                        <Globe className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>

                  {/* Tech Stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech: string, j: number) => (
                        <span key={j} className="px-3 py-1.5 rounded-xl bg-[#faf7f3] border border-black/5 text-xs font-bold text-neutral-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs font-bold text-neutral-400 flex items-center gap-2 uppercase tracking-wider">
                    <User className="w-4 h-4" />
                    Made by: {project.submittedByName || project.submittedByUserId || "Unknown Member"}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[140px]">
                  <button onClick={() => handleStatusUpdate(project.slug, 'approved')} className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200 font-bold flex justify-center items-center gap-2">
                    <Check className="w-5 h-5" /> Approve
                  </button>
                  <button onClick={() => handleStatusUpdate(project.slug, 'rejected')} className="w-full py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200 font-bold flex justify-center items-center gap-2">
                    <X className="w-5 h-5" /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withRoleGuard(ProjectReviewPage, ["admin", "core-team"]);

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, GitBranch, AlertCircle, RefreshCw, Globe, Code, User } from "lucide-react";
import { projectsApi } from "@/lib/api/projects";

export default function AdminProjectsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await projectsApi.getAllProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAction = async (slug: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this project?`)) return;
    
    try {
      const status = action === "approve" ? "approved" : "rejected";
      await projectsApi.updateStatus(slug, status);
      setProjects(projects.map(p => p.slug === slug ? { ...p, status } : p));
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} project.`);
    }
  };

  const pendingProjects = projects.filter(p => p.status === "pending");
  const approvedProjects = projects.filter(p => p.status === "approved" || p.status === "featured");

  return (
    <div className="font-['Outfit']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">Project Submissions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium mt-1">Review and approve projects submitted by MMIL members.</motion.p>
        </div>
        <button 
          onClick={fetchProjects}
          className="p-3 rounded-xl bg-white/70 backdrop-blur-xl border border-black/5 text-neutral-500 hover:text-[#111] hover:bg-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] w-fit">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "pending" ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]" : "text-neutral-500 hover:text-[#111] hover:bg-black/5"
          }`}
        >
          Pending ({pendingProjects.length})
        </button>
        <button 
          onClick={() => setActiveTab("approved")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "approved" ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]" : "text-neutral-500 hover:text-[#111] hover:bg-black/5"
          }`}
        >
          Approved ({approvedProjects.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading && projects.length === 0 ? (
          <div className="col-span-1 lg:col-span-2 text-center py-20 text-neutral-400 font-medium">Loading projects...</div>
        ) : activeTab === "pending" && pendingProjects.length === 0 ? (
          <div className="col-span-1 lg:col-span-2 text-center py-20 text-neutral-400 font-medium bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            No pending projects to review!
          </div>
        ) : activeTab === "pending" && pendingProjects.map((project) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={project.id} 
            className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden"
          >
            <div className="p-5 md:p-6 border-b border-black/5 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-[#111]">{project.title}</h3>
                <p className="text-sm text-neutral-400 mt-1 font-medium">Submitted on {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                Pending
              </span>
            </div>
            
            <div className="p-5 md:p-6 space-y-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2">Description</p>
                <p className="text-neutral-600 font-medium">{project.description}</p>
              </div>

              {/* Made By */}
              {project.submittedByName && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">Made by {project.submittedByName}</span>
                </div>
              )}
              
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2">Links</p>
                <div className="flex flex-wrap gap-3">
                  {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm">
                      <GitBranch className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors font-semibold text-sm">
                      <Globe className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
              
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-[#faf7f3] border border-black/5 text-xs text-neutral-600 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 md:p-6 border-t border-black/5 bg-[#faf7f3]/50 flex gap-3">
              <button 
                onClick={() => handleAction(project.slug, "approve")}
                className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 border border-emerald-200 transition-colors text-sm"
              >
                <Check className="w-5 h-5" /> Approve
              </button>
              <button 
                onClick={() => handleAction(project.slug, "reject")}
                className="flex-1 py-3 rounded-xl bg-red-50 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-100 border border-red-200 transition-colors text-sm"
              >
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </motion.div>
        ))}
        
        {activeTab === "approved" && approvedProjects.length === 0 ? (
          <div className="col-span-1 lg:col-span-2 text-center py-20 text-neutral-400 font-medium bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            No approved projects found.
          </div>
        ) : activeTab === "approved" && approvedProjects.map((project) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={project.id} 
            className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden"
          >
            <div className="p-5 md:p-6 border-b border-black/5 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-[#111]">{project.title}</h3>
                <p className="text-sm text-neutral-400 mt-1 font-medium">Submitted on {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                project.status === 'featured' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="p-5 md:p-6 space-y-2">
              <p className="text-neutral-600 font-medium line-clamp-2">{project.description}</p>
            </div>

            <div className="p-5 md:p-6 border-t border-black/5 bg-[#faf7f3]/50 flex gap-3">
              <button 
                onClick={() => handleAction(project.slug, "reject")}
                className="flex-1 py-2.5 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-bold flex items-center justify-center hover:bg-neutral-200 transition-colors border border-black/5"
              >
                Revoke Approval
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

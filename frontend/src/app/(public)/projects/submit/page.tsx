"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Upload, CheckCircle, Code, GitBranch, Globe } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";

export default function SubmitProjectPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    liveUrl: "",
    tags: "",
    thumbnailImage: "",
  });

  // Basic auth check
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.post("/projects", {
        title: formData.title,
        description: formData.description,
        repositoryUrl: formData.githubUrl,
        liveDemoUrl: formData.liveUrl,
        thumbnailImage: formData.thumbnailImage,
        technologies: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/projects");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf7f3] pt-32 pb-20 text-[#111] flex items-center justify-center font-['Outfit']">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/70 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black mb-4">Project Submitted!</h2>
          <p className="text-neutral-500 font-medium mb-8">
            Your project has been successfully submitted and is pending review by the MMIL core team.
          </p>
          <p className="text-sm font-bold text-neutral-400">Redirecting to projects page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f3] pt-32 pb-20 font-['Outfit'] text-[#111]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Submit a Project</h1>
          <p className="text-neutral-500 font-medium text-lg mb-12">
            Built something cool? Submit your project to be featured on the MMIL platform and share it with the community.
          </p>

          <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05),inset_0_2px_5px_rgba(255,255,255,0.8)] space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-neutral-600 mb-2">Project Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/50 border border-black/5 rounded-2xl px-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium placeholder:text-neutral-400 shadow-inner"
                placeholder="e.g. MMIL Next.js Portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-600 mb-2">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/50 border border-black/5 rounded-2xl px-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none font-medium placeholder:text-neutral-400 shadow-inner"
                placeholder="Describe what your project does, what technologies you used, and what challenges you solved..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-600 mb-2">Thumbnail / Cover Image URL</label>
              <div className="relative group">
                <Upload className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="url"
                  value={formData.thumbnailImage}
                  onChange={(e) => setFormData({...formData, thumbnailImage: e.target.value})}
                  className="w-full bg-white/50 border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium placeholder:text-neutral-400 shadow-inner"
                  placeholder="https://example.com/image.jpg (Optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">GitHub Repository URL</label>
                <div className="relative group">
                  <GitBranch className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" />
                  <input 
                    type="url" 
                    required
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    className="w-full bg-white/50 border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium placeholder:text-neutral-400 shadow-inner"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Live Demo URL (Optional)</label>
                <div className="relative group">
                  <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" />
                  <input 
                    type="url" 
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                    className="w-full bg-white/50 border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium placeholder:text-neutral-400 shadow-inner"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-600 mb-2">Tech Stack / Tags (Comma separated)</label>
              <div className="relative group">
                <Code className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  required
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-white/50 border border-black/5 rounded-2xl pl-12 pr-4 py-4 text-[#111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium placeholder:text-neutral-400 shadow-inner"
                  placeholder="React, Next.js, Tailwind, Spring Boot"
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-[#111] text-white font-black tracking-wide flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 active:scale-[0.98] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-black"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    SUBMIT FOR REVIEW
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

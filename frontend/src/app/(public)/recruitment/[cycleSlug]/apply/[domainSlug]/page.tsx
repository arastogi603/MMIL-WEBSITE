"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, User, BookOpen, Link as LinkIcon, Code2, AlertCircle, CheckCircle } from "lucide-react";
import { recruitmentApi } from "@/lib/api/recruitment";
import { useAuthStore } from "@/lib/store/auth.store";
import Link from "next/link";

export default function ApplicationFormPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const cycleSlug = params.cycleSlug as string;
  const domainSlug = params.domainSlug as string;

  const [formData, setFormData] = useState({
    yearOfStudy: "1st Year",
    branch: "",
    resumeUrl: "",
    skills: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-['Outfit']">
        <div className="glassmorphism p-10 rounded-3xl border border-white/10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400 mb-8">You need to sign in to submit an application for the Core Team.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-2 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors">Sign In</Link>
            <Link href="/register" className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/5">Register</Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-['Outfit']">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glassmorphism p-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-slate-400 mb-8">Thank you for applying to the {domainSlug.toUpperCase()} domain. Our core team will review your profile and get back to you soon.</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
          >
            Return to Homepage
          </button>
        </motion.div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await recruitmentApi.submitApplication(cycleSlug, formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Link href="/recruitment" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-6 w-fit">
            &larr; Back to Domains
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 capitalize">{domainSlug.replace('-', ' ')}</span>
          </h1>
          <p className="text-slate-400 text-lg font-light">Complete the form below to submit your application for the {cycleSlug} cycle.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="glassmorphism p-8 md:p-10 rounded-3xl border border-white/10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Year of Study</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <select 
                  required
                  value={formData.yearOfStudy}
                  onChange={e => setFormData({...formData, yearOfStudy: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-black transition-all appearance-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Branch/Major</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={e => setFormData({...formData, branch: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-black transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Resume Link (Google Drive, Dropbox, etc.)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input 
                type="url" 
                required
                placeholder="https://..."
                value={formData.resumeUrl}
                onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-black transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Technical Skills (Comma separated)</label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-500">
                <Code2 className="w-5 h-5" />
              </div>
              <textarea 
                required
                rows={3}
                placeholder="e.g., React, Node.js, Python, Figma"
                value={formData.skills}
                onChange={e => setFormData({...formData, skills: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:bg-black transition-all resize-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-6 premium-glow py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Submit Application <Send className="w-5 h-5" />
              </span>
            )}
          </button>
        </motion.form>
      </div>
    </main>
  );
}

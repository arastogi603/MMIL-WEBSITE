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
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 font-['Outfit']">
        <div className="p-10 rounded-3xl border border-[var(--border)] text-center max-w-md shadow-xl bg-[var(--background)]/50 backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Authentication Required</h2>
          <p className="text-[var(--text-secondary)] mb-8">You need to sign in to submit an application for the Core Team.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold hover:opacity-80 transition-colors">Sign In</Link>
            <Link href="/register" className="px-6 py-2 rounded-xl bg-[var(--background)] text-[var(--text-primary)] font-bold hover:bg-[var(--text-primary)]/5 transition-colors border border-[var(--border)]">Register</Link>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 font-['Outfit']">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center max-w-md backdrop-blur-xl shadow-xl"
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Application Submitted!</h2>
          <p className="text-[var(--text-secondary)] mb-8">Thank you for applying to the {domainSlug.toUpperCase()} domain. Our core team will review your profile and get back to you soon.</p>
          <button 
            onClick={() => router.push('/domains')}
            className="w-full py-3 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold hover:opacity-80 transition-colors shadow-lg"
          >
            Return to Domain Page
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none z-[-1]" />
      
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <Link href="/domains" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 mb-6 w-fit">
            &larr; Return to Domain Page
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 capitalize drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{domainSlug.replace('-', ' ')}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg font-light">Complete the form below to submit your application for the {cycleSlug} cycle.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="p-8 md:p-10 rounded-[2rem] border border-[var(--border)] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-[var(--background)]/60 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Year of Study</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <User className="w-5 h-5" />
                </div>
                <select 
                  required
                  value={formData.yearOfStudy}
                  onChange={e => setFormData({...formData, yearOfStudy: e.target.value})}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none shadow-inner"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Branch/Major</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Computer Science"
                  value={formData.branch}
                  onChange={e => setFormData({...formData, branch: e.target.value})}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner placeholder-[var(--text-secondary)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Resume Link (Google Drive, Dropbox, etc.)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input 
                type="url" 
                required
                placeholder="https://..."
                value={formData.resumeUrl}
                onChange={e => setFormData({...formData, resumeUrl: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner placeholder-[var(--text-secondary)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)] ml-1">Technical Skills (Comma separated)</label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-[var(--text-secondary)]">
                <Code2 className="w-5 h-5" />
              </div>
              <textarea 
                required
                rows={3}
                placeholder="e.g., React, Node.js, Python, Figma"
                value={formData.skills}
                onChange={e => setFormData({...formData, skills: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none shadow-inner placeholder-[var(--text-secondary)]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-[var(--border)] text-[var(--text-primary)] font-black text-lg flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(52,211,153,0.1),inset_0_2px_10px_rgba(255,255,255,0.05)] backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-[var(--text-primary)]/10 to-transparent pointer-events-none rounded-t-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--text-primary)]/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
            
            {isSubmitting ? (
              <span className="flex items-center gap-2 relative z-10">
                <div className="w-5 h-5 border-2 border-[var(--text-primary)]/30 border-t-[var(--text-primary)] rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2 relative z-10 drop-shadow-md">
                Submit Application 
                <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Send className="w-5 h-5" />
                </motion.div>
              </span>
            )}
          </button>
        </motion.form>
      </div>
    </main>
  );
}

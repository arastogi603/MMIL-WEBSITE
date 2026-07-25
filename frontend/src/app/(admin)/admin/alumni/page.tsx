"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { alumniApi, Alumni } from "@/lib/api/alumni";
import { Plus, Trash, GraduationCap, MapPin, Building, Briefcase, ExternalLink, Users, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { withRoleGuard } from "@/components/auth/RoleGuard";

function AdminAlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Alumni>();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const data = await alumniApi.getAllAlumni();
      setAlumni(data);
    } catch (e) {
      toast.error("Failed to load alumni");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Alumni) => {
    try {
      await alumniApi.createAlumni(data);
      toast.success("Alumni created successfully");
      setIsModalOpen(false);
      reset();
      fetchAlumni();
    } catch (e) {
      toast.error("Failed to create Alumni");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni record?")) return;
    try {
      await alumniApi.deleteAlumni(id);
      toast.success("Deleted successfully");
      fetchAlumni();
    } catch (e) {
      toast.error("Failed to delete alumni");
    }
  };

  const inputClass = "w-full bg-white/50 backdrop-blur-xl border border-black/10 rounded-xl py-3 px-4 text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]/20 transition-all placeholder:text-neutral-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

  return (
    <div className="font-['Outfit'] relative space-y-8 md:space-y-10 min-h-screen">
      
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">Alumni Network</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium mt-1">Manage alumni profiles and connections.</motion.p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-[#111] hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Alumni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center items-center">
            <Loader2 className="w-10 h-10 text-neutral-400 animate-spin" />
          </div>
        ) : alumni.length === 0 ? (
          <div className="col-span-full bg-white/70 backdrop-blur-xl p-12 rounded-[2rem] text-center border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
              <Users className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-[#111]">No Alumni Yet</h2>
            <p className="text-neutral-500 font-medium mt-2">Start building the network by adding alumni profiles.</p>
          </div>
        ) : (
          alumni.map((alum, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              key={alum.id} 
              className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] relative group overflow-hidden flex flex-col h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 pointer-events-none" />
              
              <button 
                onClick={() => handleDelete(alum.id)} 
                className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
              >
                <Trash size={18} />
              </button>
              
              <div className="flex items-center gap-5 mb-6 relative z-10">
                {alum.imageUrl ? (
                  <img src={alum.imageUrl} alt={alum.name} className="w-20 h-20 rounded-2xl object-cover shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white">
                    <span className="text-3xl font-black text-white">{alum.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-black text-xl text-[#111] leading-tight">{alum.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-[inset_0_1px_2px_rgba(255,255,255,1)]">
                      Batch of {alum.batchYear}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 flex-1 relative z-10 mb-6">
                <div className="flex items-center gap-3 text-sm text-neutral-600 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-[#faf7f3] flex items-center justify-center border border-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Building size={16} className="text-neutral-500" />
                  </div>
                  {alum.company}
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-600 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-[#faf7f3] flex items-center justify-center border border-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <Briefcase size={16} className="text-neutral-500" />
                  </div>
                  {alum.role}
                </div>
              </div>

              {alum.linkedInUrl && (
                <a 
                  href={alum.linkedInUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full relative z-10 flex items-center justify-center gap-2 py-3 bg-[#faf7f3] hover:bg-blue-50 text-blue-600 font-bold text-sm rounded-xl border border-black/5 hover:border-blue-200 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,1)]"
                >
                  <ExternalLink size={18} /> View LinkedIn
                </a>
              )}
            </motion.div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-2xl border border-white rounded-[2rem] p-6 sm:p-8 w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.2)] my-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#111]">Add New Alumni</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-[#faf7f3] rounded-xl flex items-center justify-center text-neutral-500 hover:text-[#111] transition-colors border border-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Full Name</label>
                <input {...register("name", { required: true })} className={inputClass} placeholder="John Doe" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Batch Year</label>
                  <input type="number" {...register("batchYear", { required: true })} className={inputClass} placeholder="e.g. 2023" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Company</label>
                  <input {...register("company", { required: true })} className={inputClass} placeholder="Google" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Role / Position</label>
                <input {...register("role", { required: true })} className={inputClass} placeholder="Software Engineer" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">LinkedIn URL</label>
                <input type="url" {...register("linkedInUrl")} className={inputClass} placeholder="https://linkedin.com/in/..." />
              </div>
              
              <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1 mb-1.5 block">Image URL (Optional)</label>
                <input type="url" {...register("imageUrl")} className={inputClass} placeholder="https://..." />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 rounded-xl font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#111] hover:bg-black text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.15)] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Alumni"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default withRoleGuard(AdminAlumniPage, ["admin", "core-team"]);

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, RefreshCw, AlertCircle, CheckCircle, XCircle, FileText, ExternalLink, CalendarPlus, ShieldAlert, Power } from "lucide-react";
import { recruitmentApi } from "@/lib/api/recruitment";
import { useAuthStore } from "@/lib/store/auth.store";

export default function RecruitmentManagementPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const [isCreatingCycle, setIsCreatingCycle] = useState(false);
  const [newCycleForm, setNewCycleForm] = useState({ name: "", cycleSlug: "", description: "" });

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [appsData, cyclesData] = await Promise.all([
        recruitmentApi.getApplications(),
        user?.role?.toUpperCase() === "ADMIN" ? recruitmentApi.getAllCycles() : Promise.resolve([])
      ]);
      setApplications(appsData);
      setCycles(cyclesData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load recruitment data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) return;
    try {
      await recruitmentApi.updateApplicationStatus(id, status);
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update application status");
    }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recruitmentApi.createCycle(newCycleForm);
      setIsCreatingCycle(false);
      setNewCycleForm({ name: "", cycleSlug: "", description: "" });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create cycle.");
    }
  };

  const handleActivateCycle = async (slug: string) => {
    if (!confirm("Are you sure you want to open this recruitment cycle?")) return;
    try {
      await recruitmentApi.activateCycle(slug);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to activate cycle.");
    }
  };

  const handleCloseCycle = async (slug: string) => {
    if (!confirm("CRITICAL WARNING: Are you sure you want to close this cycle? This will stop all new applications!")) return;
    try {
      await recruitmentApi.closeCycle(slug);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to close cycle.");
    }
  };

  const filteredApps = applications.filter(app => 
    app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.skills.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass = "w-full bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl py-2.5 px-4 text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]/20 transition-all placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]";

  return (
    <div className="font-['Outfit'] space-y-8 md:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">Recruitment</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium mt-1">Manage cycles and review candidate applications.</motion.p>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 rounded-xl bg-white/70 backdrop-blur-xl border border-black/5 text-neutral-500 hover:text-[#111] hover:bg-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Admin Cycle Management */}
      {user?.role?.toUpperCase() === "ADMIN" && (
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-black text-[#111]">Recruitment Cycles</h2>
            <button 
              onClick={() => setIsCreatingCycle(!isCreatingCycle)}
              className="px-5 py-2.5 bg-[#111] hover:bg-black text-white font-bold rounded-xl flex items-center gap-2 transition-colors text-sm shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <CalendarPlus className="w-4 h-4" /> New Cycle
            </button>
          </div>
          
          {isCreatingCycle && (
            <div className="p-5 md:p-6 bg-[#faf7f3]/50 border-b border-black/5">
              <form onSubmit={handleCreateCycle} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input required type="text" placeholder="Name (e.g. Spring 2026)" value={newCycleForm.name} onChange={e => setNewCycleForm({...newCycleForm, name: e.target.value})} className={inputClass} />
                <input required type="text" placeholder="Slug (e.g. spring-2026)" value={newCycleForm.cycleSlug} onChange={e => setNewCycleForm({...newCycleForm, cycleSlug: e.target.value})} className={inputClass} />
                <input type="text" placeholder="Description" value={newCycleForm.description} onChange={e => setNewCycleForm({...newCycleForm, description: e.target.value})} className={inputClass} />
                <button type="submit" className="bg-[#111] hover:bg-black text-white font-bold rounded-xl py-2.5 px-4 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.15)] active:scale-95 text-sm">Create</button>
              </form>
            </div>
          )}

          <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {cycles.length === 0 ? (
               <p className="text-neutral-400 font-medium">No recruitment cycles found.</p>
            ) : cycles.map(cycle => (
              <div key={cycle.id} className="p-5 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-[#111] text-lg">{cycle.name}</h3>
                    <p className="text-xs text-neutral-400 font-medium">/{cycle.cycleSlug}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${cycle.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : cycle.status === 'closed' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                    {cycle.status.toUpperCase()}
                  </span>
                </div>
                
                {cycle.status !== 'active' ? (
                  <button onClick={() => handleActivateCycle(cycle.cycleSlug)} className="w-full py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                    <Power className="w-4 h-4" /> Open Recruitment
                  </button>
                ) : (
                  <button onClick={() => handleCloseCycle(cycle.cycleSlug)} className="w-full py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Close Recruitment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total", value: applications.length, gradient: "from-blue-500 to-cyan-400" },
          { label: "Pending", value: applications.filter(a => a.status === 'PENDING').length, gradient: "from-amber-500 to-orange-400" },
          { label: "Accepted", value: applications.filter(a => a.status === 'ACCEPTED').length, gradient: "from-emerald-500 to-green-400" },
          { label: "Rejected", value: applications.filter(a => a.status === 'REJECTED').length, gradient: "from-red-500 to-rose-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
            <h3 className="text-2xl md:text-3xl font-black text-[#111]">{stat.value}</h3>
            <p className="text-neutral-400 text-xs md:text-sm font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Candidates List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
        <div className="p-5 md:p-6 border-b border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#111]">Candidates</h2>
          <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search name, branch, skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-[#faf7f3] border border-black/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-all text-[#111] placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>

        <div className="p-4 md:p-6">
          {isLoading && applications.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 font-medium">Loading applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No applications found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {filteredApps.map((app) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  key={app.id} 
                  className="p-5 md:p-6 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row xl:items-start justify-between gap-5"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="text-xl font-black text-[#111]">{app.candidate.name}</h3>
                        <p className="text-sm text-neutral-400 font-medium">{app.candidate.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-600 border-red-200' : 
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Cycle</p>
                        <p className="text-[#111] text-sm font-semibold">{app.recruitment?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Domain</p>
                        <p className="text-emerald-600 font-semibold text-sm">{app.domainSlug}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Year</p>
                        <p className="text-[#111] text-sm font-semibold">{app.yearOfStudy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1">Branch</p>
                        <p className="text-[#111] text-sm font-semibold">{app.branch}</p>
                      </div>
                      <div className="col-span-2 md:col-span-4">
                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {app.skills.split(',').map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 rounded-lg bg-white/80 border border-black/5 text-xs text-neutral-600 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 min-w-[180px]">
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors font-bold text-sm"
                    >
                      <FileText className="w-4 h-4" /> View Resume
                    </a>
                    
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors font-bold text-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors font-bold text-sm"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

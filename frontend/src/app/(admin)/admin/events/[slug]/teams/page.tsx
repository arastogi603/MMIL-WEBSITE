"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, ShieldAlert, Users, Presentation, Search, Star, Filter } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function AdminTeamsDashboard() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, QUALIFIED, ELIMINATED
  
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [evalData, setEvalData] = useState({ status: "", round1Score: 0, round2Score: 0, round3Score: 0 });
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const ev = await eventsApi.getEventBySlug(slug as string);
        setEvent(ev);
        const res = await apiClient.get(`/admin/events/${slug}/teams`);
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load admin teams", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    try {
      await apiClient.put(`/admin/events/${slug}/teams/${selectedTeam.id}/evaluate`, evalData);
      setTeams(teams.map(t => t.id === selectedTeam.id ? { ...t, ...evalData } : t));
      setSelectedTeam(null);
    } catch (err) {
      alert("Failed to evaluate team");
    } finally {
      setIsEvaluating(false);
    }
  };

  const openEvalModal = (team: any) => {
    setSelectedTeam(team);
    setEvalData({
      status: team.status,
      round1Score: team.round1Score,
      round2Score: team.round2Score,
      round3Score: team.round3Score
    });
  };

  const filteredTeams = teams.filter(t => {
    if (!t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === "QUALIFIED") return t.status !== "ELIMINATED" && t.status !== "REGISTERED";
    if (activeTab === "ELIMINATED") return t.status === "ELIMINATED";
    return true; // ALL
  });

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="font-['Outfit'] pb-24 text-[var(--text-primary)] transition-colors duration-300 relative min-h-[calc(100vh-100px)]">
      {/* Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-[80px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-[80px] pointer-events-none z-0" 
      />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10">
        <motion.div variants={itemVariants}>
          <Link href="/admin/events" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 w-fit bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] px-4 py-2 rounded-full border border-[var(--card-border)] shadow-[0_4px_12px_var(--shadow-color)] backdrop-blur-md group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Events</span>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Team Management</h1>
            <p className="text-[var(--text-secondary)]">Evaluate and shortlist teams for <span className="text-blue-500 font-bold">{event?.title}</span></p>
          </div>
        
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
          <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1 shadow-sm">
            {['ALL', 'QUALIFIED', 'ELIMINATED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-[var(--text-primary)] text-[var(--background)] shadow-md' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)]'
                }`}
              >
                {tab === 'ALL' ? 'All Teams' : tab === 'QUALIFIED' ? 'Qualified' : 'Eliminated'}
              </button>
            ))}
          </div>
        </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[var(--card-bg)] backdrop-blur-2xl border border-[var(--card-border)] rounded-[2.5rem] p-2 sm:p-4 shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-hover-bg)] text-sm text-[var(--text-secondary)]">
                  <th className="p-4 font-semibold pl-6 rounded-tl-2xl">Team Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Locked</th>
                <th className="p-4 font-semibold">PPT Link</th>
                <th className="p-4 font-semibold text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">No teams found.</td>
                </tr>
              ) : filteredTeams.map(team => (
                <tr key={team.id} className="border-b border-[var(--card-border)] hover:bg-[var(--card-hover-bg)] transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-[var(--text-primary)] text-lg">{team.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{team.members.length} Members</p>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--card-hover-bg)] border border-[var(--card-border)] text-[var(--text-primary)]">
                      {team.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {team.isLocked ? (
                      <span className="text-green-500 flex items-center gap-1 text-sm font-bold"><CheckCircle className="w-4 h-4"/> Yes</span>
                    ) : (
                      <span className="text-[var(--text-muted)] text-sm">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    {team.pptLink ? (
                      <a href={team.pptLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-semibold text-sm">
                        <Presentation className="w-4 h-4" /> View PPT
                      </a>
                    ) : (
                      <span className="text-[var(--text-muted)] text-sm">Not submitted</span>
                    )}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => openEvalModal(team)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/10 backdrop-blur-md"
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card-bg)] w-full max-w-2xl rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-3xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none" />
              <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center bg-[var(--card-hover-bg)] relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedTeam.name}</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Evaluation & Shortlisting</p>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--background)] hover:bg-[var(--card-border)] text-[var(--text-secondary)] transition-colors">
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6 relative z-10">
                
                {/* Team Info */}
                <div className="grid grid-cols-2 gap-4 bg-[var(--card-hover-bg)] border border-[var(--card-border)] rounded-xl p-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-1">PPT Link</p>
                    {selectedTeam.pptLink ? (
                      <a href={selectedTeam.pptLink} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all">{selectedTeam.pptLink}</a>
                    ) : (
                      <span className="text-[var(--text-muted)]">None</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-1">Members Count</p>
                    <p className="text-[var(--text-primary)] font-semibold">{selectedTeam.members.length} / {selectedTeam.maxSize}</p>
                  </div>
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Team Members List</p>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedTeam.members.map((member: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-hover-bg)] relative overflow-hidden flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                              {member.name}
                              {member.isLeader && (
                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-500/20">
                                  Leader
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{member.collegeName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                            <span className="font-bold text-[var(--text-muted)] text-xs uppercase">Email:</span>
                            {member.email}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                            <span className="font-bold text-[var(--text-muted)] text-xs uppercase">Phone:</span>
                            {member.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form id="eval-form" onSubmit={handleEvaluate} className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">Team Status (Round)</label>
                    <select 
                      value={evalData.status} 
                      onChange={e => setEvalData({...evalData, status: e.target.value})} 
                      className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-3 px-4 text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all appearance-none font-bold shadow-sm"
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="ROUND_1">Round 1</option>
                      <option value="ROUND_2">Round 2</option>
                      <option value="ROUND_3">Round 3</option>
                      <option value="ELIMINATED">Eliminated</option>
                      <option value="WINNER_1">1st Place Winner</option>
                      <option value="WINNER_2">2nd Place Winner</option>
                      <option value="WINNER_3">3rd Place Winner</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 1</label>
                      <input type="number" min="0" max="100" value={evalData.round1Score ?? 0} onChange={e => setEvalData({...evalData, round1Score: parseInt(e.target.value)||0})} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-2 px-4 text-[var(--text-primary)] text-center font-mono focus:border-blue-500 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 2</label>
                      <input type="number" min="0" max="100" value={evalData.round2Score ?? 0} onChange={e => setEvalData({...evalData, round2Score: parseInt(e.target.value)||0})} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-2 px-4 text-[var(--text-primary)] text-center font-mono focus:border-blue-500 shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 3</label>
                      <input type="number" min="0" max="100" value={evalData.round3Score ?? 0} onChange={e => setEvalData({...evalData, round3Score: parseInt(e.target.value)||0})} className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl py-2 px-4 text-[var(--text-primary)] text-center font-mono focus:border-blue-500 shadow-sm" />
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-[var(--card-border)] bg-[var(--card-hover-bg)] flex justify-end gap-4 relative z-10 rounded-b-[2.5rem]">
                <button type="button" onClick={() => setSelectedTeam(null)} className="px-6 py-2 rounded-xl text-[var(--text-secondary)] font-bold hover:text-[var(--text-primary)] transition-colors border border-[var(--card-border)] bg-[var(--background)]">Cancel</button>
                <button type="submit" form="eval-form" disabled={isEvaluating} className="px-8 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {isEvaluating ? "Saving..." : "Save Evaluation"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, ShieldAlert, Users, Presentation, Search, Star, Filter } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/events";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTeamsDashboard() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
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

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) && 
    (statusFilter === "ALL" || t.status === statusFilter)
  );

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="font-['Outfit'] pb-24">
      <Link href="/admin/events" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
          <p className="text-slate-400">Evaluate and shortlist teams for <span className="text-blue-400 font-bold">{event?.title}</span></p>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search teams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="ROUND_1">Round 1</option>
              <option value="ROUND_2">Round 2</option>
              <option value="ROUND_3">Round 3</option>
              <option value="ELIMINATED">Eliminated</option>
              <option value="WINNER_1">1st Place</option>
              <option value="WINNER_2">2nd Place</option>
              <option value="WINNER_3">3rd Place</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glassmorphism rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-sm text-slate-400">
                <th className="p-4 font-semibold pl-6">Team Name</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Locked</th>
                <th className="p-4 font-semibold">PPT Link</th>
                <th className="p-4 font-semibold text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No teams found.</td>
                </tr>
              ) : filteredTeams.map(team => (
                <tr key={team.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-white text-lg">{team.name}</p>
                    <p className="text-sm text-slate-400">{team.members.length} Members</p>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                      {team.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {team.isLocked ? (
                      <span className="text-green-400 flex items-center gap-1 text-sm font-bold"><CheckCircle className="w-4 h-4"/> Yes</span>
                    ) : (
                      <span className="text-slate-500 text-sm">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    {team.pptLink ? (
                      <a href={team.pptLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm">
                        <Presentation className="w-4 h-4" /> View PPT
                      </a>
                    ) : (
                      <span className="text-slate-500 text-sm">Not submitted</span>
                    )}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => openEvalModal(team)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glassmorphism w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTeam.name}</h2>
                  <p className="text-slate-400 text-sm">Evaluation & Shortlisting</p>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="text-slate-400 hover:text-white transition-colors p-2">
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Team Info */}
                <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">PPT Link</p>
                    {selectedTeam.pptLink ? (
                      <a href={selectedTeam.pptLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">{selectedTeam.pptLink}</a>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Members</p>
                    <p className="text-slate-300">{selectedTeam.members.length} / {selectedTeam.maxSize}</p>
                  </div>
                </div>

                <form id="eval-form" onSubmit={handleEvaluate} className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Team Status (Round)</label>
                    <select 
                      value={evalData.status} 
                      onChange={e => setEvalData({...evalData, status: e.target.value})} 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none font-bold"
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
                      <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 1</label>
                      <input type="number" min="0" max="100" value={evalData.round1Score ?? 0} onChange={e => setEvalData({...evalData, round1Score: parseInt(e.target.value)||0})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white text-center font-mono focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 2</label>
                      <input type="number" min="0" max="100" value={evalData.round2Score ?? 0} onChange={e => setEvalData({...evalData, round2Score: parseInt(e.target.value)||0})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white text-center font-mono focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500"/> Round 3</label>
                      <input type="number" min="0" max="100" value={evalData.round3Score ?? 0} onChange={e => setEvalData({...evalData, round3Score: parseInt(e.target.value)||0})} className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white text-center font-mono focus:border-blue-500" />
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                <button type="button" onClick={() => setSelectedTeam(null)} className="px-6 py-2 rounded-xl text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
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

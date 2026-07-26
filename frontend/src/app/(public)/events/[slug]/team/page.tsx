"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, UserMinus, ShieldAlert, CheckCircle, Users, Lock, Link as LinkIcon, LockKeyhole, Star, UserPlus, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { apiClient } from "@/lib/api/client";

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
import { useAuthStore } from "@/lib/store/auth.store";

export default function TeamDashboardPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [team, setTeam] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [pptLinkInput, setPptLinkInput] = useState("");
  const [isSubmittingPpt, setIsSubmittingPpt] = useState(false);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${slug}/team`);
      return;
    }

    async function loadTeam() {
      try {
        const [teamRes, eventRes] = await Promise.all([
          apiClient.get(`/events/${slug}/teams/my`),
          apiClient.get(`/events/${slug}`)
        ]);
        
        setTeam(teamRes.data);
        setEventDetails(eventRes.data);
        if (teamRes.data.pptLink) setPptLinkInput(teamRes.data.pptLink);

        if (teamRes.data.isViewerLeader && !teamRes.data.isLocked) {
          try {
            const reqRes = await apiClient.get(`/events/${slug}/teams/requests`);
            setJoinRequests(reqRes.data);
          } catch (e) {
            console.error("Failed to load requests", e);
          }
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("You are not part of a team for this event.");
        } else {
          setError("Failed to load team details.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadTeam();
  }, [slug, isAuthenticated, router]);

  const copyToClipboard = () => {
    if (team?.joinCode) {
      navigator.clipboard.writeText(team.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const removeMember = async (registrationId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      await apiClient.delete(`/events/${slug}/teams/members/${registrationId}`);
      setTeam({
        ...team,
        members: team.members.filter((m: any) => m.registrationId !== registrationId)
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove member.");
    }
  };

  const lockTeam = async () => {
    if (!confirm("Are you sure you want to lock the team? No one else will be able to join!")) return;
    setIsLocking(true);
    try {
      await apiClient.post(`/events/${slug}/teams/my/lock`);
      setTeam({ ...team, isLocked: true });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to lock team.");
    } finally {
      setIsLocking(false);
    }
  };

  const submitPpt = async () => {
    if (!pptLinkInput) return;
    setIsSubmittingPpt(true);
    try {
      await apiClient.put(`/events/${slug}/teams/my/ppt`, { pptLink: pptLinkInput });
      setTeam({ ...team, pptLink: pptLinkInput });
      alert("PPT Link updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit PPT.");
    } finally {
      setIsSubmittingPpt(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setIsProcessingRequest(true);
    try {
      await apiClient.post(`/events/${slug}/teams/requests/${requestId}/approve`);
      setJoinRequests(joinRequests.filter(r => r.id !== requestId));
      // Reload team to get the new member
      const res = await apiClient.get(`/events/${slug}/teams/my`);
      setTeam(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve request.");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setIsProcessingRequest(true);
    try {
      await apiClient.post(`/events/${slug}/teams/requests/${requestId}/reject`);
      setJoinRequests(joinRequests.filter(r => r.id !== requestId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject request.");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pt-32 pb-24 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-black mb-4">Error</h1>
        <p className="text-[var(--text-secondary)] mb-8">{error || "Could not load team data."}</p>
        <Link href={`/events/${slug}`} className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold">
          ← Back to Event
        </Link>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen pt-32 pb-24 relative overflow-hidden font-['Outfit'] text-[var(--text-primary)] transition-colors duration-300"
      style={{ backgroundImage: 'var(--page-bg-img)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      <div className="absolute inset-0 bg-[var(--background)] opacity-80 dark:opacity-90 z-0 pointer-events-none" />
      
      {/* Animated Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-[80px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-[80px] pointer-events-none z-0" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 relative z-10"
      >
        <motion.div variants={itemVariants}>
          <Link href={`/events/${slug}`} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 w-fit bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] px-4 py-2 rounded-full border border-[var(--card-border)] shadow-[0_4px_12px_var(--shadow-color)] hover:shadow-[0_4px_20px_var(--shadow-color)] backdrop-blur-md group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Event</span>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-[var(--text-primary)]">{team.name}</h1>
            <p className="text-[var(--text-secondary)]">Team Dashboard &bull; Status: <span className="font-bold text-[var(--text-primary)]">{team.status}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            {!team.isLocked && team.isViewerLeader && (
              <button 
                onClick={lockTeam}
                disabled={isLocking}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              >
                <LockKeyhole className="w-5 h-5" />
                {isLocking ? "Locking..." : "Lock Team"}
              </button>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-6 shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 relative z-10">Join Code</h3>
            <p className="text-2xl font-mono font-black text-[var(--text-primary)] tracking-widest relative z-10">{team.joinCode}</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-6 shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 relative z-10">Event</h3>
            <p className="text-xl font-black text-[var(--text-primary)] relative z-10">{team.eventTitle}</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-6 shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 relative z-10">Members</h3>
            <p className="text-xl font-black text-[var(--text-primary)] relative z-10">{team.members.length} / {team.maxSize || 'Unlimited'}</p>
          </div>
        </motion.div>

        {eventDetails && (eventDetails.round1StartsAt || eventDetails.round2StartsAt) && (
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)]">
              <CalendarPlus className="w-6 h-6 text-blue-500" />
              Event Rounds Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {eventDetails.round1StartsAt && (
                <div className={`p-6 rounded-[2rem] border relative overflow-hidden backdrop-blur-md ${team.status === 'REGISTERED' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-60'}`}>
                  <h3 className="font-black text-lg text-[var(--text-primary)] mb-1">Round 1: PPT Submission</h3>
                  <p className="text-sm font-bold text-[var(--text-secondary)]">
                    Starts: {new Date(eventDetails.round1StartsAt).toLocaleString()}<br/>
                    Ends: {eventDetails.round1EndsAt ? new Date(eventDetails.round1EndsAt).toLocaleString() : 'TBA'}
                  </p>
                </div>
              )}
              {eventDetails.round2StartsAt && (
                <div className={`p-6 rounded-[2rem] border relative overflow-hidden backdrop-blur-md ${team.status === 'ROUND_1' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-60'}`}>
                  <h3 className="font-black text-lg text-[var(--text-primary)] mb-1">Round 2: Main Event</h3>
                  <p className="text-sm font-bold text-[var(--text-secondary)]">
                    {eventDetails.round2Type === 'OFFLINE' ? `Offline @ ${eventDetails.round2Address || 'TBA'}` : 'Online'}<br/>
                    Starts: {new Date(eventDetails.round2StartsAt).toLocaleString()}<br/>
                    Ends: {eventDetails.round2EndsAt ? new Date(eventDetails.round2EndsAt).toLocaleString() : 'TBA'}
                  </p>
                </div>
              )}
              {eventDetails.round3StartsAt && (
                <div className={`p-6 rounded-[2rem] border relative overflow-hidden backdrop-blur-md ${team.status === 'ROUND_2' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-60'}`}>
                  <h3 className="font-black text-lg text-[var(--text-primary)] mb-1">Round 3: Finals</h3>
                  <p className="text-sm font-bold text-[var(--text-secondary)]">
                    Starts: {new Date(eventDetails.round3StartsAt).toLocaleString()}<br/>
                    Ends: {eventDetails.round3EndsAt ? new Date(eventDetails.round3EndsAt).toLocaleString() : 'TBA'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {team.status !== 'REGISTERED' && (
          <motion.div variants={itemVariants} className={`mb-12 p-8 rounded-[2.5rem] border backdrop-blur-md relative overflow-hidden ${
            team.status === 'ELIMINATED' ? 'bg-red-900/20 border-red-500/30 shadow-[0_12px_40px_rgba(239,68,68,0.15)]' :
            team.status.startsWith('WINNER') ? 'bg-yellow-900/20 border-yellow-500/30 shadow-[0_12px_40px_rgba(234,179,8,0.15)]' :
            'bg-emerald-900/20 border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.15)]'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center">
              {team.status === 'ELIMINATED' ? (
                <>
                  <h2 className="text-3xl font-black mb-2 text-red-500 flex items-center gap-2"><ShieldAlert className="w-8 h-8"/> Thank you for participating!</h2>
                  <p className="text-red-200/80 max-w-xl text-lg font-medium">Unfortunately, your team has been eliminated in this phase. We deeply appreciate your effort and hope to see you in future events!</p>
                </>
              ) : team.status.startsWith('WINNER') ? (
                <>
                  <h2 className="text-3xl font-black mb-2 text-yellow-500 flex items-center gap-2"><Star className="w-8 h-8"/> Congratulations!</h2>
                  <p className="text-yellow-200/80 max-w-xl text-lg font-medium">Your team is a winner! ({team.status.replace('_', ' ')}). Incredible job!</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black mb-2 text-emerald-500 flex items-center gap-2"><CheckCircle className="w-8 h-8"/> Team Promoted!</h2>
                  <p className="text-emerald-200/80 max-w-xl text-lg font-medium">Your team has advanced to {team.status.replace('_', ' ')}. Keep up the great work!</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {!team.isLocked && team.isViewerLeader && joinRequests.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)]">
              <UserPlus className="w-6 h-6 text-blue-500" />
              Pending Join Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinRequests.map(req => (
                <div key={req.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 flex flex-col gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl relative overflow-hidden transition-all hover:border-[var(--highlight-color)]/50 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <h3 className="font-black text-xl text-[var(--text-primary)]">{req.name}</h3>
                    <p className="text-sm font-bold text-[var(--text-secondary)] mt-1">{req.collegeName}</p>
                    <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 opacity-70">Applied: {new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3 mt-2 relative z-10">
                    <button onClick={() => handleApproveRequest(req.id)} disabled={isProcessingRequest} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 border border-emerald-500/20 rounded-xl font-bold transition-all disabled:opacity-50">Approve</button>
                    <button onClick={() => handleRejectRequest(req.id)} disabled={isProcessingRequest} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 rounded-xl font-bold transition-all disabled:opacity-50">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {team.isLocked && (
          <motion.div variants={itemVariants} className="mb-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-sm relative overflow-hidden shadow-[0_12px_40px_rgba(59,130,246,0.2),inset_0_1px_2px_rgba(255,255,255,0.1)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
                  <LinkIcon className="w-6 h-6 text-blue-400" />
                  Presentation Submission
                </h2>
                <p className="text-blue-100 max-w-md">
                  Submit your PPT link here (e.g. Google Slides, Canva). Make sure the permissions are set to "Anyone with the link can view".
                </p>
              </div>
              
              <div className="flex-1 w-full md:max-w-md flex flex-col gap-2">
                {team.isViewerLeader ? (
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://docs.google.com/presentation/d/..."
                      value={pptLinkInput}
                      onChange={e => setPptLinkInput(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      onClick={submitPpt}
                      disabled={isSubmittingPpt || !pptLinkInput}
                      className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingPpt ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-black/30 border border-white/5 rounded-xl p-4 break-all">
                    {team.pptLink ? (
                      <a href={team.pptLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{team.pptLink}</a>
                    ) : (
                      <span className="text-slate-500 italic">No presentation submitted yet.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-6 sm:p-12 shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)] relative z-10">
            <Users className="w-6 h-6" />
            Team Members
          </h2>
          
          <div className="space-y-4 relative z-10">
            {team.members.map((member: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 sm:p-6 rounded-[1.5rem] bg-[var(--card-hover-bg)] border border-[var(--card-border)] shadow-sm relative z-10">
                <div>
                  <p className="font-bold text-[var(--text-primary)] text-lg">{member.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{member.collegeName}</p>
                </div>
                {member.isLeader && (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-black uppercase tracking-wider border border-blue-500/20">
                    Leader
                  </span>
                )}
                {team.isViewerLeader && !member.isLeader && !team.isLocked && (
                  <button 
                    onClick={() => removeMember(member.registrationId)}
                    className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors text-sm font-bold w-fit"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

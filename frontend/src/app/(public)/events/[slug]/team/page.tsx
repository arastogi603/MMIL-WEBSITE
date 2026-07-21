"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, UserMinus, ShieldAlert, CheckCircle, Users, Lock, Link as LinkIcon, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";

export default function TeamDashboardPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [team, setTeam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [pptLinkInput, setPptLinkInput] = useState("");
  const [isSubmittingPpt, setIsSubmittingPpt] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${slug}/team`);
      return;
    }

    async function loadTeam() {
      try {
        const res = await apiClient.get(`/events/${slug}/teams/my`);
        setTeam(res.data);
        if (res.data.pptLink) setPptLinkInput(res.data.pptLink);
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link href={`/events/${slug}`} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 w-fit bg-[var(--background)]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border)] shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Join Code</h3>
            <p className="text-2xl font-mono font-black text-[var(--text-primary)] tracking-widest">{team.joinCode}</p>
          </div>
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Event</h3>
            <p className="text-xl font-black text-[var(--text-primary)]">{team.eventTitle}</p>
          </div>
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Members</h3>
            <p className="text-xl font-black text-[var(--text-primary)]">{team.members.length} / {team.maxSize || 'Unlimited'}</p>
          </div>
        </div>

        {team.isLocked && (
          <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-sm">
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
          </div>
        )}

        <div className="bg-[var(--background)] border border-[var(--border)] rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)]">
            <Users className="w-6 h-6" />
            Team Members
          </h2>
          
          <div className="space-y-4">
            {team.members.map((member: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-sm">
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
        </div>
      </div>
    </main>
  );
}

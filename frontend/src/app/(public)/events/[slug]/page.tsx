"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { eventsApi } from "@/lib/api/events";
import { useAuthStore } from "@/lib/store/auth.store";
import { apiClient } from "@/lib/api/client";
import Image from "next/image";

// Maps event type to its specific cover photo
function getEventImage(type?: string): string {
  const t = (type || "").toLowerCase();
  if (t.includes("hackathon")) return "/event-hackathon.png";
  if (t.includes("workshop")) return "/event-workshop.jpg";
  if (t.includes("ideathon")) return "/event-ideathon.png";
  return "/event-default.jpg";
}

export default function EventDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);
  const [error, setError] = useState("");

  // Team Modals state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamFlow, setTeamFlow] = useState<'selection' | 'leader' | 'member'>('selection');
  
  // Leader Form State
  const [leaderStep, setLeaderStep] = useState<1 | 2 | 3>(1);
  const [teamForm, setTeamForm] = useState({
    name: "", phone: "", email: "", collegeName: "", district: "", state: "", otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [joinCodeResult, setJoinCodeResult] = useState("");

  // Member Form State
  const [memberForm, setMemberForm] = useState({
    joinCode: "", phone: "", collegeName: "", district: "", state: ""
  });

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await eventsApi.getEventBySlug(slug as string);
        setEvent(data);
        
        if (isAuthenticated) {
          try {
            const statusRes = await apiClient.get(`/events/${slug}/registration-status`);
            if (statusRes.data.isRegistered) {
              setIsRegistered(true);
              if (statusRes.data.teamId) {
                setHasTeam(true);
              }
            }
          } catch(e) {
            console.error("Failed to fetch registration status");
          }
        }
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [slug, isAuthenticated]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/events/${slug}`);
      return;
    }
    
    if (event.isTeamEvent) {
      setIsTeamModalOpen(true);
      setTeamFlow('selection');
    } else {
      handleIndividualRegister();
    }
  };

  const handleIndividualRegister = async () => {
    setIsRegistering(true);
    setError("");
    try {
      await apiClient.post(`/events/${slug}/register`);
      setIsRegistered(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");
    try {
      await apiClient.post("/otp/send", { email: teamForm.email });
      setOtpSent(true);
      setLeaderStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerifyAndCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");
    try {
      const res = await apiClient.post(`/events/${slug}/teams`, teamForm);
      setJoinCodeResult(res.data.joinCode);
      setLeaderStep(3);
      setIsRegistered(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify OTP and create team.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");
    try {
      await apiClient.post(`/events/${slug}/teams/join`, memberForm);
      setIsRegistered(true);
      setIsTeamModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join team.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf7f3] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const seatsLeft = event.capacity - event.seatsTaken;
  const isFull = seatsLeft <= 0;

  return (
    <main className="min-h-screen bg-[#faf7f3] text-[#111] pt-32 pb-24 relative overflow-hidden font-['Outfit']">
      
      {/* Immersive Glassmorphic Banner */}
      <div className="absolute top-0 left-0 w-full h-[500px] z-0 overflow-hidden">
        <Image src={getEventImage(event.type)} alt={event.title} fill className="object-cover opacity-40 blur-xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-[#faf7f3]/80 to-[#faf7f3]" />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link href="/events" className="flex items-center gap-2 text-neutral-500 hover:text-[#111] font-semibold transition-colors mb-8 w-fit bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-md md:backdrop-blur-3xl rounded-[3rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white p-8 md:p-12 relative overflow-hidden">
          
          {/* Subtle light effect inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              {event.type} {event.isTeamEvent && '(Team Event)'}
            </span>
            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border shadow-sm ${isFull ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              {isFull ? 'Registration Closed' : `${seatsLeft} Seats Left`}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-[#111] leading-[0.95]">
            {event.title}
          </h1>
          
          {/* Spatial UI Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Calendar, label: "Date", value: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
              { icon: Clock, label: "Time", value: new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
              { icon: MapPin, label: "Location", value: event.location || 'TBA' },
              { icon: Users, label: "Capacity", value: event.capacity }
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-neutral-50/50 border border-black/5 rounded-2xl p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                <item.icon className="w-6 h-6 text-neutral-400 mb-3" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{item.label}</span>
                <span className="text-sm font-black text-[#111]">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 text-[#111]">About the Event</h2>
            <p className="text-neutral-600 leading-relaxed text-lg font-medium">{event.description}</p>
          </div>

          {error && !isTeamModalOpen && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-sm mb-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-black/5 pt-8">
            {isRegistered ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3 text-emerald-600 font-black px-8 py-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm w-full sm:w-auto justify-center">
                  <CheckCircle className="w-6 h-6" />
                  ALREADY REGISTERED
                </div>
                {hasTeam && (
                  <Link href={`/events/${slug}/team`} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#111] hover:bg-black text-white font-black transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-center transform hover:scale-[1.02]">
                    TEAM DASHBOARD
                  </Link>
                )}
              </div>
            ) : (
              <button 
                onClick={handleRegisterClick}
                disabled={isFull || isRegistering}
                className="w-full px-10 py-5 rounded-2xl bg-[#111] hover:bg-black text-white font-black tracking-tight text-xl transition-all disabled:opacity-50 shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)] transform hover:scale-[1.01] active:scale-95"
              >
                {isRegistering ? "PROCESSING..." : isFull ? "EVENT FULL" : "REGISTER NOW"}
              </button>
            )}
            
            {!isAuthenticated && !isRegistered && (
              <p className="text-sm font-bold text-neutral-400 text-center uppercase tracking-wider">Login required to register</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Team Registration Modal - Spatial UI */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
              onClick={() => setIsTeamModalOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white/90 backdrop-blur-md md:backdrop-blur-3xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]"
            >
              <button onClick={() => setIsTeamModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-colors">
                <X className="w-4 h-4" />
              </button>

              {teamFlow === 'selection' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-3xl font-black mb-3 text-[#111] tracking-tight">TEAM EVENT</h2>
                  <p className="text-neutral-500 mb-8 font-medium">How would you like to participate?</p>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setTeamFlow('leader')} className="w-full py-4 rounded-2xl bg-[#111] hover:bg-black text-white font-black tracking-wide transition-all shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      CREATE A TEAM
                    </button>
                    <button onClick={() => setTeamFlow('member')} className="w-full py-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-[#111] font-black tracking-wide transition-colors border border-white shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                      JOIN EXISTING TEAM
                    </button>
                  </div>
                </div>
              )}

              {teamFlow === 'leader' && leaderStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4 py-2">
                  <h2 className="text-3xl font-black mb-6 text-[#111] tracking-tight">Create Team</h2>
                  {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">{error}</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Team Name</label>
                      <input required type="text" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone (+code)</label>
                      <input required type="tel" placeholder="+1234567890" value={teamForm.phone} onChange={e => setTeamForm({...teamForm, phone: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
                    <input required type="email" value={teamForm.email} onChange={e => setTeamForm({...teamForm, email: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">College Name</label>
                    <input required type="text" value={teamForm.collegeName} onChange={e => setTeamForm({...teamForm, collegeName: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">District</label>
                      <input required type="text" value={teamForm.district} onChange={e => setTeamForm({...teamForm, district: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">State</label>
                      <input required type="text" value={teamForm.state} onChange={e => setTeamForm({...teamForm, state: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                  </div>

                  <button type="submit" disabled={isRegistering} className="w-full py-4 mt-6 rounded-2xl bg-[#111] text-white font-black tracking-wide hover:bg-black transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    {isRegistering ? "SENDING OTP..." : "SEND OTP"}
                  </button>
                </form>
              )}

              {teamFlow === 'leader' && leaderStep === 2 && (
                <form onSubmit={handleVerifyAndCreateTeam} className="space-y-4 py-8 text-center">
                  <h2 className="text-3xl font-black mb-2 text-[#111] tracking-tight">Verify Email</h2>
                  <p className="text-neutral-500 mb-8 font-medium">Enter the 6-digit OTP sent to your email.</p>
                  {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl text-left">{error}</div>}
                  
                  <input required type="text" maxLength={6} placeholder="000000" value={teamForm.otp} onChange={e => setTeamForm({...teamForm, otp: e.target.value})} className="w-2/3 mx-auto text-center tracking-[0.75em] font-mono text-3xl bg-neutral-50 border border-black/5 rounded-2xl py-4 px-4 text-[#111] focus:border-blue-500 outline-none block shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" />
                  
                  <button type="submit" disabled={isRegistering} className="w-full py-4 mt-8 rounded-2xl bg-[#111] text-white font-black tracking-wide hover:bg-black transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    {isRegistering ? "VERIFYING..." : "VERIFY & CREATE TEAM"}
                  </button>
                </form>
              )}

              {teamFlow === 'leader' && leaderStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-black mb-3 text-[#111] tracking-tight">Team Created!</h2>
                  <p className="text-neutral-500 mb-8 font-medium">Share this code with your teammates to let them join:</p>
                  
                  <div className="bg-neutral-50 border border-black/5 rounded-2xl p-6 mb-8 select-all cursor-pointer hover:border-blue-200 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <span className="font-mono text-4xl font-black text-blue-600 tracking-widest">{joinCodeResult}</span>
                  </div>

                  <button onClick={() => setIsTeamModalOpen(false)} className="w-full py-4 rounded-2xl bg-[#111] text-white font-black tracking-wide transition-all shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                    DONE
                  </button>
                </div>
              )}

              {teamFlow === 'member' && (
                <form onSubmit={handleJoinTeam} className="space-y-4 py-2 text-left">
                  <h2 className="text-3xl font-black mb-2 text-[#111] tracking-tight">Join Team</h2>
                  <p className="text-neutral-500 mb-6 font-medium">Enter the team code and your details.</p>
                  {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl">{error}</div>}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Join Code</label>
                      <input required type="text" placeholder="MMIL-XXXXX" value={memberForm.joinCode} onChange={e => setMemberForm({...memberForm, joinCode: e.target.value.toUpperCase()})} className="w-full font-mono bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Phone</label>
                      <input required type="tel" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">College Name</label>
                    <input required type="text" value={memberForm.collegeName} onChange={e => setMemberForm({...memberForm, collegeName: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">District</label>
                      <input required type="text" value={memberForm.district} onChange={e => setMemberForm({...memberForm, district: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">State</label>
                      <input required type="text" value={memberForm.state} onChange={e => setMemberForm({...memberForm, state: e.target.value})} className="w-full bg-neutral-50 border border-black/5 rounded-xl py-3 px-4 text-[#111] focus:border-blue-500 outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium" />
                    </div>
                  </div>
                  
                  <button type="submit" disabled={isRegistering} className="w-full py-4 mt-6 rounded-2xl bg-[#111] text-white font-black tracking-wide hover:bg-black transition-all disabled:opacity-50 shadow-[0_4px_20px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                    {isRegistering ? "JOINING..." : "JOIN TEAM"}
                  </button>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Plus, X, MapPin, Users, Type, AlignLeft, ShieldAlert, Trash2 } from "lucide-react";
import { eventsApi } from "@/lib/api/events";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";
import { isAdminRights } from "@/lib/roles";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEventSlug, setEditingEventSlug] = useState<string | null>(null);
  const { user } = useAuthStore();
  const isAdmin = isAdminRights(user?.role);
  
  const initialFormState = {
    title: "", type: "event", location: "", capacity: 100, 
    startDate: "", endDate: "", description: "",
    isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 4, posterUrl: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await eventsApi.getAllEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePublish = async (slug: string) => {
    if (!confirm("Are you sure you want to publish this event? It will become visible to the public.")) return;
    try {
      await eventsApi.publishEvent(slug);
      setEvents(events.map(e => e.slug === slug ? { ...e, status: "published" } : e));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to publish event.");
    }
  };

  const handleUnpublish = async (slug: string) => {
    if (!confirm("CRITICAL WARNING: Are you sure you want to unpublish this event? This will instantly remove ALL participants and teams registered for it!")) return;
    try {
      await eventsApi.unpublishEvent(slug);
      setEvents(events.map(e => e.slug === slug ? { ...e, status: "draft" } : e));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to unpublish event.");
    }
  };

  const handleDeleteDraft = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    try {
      await eventsApi.deleteEvent(slug);
      setEvents(events.filter(e => e.slug !== slug));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleEditClick = (event: any) => {
    setEditingEventSlug(event.slug);
    setFormData({
      title: event.title || "",
      type: event.type || "event",
      location: event.location || "",
      capacity: event.capacity || 100,
      startDate: event.startDate ? event.startDate.substring(0, 16) : "",
      endDate: event.endDate ? event.endDate.substring(0, 16) : "",
      description: event.description || "",
      isTeamEvent: event.isTeamEvent || false,
      teamSizeMin: event.teamSizeMin || 1,
      teamSizeMax: event.teamSizeMax || 4,
      posterUrl: event.posterUrl || "",
      round1StartsAt: event.round1StartsAt ? event.round1StartsAt.substring(0, 16) : "",
      round1EndsAt: event.round1EndsAt ? event.round1EndsAt.substring(0, 16) : "",
      round2Type: event.round2Type || "ONLINE",
      round2Address: event.round2Address || "",
      round2StartsAt: event.round2StartsAt ? event.round2StartsAt.substring(0, 16) : "",
      round2EndsAt: event.round2EndsAt ? event.round2EndsAt.substring(0, 16) : "",
      round3StartsAt: event.round3StartsAt ? event.round3StartsAt.substring(0, 16) : "",
      round3EndsAt: event.round3EndsAt ? event.round3EndsAt.substring(0, 16) : ""
    });
    setIsModalOpen(true);
  };

  const handleCreateOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const payload = {
        ...formData,
        slug,
        isTeamEvent: formData.isTeamEvent || formData.type === 'hackathon',
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        round1StartsAt: formData.round1StartsAt ? new Date(formData.round1StartsAt).toISOString() : null,
        round1EndsAt: formData.round1EndsAt ? new Date(formData.round1EndsAt).toISOString() : null,
        round2Type: formData.round2Type,
        round2Address: formData.round2Type === 'OFFLINE' ? formData.round2Address : null,
        round2StartsAt: formData.round2StartsAt ? new Date(formData.round2StartsAt).toISOString() : null,
        round2EndsAt: formData.round2EndsAt ? new Date(formData.round2EndsAt).toISOString() : null,
        round3StartsAt: formData.round3StartsAt ? new Date(formData.round3StartsAt).toISOString() : null,
        round3EndsAt: formData.round3EndsAt ? new Date(formData.round3EndsAt).toISOString() : null,
      };

      if (editingEventSlug) {
        await eventsApi.updateEvent(editingEventSlug, payload);
      } else {
        await eventsApi.createEvent(payload);
      }
      setIsModalOpen(false);
      setEditingEventSlug(null);
      setFormData(initialFormState);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save event.");
    } finally {
      setIsCreating(false);
    }
  };

  const draftEvents = events.filter(e => e.status === "draft");
  const publishedEvents = events.filter(e => e.status === "published");
  const completedEvents = events.filter(e => e.status === "completed");

  const inputClass = "w-full bg-white/80 backdrop-blur-xl border border-black/10 rounded-xl py-2.5 px-4 text-[#111] focus:outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]/20 transition-all placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]";

  return (
    <div className="font-['Outfit']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">Event Management</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-neutral-500 font-medium mt-1">Create, publish, and manage MMIL events and hackathons.</motion.p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111] text-white font-bold text-sm hover:bg-black transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Draft
          </button>
          <button 
            onClick={fetchEvents}
            className="p-3 rounded-xl bg-white/70 backdrop-blur-xl border border-black/5 text-neutral-500 hover:text-[#111] hover:bg-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3 font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Draft Events Column */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5">
            <h2 className="text-lg font-black text-[#111]">Drafts ({draftEvents.length})</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {isLoading && events.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">Loading...</p>
            ) : draftEvents.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">No draft events.</p>
            ) : draftEvents.map(event => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.id} 
                className="p-6 rounded-[2rem] border border-white/80 bg-gradient-to-b from-[#faf7f3] to-white shadow-[0_10px_25px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <div className="flex justify-between items-start mb-4 relative">
                  <h3 className="font-black text-[#111] text-xl leading-tight">{event.title}</h3>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-b from-amber-100 to-amber-50 text-amber-700 border border-amber-200 shadow-[inset_0_2px_4px_rgba(255,255,255,1)] uppercase tracking-wider">Draft</span>
                </div>
                <div className="flex flex-col gap-3 mb-6 relative">
                  <div className="flex items-center gap-3 text-sm text-neutral-500 font-bold bg-white/50 p-3 rounded-2xl border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-500 font-bold bg-white/50 p-3 rounded-2xl border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    {event.location || 'Location TBA'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 relative">
                  <button 
                    onClick={() => handleEditClick(event)}
                    className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(59,130,246,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Type className="w-4 h-4" /> Edit Event
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handlePublish(event.slug)}
                      className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-b from-emerald-50 to-emerald-100/50 text-emerald-600 border border-emerald-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(16,185,129,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Publish
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteDraft(event.slug)}
                    className="col-span-2 w-full py-3 rounded-2xl font-black text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Draft
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* Published Events Column */}
        <div className="bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_4px_8px_rgba(255,255,255,0.8)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] -z-10" />
          <div className="p-6 md:p-8 border-b border-black/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_8px_16px_rgba(59,130,246,0.3)] text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-[#111]">Published ({publishedEvents.length})</h2>
          </div>
          <div className="p-4 md:p-6 space-y-5">
            {isLoading && events.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">Loading...</p>
            ) : publishedEvents.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">No published events.</p>
            ) : publishedEvents.map(event => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.id} 
                className="p-6 rounded-[2rem] border border-white/80 bg-gradient-to-b from-[#faf7f3] to-white shadow-[0_10px_25px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <div className="flex justify-between items-start mb-4 relative">
                  <h3 className="font-black text-[#111] text-xl leading-tight">{event.title}</h3>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-b from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200 shadow-[inset_0_2px_4px_rgba(255,255,255,1)] uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6 font-bold bg-white/50 p-3 rounded-2xl border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
                
                {event.isTeamEvent && (
                  <Link 
                    href={`/admin/events/${event.slug}/teams`}
                    className="w-full py-3 mb-3 rounded-2xl font-black text-sm bg-gradient-to-b from-purple-50 to-purple-100/50 text-purple-600 border border-purple-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(168,85,247,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(168,85,247,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 relative"
                  >
                    <Users className="w-4 h-4" /> Manage Teams
                  </Link>
                )}
                <div className="grid grid-cols-2 gap-3 relative">
                  <button 
                    onClick={() => handleEditClick(event)}
                    className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(59,130,246,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Type className="w-4 h-4" /> Edit Event
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handleUnpublish(event.slug)}
                      className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-b from-red-50 to-red-100/50 text-red-600 border border-red-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(239,68,68,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(239,68,68,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4" /> Unpublish
                    </button>
                  )}
                </div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Events Column */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5 flex items-center gap-3">
            <h2 className="text-lg font-black text-[#111]">Completed ({completedEvents.length})</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {isLoading && events.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">Loading...</p>
            ) : completedEvents.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">No completed events.</p>
            ) : completedEvents.map(event => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.id} 
                className="p-6 rounded-[2rem] border border-white/80 bg-gradient-to-b from-[#faf7f3] to-white shadow-[0_10px_25px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] relative group overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <div className="flex justify-between items-start mb-4 relative">
                  <h3 className="font-black text-[#111] text-xl leading-tight">{event.title}</h3>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-b from-neutral-200 to-neutral-100 text-neutral-600 border border-neutral-300 shadow-[inset_0_2px_4px_rgba(255,255,255,1)] uppercase tracking-wider">Past</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500 mb-6 font-bold bg-white/50 p-3 rounded-2xl border border-black/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
                
                <button 
                  onClick={() => handleEditClick(event)}
                  className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-b from-blue-50 to-blue-100/50 text-blue-600 border border-blue-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(59,130,246,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_15px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Type className="w-4 h-4" /> Edit Event
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white/90 backdrop-blur-3xl w-full max-w-2xl rounded-[2rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-black text-[#111]">{editingEventSlug ? "Edit Event" : "Create New Event"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-neutral-500 hover:text-[#111] hover:bg-black/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="create-event-form" onSubmit={handleCreateOrUpdateEvent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. AI Hackathon" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Type</label>
                      <select required value={formData.type} onChange={e => {
                        const newType = e.target.value;
                        setFormData({...formData, type: newType, isTeamEvent: formData.isTeamEvent || newType === 'hackathon'});
                      }} className={inputClass + " appearance-none"}>
                        <option value="event">General Event</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Location</label>
                      <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass} placeholder="e.g. Main Auditorium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Poster Image URL (Optional)</label>
                      <input type="url" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} className={inputClass} placeholder="https://example.com/poster.jpg" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-600">Capacity (Seats)</label>
                    <input required type="number" min="1" value={formData.capacity || ""} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} className={inputClass} placeholder="100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Start Date</label>
                      <input required type="datetime-local" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">End Date</label>
                      <input required type="datetime-local" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <input 
                      type="checkbox" 
                      id="isTeamEvent" 
                      checked={formData.isTeamEvent || formData.type === 'hackathon'} 
                      onChange={e => setFormData({...formData, isTeamEvent: e.target.checked})} 
                      disabled={formData.type === 'hackathon'}
                      className="w-5 h-5 rounded border-black/10 text-[#111] focus:ring-[#111] disabled:opacity-50" 
                    />
                    <label htmlFor="isTeamEvent" className={`text-sm font-bold ${formData.type === 'hackathon' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      This is a Team Event {formData.type === 'hackathon' && '(Required for Hackathons)'}
                    </label>
                  </div>

                  {(formData.isTeamEvent || formData.type === 'hackathon') && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl border border-blue-200 bg-blue-50">
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-blue-700">Min Team Size</label>
                          <input required type="number" min="1" value={formData.teamSizeMin || ""} onChange={e => setFormData({...formData, teamSizeMin: parseInt(e.target.value) || 1})} className={inputClass} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-blue-700">Max Team Size</label>
                          <input required type="number" min="1" value={formData.teamSizeMax || ""} onChange={e => setFormData({...formData, teamSizeMax: parseInt(e.target.value) || 4})} className={inputClass} />
                        </div>
                      </div>

                      <div className="border border-neutral-200 rounded-[1.5rem] p-4 space-y-4 bg-neutral-50/50">
                        <h3 className="text-sm font-black text-[#111] border-b pb-2">Rounds Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 1 (PPT) Starts At</label>
                            <input type="datetime-local" value={formData.round1StartsAt || ""} onChange={e => setFormData({...formData, round1StartsAt: e.target.value})} className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 1 (PPT) Ends At</label>
                            <input type="datetime-local" value={formData.round1EndsAt || ""} onChange={e => setFormData({...formData, round1EndsAt: e.target.value})} className={inputClass} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 2 Type</label>
                            <select value={formData.round2Type || "ONLINE"} onChange={e => setFormData({...formData, round2Type: e.target.value})} className={`${inputClass} appearance-none`}>
                              <option value="ONLINE">Online</option>
                              <option value="OFFLINE">Offline</option>
                            </select>
                          </div>
                          {formData.round2Type === 'OFFLINE' && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-neutral-600">Round 2 Address</label>
                              <input type="text" placeholder="Venue Address..." value={formData.round2Address || ""} onChange={e => setFormData({...formData, round2Address: e.target.value})} className={inputClass} />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 2 Starts At</label>
                            <input type="datetime-local" value={formData.round2StartsAt || ""} onChange={e => setFormData({...formData, round2StartsAt: e.target.value})} className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 2 Ends At</label>
                            <input type="datetime-local" value={formData.round2EndsAt || ""} onChange={e => setFormData({...formData, round2EndsAt: e.target.value})} className={inputClass} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 3 (Finals) Starts At</label>
                            <input type="datetime-local" value={formData.round3StartsAt || ""} onChange={e => setFormData({...formData, round3StartsAt: e.target.value})} className={inputClass} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600">Round 3 (Finals) Ends At</label>
                            <input type="datetime-local" value={formData.round3EndsAt || ""} onChange={e => setFormData({...formData, round3EndsAt: e.target.value})} className={inputClass} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-600">Description</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass + " resize-none"} placeholder="Details about the event..."></textarea>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-black/5 flex gap-4 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-neutral-500 font-bold hover:text-[#111] hover:bg-black/5 transition-colors">Cancel</button>
                <button type="submit" form="create-event-form" disabled={isCreating} className="px-6 py-2.5 rounded-xl bg-[#111] text-white font-bold hover:bg-black transition-colors disabled:opacity-50 shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  {isCreating ? "Saving..." : "Create Event"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

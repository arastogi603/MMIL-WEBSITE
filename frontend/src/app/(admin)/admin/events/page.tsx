"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, RefreshCw, AlertCircle, CheckCircle, Plus, X, MapPin, Users, Type, AlignLeft, ShieldAlert, Trash2 } from "lucide-react";
import { eventsApi } from "@/lib/api/events";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: "", type: "event", location: "", capacity: 100, 
    startDate: "", endDate: "", description: "",
    isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 4
  });

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
    if (!confirm("Are you sure you want to delete this draft event? This cannot be undone.")) return;
    try {
      await eventsApi.deleteEvent(slug);
      setEvents(events.filter(e => e.slug !== slug));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      await eventsApi.createEvent({ ...formData, slug });
      setIsModalOpen(false);
      setFormData({ title: "", type: "event", location: "", capacity: 100, startDate: "", endDate: "", description: "", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 4 });
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create event.");
    } finally {
      setIsCreating(false);
    }
  };

  const draftEvents = events.filter(e => e.status === "draft");
  const publishedEvents = events.filter(e => e.status === "published");

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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
                className="p-5 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#111] text-lg">{event.title}</h3>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">Draft</span>
                </div>
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handlePublish(event.slug)}
                    className="w-full py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Publish Event
                  </button>
                  {user?.role?.toUpperCase() === "ADMIN" && (
                    <button 
                      onClick={() => handleDeleteDraft(event.slug)}
                      className="w-full py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Draft
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Published Events Column */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-black/5">
            <h2 className="text-lg font-black text-[#111]">Published ({publishedEvents.length})</h2>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {isLoading && events.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">Loading...</p>
            ) : publishedEvents.length === 0 ? (
              <p className="text-neutral-400 text-center py-4 font-medium">No published events.</p>
            ) : publishedEvents.map(event => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.id} 
                className="p-5 rounded-2xl border border-black/5 bg-[#faf7f3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#111] text-lg">{event.title}</h3>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4 font-medium">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
                {event.isTeamEvent && (
                  <Link 
                    href={`/admin/events/${event.slug}/teams`}
                    className="w-full py-2.5 rounded-xl font-bold text-sm bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <Users className="w-4 h-4" /> Manage Teams
                  </Link>
                )}
                {user?.role?.toUpperCase() === "ADMIN" && (
                  <button 
                    onClick={() => handleUnpublish(event.slug)}
                    className="w-full py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" /> Unpublish (Admin Only)
                  </button>
                )}
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
                <h2 className="text-xl font-black text-[#111]">Create New Event</h2>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-neutral-500 hover:text-[#111] hover:bg-black/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="create-event-form" onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. AI Hackathon" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-600">Type</label>
                      <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputClass + " appearance-none"}>
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
                      <label className="text-sm font-bold text-neutral-600">Capacity (Seats)</label>
                      <input required type="number" min="1" value={formData.capacity || ""} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} className={inputClass} placeholder="100" />
                    </div>
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
                    <input type="checkbox" id="isTeamEvent" checked={formData.isTeamEvent} onChange={e => setFormData({...formData, isTeamEvent: e.target.checked})} className="w-5 h-5 rounded border-black/10 text-[#111] focus:ring-[#111]" />
                    <label htmlFor="isTeamEvent" className="text-sm font-bold text-neutral-600">This is a Team Event</label>
                  </div>

                  {formData.isTeamEvent && (
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

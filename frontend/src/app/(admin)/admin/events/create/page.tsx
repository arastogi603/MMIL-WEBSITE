"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { withRoleGuard } from "@/components/auth/RoleGuard";

function CreateEventPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Event");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.post("/events", {
        title,
        type,
        description,
        location,
        capacity: parseInt(capacity),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(startDate).toISOString(), // Mocking for now
      });
      
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#faf7f3] border border-black/5 rounded-xl px-4 py-3 text-[#111] focus:outline-none focus:border-[#111] transition-all placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]";

  return (
    <div className="font-['Outfit'] relative">
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-neutral-500 hover:text-[#111] font-bold text-sm transition-colors mb-8 w-fit bg-white/70 backdrop-blur-xl px-4 py-2 rounded-xl border border-white shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Center</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black text-[#111] tracking-tight mb-2">Create New Event</h1>
          <p className="text-neutral-500 font-medium mb-10">Draft a new event. It will be immediately published to the public API.</p>
          
          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. AI Masterclass"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Event Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Event">Event</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-600 mb-2">Description</label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Details about the event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Location</label>
                <input 
                  type="text" 
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Main Aud."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Capacity</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className={inputClass}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-2">Date</label>
                <input 
                  type="datetime-local" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#111] text-white font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors mt-4 disabled:opacity-50 shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              {isSubmitting ? "Publishing..." : "Create & Publish Event"}
              {!isSubmitting && <CheckCircle className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default withRoleGuard(CreateEventPage, ["admin", "core-team"]);

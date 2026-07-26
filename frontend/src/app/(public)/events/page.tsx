"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { eventsApi, Event } from "@/lib/api/events";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { Calendar, Users, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";

// Fallback events if backend is not started/seeded yet
const fallbackEvents: Event[] = [
  { id: "1", title: "Logocon", slug: "logocon", description: "Zealicon flagship logic and coding contest.", type: "event", status: "completed", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 1, seatsTaken: 0 },
  { id: "2", title: "Code-in-Pair", slug: "code-in-pair", description: "Two-member team coding relay contest.", type: "event", status: "completed", isTeamEvent: true, teamSizeMin: 2, teamSizeMax: 2, seatsTaken: 0 },
  { id: "3", title: "Decode", slug: "decode", description: "Cryptic hunt and algorithmic decoding event.", type: "event", status: "completed", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 1, seatsTaken: 0 },
  { id: "4", title: "Valorant Gaming Tournament", slug: "valorant", description: "Zealicon e-sports Valorant tournament.", type: "event", status: "completed", isTeamEvent: true, teamSizeMin: 5, teamSizeMax: 5, seatsTaken: 0 },
  { id: "5", title: "Hack-o-Code", slug: "hack-o-code", description: "Annual Coding Contest.", type: "event", status: "completed", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 1, seatsTaken: 0 },
  { id: "6", title: "GitHub & Version Control", slug: "github-workshop", description: "Learn Git basics and open-source contribution.", type: "workshop", status: "completed", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 1, seatsTaken: 0 },
  { id: "7", title: "LinkedIn & Resume Building", slug: "resume-workshop", description: "Professional profile optimization session.", type: "workshop", status: "completed", isTeamEvent: false, teamSizeMin: 1, teamSizeMax: 1, seatsTaken: 0 },
];

import { useAuthStore } from "@/lib/store/auth.store";
import { apiClient } from "@/lib/api/client";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
    eventsApi.getPublishedEvents().then(data => {
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(fallbackEvents);
      }
    }).catch(() => {
      setEvents(fallbackEvents);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && events.length > 0) {
      const ongoing = events.filter(e => e.status !== "completed" && e.status !== "draft");
      Promise.all(
        ongoing.map(async (e) => {
          try {
            const res = await apiClient.get(`/events/${e.slug}/registration-status`);
            return { slug: e.slug, isRegistered: res.data.isRegistered };
          } catch (err) {
            return { slug: e.slug, isRegistered: false };
          }
        })
      ).then(results => {
        const statuses: Record<string, boolean> = {};
        results.forEach(r => statuses[r.slug] = r.isRegistered);
        setRegisteredEvents(statuses);
      });
    }
  }, [isAuthenticated, events]);

  if (!isHydrated) return null;

  const ongoingEvents = events.filter(e => e.status !== "completed" && e.status !== "draft");
  const completedEvents = events.filter(e => e.status === "completed");

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text-primary)]"
        >
          OUR EVENTS
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto"
        >
          Explore our flagship technical contests, workshops, and the grand Zealicon fests.
        </motion.p>
      </div>

      <AnimatePresence>
        {ongoingEvents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">Ongoing Now</h2>
              <div className="h-px bg-black/10 dark:bg-white/20 flex-1 rounded-full" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            </div>
            
            {/* Desktop Layout: Large Banners */}
            <div className="hidden md:flex flex-col gap-12">
              {ongoingEvents.map((evt) => (
                <Link href={`/events/${evt.slug}`} key={`desktop-${evt.id || evt.slug}`}>
                  <LiquidGlassCard className="h-[400px] flex overflow-hidden border-emerald-500/20 dark:border-emerald-500/30 group p-0" status="ongoing">
                    {/* Poster Half */}
                    <div className="w-1/2 relative bg-black/5 dark:bg-white/5 border-r border-black/5 dark:border-white/10">
                      <Image 
                        src={
                          evt.posterUrl || (
                            (evt.type || "").toLowerCase().includes("hackathon") ? "/event-hackathon.png" :
                            (evt.type || "").toLowerCase().includes("workshop") ? "/event-workshop.jpg" :
                            (evt.type || "").toLowerCase().includes("ideathon") ? "/event-ideathon.png" :
                            "/event-default.jpg"
                          )
                        }
                        alt={evt.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Content Half */}
                    <div className="w-1/2 p-12 flex flex-col justify-between bg-emerald-50 dark:bg-emerald-500/5">
                      <div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4">
                          <Calendar className="w-4 h-4" /> Registration Open
                        </div>
                        <h3 className="text-4xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{evt.title}</h3>
                        <p className="text-[var(--text-secondary)] text-lg leading-relaxed line-clamp-3">{evt.description}</p>
                      </div>
                      
                      <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider">
                          <Users className="w-4 h-4" />
                          {evt.isTeamEvent ? `Team Size: ${evt.teamSizeMin}-${evt.teamSizeMax}` : "Individual Event"}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold bg-black/5 dark:bg-white/10 px-6 py-3 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                          {registeredEvents[evt.slug] ? (
                            evt.isTeamEvent ? "Team Dashboard" : "View Details"
                          ) : "Register Now"} <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </Link>
              ))}
            </div>

            {/* Mobile Layout: Horizontal Slider with Posters */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 hide-scrollbar">
              {ongoingEvents.map((evt, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={`mobile-${evt.id || evt.slug}`} 
                  className="snap-center shrink-0 w-[85vw]"
                >
                  <Link href={`/events/${evt.slug}`}>
                    <LiquidGlassCard className="p-0 overflow-hidden h-[480px] flex flex-col border-emerald-500/30 bg-emerald-50 dark:bg-[#111] group" status="ongoing">
                      <div className="relative w-full h-[200px] bg-black/5 dark:bg-white/5 shrink-0 border-b border-black/5 dark:border-white/10">
                        <Image 
                          src={
                            evt.posterUrl || (
                              (evt.type || "").toLowerCase().includes("hackathon") ? "/event-hackathon.png" :
                              (evt.type || "").toLowerCase().includes("workshop") ? "/event-workshop.jpg" :
                              (evt.type || "").toLowerCase().includes("ideathon") ? "/event-ideathon.png" :
                              "/event-default.jpg"
                            )
                          }
                          alt={evt.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-widest uppercase mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Registration Open
                          </div>
                          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{evt.title}</h3>
                          <p className="text-[var(--text-secondary)] text-sm line-clamp-2">{evt.description}</p>
                        </div>
                        
                        <div className="mt-4 flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider">
                            <Users className="w-4 h-4" />
                            {evt.isTeamEvent ? `Team: ${evt.teamSizeMin}-${evt.teamSizeMax}` : "Individual"}
                          </div>
                          <div className="flex items-center gap-2 text-white font-black bg-emerald-600 px-4 py-3 rounded-xl justify-center shadow-lg shadow-emerald-500/20">
                            {registeredEvents[evt.slug] ? (
                              evt.isTeamEvent ? "Team Dashboard" : "View Details"
                            ) : "Register Now"} <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </LiquidGlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">Past Events Repository</h2>
        <div className="h-px bg-black/10 dark:bg-white/10 flex-1 rounded-full" />
      </div>

      {/* Mobile Layout: Spatial Sticky Cascading Deck */}
      <div className="flex sm:hidden flex-col pb-[60vh] relative mt-10 w-full max-w-[400px] mx-auto">
        <div className="text-center mb-6 text-sm font-black text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <div className="w-1 h-1 rounded-full bg-neutral-400 animate-pulse" />
          Scroll to Explore
          <div className="w-1 h-1 rounded-full bg-neutral-400 animate-pulse" />
        </div>
        {completedEvents.map((evt, idx) => (
          <div 
            key={`mobile-${evt.id || evt.slug}`}
            className="sticky w-full"
            style={{ 
              top: `calc(80px + ${idx * 20}px)`,
              zIndex: idx,
              marginBottom: '4rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full origin-top"
            >
              <Link href={`/events/${evt.slug}`}>
                <LiquidGlassCard className="p-4 group h-[480px] flex flex-col border border-black/10 dark:border-white/20 bg-[#f8f9fa] dark:bg-[#111] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-[2.5rem]" status="completed">
                  <div className="relative w-full h-[220px] rounded-[1.8rem] overflow-hidden mb-4 bg-black/5 dark:bg-white/5 shrink-0">
                    <Image 
                      src={
                        evt.posterUrl || (
                          (evt.type || "").toLowerCase().includes("hackathon") ? "/event-hackathon.png" :
                          (evt.type || "").toLowerCase().includes("workshop") ? "/event-workshop.jpg" :
                          (evt.type || "").toLowerCase().includes("ideathon") ? "/event-ideathon.png" :
                          "/event-default.jpg"
                        )
                      }
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="px-3 pb-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-black/5 dark:bg-white/10 text-[var(--text-primary)] border border-black/5 dark:border-white/10 shadow-sm">
                           {evt.type}
                         </span>
                      </div>
                      <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 leading-tight drop-shadow-sm">
                        {evt.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-black tracking-widest text-[var(--text-secondary)] uppercase mt-4 bg-black/5 dark:bg-white/5 px-4 py-3 rounded-xl justify-between border border-black/5 dark:border-white/10">
                      Explore Details <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </LiquidGlassCard>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Desktop Layout: Staggered 3-Column Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          completedEvents.filter((_, i) => i % 3 === 0),
          completedEvents.filter((_, i) => i % 3 === 1),
          completedEvents.filter((_, i) => i % 3 === 2),
        ].map((column, colIdx) => (
          <div key={colIdx} className={`flex flex-col gap-6 ${colIdx % 2 === 0 ? 'lg:pt-16' : ''}`}>
            {column.map((evt, idx) => (
              <motion.div
                key={`desktop-${evt.id || evt.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/events/${evt.slug}`}>
                  <LiquidGlassCard className="p-4 sm:p-5 group" status="completed">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-black/5 dark:bg-white/5">
                      <Image 
                        src={
                          evt.posterUrl || (
                            (evt.type || "").toLowerCase().includes("hackathon") ? "/event-hackathon.png" :
                            (evt.type || "").toLowerCase().includes("workshop") ? "/event-workshop.jpg" :
                            (evt.type || "").toLowerCase().includes("ideathon") ? "/event-ideathon.png" :
                            "/event-default.jpg"
                          )
                        }
                        alt={evt.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="px-2 pb-2">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-black/5 dark:bg-white/10 text-[var(--text-secondary)]">
                           {evt.type}
                         </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {evt.title}
                      </h3>
                      
                      <div className="flex items-center text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase group-hover:text-[var(--text-primary)] transition-colors mt-4">
                        View Details <ExternalLink className="w-3 h-3 ml-2" />
                      </div>
                    </div>
                  </LiquidGlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

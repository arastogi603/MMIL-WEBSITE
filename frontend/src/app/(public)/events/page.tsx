"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { eventsApi, Event } from "@/lib/api/events";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { Calendar, Users, ChevronRight, ChevronLeft, ExternalLink, Code, Lightbulb, Palette, Trophy } from "lucide-react";
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

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();

  if (s === "ongoing" || s === "live") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-[#eb4d6d] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#eb4d6d]">Live Now</span>
      </div>
    );
  }

  if (s === "upcoming" || s === "draft") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Upcoming</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 backdrop-blur-md">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Finished</span>
    </div>
  );
}

function EventFallbackImage({ type }: { type: string }) {
  const t = (type || "event").toLowerCase();
  let Icon = Trophy;
  let bg = "bg-blue-100 dark:bg-blue-900/30";
  let color = "text-blue-500 dark:text-blue-400";

  if (t.includes("hackathon") || t.includes("code")) {
    Icon = Code;
    bg = "bg-teal-100 dark:bg-teal-900/30";
    color = "text-teal-500 dark:text-teal-400";
  } else if (t.includes("workshop") || t.includes("session")) {
    Icon = Lightbulb;
    bg = "bg-amber-100 dark:bg-amber-900/30";
    color = "text-amber-500 dark:text-amber-400";
  } else if (t.includes("design") || t.includes("ui")) {
    Icon = Palette;
    bg = "bg-pink-100 dark:bg-pink-900/30";
    color = "text-pink-500 dark:text-pink-400";
  } else if (t.includes("meetup") || t.includes("community")) {
    Icon = Users;
    bg = "bg-purple-100 dark:bg-purple-900/30";
    color = "text-purple-500 dark:text-purple-400";
  }

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center ${bg} ${color}`}>
      <Icon className="w-20 h-20 opacity-40 mb-3" strokeWidth={1.5} />
      <span className="text-xs font-bold tracking-widest uppercase opacity-40">{type}</span>
    </div>
  );
}

function CoverflowCarousel({ events }: { events: Event[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!events || events.length === 0) return null;

  const activeEvent = events[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const getMotionProps = (index: number) => {
    const total = events.length;
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return {
        x: "0%",
        scale: 1,
        rotate: 0,
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
        isCenter: true,
      };
    } else if (diff === -1) {
      return {
        x: "-45%",
        scale: 0.89,
        rotate: -9,
        opacity: 0.75,
        zIndex: 10,
        pointerEvents: "auto" as const,
        isCenter: false,
      };
    } else if (diff === 1) {
      return {
        x: "45%",
        scale: 0.89,
        rotate: 9,
        opacity: 0.75,
        zIndex: 10,
        pointerEvents: "auto" as const,
        isCenter: false,
      };
    } else {
      return {
        x: diff < 0 ? "-120%" : "120%",
        scale: 0.65,
        rotate: diff < 0 ? -15 : 15,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
        isCenter: false,
      };
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Carousel Track Container - 560px Center Card Width & 80% Vertical Occupancy */}
      <div className="relative w-full max-w-6xl h-[460px] sm:h-[560px] md:h-[640px] lg:h-[660px] flex items-center justify-center overflow-hidden py-2 select-none">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -40) handleNext();
            else if (info.offset.x > 40) handlePrev();
          }}
        >
          {events.map((evt, idx) => {
            const props = getMotionProps(idx);

            return (
              <motion.div
                key={`coverflow-${evt.id || evt.slug}`}
                onClick={() => {
                  if (!props.isCenter) setActiveIndex(idx);
                }}
                animate={{
                  x: props.x,
                  scale: props.scale,
                  rotate: props.rotate,
                  opacity: props.opacity,
                }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  zIndex: props.zIndex,
                  pointerEvents: props.pointerEvents,
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="absolute w-[300px] sm:w-[440px] md:w-[540px] lg:w-[560px] h-[400px] sm:h-[500px] md:h-[580px] lg:h-[600px] rounded-2xl bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 overflow-hidden flex flex-col cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Poster Image / Fallback — Fixed Height for smooth layout stability */}
                <div className="relative w-full h-[76%] overflow-hidden shrink-0 border-b border-black/5 dark:border-white/10">
                  {evt.posterUrl ? (
                    <Image
                      src={evt.posterUrl}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 640px) 300px, (max-width: 768px) 440px, 560px"
                      className="object-cover"
                    />
                  ) : (
                    <EventFallbackImage type={evt.type || "Event"} />
                  )}
                </div>

                {/* Title & Info — Always rendered to eliminate layout shift jitter */}
                <div
                  className="p-4 sm:p-6 flex-1 flex flex-col justify-center bg-white dark:bg-[#18181b] transition-opacity duration-300"
                  style={{ opacity: props.isCenter ? 1 : 0 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-black/5 dark:bg-white/10 text-[var(--text-secondary)]">
                      {evt.type || "Event"}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-2xl text-[var(--text-primary)] leading-snug line-clamp-1">
                    {evt.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation Arrow Buttons - Inward Positioned */}
        <button
          onClick={handlePrev}
          aria-label="Previous event"
          className="absolute left-2 sm:left-10 md:left-16 lg:left-24 z-40 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-[#27272a]/90 text-[var(--text-primary)] border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#27272a] transition-all shadow-md active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next event"
          className="absolute right-2 sm:right-10 md:right-16 lg:right-24 z-40 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-[#27272a]/90 text-[var(--text-primary)] border border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#27272a] transition-all shadow-md active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center gap-2 mt-2 mb-1">
        {events.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex
                ? "w-8 bg-[#eb4d6d]"
                : "w-2.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState("All");
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

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.type || "Event"));
    return ["All", ...Array.from(cats)];
  }, [events]);

  const featuredEvents = useMemo(() => {
    return events.slice(0, 6);
  }, [events]);

  const filteredEvents = useMemo(() => {
    let sorted = [...events].sort((a, b) => {
      const wA = (a.status === "ongoing" || a.status === "live") ? 2 : (a.status === "upcoming" ? 1 : 0);
      const wB = (b.status === "ongoing" || b.status === "live") ? 2 : (b.status === "upcoming" ? 1 : 0);
      return wB - wA;
    });

    if (categoryFilter === "All") return sorted;
    return sorted.filter(e => e.type === categoryFilter);
  }, [events, categoryFilter]);

  if (!isHydrated) return null;

  const ongoingEvents = events.filter(e => e.status !== "completed" && e.status !== "draft");

  return (
    <main className="pt-28 md:pt-32 pb-4 px-6 max-w-7xl mx-auto w-full font-['Outfit'] bg-transparent relative z-10">

      {/* Hero Header Section */}
      <div className="mb-6 md:mb-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#eb4d6d] mb-3"
        >
          MMIL EVENTS
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-[var(--text-primary)] uppercase flex flex-wrap items-center justify-center gap-x-3.5"
        >
          <span>OUR</span>{" "}
          <span className="relative inline-block text-[#eb4d6d]">
            EVENTS
            <span className="absolute -bottom-2 left-0 w-[60px] h-[3px] bg-[#eb4d6d] rounded-full" />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Explore our flagship technical contests, workshops, and the grand Zealicon fests.
        </motion.p>
      </div>

      {/* Featured Coverflow Carousel Section */}
      <section className="mb-4 relative z-10">
        <CoverflowCarousel events={featuredEvents} />
      </section>

      <AnimatePresence>
        {ongoingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-16 relative z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">Ongoing Now</h2>
              <div className="h-px bg-black/10 dark:bg-white/20 flex-1 rounded-full" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            </div>

            {/* Desktop Layout: Large Banners */}
            <div className="hidden md:flex flex-col gap-12">
              {ongoingEvents.map((evt) => (
                <Link href={`/events/${evt.slug}`} key={`desktop-ongoing-${evt.id || evt.slug}`}>
                  <LiquidGlassCard className="h-[400px] flex overflow-hidden border-emerald-500/20 dark:border-emerald-500/30 group p-0" status="ongoing">
                    {/* Poster Half */}
                    <div className="w-1/2 relative bg-black/5 dark:bg-white/5 border-r border-black/5 dark:border-white/10">
                      {evt.posterUrl ? (
                        <Image src={evt.posterUrl} alt={evt.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full transition-transform duration-700 group-hover:scale-105"><EventFallbackImage type={evt.type || "Event"} /></div>
                      )}
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
                            evt.isTeamEvent ? "Team Dashboard" : "Registered"
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
                  key={`mobile-ongoing-${evt.id || evt.slug}`}
                  className="snap-center shrink-0 w-[85vw]"
                >
                  <Link href={`/events/${evt.slug}`}>
                    <LiquidGlassCard className="p-0 overflow-hidden h-[480px] flex flex-col border-emerald-500/30 bg-emerald-50 dark:bg-[#111] group" status="ongoing">
                      <div className="relative w-full h-[200px] bg-black/5 dark:bg-white/5 shrink-0 border-b border-black/5 dark:border-white/10">
                        {evt.posterUrl ? (
                          <Image src={evt.posterUrl} alt={evt.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full transition-transform duration-700 group-hover:scale-105"><EventFallbackImage type={evt.type || "Event"} /></div>
                        )}
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
                              evt.isTeamEvent ? "Team Dashboard" : "Registered"
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
    </main>
  );
}

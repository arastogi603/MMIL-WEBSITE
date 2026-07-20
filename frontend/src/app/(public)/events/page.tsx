"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { eventsApi } from "@/lib/api/events";

// Maps event type to its specific cover photo
function getEventImage(type?: string): string {
  const t = (type || "").toLowerCase();
  if (t.includes("hackathon")) return "/event-hackathon.png";
  if (t.includes("workshop")) return "/event-workshop.jpg";
  if (t.includes("ideathon")) return "/event-ideathon.png";
  return "/event-default.jpg";
}

// Helper for 3D Tilt Card
function TiltCard({ event, index }: { event: any; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.15; // sensitivity
    const y = (clientY - top - height / 2) * -0.15;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: mouseY,
        rotateY: mouseX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full"
    >
      <div className="absolute inset-0 bg-black/[0.02] rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full bg-white/60 p-8 rounded-[2rem] border border-black/5 hover:border-black/10 transition-colors flex flex-col justify-between overflow-hidden group backdrop-blur-md shadow-sm">
        
        {/* Glow effect that follows mouse */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                400px circle at ${useMotionValue(100)}px ${useMotionValue(100)}px,
                rgba(255,255,255,0.1),
                transparent 80%
              )
            `,
          }}
        />

        <div>
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-black/5 text-neutral-600 border border-black/10">
              {event.type}
            </span>
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-semibold tracking-wider uppercase">
              <Users className="w-3.5 h-3.5" />
              <span>{event.capacity - event.seatsTaken} left</span>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-[#111] mb-4 tracking-tight group-hover:text-[#eb4d6d] transition-colors" style={{ transform: "translateZ(30px)" }}>
            {event.title}
          </h3>
          
          <p className="text-neutral-600 text-sm leading-relaxed font-light line-clamp-3 mb-8" style={{ transform: "translateZ(20px)" }}>
            {event.description}
          </p>
        </div>

        <div className="space-y-3 pt-6 border-t border-black/5" style={{ transform: "translateZ(10px)" }}>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Calendar className="w-4 h-4 text-[#eb4d6d]" />
            <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Clock className="w-4 h-4 text-[#eb4d6d]" />
            <span>{new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <Link 
            href={`/events/${event.slug}`} 
            className="mt-6 flex items-center justify-between w-full px-6 py-3 bg-black/5 hover:bg-black/10 border border-black/10 rounded-xl transition-all text-sm font-bold text-[#111] group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await eventsApi.getPublishedEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
        // Fallback mock data for design preview
        setEvents([
          {
            id: 1, slug: 'ai-hack-2026', title: 'Generative AI Hackathon', type: 'Hackathon',
            description: 'Build the future of AI. Join 500+ hackers in our largest flagship generative AI hackathon yet.',
            startDate: new Date().toISOString(), capacity: 500, seatsTaken: 420
          },
          {
            id: 2, slug: 'web3-masterclass', title: 'Web3 & Smart Contracts', type: 'Workshop',
            description: 'Learn Solidity from the ground up. Write, test, and deploy your first smart contract on Ethereum.',
            startDate: new Date(Date.now() + 86400000).toISOString(), capacity: 100, seatsTaken: 89
          },
          {
            id: 3, slug: 'cloud-summit', title: 'AWS Cloud Summit', type: 'Event',
            description: 'A full day of technical deep dives into AWS infrastructure, serverless architectures, and Kubernetes.',
            startDate: new Date(Date.now() + 86400000 * 5).toISOString(), capacity: 200, seatsTaken: 15
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <main className="min-h-screen text-[#111] bg-[#faf7f3] pt-40 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-black tracking-tighter leading-none mb-4 text-[#111]"
          >
            OUR EVENTS
          </motion.h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] max-w-6xl mx-auto">
            {/* Left Large Bento Box */}
            {events[0] && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="col-span-1 md:col-span-2 row-span-2 relative rounded-[3rem] bg-neutral-100 overflow-hidden group border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all cursor-pointer"
              >
                <Link href={`/events/${events[0].slug}`} className="absolute inset-0 z-20" />
                <img src={getEventImage(events[0].type)} alt={events[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <span className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-neutral-800 w-max mb-4 shadow-sm border border-white">
                    Featured Event
                  </span>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-3">
                    {events[0].title}
                  </h3>
                  <p className="text-white/70 font-medium max-w-md line-clamp-2">
                    {events[0].description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Middle Column (Two stacked bento boxes) */}
            <div className="col-span-1 row-span-2 flex flex-col gap-4">
              {events[1] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 relative rounded-[3rem] bg-neutral-100 overflow-hidden group border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center p-8 text-center hover:shadow-xl transition-all cursor-pointer"
                >
                  <Link href={`/events/${events[1].slug}`} className="absolute inset-0 z-20" />
                  <img src={getEventImage(events[1].type)} alt={events[1].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight relative z-10">{events[1].title}</h3>
                </motion.div>
              )}
              {events[2] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 relative rounded-[3rem] bg-[#111] overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center p-8 text-center hover:shadow-xl transition-all cursor-pointer"
                >
                  <Link href={`/events/${events[2].slug}`} className="absolute inset-0 z-20" />
                  <img src={getEventImage(events[2].type)} alt={events[2].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight relative z-10">{events[2].title}</h3>
                </motion.div>
              )}
            </div>

            {/* Right Large Bento Box */}
            {events[3] ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-1 row-span-2 relative rounded-[3rem] bg-neutral-100 overflow-hidden group border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer"
              >
                <Link href={`/events/${events[3].slug}`} className="absolute inset-0 z-20" />
                <img src={getEventImage(events[3].type)} alt={events[3].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-white relative z-10">
                  <span className="text-xl">✨</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{events[3].title}</h3>
                  <p className="text-white/70 font-medium line-clamp-3">
                    {events[3].description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="col-span-1 row-span-2 relative rounded-[3rem] bg-neutral-100 overflow-hidden group border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-neutral-100 mb-6">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-black text-neutral-400 uppercase tracking-tight">More Events Soon</h3>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

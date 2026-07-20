"use client";

import { motion } from "framer-motion";
import { GitBranch, Briefcase, Mail } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";

const teamMembers = [
  {
    name: "Alex Rivera",
    role: "President",
    domain: "Leadership",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "Technical Lead",
    domain: "Web Development",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "David Kim",
    role: "AI Lead",
    domain: "Artificial Intelligence",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    name: "Elena Martinez",
    role: "Design Lead",
    domain: "UI/UX",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
  {
    name: "James Wilson",
    role: "Events Head",
    domain: "Operations",
    avatar: "https://i.pravatar.cc/150?u=james",
  },
  {
    name: "Maya Patel",
    role: "PR & Outreach",
    domain: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=maya",
  }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen text-[#111] bg-[#faf7f3] pt-40 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[6rem] md:text-[8rem] font-black tracking-tighter leading-none mb-6 text-[#111]"
          >
            OUR TEAM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-xl md:text-2xl text-neutral-800 leading-relaxed font-medium"
          >
            Meet the Passionate minds behind MMIL—a group of students dedicated to creating opportunities, organizing impactful events, and building a community where innovation thrives.
          </motion.p>
        </div>

        {["Programming", "Design", "Web Development", "Technical"].map((domainGroup) => (
          <div key={domainGroup} className="mb-16">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-black/20 flex-grow" />
              <span className="px-6 text-xl font-medium tracking-[0.1em] text-[#111] uppercase">{domainGroup}</span>
              <div className="h-px bg-black/20 flex-grow" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* For mock purposes, just show a few members per section */}
              {teamMembers.slice(0, 4).map((member, i) => (
                <FadeIn key={i + member.name} delay={i * 0.1}>
                  <div className="rounded-[2.5rem] bg-[#faf7f3] p-8 flex flex-col items-center justify-center border border-white/50 transition-all duration-300 shadow-[12px_12px_24px_#e3ded8,-12px_-12px_24px_#ffffff] hover:shadow-[inset_6px_6px_12px_#e3ded8,inset_-6px_-6px_12px_#ffffff] group cursor-pointer">
                    
                    {/* Inner Claymorphic Avatar Container */}
                    <div className="w-24 h-24 rounded-full bg-[#faf7f3] mb-6 overflow-hidden p-2 shadow-[inset_6px_6px_12px_#e3ded8,inset_-6px_-6px_12px_#ffffff] group-hover:shadow-[6px_6px_12px_#e3ded8,-6px_-6px_12px_#ffffff] transition-shadow duration-300">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#111] mb-1 group-hover:text-[#eb4d6d] transition-colors">{member.name}</h3>
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{member.role}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

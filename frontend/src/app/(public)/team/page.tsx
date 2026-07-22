"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";

// ----------------------------------------------------
// MOCK DATA
// ----------------------------------------------------
const executiveBoard = [
  { name: "John Doe", role: "President", avatar: "https://i.pravatar.cc/300?u=president", linkedin: "#" },
  { name: "Jane Smith", role: "Vice President", avatar: "https://i.pravatar.cc/300?u=vp", linkedin: "#" },
  { name: "Mike Johnson", role: "CTC", avatar: "https://i.pravatar.cc/300?u=ctc", linkedin: "#" },
  { name: "Sarah Williams", role: "Co-CTC", avatar: "https://i.pravatar.cc/300?u=co-ctc", linkedin: "#" },
  { name: "David Brown", role: "Management Head", avatar: "https://i.pravatar.cc/300?u=management", linkedin: "#" },
  { name: "Emily Davis", role: "General Secretary", avatar: "https://i.pravatar.cc/300?u=gen-sec", linkedin: "#" },
];

type DomainData = {
  id: string;
  label: string;
  lead: { name: string; role: string; avatar: string; linkedin: string };
  students: { name: string; role: string; avatar: string; linkedin: string }[];
};

// Generate 10 placeholder students for a domain
const generateStudents = (domainId: string, roleName: string) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    name: `Student ${i + 1}`,
    role: roleName,
    avatar: `https://i.pravatar.cc/150?u=${domainId}-student-${i}`,
    linkedin: "#",
  }));
};

const domains: DomainData[] = [
  {
    id: "programming",
    label: "Programming",
    lead: { name: "Alice Cooper", role: "Programming Lead", avatar: "https://i.pravatar.cc/300?u=programming-lead", linkedin: "#" },
    students: generateStudents("programming", "Programmer"),
  },
  {
    id: "web-dev",
    label: "Web Development",
    lead: { name: "Bob Martin", role: "Web Dev Lead", avatar: "https://i.pravatar.cc/300?u=web-lead", linkedin: "#" },
    students: generateStudents("web", "Web Developer"),
  },
  {
    id: "technical",
    label: "Technical",
    lead: { name: "Charlie Day", role: "Technical Lead", avatar: "https://i.pravatar.cc/300?u=tech-lead", linkedin: "#" },
    students: generateStudents("tech", "Technical Member"),
  },
  {
    id: "design",
    label: "Design",
    lead: { name: "Diana Prince", role: "Design Lead", avatar: "https://i.pravatar.cc/300?u=design-lead", linkedin: "#" },
    students: generateStudents("design", "Designer"),
  },
];

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------
const BigMemberCard = ({ member }: { member: any }) => (
  <div className="relative group overflow-hidden rounded-[2.5rem] bg-[var(--background)] border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-300">
    <div className="aspect-[4/5] relative bg-black/5 dark:bg-white/5">
      <Image src={member.avatar} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* LinkedIn Button */}
      <a 
        href={member.linkedin} 
        target="_blank" 
        rel="noreferrer" 
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-600 hover:text-white transition-all shadow-sm"
      >
        <LinkIcon size={20} />
      </a>

      {/* Info */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <h3 className="text-2xl font-black mb-1">{member.name}</h3>
        <p className="text-sm font-semibold tracking-wide uppercase text-white/80">{member.role}</p>
      </div>
    </div>
  </div>
);

const SmallMemberCard = ({ member }: { member: any }) => (
  <div className="flex flex-col items-center group">
    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[var(--border)] mb-4 bg-black/5 dark:bg-white/5 shadow-sm group-hover:border-blue-500 transition-colors duration-300">
      <Image src={member.avatar} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <a 
          href={member.linkedin} 
          target="_blank" 
          rel="noreferrer" 
          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
        >
          <LinkIcon size={20} />
        </a>
      </div>
    </div>
    <h3 className="text-lg font-bold text-[var(--text-primary)] text-center group-hover:text-blue-500 transition-colors">{member.name}</h3>
    <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider text-center">{member.role}</p>
  </div>
);

// ----------------------------------------------------
// PAGE
// ----------------------------------------------------
export default function TeamPage() {
  const [activeDomain, setActiveDomain] = useState(domains[0].id);

  const activeDomainData = domains.find(d => d.id === activeDomain);

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-[var(--background)] pt-40 pb-24 relative overflow-hidden font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[4rem] md:text-[6rem] font-black tracking-tighter leading-none mb-6"
          >
            OUR TEAM
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-medium"
          >
            Meet the passionate minds behind MMIL—a group of students dedicated to creating opportunities, organizing impactful events, and building a community where innovation thrives.
          </motion.p>
        </div>

        {/* Executive Board */}
        <section className="mb-32">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-[var(--border)] flex-grow" />
            <span className="px-6 text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">Executive Board</span>
            <div className="h-px bg-[var(--border)] flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveBoard.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <BigMemberCard member={member} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Domain Selector */}
        <section>
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-[var(--border)] flex-grow hidden md:block" />
            <span className="px-6 text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">Domains</span>
            <div className="h-px bg-[var(--border)] flex-grow hidden md:block" />
          </div>

          <div className="flex overflow-x-auto pb-4 mb-12 snap-x hide-scrollbar justify-start md:justify-center items-center gap-4 border-b border-[var(--border)]">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                className={`relative px-8 py-4 whitespace-nowrap text-lg font-bold rounded-full transition-all flex-shrink-0 snap-center ${
                  activeDomain === domain.id
                    ? "text-white bg-[#111] dark:bg-white dark:text-black shadow-lg"
                    : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-primary)]"
                }`}
              >
                {domain.label}
              </button>
            ))}
          </div>

          {/* Active Domain Content */}
          <AnimatePresence mode="wait">
            {activeDomainData && (
              <motion.div
                key={activeDomainData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                  
                  {/* Lead Section */}
                  <div className="w-full lg:w-1/3 flex-shrink-0">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-6 text-center lg:text-left">Domain Lead</h3>
                    <BigMemberCard member={activeDomainData.lead} />
                  </div>

                  {/* Students Section */}
                  <div className="w-full lg:w-2/3">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-6 text-center lg:text-left">Members</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
                      {activeDomainData.students.map((student, idx) => (
                        <FadeIn key={student.name + idx} delay={idx * 0.05}>
                          <SmallMemberCard member={student} />
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </section>
      </div>
    </main>
  );
}

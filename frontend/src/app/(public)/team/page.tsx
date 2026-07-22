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
  { name: "Kuldeep Pandit", role: "President", avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHa7qL5i8RgmA/profile-displayphoto-shrink_800_800/B4DZT7vmRvGcAc-/0/1739390346803?e=1786579200&v=beta&t=rcPlW5QrZFVDXcpLm7Iee3m3xi7Qfg5RxLPaGicfgMc", linkedin: "https://www.linkedin.com/in/kuldeepk-pandit/" },
  { name: "Vaishnavi Bhati", role: "Vice President", avatar: "https://media.licdn.com/dms/image/v2/D5603AQF1SKuMrt1lQg/profile-displayphoto-crop_800_800/B56Z8s1cA6H4AI-/0/1783163634727?e=1786579200&v=beta&t=9X6c-4dQFZS3Jco5Mq4KWGyZ527MMgRB-DemLD3SUss", linkedin: "https://www.linkedin.com/in/vaishnavi-bhati-15vb2004/" },
  { name: "Ayan Khan", role: "CTC", avatar: "https://media.licdn.com/dms/image/v2/D5603AQEQIdKNKZmL0w/profile-displayphoto-crop_800_800/B56ZsNy8hqJEAM-/0/1765463019838?e=1786579200&v=beta&t=YkAg5vd9_kSQh8sqo3386pBGyrc6BH-kQPcVrBEF5Z0", linkedin: "https://www.linkedin.com/in/ayankhan28/" },
  { name: "Parth Chaturvedi", role: "Co-CTC", avatar: "https://media.licdn.com/dms/image/v2/D5635AQH3VxIR1jBbxQ/profile-framedphoto-shrink_800_800/B56Zy3.rUJIcAk-/0/1772613187180?e=1785312000&v=beta&t=hi-JuAlYQBa9SGVG6UllE3RQ2f-GrLVN1NS14C2pi08", linkedin: "https://www.linkedin.com/in/parth-chaturvedi-dev/" },
  { name: "Anurag Maurya", role: "Management Head", avatar: "https://media.licdn.com/dms/image/v2/D5635AQF4ZENwk1HXeA/profile-framedphoto-shrink_800_800/B56Z1zrfCqJgAk-/0/1775762272717?e=1785312000&v=beta&t=I5A3S9RhH-oBZjbPJNWFHgYAlm28oBZ3pd0ijRqNjHk", linkedin: "https://www.linkedin.com/in/anuragg28/" },
  { name: "Sanya Pandey", role: "General Secretary", avatar: "https://media.licdn.com/dms/image/v2/D5635AQF73kSRx_Goaw/profile-framedphoto-shrink_800_800/B56Z7VJeM2IgAY-/0/1781692492487?e=1785312000&v=beta&t=hfnRJbe0WIahTLbN3PFS7E2HS-43QUhgtH7lItDHyjs", linkedin: "https://www.linkedin.com/in/sanya-pandey08/" },
];

type DomainData = {
  id: string;
  label: string;
  lead: { name: string; role: string; avatar: string; linkedin: string };
  students: { name: string; role: string; avatar: string; linkedin: string }[];
};



const domains: DomainData[] = [
  {
    id: "programming",
    label: "Programming",
    lead: { name: "Tanmay Kalra", role: "Programming Lead", avatar: "https://media.licdn.com/dms/image/v2/D5635AQESFxT8g3npeA/profile-framedphoto-shrink_800_800/B56ZdA80ANGsAk-/0/1749141373315?e=1785312000&v=beta&t=GcnpzhqtpQLNeZEFSblfZh4DJNLvkmPsaycoYMw68FU", linkedin: "https://www.linkedin.com/in/tanmay-kalra-09oct/" },
    students: [
      { name: "Placeholder Name", role: "Programmer", avatar: "https://i.pravatar.cc/150?u=programming-student", linkedin: "#" }
    ],
  },
  {
    id: "web-dev",
    label: "Web Development",
    lead: { name: "Disha Agrawal", role: "Web Dev Lead", avatar: "https://media.licdn.com/dms/image/v2/D5635AQEkSyHkUmXTSw/profile-framedphoto-shrink_800_800/B56Z0VRC_bJwAg-/0/1774178283808?e=1785312000&v=beta&t=pI0HI6feLSv6M8OPfv4usOXa31jef0C2wt1qIZzO-eg", linkedin: "https://www.linkedin.com/in/disha-agrawal-0438062a5/" },
    students: [
      { name: "Placeholder Name", role: "Web Developer", avatar: "https://i.pravatar.cc/150?u=web-student", linkedin: "#" }
    ],
  },
  {
    id: "technical",
    label: "Technical",
    lead: { name: "Vaishnav Gupta", role: "Technical Lead", avatar: "https://media.licdn.com/dms/image/v2/D5635AQHfu0yPDmJkHw/profile-framedphoto-shrink_800_800/B56Z4kv4peHEAg-/0/1778732993418?e=1785312000&v=beta&t=fibyE81Q5lfLA3xttPyyCXqzLipX02VbkeO1ZX2MinA", linkedin: "https://www.linkedin.com/in/vaishnavgupta/" },
    students: [
      { name: "Placeholder Name", role: "Technical Member", avatar: "https://i.pravatar.cc/150?u=tech-student", linkedin: "#" }
    ],
  },
  {
    id: "design",
    label: "Design",
    lead: { name: "Aarsh Upadhyay", role: "Design Lead", avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFc7G8FNXP2Cw/profile-displayphoto-shrink_800_800/B4DZXWd3q2HwAc-/0/1743059910043?e=1786579200&v=beta&t=gngRgGef8mSj5cJYciKYSDny_u6J4jhxFIsfMCTwavs", linkedin: "https://www.linkedin.com/in/aarsh-upadhyay-66010a359/" },
    students: [
      { name: "Placeholder Name", role: "Designer", avatar: "https://i.pravatar.cc/150?u=design-student", linkedin: "#" }
    ],
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
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-40 pb-24 relative overflow-hidden font-['Outfit']">
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
                className={`relative px-8 py-4 whitespace-nowrap text-lg font-bold rounded-full transition-all flex-shrink-0 snap-center ${activeDomain === domain.id
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

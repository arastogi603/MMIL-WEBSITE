"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";

interface AlumniMember {
  id: string;
  name: string;
  batchYear: number;
  linkedInUrl: string;
  linkedInUsername: string;
  avatarUrl: string;
  company: string;
}

const ALUMNI_DATA: AlumniMember[] = [
  {
    id: "1",
    name: "Harsh Jajaniya",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/harsh-jajaniya-293bb0247/",
    linkedInUsername: "harsh-jajaniya-293bb0247",
    avatarUrl: "/images/alumni/harsh-jajaniya.jpg",
    company: "AARFID Holdings LLC",
  },
  {
    id: "2",
    name: "Ashita Maheshwari",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/ashita-maheshwari/",
    linkedInUsername: "ashita-maheshwari",
    avatarUrl: "/images/alumni/ashita-maheshwari.jpg",
    company: "Haltdos",
  },
  {
    id: "3",
    name: "Anusha Agarwal",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/anusha-agarwal-068b70271/",
    linkedInUsername: "anusha-agarwal-068b70271",
    avatarUrl: "/images/alumni/anusha-agarwal.jpg",
    company: "Blinkit",
  },
  {
    id: "4",
    name: "Parth Gupta",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/parth-gupta-3793ba273/",
    linkedInUsername: "parth-gupta-3793ba273",
    avatarUrl: "/images/alumni/parth-gupta.jpg",
    company: "Modgenics Technology Solutions",
  },
  {
    id: "5",
    name: "Muskan Jaiswal",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/muskan-jais/",
    linkedInUsername: "muskan-jais",
    avatarUrl: "/images/alumni/muskan-jaiswal.jpg",
    company: "Newgen",
  },
  {
    id: "6",
    name: "Garima Singh",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/garimasingh10u/",
    linkedInUsername: "garimasingh10u",
    avatarUrl: "/images/alumni/garima-singh.jpg",
    company: "TCS",
  },
  {
    id: "7",
    name: "Anushka Dubey",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/anushka-dubey-17ba77275/",
    linkedInUsername: "anushka-dubey-17ba77275",
    avatarUrl: "/images/alumni/anushka-dubey.jpg",
    company: "Premier Energies",
  },
  {
    id: "8",
    name: "Abhinav Yadav",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/abhinav-yadav-70088a252/",
    linkedInUsername: "abhinav-yadav-70088a252",
    avatarUrl: "/images/alumni/abhinav-yadav.jpg",
    company: "Attero",
  },
  {
    id: "31",
    name: "Utkarsh Sharma",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/utkarshdev2411/",
    linkedInUsername: "utkarshdev2411",
    avatarUrl: "/images/alumni/utkarsh-sharma.jpg",
    company: "Binmile",
  },
  {
    id: "30",
    name: "Rounak Ali",
    batchYear: 2026,
    linkedInUrl: "https://www.linkedin.com/in/rounak-ali-a58362260/",
    linkedInUsername: "rounak-ali-a58362260",
    avatarUrl: "/images/alumni/raunak.png",
    company: "Masters at DRDO",
  },
  {
    id: "9",
    name: "Manas Rai",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/manas-rai2003/",
    linkedInUsername: "manas-rai2003",
    avatarUrl: "/images/alumni/manas-rai.jpg",
    company: "Astrotalk",
  },
  {
    id: "10",
    name: "Ayush Pandey",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/ayush-pandey01/",
    linkedInUsername: "ayush-pandey01",
    avatarUrl: "/images/alumni/ayush-pandey.jpg",
    company: "Amazon",
  },
  {
    id: "11",
    name: "Sakshi Tiwari",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/sakshi-tiwari-7a952b1b7/",
    linkedInUsername: "sakshi-tiwari-7a952b1b7",
    avatarUrl: "/images/alumni/sakshi-tiwari.jpg",
    company: "Oracle",
  },
  {
    id: "12",
    name: "Suyash Rastogi",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/suyash-rastogi/",
    linkedInUsername: "suyash-rastogi",
    avatarUrl: "/images/alumni/suyash-rastogi.jpg",
    company: "Clinikally (YC S22)",
  },
  {
    id: "13",
    name: "Anuj Agarwal",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/anujagarwal900/",
    linkedInUsername: "anujagarwal900",
    avatarUrl: "/images/alumni/anuj-agarwal.jpg",
    company: "Pelocal Fintech Private Limited",
  },

  {
    id: "15",
    name: "Pushkar Singh",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/pushkar-singh-a052a1205/",
    linkedInUsername: "pushkar-singh-a052a1205",
    avatarUrl: "/images/alumni/pushkar-singh.jpg",
    company: "Newgen Software",
  },
  {
    id: "16",
    name: "Arnika Sharma",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/arnika-sharma-53496320b/",
    linkedInUsername: "arnika-sharma-53496320b",
    avatarUrl: "/images/alumni/arnika-sharma.jpg",
    company: "Emerson",
  },
  {
    id: "17",
    name: "Ashwin Raj Vats",
    batchYear: 2024,
    linkedInUrl: "https://www.linkedin.com/in/ashwin-raj-vats-5911a41b7/",
    linkedInUsername: "ashwin-raj-vats-5911a41b7",
    avatarUrl: "/images/alumni/ashwin-raj-vats.jpg",
    company: "Self Employed Graphic Designer",
  },
  {
    id: "18",
    name: "Nipun Khatri",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/nipun-khatri-80b168224/",
    linkedInUsername: "nipun-khatri-80b168224",
    avatarUrl: "/images/alumni/nipun-khatri.jpg",
    company: "Vesper",
  },
  {
    id: "26",
    name: "Bhoomi Agrawal",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/bhoomi-agarwal-393846239/",
    linkedInUsername: "bhoomi-agarwal-393846239",
    avatarUrl: "/images/alumni/bhoomi-agrawal.jpg",
    company: "Infineon Technologies",
  },
  {
    id: "27",
    name: "Yash Shekhar",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/yash-shekhar-srivastava-b0559922a/",
    linkedInUsername: "yash-shekhar-srivastava-b0559922a",
    avatarUrl: "/images/alumni/yash-shekhar.jpg",
    company: "HCL Tech",
  },
  {
    id: "28",
    name: "Vibhuti Kapoor",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/vibhutikapoor/",
    linkedInUsername: "vibhutikapoor",
    avatarUrl: "/images/alumni/vibhuti-kapoor.jpg",
    company: "RedDoorz",
  },
  {
    id: "29",
    name: "Dhanraj Singh",
    batchYear: 2025,
    linkedInUrl: "https://www.linkedin.com/in/sdhanraj300/",
    linkedInUsername: "sdhanraj300",
    avatarUrl: "/images/alumni/dhanraj-singh.jpg",
    company: "Pursuing MTech at Kiel University",
  },
  {
    id: "19",
    name: "Parth Sharma",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/parthsharmat/",
    linkedInUsername: "parthsharmat",
    avatarUrl: "/images/alumni/parth-sharma.jpg",
    company: "BUSINESSNEXT",
  },
  {
    id: "20",
    name: "Gautam Kushal",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/gautamkushal/",
    linkedInUsername: "gautamkushal",
    avatarUrl: "/images/alumni/gautam-kushal.jpg",
    company: "AU Small Finance Bank",
  },
  {
    id: "21",
    name: "Neeraj Maurya",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/mauryaneeraj11/",
    linkedInUsername: "mauryaneeraj11",
    avatarUrl: "/images/alumni/neeraj-maurya.jpg",
    company: "Josh Technology Group",
  },
  {
    id: "22",
    name: "Anmol Puri",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/anmol-puri-401b441a4/",
    linkedInUsername: "anmol-puri-401b441a4",
    avatarUrl: "/images/alumni/anmol-puri.jpg",
    company: "Newgen Software",
  },
  {
    id: "23",
    name: "Rudrakshi Soni",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/rudrakshi-soni/",
    linkedInUsername: "rudrakshi-soni",
    avatarUrl: "/images/alumni/rudrakshi-soni.jpg",
    company: "Amazon",
  },
  {
    id: "24",
    name: "Diksha Shukla",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/diksha-shukla-98aa1a196/",
    linkedInUsername: "diksha-shukla-98aa1a196",
    avatarUrl: "/images/alumni/diksha-shukla.jpg",
    company: "Headset",
  },
  {
    id: "25",
    name: "Samyak Singh",
    batchYear: 2023,
    linkedInUrl: "https://www.linkedin.com/in/samyak-singh-007abc/",
    linkedInUsername: "samyak-singh-007abc",
    avatarUrl: "/images/alumni/samyak-singh.jpg",
    company: "Playo",
  },
];

function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PosterImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-800 text-white select-none">
        <span className="text-4xl font-black tracking-wider text-zinc-300">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover object-top transition-transform duration-200 ease-out group-hover:scale-[1.03]"
      onError={() => setHasError(true)}
    />
  );
}

function AlumniCard({ member, index }: { member: AlumniMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative group rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] h-[370px] sm:h-[420px] md:h-[460px] lg:h-[480px] cursor-pointer bg-black/5 dark:bg-white/5"
    >
      <PosterImage src={member.avatarUrl} alt={member.name} name={member.name} />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      <a
        href={member.linkedInUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${member.name}'s LinkedIn profile`}
        className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 shadow-md z-10"
      >
        <LinkIcon className="w-4 h-4" />
      </a>

      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 text-white z-10 pointer-events-none">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-0.5">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/80">
          {member.company.toLowerCase().startsWith("pursuing") ||
            member.company.toLowerCase().startsWith("studying") ||
            member.company.toLowerCase().startsWith("self") ||
            member.company.toLowerCase().startsWith("masters") ? (
            <span className="text-white font-bold">{member.company}</span>
          ) : (
            <>
              Working at <span className="text-white font-bold">{member.company}</span>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default function AlumniPage() {
  const batchYears = Array.from(
    new Set(ALUMNI_DATA.map((a) => a.batchYear))
  ).sort((a, b) => b - a);

  const [activeYear, setActiveYear] = useState<number>(batchYears[0]);
  const filteredAlumni = ALUMNI_DATA.filter((a) => a.batchYear === activeYear);

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 md:pt-40 pb-24 relative font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none mb-6 text-[var(--text-primary)]"
          >
            OUR ALUMNI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-medium"
          >
            Meet the brilliant minds who helped shape MMIL. Connect with them on
            LinkedIn and follow their journey.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-14"
        >
          <div className="flex gap-3 p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-[var(--card-border)]">
            {batchYears.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeYear === year
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105"
                  : "hover:bg-white/10 text-[var(--text-secondary)]"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
          <span className="px-6 text-xl sm:text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">
            Batch of {activeYear}
          </span>
          <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {filteredAlumni.map((member, idx) => (
              <AlumniCard key={member.id} member={member} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  );
}

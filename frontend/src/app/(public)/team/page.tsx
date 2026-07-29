"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";

// ----------------------------------------------------
// TYPES & DATA
// ----------------------------------------------------
type Member = {
  name: string;
  role: string;
  avatar: string;
  linkedin: string;
  isPresident?: boolean;
};

type DomainData = {
  id: string;
  label: string;
  accentColor: string;
  badgeText: string;
  lead: Member;
  students: Member[];
};

const executiveBoard: Member[] = [
  {
    name: "Kuldeep Pandit",
    role: "President",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQHa7qL5i8RgmA/profile-displayphoto-shrink_800_800/B4DZT7vmRvGcAc-/0/1739390346803?e=1786579200&v=beta&t=rcPlW5QrZFVDXcpLm7Iee3m3xi7Qfg5RxLPaGicfgMc",
    linkedin: "https://www.linkedin.com/in/kuldeepk-pandit/",
    isPresident: true,
  },
  {
    name: "Vaishnavi Bhati",
    role: "Vice President",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5603AQF1SKuMrt1lQg/profile-displayphoto-crop_800_800/B56Z8s1cA6H4AI-/0/1783163634727?e=1786579200&v=beta&t=9X6c-4dQFZS3Jco5Mq4KWGyZ527MMgRB-DemLD3SUss",
    linkedin: "https://www.linkedin.com/in/vaishnavi-bhati-15vb2004/",
  },
  {
    name: "Ayan Khan",
    role: "CTC",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5603AQEQIdKNKZmL0w/profile-displayphoto-crop_800_800/B56ZsNy8hqJEAM-/0/1765463019838?e=1786579200&v=beta&t=YkAg5vd9_kSQh8sqo3386pBGyrc6BH-kQPcVrBEF5Z0",
    linkedin: "https://www.linkedin.com/in/ayankhan28/",
  },
  {
    name: "Parth Chaturvedi",
    role: "Co-CTC",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5635AQH3VxIR1jBbxQ/profile-framedphoto-shrink_800_800/B56Zy3.rUJIcAk-/0/1772613187180?e=1785312000&v=beta&t=hi-JuAlYQBa9SGVG6UllE3RQ2f-GrLVN1NS14C2pi08",
    linkedin: "https://www.linkedin.com/in/parth-chaturvedi-dev/",
  },
  {
    name: "Anurag Maurya",
    role: "Management Head",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5635AQF4ZENwk1HXeA/profile-framedphoto-shrink_800_800/B56Z1zrfCqJgAk-/0/1775762272717?e=1785312000&v=beta&t=I5A3S9RhH-oBZjbPJNWFHgYAlm28oBZ3pd0ijRqNjHk",
    linkedin: "https://www.linkedin.com/in/anuragg28/",
  },
  {
    name: "Sanya Pandey",
    role: "General Secretary",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5635AQF73kSRx_Goaw/profile-framedphoto-shrink_800_800/B56Z7VJeM2IgAY-/0/1781692492487?e=1785312000&v=beta&t=hfnRJbe0WIahTLbN3PFS7E2HS-43QUhgtH7lItDHyjs",
    linkedin: "https://www.linkedin.com/in/sanya-pandey08/",
  },
];

const domains: DomainData[] = [
  {
    id: "programming",
    label: "Programming",
    accentColor: "#0d9488", // Teal
    badgeText: "PROGRAMMING LEAD",
    lead: {
      name: "Tanmay Kalra",
      role: "Programming Lead",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5603AQHdOVvvjrtoaQ/profile-displayphoto-crop_800_800/B56Z.U0t6jHYAI-/0/1784908276336?e=1786579200&v=beta&t=lgOoi4ELPSBTYkEPfRQ357XNpbdbZveqlnaOOyHdNOU",
      linkedin: "https://www.linkedin.com/in/tanmay-kalra-09oct/",
    },
    students: [
      {
        name: "Akshat Rastogi",
        role: "Programmer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQGHyzr7S7o_XQ/profile-displayphoto-crop_800_800/B56ZkT.9D0HQAU-/0/1756976896081?e=1786579200&v=beta&t=_AY8oRu--oNUZBrkA_wWCYkRhfzOWERHEc-fH6gitOs",
        linkedin: "https://www.linkedin.com/in/-akshatrastogi/",
      },
      {
        name: "Vansh Bhaskar",
        role: "Programmer",
        avatar: "https://drive.google.com/uc?export=view&id=1HdKkr7oydmReVpZB8_9beePEP2oX43ka",
        linkedin: "https://www.linkedin.com/in/vanshbhaskar/",
      },
      {
        name: "Arunima Negi",
        role: "Programmer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQHk8xAMkLoX6Q/profile-displayphoto-shrink_800_800/B56ZQxgkCJH0Ac-/0/1735997414525?e=1786579200&v=beta&t=YnWVlxUAEVmLmX7XyZeSiepE5Y0bbLcsPbYMq1k8cN8",
        linkedin: "https://www.linkedin.com/in/arunima-negi-90504429b/",
      },
      {
        name: "K. Anushree",
        role: "Programmer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D4E03AQGHQXpi0yR2Bg/profile-displayphoto-shrink_800_800/B4EZcFx5uKH0Ac-/0/1748148658313?e=1786579200&v=beta&t=kueb2YiIzYSZ8upDjHbJZahlNhjE43yrl4UYTmPxF3I",
        linkedin: "https://www.linkedin.com/in/theanushree25/",
      },
      {
        name: "Aditya Kumar Gupta",
        role: "Programmer",
        avatar: "https://drive.google.com/uc?export=view&id=1WYkNYR7fAGegTi3I8mkPpNzPIIG9xdJ4",
        linkedin: "https://www.linkedin.com/in/aditya-kumar-gupta-245515297/",
      },
      {
        name: "Sanskar Mittal",
        role: "Programmer",
        avatar: "https://drive.google.com/uc?export=view&id=1SSmiD2QlZ0Zt4baq2LxD4jX_a6dPJ7gK",
        linkedin: "https://www.linkedin.com/in/sanskarmittal/",
      },
      {
        name: "Prashasti Jha",
        role: "Programmer",
        avatar: "https://drive.google.com/uc?export=view&id=1VHi80z8fJDApwnBbb7t_5a1F98DRZrJn",
        linkedin: "https://www.linkedin.com/in/prashasti-jha-391109381/",
      },
      {
        name: "Aaryan Singh",
        role: "Programmer",
        avatar: "https://drive.google.com/uc?export=view&id=1go3rBmnxA0Upp89TfmtxSliSE-qgD-8m",
        linkedin: "https://www.linkedin.com/in/aaryansingh31/",
      },
    ],
  },
  {
    id: "web-dev",
    label: "Web Development",
    accentColor: "#2563eb", // Blue
    badgeText: "WEB DEV LEAD",
    lead: {
      name: "Disha Agrawal",
      role: "Web Dev Lead",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5635AQEkSyHkUmXTSw/profile-framedphoto-shrink_800_800/B56Z0VRC_bJwAg-/0/1774178283808?e=1785312000&v=beta&t=pI0HI6feLSv6M8OPfv4usOXa31jef0C2wt1qIZzO-eg",
      linkedin: "https://www.linkedin.com/in/disha-agrawal-0438062a5/",
    },
    students: [
      {
        name: "Abhishek Jaiswal",
        role: "Web Developer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQH9OH2jrPDlfg/profile-displayphoto-crop_800_800/B56ZyMGA0yJQAM-/0/1771876913422?e=1786579200&v=beta&t=iCUqJoUDAt58UMkScnakQJvqYQHjOHikvCvQhJ0rN4A",
        linkedin: "https://www.linkedin.com/in/abhishek-jaiswal-110399338/",
      },
      {
        name: "Thushar Rai",
        role: "Web Developer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D4E03AQHCgVvwxGYlSQ/profile-displayphoto-crop_800_800/B4EZkLMw8CGwAI-/0/1756829521504?e=1786579200&v=beta&t=od5HdvJahMff8MbT4AKj8L8dFZzhqEs22haWXkDEvlE",
        linkedin: "https://www.linkedin.com/in/thushar-rai-a8aa9a375/",
      },
      {
        name: "Nandini Mishra",
        role: "Web Developer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQGzKnyCuA3V-Q/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1727012180946?e=1786579200&v=beta&t=CJTkR5BDprIilEeghIL368AyD-F2AhlEjbBaE4-vzKs",
        linkedin: "https://www.linkedin.com/in/nandini-mishra-4a5a3132a/",
      },
      {
        name: "Ayushi Tiwari",
        role: "Web Developer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQF9h99beGKKcg/profile-displayphoto-crop_800_800/B56Zzy9SpMJIAQ-/0/1773602682193?e=1786579200&v=beta&t=gbBKa-FRy4VArkjedeOMFnn60K6GZb3c4Gng4FIVmiM",
        linkedin: "https://www.linkedin.com/in/ayushi-tiwari-408a61302/",
      },
      {
        name: "Akhil Mishra",
        role: "Web Developer",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5603AQEFlb64aMvblA/profile-displayphoto-crop_800_800/B56Z9CxSqKGcAI-/0/1783531646775?e=1786579200&v=beta&t=tavhaGWLV5ZmDWi_zU4PJtEGm8KKL5-YTOpOy8MYVaQ",
        linkedin: "https://www.linkedin.com/in/akhil-mishra-95ba36312/",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    accentColor: "#d97706", // Amber
    badgeText: "TECHNICAL LEAD",
    lead: {
      name: "Vaishnav Gupta",
      role: "Technical Lead",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5635AQHfu0yPDmJkHw/profile-framedphoto-shrink_800_800/B56Z4kv4peHEAg-/0/1778732993418?e=1785312000&v=beta&t=fibyE81Q5lfLA3xttPyyCXqzLipX02VbkeO1ZX2MinA",
      linkedin: "https://www.linkedin.com/in/vaishnavgupta/",
    },
    students: [
      {
        name: "Abhishek",
        role: "Technical Member",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSs9bBvurUnow2rc2cuJHs7GL1_7VA3Q_QeQBC_X08Xg&s=10",
        linkedin: "https://www.linkedin.com/in/abhishekk1811/",
      },
      {
        name: "Shivanshu Kushwaha",
        role: "Technical Member",
        avatar: "https://drive.google.com/uc?export=view&id=1P1PzDOag-xV34vRgnfrKVkG8FN7Ia_Td",
        linkedin: "https://www.linkedin.com/in/shivanshu-kushwaha-12572b345/",
      },
      {
        name: "Rajat Kumar",
        role: "Technical Member",
        avatar:
          "https://media.licdn.com/dms/image/v2/D5635AQFVYMArh5ZYUA/profile-framedphoto-shrink_800_800/B56Z7q0_aUIQAY-/0/1782056220724?e=1785358800&v=beta&t=Rn4edCrF-0LmQoqTQxRicM5ZbmGLrelsIh_2A1xYu18",
        linkedin: "https://www.linkedin.com/in/rajat281/",
      },
      {
        name: "Mahi Gupta",
        role: "Technical Member",
        avatar: "https://drive.google.com/uc?export=view&id=1w6V2va73iu2Ns8ya-WtQE4z_uMzuhHPU",
        linkedin: "https://www.linkedin.com/in/mahi-gupta-8623b4364/",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    accentColor: "#eb4d6d", // Pink
    badgeText: "DESIGN LEAD",
    lead: {
      name: "Aarsh Upadhyay",
      role: "Design Lead",
      avatar:
        "https://media.licdn.com/dms/image/v2/D4D03AQFc7G8FNXP2Cw/profile-displayphoto-shrink_800_800/B4DZXWd3q2HwAc-/0/1743059910043?e=1786579200&v=beta&t=gngRgGef8mSj5cJYciKYSDny_u6J4jhxFIsfMCTwavs",
      linkedin: "https://www.linkedin.com/in/aarsh-upadhyay-66010a359/",
    },
    students: [
      {
        name: "Arnav",
        role: "Designer",
        avatar: "https://drive.google.com/uc?export=view&id=1jAh7Y1YnUVf7n-q1TlEWft1e37Owp_5H",
        linkedin: "https://www.linkedin.com/in/arnav2k5/",
      },
      {
        name: "Akshat Srivastava",
        role: "Designer",
        avatar: "https://drive.google.com/uc?export=view&id=1oDp5216NuGeljG1uet0hHaeBVpuOGlFo",
        linkedin: "https://www.linkedin.com/in/akshat-srivastava-522265407/",
      },
      {
        name: "Ankita Singh",
        role: "Designer",
        avatar: "https://drive.google.com/uc?export=view&id=1Hru4uuqfaDU03i6Q-66AM8MDYtxOMxxf",
        linkedin: "https://www.linkedin.com/in/ankita-singh-566007385/",
      },
      {
        name: "Placeholder Name",
        role: "Designer",
        avatar: "",
        linkedin: "#",
      },
    ],
  },
];

// Helper to get initials
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

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

/** Poster Image with Fallback */
function PosterImage({
  src,
  alt,
  name,
}: {
  src: string;
  alt: string;
  name: string;
}) {
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
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
      className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
      onError={() => setHasError(true)}
    />
  );
}

/** Circle Avatar with Fallback */
function CircleAvatar({
  src,
  alt,
  name,
  accentColor,
}: {
  src: string;
  alt: string;
  name: string;
  accentColor: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden">
      {!src || hasError ? (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-base sm:text-lg select-none transition-transform duration-200 ease-out group-hover:scale-[1.08]"
          style={{
            backgroundColor: `${accentColor}1c`, // ~11% tint background
            color: accentColor,
          }}
        >
          {getInitials(name)}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.08]"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

/** Poster Card for Executive Board & Domain Leads */
function PosterCard({
  member,
  accentColor = "#2563eb",
  isDomainLead = false,
  index = 0,
}: {
  member: Member;
  accentColor?: string;
  isDomainLead?: boolean;
  index?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const cardDimensions = isDomainLead
    ? "w-[300px] sm:w-[340px] md:w-[370px] lg:w-[390px] h-[390px] sm:h-[440px] md:h-[480px] lg:h-[500px]"
    : "w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] h-[370px] sm:h-[420px] md:h-[460px] lg:h-[480px]";

  const titleSize = "text-xl sm:text-2xl";
  const roleSize = "text-xs sm:text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className={`relative group rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] shrink-0 ${cardDimensions} cursor-pointer bg-black/5 dark:bg-white/5`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo with Fallback */}
      <PosterImage src={member.avatar} alt={member.name} name={member.name} />

      {/* Gradient Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

      {/* LinkedIn Button */}
      {member.linkedin && member.linkedin !== "#" && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm z-10"
          aria-label={`${member.name}'s LinkedIn profile`}
        >
          <LinkIcon className="w-4 h-4" />
        </a>
      )}

      {/* Name & Role Text */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 text-white z-10 pointer-events-none">
        <h3 className={`font-black tracking-tight leading-snug mb-0.5 ${titleSize}`}>
          {member.name}
        </h3>
        <p className={`font-semibold uppercase tracking-wider text-white/80 ${roleSize}`}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

/** Domain Member Card */
function DomainMemberCard({
  member,
  accentColor,
  index,
}: {
  member: Member;
  accentColor: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex flex-col items-center group cursor-pointer w-full transition-all duration-200 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Circle Avatar */}
      <div
        className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full mb-4 bg-black/5 dark:bg-white/5 transition-all duration-200 ease-out shrink-0 overflow-hidden"
        style={{
          boxShadow: isHovered ? `0 0 14px ${accentColor}50` : "none",
        }}
      >
        <CircleAvatar
          src={member.avatar}
          alt={member.name}
          name={member.name}
          accentColor={accentColor}
        />

        {/* LinkedIn Hover Overlay */}
        {member.linkedin && member.linkedin !== "#" && (
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out flex items-center justify-center">
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <LinkIcon className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Name & Role */}
      <h4
        className="text-base sm:text-lg font-bold text-center transition-colors duration-200 ease-out line-clamp-1"
        style={{ color: isHovered ? accentColor : "var(--text-primary)" }}
      >
        {member.name}
      </h4>
      <p
        className="text-xs font-semibold uppercase tracking-wider text-center mt-0.5 transition-colors duration-200 ease-out line-clamp-1"
        style={{ color: isHovered ? accentColor : "var(--text-secondary)" }}
      >
        {member.role}
      </p>
    </motion.div>
  );
}

// ----------------------------------------------------
// PAGE
// ----------------------------------------------------
export default function TeamPage() {
  const [activeDomainId, setActiveDomainId] = useState(domains[0].id);

  const activeDomain = domains.find((d) => d.id === activeDomainId) || domains[0];

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 md:pt-40 pb-24 relative font-['Outfit']">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none mb-6 text-[var(--text-primary)]"
          >
            OUR TEAM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-medium"
          >
            Meet the passionate minds behind MMIL—a group of students dedicated to creating
            opportunities, organizing impactful events, and building a community where innovation
            thrives.
          </motion.p>
        </div>

        {/* 1. EXECUTIVE BOARD SECTION */}
        <section className="mb-28">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
            <span className="px-6 text-xl sm:text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">
              Executive Board
            </span>
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
          </div>

          {/* Flex Wrap Container: Uniform card sizing across all cards */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {executiveBoard.map((member, i) => (
              <PosterCard
                key={`exec-${member.name}`}
                member={member}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* 2. DOMAINS SECTION */}
        <section className="relative z-10">
          <div className="flex items-center justify-center mb-10">
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow hidden md:block" />
            <span className="px-6 text-xl sm:text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">
              Domains
            </span>
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow hidden md:block" />
          </div>

          {/* Minimal Domain Tabs Bar with 2px Accent Underline */}
          <div className="flex overflow-x-auto pb-3 mb-10 snap-x hide-scrollbar justify-start md:justify-center items-center gap-8 sm:gap-10 border-b border-black/10 dark:border-white/10">
            {domains.map((domain) => {
              const isActive = activeDomainId === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  className="relative pb-3 px-1 whitespace-nowrap text-base sm:text-lg font-medium transition-colors duration-200 flex-shrink-0 snap-center"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {domain.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] rounded-full"
                      style={{ backgroundColor: domain.accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Domain Content Workspace (Neutral Container) */}
          <section className="rounded-3xl p-6 sm:p-10 border border-black/10 dark:border-white/10 bg-transparent">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                  {/* Left Column: Domain Lead Card */}
                  <div className="w-full lg:w-auto flex flex-col items-center lg:items-start shrink-0">
                    <PosterCard
                      member={activeDomain.lead}
                      accentColor={activeDomain.accentColor}
                      isDomainLead
                      index={0}
                    />
                  </div>

                  {/* Right Column: Members Grid */}
                  <div className="w-full lg:flex-1">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-secondary)] mb-6 text-center lg:text-left">
                      Members
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8 sm:gap-y-10 justify-items-center items-start">
                      {activeDomain.students.map((student, idx) => (
                        <DomainMemberCard
                          key={`member-${student.name}-${idx}`}
                          member={student}
                          accentColor={activeDomain.accentColor}
                          index={idx}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </section>
      </div>
    </main>
  );
}

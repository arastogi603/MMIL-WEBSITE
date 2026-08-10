"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Award, BookOpen, Sparkles, ExternalLink, GraduationCap } from "lucide-react";
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
    avatar: "/images/members/kuldeep.jpeg",
    linkedin: "https://www.linkedin.com/in/kuldeepk-pandit/",
    isPresident: true,
  },
  {
    name: "Vaishnavi Bhati",
    role: "Vice President",
    avatar: "/images/members/vaisnavi.png",
    linkedin: "https://www.linkedin.com/in/vaishnavi-bhati-15vb2004/",
  },
  {
    name: "Ayan Khan",
    role: "CTC",
    avatar: "/images/members/ayan.jpeg",
    linkedin: "https://www.linkedin.com/in/ayankhan28/",
  },
  {
    name: "Parth Chaturvedi",
    role: "Co-CTC",
    avatar: "/images/members/parth.jpg.jpeg",
    linkedin: "https://www.linkedin.com/in/parth-chaturvedi-dev/",
  },
  {
    name: "Sanya Pandey",
    role: "General Secretary",
    avatar: "/images/members/sanya.jpeg",
    linkedin: "https://www.linkedin.com/in/sanya-pandey08/",
  },
  {
    name: "Anurag Maurya",
    role: "Management Head",
    avatar: "/images/members/anurag.jpg.jpeg",
    linkedin: "https://www.linkedin.com/in/anuragg28/",
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
      avatar: "/images/members/tanmay.jpeg",
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
        avatar: "/images/members/vansh.jpg",
        linkedin: "https://www.linkedin.com/in/vanshbhaskar/",
      },
      {
        name: "Arunima Negi",
        role: "Programmer",
        avatar: "/images/members/Arunima.jpeg",
        linkedin: "https://www.linkedin.com/in/arunima-negi-90504429b/",
      },
      {
        name: "K. Anushree",
        role: "Programmer",
        avatar: "/images/members/Anushree.jpeg",
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
        avatar: "/images/members/sanskar.jpg",
        linkedin: "https://www.linkedin.com/in/sanskarmittal/",
      },
      {
        name: "Prashasti Jha",
        role: "Programmer",
        avatar: "/images/members/Prashasthi.jpg",
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
      avatar: "/images/members/disha.jpeg",
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
        avatar: "/images/members/tushar.jpeg",
        linkedin: "https://www.linkedin.com/in/thushar-rai-a8aa9a375/",
      },
      {
        name: "Nandini Mishra",
        role: "Web Developer",
        avatar: "/images/members/nandini.jpeg",
        linkedin: "https://www.linkedin.com/in/nandini-mishra-4a5a3132a/",
      },
      {
        name: "Ayushi Tiwari",
        role: "Web Developer",
        avatar: "/images/members/Ayushi.png",
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
      avatar: "/images/members/VaishnavGupta.jpg.jpeg",
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
        avatar: "/images/members/shivanshu.jpg",
        linkedin: "https://www.linkedin.com/in/shivanshu-kushwaha-12572b345/",
      },
      {
        name: "Rajat Kumar",
        role: "Technical Member",
        avatar: "/images/members/rajat.jpeg",
        linkedin: "https://www.linkedin.com/in/rajat281/",
      },
      {
        name: "Mahi Gupta",
        role: "Technical Member",
        avatar: "/images/members/mahi.jpeg",
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
      avatar: "/images/members/aarsh.jpg.jpeg",
      linkedin: "https://www.linkedin.com/in/aarsh-upadhyay-66010a359/",
    },
    students: [
      {
        name: "Arnav",
        role: "Designer",
        avatar: "/images/members/arnav.jpg",
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
        avatar: "/images/members/ankita.jpg",
        linkedin: "https://www.linkedin.com/in/ankita-singh-566007385/",
      },
      {
        name: "Himanshi",
        role: "Designer",
        avatar: "/images/members/himanshi.jpeg",
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
          className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 shadow-md z-10"
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

const facultyCoordinators = [
  {
    name: "Dr. Lavkush Sharma",
    role: "HoD & Faculty Coordinator",
    designation: "HoD & Professor, Dept. of IT",
    avatar:
      "https://backoffice.jssuninoida.edu.in/assets/img/faculty/1774855281_69ca2471438c3.webp",
    linkedin: "https://www.linkedin.com/in/lavkushsharma",
    universityLink: "https://jssuninoida.edu.in/faculty/lavkush-sharma",
    bullets: [
      "20+ Years Academic & Mentorship (50+ Projects)",
      "35+ Research Papers in International Journals",
      "UGC-NET Qualified & IEI Lifetime Member",
    ],
  },
  {
    name: "Dr. Charu Awasthi",
    role: "Faculty Coordinator",
    designation: "Assistant Professor, Dept. of IT",
    avatar:
      "https://backoffice.jssuninoida.edu.in/assets/img/faculty/1775556398_69d4d72ed79f9.webp",
    linkedin: "https://www.linkedin.com/in/dr-charu-awasthi-49264077/",
    universityLink: "https://jssuninoida.edu.in/faculty/ms-charu-awasthi",
    bullets: [
      "2 Granted Patents in Fog Computing & IoT",
      "12+ Years Academic & Research Experience",
      "Institute GDSC & MMIL Faculty Coordinator",
    ],
  },
];

/** Faculty Coordinators Section Component */
function FacultyCoordinatorsSection() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
      {facultyCoordinators.map((coord, i) => (
        <motion.div
          key={`coord-${coord.name}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
          className="relative group rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)] shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] h-[480px] sm:h-[520px] md:h-[540px] cursor-pointer bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
        >
          {/* Photo with Fallback */}
          <PosterImage src={coord.avatar} alt={coord.name} name={coord.name} />

          {/* Deep Gradient Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

          {/* Top Right Action Buttons (High contrast glass buttons) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {coord.universityLink && (
              <a
                href={coord.universityLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 shadow-md"
                aria-label={`${coord.name}'s University profile`}
                title="University Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {coord.linkedin && coord.linkedin !== "#" && (
              <a
                href={coord.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-200 shadow-md"
                aria-label={`${coord.name}'s LinkedIn profile`}
                title="LinkedIn Profile"
              >
                <LinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Content Inside Image Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 text-white z-10 pointer-events-none">
            {/* Name */}
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-0.5">
              {coord.name}
            </h3>

            {/* Designation */}
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5">
              {coord.designation}
            </p>

            {/* Point-wise Achievements */}
            <div className="border-t border-white/20 pt-2.5 space-y-1">
              {coord.bullets.map((bullet, bIdx) => (
                <div
                  key={bIdx}
                  className="flex items-start gap-1.5 text-xs text-white/95 leading-snug font-medium"
                >
                  <span className="text-blue-400 font-bold shrink-0">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
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
              Executive Team
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

        {/* 2. FACULTY COORDINATOR SECTION */}
        <section className="mb-28">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
            <span className="px-6 text-xl sm:text-2xl font-black tracking-[0.1em] text-[var(--text-primary)] uppercase">
              Faculty Coordinators
            </span>
            <div className="h-px bg-black/10 dark:bg-white/10 flex-grow" />
          </div>

          <FacultyCoordinatorsSection />
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

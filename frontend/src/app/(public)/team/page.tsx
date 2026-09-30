"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { useEffect } from "react";
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
function FacultyCoordinatorsSection({ coordinators = facultyCoordinators }: { coordinators?: any[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
      {coordinators.map((coord, i) => (
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
  const [activeDomain, setActiveDomain] = useState<string>("programming");
  const [executiveBoard, setExecutiveBoard] = useState<Member[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [domains, setDomains] = useState<DomainData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/public/team').then(res => {
      const users = res.data;
      
      const execRoles = ["president", "vice-president", "ctc", "co-ctc", "general-secretary", "management-head"];
      const execMap: Record<string, number> = {};
      execRoles.forEach((r, i) => execMap[r] = i);

      
      // Map Faculty Coordinators dynamically
      const dynamicFaculty = users.filter((u: any) => u.role === "faculty-coordinator").map((u: any) => {
        // Find if hardcoded data exists for them by name to keep extra fields
        const hardcoded = facultyCoordinators.find(f => f.name.toLowerCase() === u.name.toLowerCase()) || {};
        return {
          name: u.name,
          role: u.role.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          designation: hardcoded.designation || "Faculty Coordinator",
          avatar: u.avatarUrl || hardcoded.avatar || "/images/default-avatar.png",
          linkedin: u.linkedInUrl || hardcoded.linkedin || "",
          universityLink: hardcoded.universityLink || "",
          bullets: hardcoded.bullets || [],
        };
      });
      // Fallback to hardcoded if none returned yet (for first load before admin adds them)
      setFaculty(dynamicFaculty.length > 0 ? dynamicFaculty : facultyCoordinators);

      const execs = users.filter((u: any) => execRoles.includes(u.role)).map((u: any) => ({
        name: u.name,
        role: u.role.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        avatar: u.avatarUrl || "/images/default-avatar.png",
        linkedin: u.linkedInUrl || "",
        isPresident: u.role === 'president'
      })).sort((a: any, b: any) => execMap[a.role.toLowerCase().replace(/ /g, '-')] - execMap[b.role.toLowerCase().replace(/ /g, '-')]);
      setExecutiveBoard(execs);

      const progLead = users.find((u: any) => u.role === "programming-head");
      const progStudents = users.filter((u: any) => u.role === "programmer" || u.role === "programming");
      
      const webLead = users.find((u: any) => u.role === "web-development-head");
      const webStudents = users.filter((u: any) => u.role === "web-developer" || u.role === "web-development");

      const technicalLead = users.find((u: any) => u.role === "technical-head" || u.role === "technical-lead");
      const technicalStudents = users.filter((u: any) => u.role === "technical-member" || u.role === "technical");

      const designLead = users.find((u: any) => u.role === "design-head");
      const designStudents = users.filter((u: any) => u.role === "designer" || u.role === "design");

      const mapToMember = (u: any, defaultRole: string) => u ? {
        name: u.name,
        role: u.role.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        avatar: u.avatarUrl || "/images/default-avatar.png",
        linkedin: u.linkedInUrl || ""
      } : { name: "TBA", role: defaultRole, avatar: "", linkedin: "" };

      setDomains([
        {
          id: "programming", label: "Programming", accentColor: "#0d9488", badgeText: "PROGRAMMING LEAD",
          lead: mapToMember(progLead, "Programming Lead"),
          students: progStudents.map((s: any) => mapToMember(s, "Programmer"))
        },
        {
          id: "web-dev", label: "Web Development", accentColor: "#2563eb", badgeText: "WEB DEV LEAD",
          lead: mapToMember(webLead, "Web Dev Lead"),
          students: webStudents.map((s: any) => mapToMember(s, "Web Developer"))
        },
        {
          id: "technical", label: "Technical", accentColor: "#d97706", badgeText: "TECHNICAL LEAD",
          lead: mapToMember(technicalLead, "Technical Lead"),
          students: technicalStudents.map((s: any) => mapToMember(s, "Technical Member"))
        },
        {
          id: "design", label: "Design", accentColor: "#d946ef", badgeText: "DESIGN LEAD",
          lead: mapToMember(designLead, "Design Lead"),
          students: designStudents.map((s: any) => mapToMember(s, "Designer"))
        }
      ]);
      setIsLoading(false);
    });
  }, []);

  const activeDomainData = domains.find((d) => d.id === activeDomain);

  if (isLoading) {
    return <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 md:pt-40 pb-24 relative font-['Outfit']"><div className="text-center">Loading...</div></main>;
  }

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

          <FacultyCoordinatorsSection coordinators={faculty} />
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
              const isActive = activeDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
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
                key={activeDomainData?.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                  {/* Left Column: Domain Lead Card */}
                  <div className="w-full lg:w-auto flex flex-col items-center lg:items-start shrink-0">
                    <PosterCard
                      member={activeDomainData?.lead}
                      accentColor={activeDomainData?.accentColor}
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
                      {(activeDomainData?.students || []).map((student, idx) => (
                        <DomainMemberCard
                          key={`member-${student.name}-${idx}`}
                          member={student}
                          accentColor={activeDomainData?.accentColor}
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

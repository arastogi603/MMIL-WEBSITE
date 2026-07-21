"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { recruitmentApi } from "@/lib/api/recruitment";
import { projectsApi } from "@/lib/api/projects";

/* ─────────────────────────────────────────────
   STATIC DATA (placeholders until API wired)
   ───────────────────────────────────────────── */

const domains = ["Web Dev", "Programming", "UI/UX", "AI/ML"];

const teamMembers = [
  { name: "Member 1", role: "President", img: "" },
  { name: "Member 2", role: "Vice President", img: "" },
  { name: "Member 3", role: "CTC", img: "" },
  { name: "Member 4", role: "Co-CTC", img: "" },
  { name: "Member 5", role: "General Secretary", img: "" },
  { name: "Member 6", role: "Tech Head", img: "" },
  { name: "Member 7", role: "Design Head", img: "" },
  { name: "Member 8", role: "Web Dev Head", img: "" },
];

const alumniYears = ["2024", "2023"];
const alumniData: Record<string, { name: string; role: string; img: string }[]> = {
  "2024": [
    { name: "Alum 1", role: "President", img: "" },
    { name: "Alum 2", role: "CTC", img: "" },
    { name: "Alum 3", role: "Vice President", img: "" },
    { name: "Alum 4", role: "Tech Head", img: "" },
  ],
  "2023": [
    { name: "Alum 5", role: "President", img: "" },
    { name: "Alum 6", role: "CTC", img: "" },
    { name: "Alum 7", role: "Vice President", img: "" },
  ],
};

const sampleEvents = [
  { title: "Hackathon 2024", desc: "A 24-hour coding sprint to build innovative solutions.", img: "/event-hackathon.png", slug: "hackathon-2024" },
  { title: "Ideathon", desc: "Pitch your groundbreaking ideas to a panel of judges.", img: "/event-ideathon.png", slug: "ideathon" },
  { title: "Workshop Series", desc: "Hands-on workshops covering web, mobile, and AI.", img: "/event-workshop.jpg", slug: "workshop-series" },
  { title: "Tech Talk", desc: "Industry experts sharing insights on emerging tech.", img: "/event-default.jpg", slug: "tech-talk" },
];

const galleryItems = [
  { label: "Community Day", img: "/community.jpg" },
  { label: "Hackathon Finals", img: "/event-hackathon.png" },
  { label: "Workshop Session", img: "/event-workshop.jpg" },
  { label: "Team Photo", img: "/event-ideathon.png" },
  { label: "Award Ceremony", img: "/event-default.jpg" },
  { label: "Coding Sprint", img: "/community.jpg" },
];

const fallbackProjects = [
  {
    id: 1, title: 'Nexus AI', 
    description: 'A generative AI coding assistant built on top of LLMs to automatically generate UI components from text prompts.',
    tech: ['React', 'Python', 'FastAPI'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2, title: 'DeFi Swap', 
    description: 'Decentralized exchange protocol on Ethereum allowing automated liquidity provision for ERC20 tokens.',
    tech: ['Solidity', 'Next.js', 'Ethers.js'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec8ce?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3, title: 'CloudMonitor', 
    description: 'Real-time observability dashboard for Kubernetes clusters aggregating logs and metrics.',
    tech: ['Go', 'Kubernetes', 'Prometheus'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];

/* ─────────────────────────────────────────────
   HOME PAGE COMPONENT
   ───────────────────────────────────────────── */

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeDomain, setActiveDomain] = useState("Programming");
  const [activeAlumniYear, setActiveAlumniYear] = useState("2024");
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    recruitmentApi
      .getActiveCycles()
      .then((cycles) => {
        if (cycles && cycles.length > 0) setActiveCycle(cycles[0]);
      })
      .catch(console.error);

    projectsApi
      .getPublicProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjectsList(data);
        } else {
          setProjectsList(fallbackProjects);
        }
      })
      .catch(() => setProjectsList(fallbackProjects));
  }, []);

  return (
    <main style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* ───── HERO SECTION ───── */}
      <section className="hero-section">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 className="hero-title">MMIL</h1>
          <h2 className="hero-subtitle">PRESENTS</h2>
        </div>
      </section>

      {/* ───── OUR TEAM SECTION ───── */}
      <section className="page-section" id="team">
        <h2 className="section-heading">OUR TEAM</h2>
        <p className="section-subtext">
          Meet the brilliant people who make MMIL happen — constantly innovating, learning and building together.
        </p>

        {/* Domain tabs */}
        <div className="tab-row">
          {domains.map((domain) => (
            <button
              key={domain}
              className={`tab-pill ${activeDomain === domain ? "active" : ""}`}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Team grid */}
        <div className="card-grid">
          {teamMembers.map((member, i) => (
            <div key={i} className="member-card">
              <div className="member-card-img" />
              <div className="member-card-info">
                <div className="member-card-name">{member.name}</div>
                <div className="member-card-role">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── ALUMNI SECTION ───── */}
      <section className="page-section" id="alumni">
        <h2 className="section-heading">ALUMNI</h2>
        <p className="section-subtext">Meet the people who shaped MMIL</p>

        {/* Year tabs */}
        <div className="tab-row">
          {alumniYears.map((year) => (
            <button
              key={year}
              className={`tab-pill ${activeAlumniYear === year ? "active" : ""}`}
              onClick={() => setActiveAlumniYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Year heading */}
        <div className="year-heading">{activeAlumniYear}</div>

        {/* Alumni grid */}
        <div className="card-grid">
          {(alumniData[activeAlumniYear] || []).map((alum, i) => (
            <div key={i} className="member-card">
              <div className="member-card-img" />
              <div className="member-card-info">
                <div className="member-card-name">{alum.name}</div>
                <div className="member-card-role">{alum.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── OUR EVENTS SECTION ───── */}
      <section className="page-section" id="events">
        <h2 className="section-heading">OUR EVENTS</h2>
        <p className="section-subtext">
          Hackathons, workshops, tech talks and more — explore what we do.
        </p>

        <div className="card-grid-events">
          {sampleEvents.map((evt, i) => (
            <Link key={i} href={`/events/${evt.slug}`} className="event-card">
              <Image
                src={evt.img}
                alt={evt.title}
                width={400}
                height={250}
                className="event-card-img"
              />
              <div className="event-card-info">
                <div className="event-card-title">{evt.title}</div>
                <div className="event-card-desc">{evt.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── GALLERY SECTION ───── */}
      <section className="page-section" id="gallery">
        <h2 className="section-heading">GALLERY</h2>
        <p className="section-subtext">
          Moments captured from our events, meetups, and celebrations.
        </p>

        <div className="card-grid-gallery">
          {galleryItems.map((item, i) => (
            <div key={i} className="gallery-card">
              <Image
                src={item.img}
                alt={item.label}
                width={300}
                height={225}
                className="gallery-card-img"
              />
              <div className="gallery-card-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── PROJECTS SECTION ───── */}
      <section className="page-section" id="projects">
        <h2 className="section-heading">Projects</h2>
        <p className="section-subtext">
          Open-source and innovative projects built by MMIL members.
        </p>

        <div className="card-grid-events">
          {projectsList.map((proj, i) => (
            <div key={i} className="project-card">
              <Image
                src={proj.thumbnailImage || proj.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'}
                alt={proj.title}
                width={700}
                height={394}
                className="project-card-img"
              />
              <div className="project-card-info">
                <div className="project-card-title">{proj.title}</div>
                <div className="project-card-desc">{proj.description || proj.desc}</div>
                <Link href={`/projects/${proj.slug || proj.id}`} className="btn-primary">
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

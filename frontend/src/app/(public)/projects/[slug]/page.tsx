"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Sparkles,
  Layers,
  MapPin,
  LayoutGrid,
  Video,
  Mic,
  Activity,
  Zap,
  MessageSquare,
  QrCode,
  Tags,
  TrendingUp,
  CreditCard,
  PieChart,
  Calendar,
  Timer,
  BarChart2,
  ShieldAlert,
  Navigation,
  Cpu,
  Terminal,
} from "lucide-react";
import { projectsApi } from "@/lib/api/projects";

// Tech logo mapping — uses devicon CDN for real logos
const TECH_ICONS: Record<string, string> = {
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
  docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  kubernetes: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  mongodb: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  firebase: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  flutter: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  express: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  fastapi: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  azure: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  graphql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  tensorflow: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  pytorch: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  solidity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg",
  "spring boot": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  spring: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  "vue.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  angular: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  svelte: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  sass: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "c#": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
  prometheus: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
  "ethers.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  webrtc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
};

interface ProjectTheme {
  primary: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowGradient: string;
  eyebrow: string;
}

const PROJECT_THEMES: Record<string, ProjectTheme> = {
  vaultmeet: {
    primary: "#00F5D4",
    textClass: "text-teal-400",
    bgClass: "bg-teal-500/10",
    borderClass: "border-teal-500/30",
    glowGradient: "from-teal-500/25 via-emerald-500/20 to-cyan-500/20",
    eyebrow: "SPATIAL VIRTUAL WORLD",
  },
  "voxtrace-ai": {
    primary: "#00E5FF",
    textClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-cyan-500/30",
    glowGradient: "from-cyan-500/25 via-blue-500/20 to-indigo-500/20",
    eyebrow: "AI CALLING & VOICE ANALYTICS",
  },
  clientflow: {
    primary: "#10B981",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    glowGradient: "from-emerald-500/25 via-teal-500/20 to-green-500/20",
    eyebrow: "CUSTOMER MESSAGING MVP",
  },
  vaultrade: {
    primary: "#F59E0B",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    glowGradient: "from-amber-500/25 via-orange-500/20 to-yellow-500/20",
    eyebrow: "FINTECH TRADING PLATFORM",
  },
  "tech-taste-foods": {
    primary: "#FF6B00",
    textClass: "text-orange-400",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    glowGradient: "from-orange-500/25 via-amber-500/20 to-red-500/20",
    eyebrow: "FOOD ORDERING & CATERING",
  },
  "parthdev-portfolio": {
    primary: "#A855F7",
    textClass: "text-purple-400",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    glowGradient: "from-purple-500/25 via-violet-500/20 to-indigo-500/20",
    eyebrow: "DEVELOPER PORTFOLIO",
  },
  "kuldeep-pandit-portfolio": {
    primary: "#6366F1",
    textClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10",
    borderClass: "border-indigo-500/30",
    glowGradient: "from-indigo-500/25 via-blue-500/20 to-cyan-500/20",
    eyebrow: "SOFTWARE ENGINEER PORTFOLIO",
  },
  "study-smart": {
    primary: "#0EA5E9",
    textClass: "text-sky-400",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/30",
    glowGradient: "from-sky-500/25 via-blue-500/20 to-cyan-500/20",
    eyebrow: "STUDY SESSION MANAGER",
  },
  "guardian-safety-app": {
    primary: "#EF4444",
    textClass: "text-rose-400",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    glowGradient: "from-red-500/25 via-rose-500/20 to-pink-500/20",
    eyebrow: "EMERGENCY SAFETY APP",
  },
};

const DEFAULT_THEME: ProjectTheme = {
  primary: "#00E5FF",
  textClass: "text-cyan-400",
  bgClass: "bg-cyan-500/10",
  borderClass: "border-cyan-500/30",
  glowGradient: "from-cyan-500/25 via-blue-500/20 to-indigo-500/20",
  eyebrow: "FEATURED PROJECT",
};

function getProjectTheme(slugOrId: string): ProjectTheme {
  const key = (slugOrId || "").toLowerCase();
  return PROJECT_THEMES[key] || DEFAULT_THEME;
}

function getTechIcon(tech: string): string | null {
  return TECH_ICONS[tech.toLowerCase().trim()] || null;
}

function getDomainFromUrl(url?: string): string {
  if (!url) return "project.preview";
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "project.preview";
  }
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function getKeyFeatures(project: any): FeatureItem[] {
  const text = (project.description || "").toLowerCase();
  const slug = (project.slug || project.id || "").toLowerCase();

  if (slug.includes("vaultmeet") || text.includes("virtual") || text.includes("2d")) {
    return [
      {
        icon: <MapPin className="w-4 h-4" />,
        title: "2D Spatial Audio & Avatars",
        desc: "Interactive spatial map for hackathons, virtual booths, and organic participant networking.",
      },
      {
        icon: <LayoutGrid className="w-4 h-4" />,
        title: "Multi-Room Expo Spaces",
        desc: "Customizable virtual stages, breakout rooms, and sponsor showcase zones.",
      },
      {
        icon: <Video className="w-4 h-4" />,
        title: "Real-time WebRTC Streaming",
        desc: "Low-latency video streams, screen sharing, and interactive audience chat.",
      },
    ];
  }

  if (slug.includes("voxtrace") || text.includes("voice") || text.includes("ai")) {
    return [
      {
        icon: <Mic className="w-4 h-4" />,
        title: "Automated AI Telephony",
        desc: "Real-time voice agent routing and conversational AI processing at scale.",
      },
      {
        icon: <Activity className="w-4 h-4" />,
        title: "Live Speech Analytics",
        desc: "Instant sentiment detection, conversation transcripts, and latency tracking.",
      },
      {
        icon: <Zap className="w-4 h-4" />,
        title: "Zero-Friction Integration",
        desc: "Seamless webhook connectivity with customer contact platforms and CRMs.",
      },
    ];
  }

  if (slug.includes("clientflow") || text.includes("whatsapp") || text.includes("inbox")) {
    return [
      {
        icon: <MessageSquare className="w-4 h-4" />,
        title: "Unified Multi-Agent Inbox",
        desc: "Manage high-volume WhatsApp conversations across agents from one dashboard.",
      },
      {
        icon: <QrCode className="w-4 h-4" />,
        title: "QR Code Device Pairing",
        desc: "Connect WhatsApp instances effortlessly powered by Evolution API.",
      },
      {
        icon: <Tags className="w-4 h-4" />,
        title: "Automated Lead Tagging",
        desc: "Smart conversation categorization, customer history, and team handoffs.",
      },
    ];
  }

  if (slug.includes("vaultrade") || text.includes("trading") || text.includes("fintech")) {
    return [
      {
        icon: <TrendingUp className="w-4 h-4" />,
        title: "TradingView Chart Widgets",
        desc: "Live financial market data, technical indicators, and real-time price feeds.",
      },
      {
        icon: <CreditCard className="w-4 h-4" />,
        title: "Payment Gateway Integration",
        desc: "Secure Razorpay wallet funding, Google Auth, and transaction logs.",
      },
      {
        icon: <PieChart className="w-4 h-4" />,
        title: "Portfolio Performance",
        desc: "Real-time P&L analytics, asset allocation tracking, and market history.",
      },
    ];
  }

  if (slug.includes("study") || text.includes("session") || text.includes("task")) {
    return [
      {
        icon: <Calendar className="w-4 h-4" />,
        title: "Study Schedule Manager",
        desc: "Organize subjects, prioritize tasks with due dates, and track milestones.",
      },
      {
        icon: <Timer className="w-4 h-4" />,
        title: "Integrated Focus Timer",
        desc: "Track active study hours, break intervals, and session duration logs.",
      },
      {
        icon: <BarChart2 className="w-4 h-4" />,
        title: "Progress Analytics",
        desc: "Visual charts detailing weekly study hours and subject completion rate.",
      },
    ];
  }

  if (slug.includes("guardian") || text.includes("sos") || text.includes("safety")) {
    return [
      {
        icon: <ShieldAlert className="w-4 h-4" />,
        title: "Instant SOS Emergency Alert",
        desc: "One-tap emergency trigger notifying designated emergency contacts.",
      },
      {
        icon: <Navigation className="w-4 h-4" />,
        title: "Live GPS Location Sharing",
        desc: "Continuous real-time location broadcast with encrypted position data.",
      },
      {
        icon: <Mic className="w-4 h-4" />,
        title: "Ambient Audio Recorder",
        desc: "Automatic background audio capture during critical alert states.",
      },
    ];
  }

  return [
    {
      icon: <Cpu className="w-4 h-4" />,
      title: "Responsive Architecture",
      desc: "Built with modern framework standards for maximum speed and accessibility.",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "Intuitive Experience",
      desc: "Polished user interface with clean layout rhythm and micro-interactions.",
    },
    {
      icon: <Terminal className="w-4 h-4" />,
      title: "Production Engineering",
      desc: "Structured component state, fast API routing, and optimized delivery.",
    },
  ];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    async function fetchProject() {
      try {
        const data = await projectsApi.getProjectBySlug(slug);
        setProject(data);
      } catch (err: any) {
        setError("Project not found.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-['Outfit']">
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-['Outfit'] text-[var(--text-primary)]">
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-8">{error || "The requested project could not be found."}</p>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold text-sm hover:opacity-80 transition-all"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";
  const heroImage = project.thumbnailImage || project.image || fallbackImage;
  const domainName = getDomainFromUrl(project.liveDemoUrl);
  const theme = getProjectTheme(project.slug || project.id || slug);
  const features = getKeyFeatures(project);

  return (
    <main className="min-h-screen bg-transparent text-[var(--text-primary)] font-['Outfit'] pt-28 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Title (Placed above the grid so the top of screenshot & top of tech stack align perfectly) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            {project.title}
          </h1>
        </motion.div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Column (~68% width for larger, prominent screenshot) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Framed Browser Screenshot Container with Brand Accent Glow */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative group"
            >
              {/* Subtle Brand Accent Glow Behind Screenshot */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.glowGradient} blur-3xl opacity-35 rounded-3xl -z-10 group-hover:opacity-50 transition-opacity duration-300`} />

              {/* Browser Frame */}
              <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                {/* Browser Chrome Header */}
                <div className="flex items-center px-4 py-3 bg-[var(--card-bg)] border-b border-[var(--card-border)] gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 max-w-sm mx-auto bg-[var(--border)]/30 rounded-lg px-3 py-1 text-center text-xs font-mono text-[var(--text-secondary)] truncate border border-[var(--card-border)]">
                    {domainName}
                  </div>
                  <div className="w-12" />
                </div>

                {/* Main Screenshot Image (Increased height/aspect presence) */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-black/5">
                  <img
                    src={heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Intro Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed text-base md:text-lg">
                {project.description}
              </p>
            </motion.div>

            {/* Key Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-5 pt-2"
            >
              <h2 className={`text-xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2`}>
                <Layers className={`w-5 h-5 ${theme.textClass}`} />
                <span>Key Features</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className={`bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl border border-[var(--card-border)] p-5 shadow-sm space-y-3 hover:${theme.borderClass} transition-colors`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${theme.bgClass} ${theme.textClass} border ${theme.borderClass} flex items-center justify-center`}>
                      {feat.icon}
                    </div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{feat.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column (~32% width, top aligned with the screenshot image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 lg:sticky lg:top-28 space-y-8"
          >
            {/* 1. Tech Stack (at top, aligned with top of screenshot image) */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-4 px-1">
                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech: string, i: number) => {
                    const icon = getTechIcon(tech);
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 px-4 py-2.5 bg-[var(--card-bg)] backdrop-blur-md rounded-xl border border-[var(--card-border)] shadow-xs hover:${theme.borderClass} hover:${theme.bgClass} hover:-translate-y-0.5 transition-all duration-150 group cursor-default`}
                      >
                        {icon ? (
                          <img
                            src={icon}
                            alt={tech}
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded bg-[var(--border)] flex items-center justify-center text-[10px] font-black text-[var(--text-secondary)]">
                            {tech.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={`font-bold text-xs text-[var(--text-primary)] group-hover:${theme.textClass} transition-colors`}>
                          {tech}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Project Links Button (Placed below Tech Stack) */}
            {project.liveDemoUrl && (
              <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-3xl border border-[var(--card-border)] p-6 shadow-sm">
                <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                  Project Links
                </h3>
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[var(--text-primary)] text-[var(--background)] font-bold text-sm hover:opacity-85 transition-all group w-full shadow-md"
                >
                  <Globe className="w-5 h-5" />
                  <span className="flex-1">Live Demo</span>
                  <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

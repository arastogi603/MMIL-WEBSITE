"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, Globe, User, Calendar } from "lucide-react";
import { projectsApi } from "@/lib/api/projects";
import { ProjectPageBackground } from "@/components/layout/ProjectPageBackground";

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
};

function getTechIcon(tech: string): string | null {
  return TECH_ICONS[tech.toLowerCase().trim()] || null;
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
        <ProjectPageBackground />
        <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-['Outfit'] text-[var(--text-primary)]">
        <ProjectPageBackground />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-8">{error || "The requested project could not be found."}</p>
          <Link href="/projects" className="px-6 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold text-sm hover:opacity-80 transition-all">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200";

  return (
    <main className="min-h-screen bg-transparent text-[var(--text-primary)] font-['Outfit'] pt-32 pb-24 relative overflow-hidden">
      <ProjectPageBackground />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/projects" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden mb-12 bg-neutral-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),inset_0_2px_10px_rgba(255,255,255,0.8)] border border-white"
        >
          <img
            src={project.thumbnailImage || project.image || fallbackImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="md:col-span-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black tracking-tight mb-6"
            >
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[var(--text-secondary)] font-medium leading-relaxed text-lg mb-10"
            >
              {project.description}
            </motion.p>

            {/* Tech Stack Section */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-5">Tech Stack</h3>
                <div className="flex flex-wrap gap-4">
                  {project.technologies.map((tech: string, i: number) => {
                    const icon = getTechIcon(tech);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white shadow-[0_4px_15px_rgba(0,0,0,0.04),inset_0_1px_3px_rgba(255,255,255,1)] hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] transition-all group"
                      >
                        {icon ? (
                          <img src={icon} alt={tech} className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-[var(--border)] flex items-center justify-center text-xs font-black text-[var(--text-secondary)]">
                            {tech.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold text-sm text-[var(--text-primary)]">{tech}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Links Card */}
            <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_5px_rgba(255,255,255,0.8)]">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-5">Links</h3>
              <div className="space-y-3">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--background)] font-bold text-sm hover:opacity-80 transition-all group w-full"
                  >
                    <GitBranch className="w-5 h-5" />
                    <span className="flex-1">GitHub Repository</span>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm hover:bg-[var(--border)] transition-all group shadow-inner w-full"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="flex-1">Live Demo</span>
                    <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                )}
                {!project.repositoryUrl && !project.liveDemoUrl && (
                  <p className="text-neutral-400 text-sm font-medium">No links available.</p>
                )}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_5px_rgba(255,255,255,0.8)]">
              <h3 className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-wider mb-5">Made By</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--border)] flex items-center justify-center shadow-inner">
                  <User className="w-6 h-6 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="font-black text-[var(--text-primary)]">{project.submittedByName || "MMIL Member"}</p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Community Contributor</p>
                </div>
              </div>
            </div>

            {/* Date Card */}
            <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_5px_rgba(255,255,255,0.8)]">
              <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider mb-5">Submitted</h3>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <span className="font-bold text-neutral-600">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

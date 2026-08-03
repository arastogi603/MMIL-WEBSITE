"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/theme/theme";
import { usePathname } from "next/navigation";

// Instagram SVG Glyph Icon
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// LinkedIn SVG Glyph Icon
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

// GitHub SVG Glyph Icon
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Behance SVG Glyph Icon


export function Footer() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isProjectsIndex = pathname === "/projects";

  if (isProjectsIndex) return null;

  return (
    <footer
      className={`w-full mt-20 md:mt-24 bg-[#FAFAFA] dark:bg-[#0b0c0e] text-[var(--text-primary)] font-['Outfit'] relative z-10 ${isAdmin ? "md:pl-72 pb-16 md:pb-0" : ""
        }`.trim()}
    >
      <div className="max-w-[1300px] mx-auto px-6 pt-16 md:pt-20 pb-10 md:pb-12">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo-light.png"
                alt="MMIL Logo"
                width={140}
                height={70}
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform dark:hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="MMIL Logo"
                width={140}
                height={70}
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform hidden dark:block"
              />
              <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
                MMIL
              </span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed max-w-sm pt-1">
              Empowering Innovation • Inspiring Creativity • Building the Future
            </p>
          </div>

          {/* Explore Column */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black tracking-widest text-pink-500 uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link
                  href="/about"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/domains"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  Domains
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black tracking-widest text-pink-500 uppercase">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link
                  href="/team"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/alumni"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  Alumni
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-[var(--text-primary)] hover:text-pink-500 transition-colors duration-150"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-black tracking-widest text-pink-500 uppercase">
              CONNECT
            </h4>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/jssmmil/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text-primary)] hover:text-pink-500 hover:bg-pink-500/15 hover:border-pink-500/50 hover:scale-105 transition-all duration-150 shadow-2xs"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/microsoft-mobile-innovation-lab-mmil-7b78a7392/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text-primary)] hover:text-pink-500 hover:bg-pink-500/15 hover:border-pink-500/50 hover:scale-105 transition-all duration-150 shadow-2xs"
              >
                <LinkedinIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://github.com/mmil"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-[var(--text-primary)] hover:text-pink-500 hover:bg-pink-500/15 hover:border-pink-500/50 hover:scale-105 transition-all duration-150 shadow-2xs"
              >
                <GithubIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full border-t border-[var(--border)]/70 my-8" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[var(--text-secondary)]">
          <p className="flex items-center gap-1">
            © 2026 MMIL. Designed with by the MMIL Team.
          </p>
        </div>
      </div>
    </footer>
  );
}

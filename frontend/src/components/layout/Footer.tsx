"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme/theme";
import { usePathname } from "next/navigation";

export function Footer() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  
  return (
    <footer 
      className={`site-footer relative z-0 w-full mt-auto border-t border-[var(--footer-border)] bg-[var(--footer-bg)] ${theme === "dark" ? "footer-dark" : ""} ${isAdmin ? "md:pl-72 pb-16 md:pb-0" : ""}`.trim()}
    >
      <div 
        className="footer-inner max-w-[1400px] mx-auto relative flex flex-col md:flex-row items-center justify-between px-6 py-3 min-h-[52px] gap-4" 
      >
        {/* Left: Logo */}
        <div className="footer-logo flex items-center shrink-0">
          <Image src="/mmil-logo-new.png" alt="MMIL Logo" width={30} height={30} className="footer-logo-img" />
        </div>

        {/* Center: Exactly Centered across the whole viewport/footer */}
        <div className="footer-center text-center flex flex-col items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="footer-tagline text-xs font-medium text-[var(--text-primary)]">
            Empowering Innovation • Inspiring Creativity • Building the Future
          </div>
          <div className="footer-credit text-[11px] text-[var(--text-secondary)] mt-0.5">
            Designed with ❤️ by the MMIL Team
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="footer-right flex items-center shrink-0">
          <div className="footer-socials flex flex-wrap justify-center items-center gap-4 text-xs text-[var(--text-secondary)]">
            <a href="https://www.instagram.com/jssmmil/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--text-primary)] transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/in/microsoft-mobile-innovation-lab-mmil-7b78a7392/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--text-primary)] transition-colors">LinkedIn</a>
            <a href="https://github.com/mmil" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--text-primary)] transition-colors">GitHub</a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--text-primary)] transition-colors">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

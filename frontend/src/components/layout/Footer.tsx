"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme/theme";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer 
      className={`site-footer relative z-10 w-full mt-auto ${theme === "dark" ? "footer-dark" : ""}`.trim()}
    >
      <div 
        className="footer-inner max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between p-6 gap-6 md:gap-4" 
      >
        {/* Left: Logo (optional, mostly shown on standard layout) */}
        <div className="footer-logo flex items-center">
          <Image src="/mmil-logo-new.png" alt="MMIL Logo" width={36} height={36} className="footer-logo-img" />
        </div>

        {/* Center: Tagline */}
        <div className="footer-center text-center flex-1">
          <div className="footer-tagline text-sm md:text-base">
            Empowering Innovation • Inspiring Creativity • Building the Future
          </div>
          <div className="footer-credit text-xs md:text-sm mt-1">
            Designed with ❤️ by the MMIL Team
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="footer-right flex flex-col items-center md:items-end gap-2">
          <span className="footer-follow-label text-sm md:text-base">Follow Us</span>
          <div className="footer-socials flex flex-wrap justify-center gap-4">
            <a href="https://www.instagram.com/jssmmil/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/in/microsoft-mobile-innovation-lab-mmil-7b78a7392/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/mmil" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

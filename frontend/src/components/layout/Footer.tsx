"use client";

import Image from "next/image";
import { useTheme } from "@/lib/theme/theme";

export function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer 
      className={`site-footer ${theme === "dark" ? "footer-dark" : ""}`} 
      style={{ position: "relative", zIndex: 10, width: "100%", marginTop: "auto" }}
    >
      <div 
        className="footer-inner" 
        style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 2rem", flexWrap: "wrap", gap: "1rem" }}
      >
        {/* Left: Logo (optional, mostly shown on standard layout) */}
        <div className="footer-logo" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.png" alt="MMIL Logo" width={36} height={36} className="footer-logo-img" />
        </div>

        {/* Center: Tagline */}
        <div className="footer-center" style={{ textAlign: "center", flex: 1 }}>
          <div className="footer-tagline">
            Empowering Innovation • Inspiring Creativity • Building the Future
          </div>
          <div className="footer-credit">
            Designed with ❤️ by the MMIL Team
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="footer-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
          <span className="footer-follow-label">Follow Us</span>
          <div className="footer-socials" style={{ display: "flex", gap: "1rem" }}>
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

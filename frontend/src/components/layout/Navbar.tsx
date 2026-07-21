"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { isCoreTeam } from "@/lib/roles";
import { useState } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/lib/theme/theme";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Domains", href: "/domains" },
  { label: "Events", href: "/events" },
  { label: "Alumni", href: "/alumni" },
  { label: "Projects", href: "/projects" },
  { label: "Teams", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Resources", href: "/resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show navbar in admin, portal, or auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return pathname === href.split("#")[0];
    return pathname.startsWith(href);
  };

  const { theme } = useTheme();

  return (
    <>
      <nav className={`navbar ${theme === "dark" ? "navbar-glass" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image src="/logo.png" alt="MMIL Logo" width={32} height={32} className="navbar-logo-img" />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill ${isActive(item.href) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <ThemeToggle />
            
            {/* Desktop Auth */}
            <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isAuthenticated ? (
                <>
                  {isCoreTeam(user?.role) && (
                    <Link href="/admin/dashboard" className="nav-auth-btn">
                      Dashboard
                    </Link>
                  )}
                  {user?.role === "student" && (
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      Hi, {user.name?.split(" ")[0] || "Member"}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="nav-auth-btn"
                    title="Sign Out"
                    style={{ cursor: "pointer" }}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-auth-btn">
                    Sign In
                  </Link>
                  <Link href="/register" className="nav-auth-btn-filled">
                    Join Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
          <div className="mobile-menu">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`mobile-nav-pill ${isActive(item.href) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mobile-menu-actions">
              {isAuthenticated ? (
                <>
                  {isCoreTeam(user?.role) && (
                    <Link href="/admin/dashboard" onClick={closeMobileMenu} className="nav-auth-btn-filled" style={{ textAlign: "center", padding: "0.75rem" }}>
                      Admin Dashboard
                    </Link>
                  )}
                  <span style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Signed in as {user?.name || "Member"}
                  </span>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMobileMenu} className="nav-auth-btn" style={{ textAlign: "center", padding: "0.75rem" }}>
                    Sign In
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu} className="nav-auth-btn-filled" style={{ textAlign: "center", padding: "0.75rem" }}>
                    Join MMIL
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

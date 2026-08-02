"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, Home, Info, Layers, Calendar, GraduationCap, Briefcase, Users, Image as ImageIcon, Library, LogIn, UserPlus, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { isCoreTeam } from "@/lib/roles";
import { useState } from "react";
import Image from "next/image";
import GooeyNav from "@/components/GooeyNav";
import { useTheme } from "@/lib/theme/theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import OptionWheel from "@/components/OptionWheel";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Domains", href: "/domains", icon: Layers },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Alumni", href: "/alumni", icon: GraduationCap },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Team", href: "/team", icon: Users },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  // { label: "Resources", href: "/resources", icon: Library },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Don't show navbar in admin, portal, or auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal") || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return pathname === href.split("#")[0];
    return pathname.startsWith(href);
  };

  const dynamicNavItems = [
    ...navItems,
    ...(isAuthenticated
      ? [
        ...(isCoreTeam(user?.role) ? [{ label: "Admin", href: "/admin/dashboard", icon: LayoutDashboard }] : []),
        { label: "Sign Out", href: "#", icon: LogOut, onClick: (e: React.MouseEvent) => { e.preventDefault(); logout(); window.location.href = "/"; } }
      ]
      : [
        // { label: "Sign In", href: "/login", icon: LogIn },
        // { label: "Join Now", href: "/register", icon: UserPlus }
      ]),
    {
      label: "", // Remove text label so it looks clean like before
      href: "#theme",
      icon: theme === "dark" ? Sun : Moon,
      isAction: true, // This flag ensures GooeyNav doesn't assign the pill to this button!
      onClick: (e: React.MouseEvent) => { e.preventDefault(); toggleTheme(); }
    }
  ];

  return (
    <>
      <header>
        <div className="navbar">
          <div className="navbar-inner">
            {/* Mobile Hamburger (Anchored to Left) */}
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo + MMIL Wordmark (Centered Horizontally on Mobile) */}
            <Link href="/" className="navbar-logo">
              <Image src="/favicon.png" alt="MMIL Logo" width={28} height={28} className="navbar-logo-img" />
              <span className="navbar-logo-text font-black text-lg text-neutral-900 tracking-tight">
                MMIL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links">
              <GooeyNav
                items={dynamicNavItems}
                initialActiveIndex={Math.max(0, dynamicNavItems.findIndex(item => isActive(item.href)))}
              />
            </div>

            {/* Desktop Actions */}
            <div className="navbar-actions">
              <div className="desktop-only">
                <ThemeToggle />
              </div>

              {/* Desktop greeting for student */}
              {isAuthenticated && user?.role === "student" && (
                <span className="desktop-only" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "8px" }}>
                  Hi, {user.name?.split(" ")[0] || "Member"}
                </span>
              )}
            </div>

            {/* Mobile Spacer (Balances Hamburger on Right for Exact Center Alignment) */}
            <div className="navbar-spacer" />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
          <div className="mobile-menu" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0, justifyContent: 'space-between', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '350px' }}>
              <OptionWheel
                items={dynamicNavItems.map(item => ({
                  label: item.label,
                  icon: item.icon,
                  href: item.href,
                  onClick: (item as any).onClick
                })) as any}
                defaultSelected={Math.max(0, dynamicNavItems.findIndex(item => isActive(item.href)))}
                activeColor="#ffffff"
                textColor="rgba(255, 255, 255, 0.5)"
                side="left"
                fontSize={2.2}
                spacing={1.8}
                inset={40}
                loop={true}
                onChange={(idx: number) => {
                  const item = dynamicNavItems[idx];
                  if (!item) return;

                  if ((window as any).wheelNavTimer) {
                    clearTimeout((window as any).wheelNavTimer);
                  }

                  (window as any).wheelNavTimer = setTimeout(() => {
                    closeMobileMenu();
                    if ((item as any).onClick) {
                      (item as any).onClick({ preventDefault: () => { } });
                    } else if (item.href && item.href !== "#theme") {
                      window.location.href = item.href;
                    }
                  }, 800);
                }}
              />
            </div>

            {/* Relocated Dark Mode Toggle Row */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between z-50 bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white font-semibold text-sm">
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-300" />}
                <span>Dark Mode</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleTheme();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  theme === "dark" ? "bg-blue-600" : "bg-zinc-700"
                }`}
                aria-label="Toggle Dark Mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

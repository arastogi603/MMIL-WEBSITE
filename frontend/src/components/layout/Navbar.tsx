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
    // Theme toggle removed from here — it lives in the mobile menu panel now
  ];

  // Determine which logo to show based on viewport + theme
  // Desktop light mode: dark notch (#050505) → white text logo
  // Desktop dark mode: light notch (#F4EBE1) → dark text logo
  // Mobile: light top bar (#f4f4f6) → dark text logo
  // We use theme state for desktop; mobile always gets dark-text logo
  const desktopLogoSrc = theme === "dark" ? "/logo-light.png" : "/logo-dark.png";
  const mobileLogoSrc = "/logo-light.png";

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

            {/* Logo - single image, chosen by React state */}
            <Link href="/" className="navbar-logo">
              {/* Desktop logo (hidden on mobile via CSS) */}
              <Image
                src={desktopLogoSrc}
                alt="MMIL Logo"
                width={120}
                height={60}
                className="navbar-logo-img navbar-logo-desktop"
                priority
              />
              {/* Mobile logo (shown only on mobile via CSS) */}
              <Image
                src={mobileLogoSrc}
                alt="MMIL Logo"
                width={120}
                height={60}
                className="navbar-logo-img navbar-logo-mobile"
                priority
              />
              <span className="navbar-logo-text font-black text-xl text-neutral-900 tracking-tight">
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
          <div className="mobile-menu" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', padding: 0, paddingBottom: 'env(safe-area-inset-bottom, 20px)', justifyContent: 'space-between', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '350px' }}>
              {(() => {
                const mobileWheelItems = [
                  ...dynamicNavItems,
                  {
                    label: theme === "dark" ? "Light Mode" : "Dark Mode",
                    icon: theme === "dark" ? Sun : Moon,
                    href: "#theme",
                    onClick: (e: any) => { e?.preventDefault(); toggleTheme(); }
                  }
                ];

                return (
                  <OptionWheel
                    items={mobileWheelItems.map(item => ({
                      label: item.label,
                      icon: item.icon,
                      href: item.href,
                      onClick: (item as any).onClick
                    })) as any}
                    defaultSelected={Math.max(0, dynamicNavItems.findIndex(item => isActive(item.href)))}
                    activeColor={theme === "dark" ? "#ffffff" : "#111111"}
                    textColor={theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
                    side="left"
                    fontSize={2.2}
                    spacing={1.8}
                    inset={40}
                    loop={true}
                    onChange={(idx: number) => {
                      const item = mobileWheelItems[idx];
                      if (!item) return;

                      if ((window as any).wheelNavTimer) {
                        clearTimeout((window as any).wheelNavTimer);
                      }

                      (window as any).wheelNavTimer = setTimeout(() => {
                        if (item.href === "#theme") {
                          toggleTheme();
                          // Keep menu open when toggling theme
                          return;
                        }

                        closeMobileMenu();
                        if ((item as any).onClick) {
                          (item as any).onClick({ preventDefault: () => { } });
                        } else if (item.href) {
                          window.location.href = item.href;
                        }
                      }, 800);
                    }}
                  />
                );
              })()}
            </div>
          </div>
        </>
      )}
    </>
  );
}

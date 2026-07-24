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
  { label: "Teams", href: "/team", icon: Users },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Resources", href: "/resources", icon: Library },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const dynamicNavItems = [
    ...navItems,
    ...(isAuthenticated
      ? [
          ...(isCoreTeam(user?.role) ? [{ label: "Admin", href: "/admin/dashboard", icon: LayoutDashboard }] : []),
          { label: "Sign Out", href: "#", icon: LogOut, onClick: (e: React.MouseEvent) => { e.preventDefault(); logout(); window.location.href = "/"; } }
        ]
      : [
          { label: "Sign In", href: "/login", icon: LogIn },
          { label: "Join Now", href: "/register", icon: UserPlus }
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
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image src="/mmil-logo-new.png" alt="MMIL Logo" width={32} height={32} className="navbar-logo-img" />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <GooeyNav 
               items={dynamicNavItems} 
               initialActiveIndex={Math.max(0, dynamicNavItems.findIndex(item => isActive(item.href)))} 
            />
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            
            <div className="mobile-only">
              <ThemeToggle />
            </div>

            {/* Desktop greeting for student */}
            {isAuthenticated && user?.role === "student" && (
              <span className="desktop-only" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginLeft: "8px" }}>
                Hi, {user.name?.split(" ")[0] || "Member"}
              </span>
            )}

            {/* Mobile Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
          <div className="mobile-menu" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0, justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
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
                      (item as any).onClick({ preventDefault: () => {} });
                    } else if (item.href && item.href !== "#theme") {
                      window.location.href = item.href;
                    }
                  }, 800);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

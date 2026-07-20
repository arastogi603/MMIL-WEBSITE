"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Home, Calendar, Users, Briefcase, FileCode2, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { isCoreTeam } from "@/lib/roles";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastYPos, setLastYPos] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Keep navbar visible during the entire animation zone (0–5000px).
    // Only start hiding on scroll-down once the bento section appears.
    if (latest < 5000) {
      setHidden(false);
    } else if (latest > lastYPos) {
      // Scrolling down past the animation → hide
      setHidden(true);
    } else {
      // Scrolling up → show
      setHidden(false);
    }
    setLastYPos(latest);
  });

  // Don't show navbar in admin, portal, or auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.nav 
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50"
      >
        
        {/* Spatial UI: Layered depth shadows behind the navbar */}
        <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-[1.05] pointer-events-none" />

        <div className="relative bg-white/70 backdrop-blur-md md:backdrop-blur-3xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.08),0_12px_48px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/60 px-4 md:px-6 py-2 overflow-hidden">
          {/* Top highlight edge — spatial light reflection */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
          {/* Bottom subtle shadow edge */}
          <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent" />
          
          <div className="flex items-center justify-between relative z-10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="MMIL Logo" width={36} height={36} className="w-8 h-8 md:w-9 md:h-9 rounded object-contain" />
              <span className="text-sm font-black tracking-tight text-[#111] uppercase leading-tight">MMIL</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className={`px-5 py-2 text-sm font-black tracking-[0.05em] uppercase rounded-full transition-all ${pathname === '/' ? 'bg-white/80 shadow-sm text-[#111]' : 'text-neutral-700 hover:bg-white/40'}`}>
                Home
              </Link>
              <Link href="/about" className={`px-5 py-2 text-sm font-black tracking-[0.05em] uppercase rounded-full transition-all ${pathname.startsWith('/about') ? 'bg-white/80 shadow-sm text-[#111]' : 'text-neutral-700 hover:bg-white/40'}`}>
                About
              </Link>
              <Link href="/events" className={`px-5 py-2 text-sm font-black tracking-[0.05em] uppercase rounded-full transition-all ${pathname.startsWith('/events') ? 'bg-white/80 shadow-sm text-[#111]' : 'text-neutral-700 hover:bg-white/40'}`}>
                Events
              </Link>
              <Link href="/projects" className={`px-5 py-2 text-sm font-black tracking-[0.05em] uppercase rounded-full transition-all ${pathname.startsWith('/projects') ? 'bg-white/80 shadow-sm text-[#111]' : 'text-neutral-700 hover:bg-white/40'}`}>
                Projects
              </Link>
              <Link href="/team" className={`px-5 py-2 text-sm font-black tracking-[0.05em] uppercase rounded-full transition-all ${pathname.startsWith('/team') ? 'bg-white/80 shadow-sm text-[#111]' : 'text-neutral-700 hover:bg-white/40'}`}>
                Teams
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {isCoreTeam(user?.role) && (
                    <Link href="/admin/dashboard" className="px-5 py-2 text-sm font-bold rounded-xl bg-black/5 text-[#111] hover:bg-black/10 transition-colors border border-black/5">
                      Dashboard
                    </Link>
                  )}
                  {user?.role === 'student' && (
                    <div className="text-sm font-semibold text-neutral-600">
                      Hi, {user.name?.split(' ')[0] || 'Member'}
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="p-2 rounded-xl bg-black/5 text-neutral-600 hover:text-[#111] hover:bg-black/10 transition-colors border border-black/5"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold text-neutral-600 hover:text-[#111] transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-5 py-2 text-sm font-bold rounded-xl bg-[#111] text-white hover:bg-black/80 transition-colors">
                    Join Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden items-center gap-4">
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="p-2 rounded-xl bg-black/5 text-neutral-600 border border-black/5"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-black/5 text-neutral-600 border border-black/5"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden"
          >
            <div className="bg-white/90 backdrop-blur-md md:backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-white">
              <div className="flex flex-col gap-2 mb-6">
                <Link href="/" onClick={closeMobileMenu} className={`px-5 py-4 text-sm font-black tracking-[0.05em] uppercase rounded-2xl transition-all ${pathname === '/' ? 'bg-black/5 text-[#111]' : 'text-neutral-700 hover:bg-black/5'}`}>
                  Home
                </Link>
                <Link href="/about" onClick={closeMobileMenu} className={`px-5 py-4 text-sm font-black tracking-[0.05em] uppercase rounded-2xl transition-all ${pathname.startsWith('/about') ? 'bg-black/5 text-[#111]' : 'text-neutral-700 hover:bg-black/5'}`}>
                  About
                </Link>
                <Link href="/events" onClick={closeMobileMenu} className={`px-5 py-4 text-sm font-black tracking-[0.05em] uppercase rounded-2xl transition-all ${pathname.startsWith('/events') ? 'bg-black/5 text-[#111]' : 'text-neutral-700 hover:bg-black/5'}`}>
                  Events
                </Link>
                <Link href="/projects" onClick={closeMobileMenu} className={`px-5 py-4 text-sm font-black tracking-[0.05em] uppercase rounded-2xl transition-all ${pathname.startsWith('/projects') ? 'bg-black/5 text-[#111]' : 'text-neutral-700 hover:bg-black/5'}`}>
                  Projects
                </Link>
                <Link href="/team" onClick={closeMobileMenu} className={`px-5 py-4 text-sm font-black tracking-[0.05em] uppercase rounded-2xl transition-all ${pathname.startsWith('/team') ? 'bg-black/5 text-[#111]' : 'text-neutral-700 hover:bg-black/5'}`}>
                  Teams
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="pt-6 border-t border-black/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {isCoreTeam(user?.role) && (
                      <Link href="/admin/dashboard" onClick={closeMobileMenu} className="w-full text-center px-5 py-4 text-sm font-bold rounded-2xl bg-black/5 text-[#111] hover:bg-black/10 border border-black/5">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="text-center text-sm font-semibold text-neutral-600 mt-2">
                      Signed in as {user?.name || 'Member'}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu} className="w-full text-center px-5 py-4 text-sm font-bold rounded-2xl bg-black/5 text-[#111] hover:bg-black/10 border border-black/5">
                      Sign In
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu} className="w-full text-center px-5 py-4 text-sm font-bold rounded-2xl bg-[#111] text-white hover:bg-black border border-black">
                      Join MMIL
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

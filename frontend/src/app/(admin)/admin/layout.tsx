"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FolderKanban, Calendar, UserPlus, Settings, LogOut, Code, Shield, Home, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') window.location.href = "/login";
    }
  }, [isAuthenticated]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  };

  if (!mounted) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Role Management", href: "/admin/roles", icon: Shield },
    { name: "Project Reviews", href: "/admin/projects", icon: FolderKanban },
    { name: "Event Management", href: "/admin/events", icon: Calendar },
    { name: "Recruitment", href: "/admin/recruitment", icon: UserPlus },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ee] text-[#111] flex font-['Outfit']">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white/60 backdrop-blur-2xl border-r border-black/5 flex-col hidden md:flex fixed h-full z-10 shadow-[inset_-1px_0_0_rgba(255,255,255,0.8)]">
        <div className="h-20 flex items-center px-8 border-b border-black/5">
          <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-3 text-[#111]">
            <div className="w-9 h-9 rounded-xl bg-[#111] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Code className="w-4 h-4 text-white" />
            </div>
            Admin Portal
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-semibold ${
                  isActive 
                    ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)]" 
                    : "text-neutral-500 hover:bg-black/5 hover:text-[#111]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#111] flex items-center justify-center font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-bold truncate max-w-[140px] text-[#111]">{user?.name || "Admin"}</p>
              <p className="text-xs text-neutral-400 capitalize font-medium">{user?.role || "admin"}</p>
            </div>
          </div>
          <Link 
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 mb-1.5 text-neutral-500 hover:bg-black/5 hover:text-[#111] rounded-2xl transition-colors text-sm font-semibold"
          >
            <Home className="w-5 h-5" />
            Public Site
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors text-sm font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-2xl border-b border-black/5 flex items-center justify-between px-5 z-30 shadow-sm">
        <Link href="/" className="font-black flex items-center gap-2.5 text-[#111]">
          <div className="w-8 h-8 rounded-xl bg-[#111] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <Code className="w-3.5 h-3.5 text-white" />
          </div>
          Admin
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-[#111] active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white/80 backdrop-blur-3xl border-r border-black/5 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="h-16 flex items-center px-6 border-b border-black/5">
                <span className="text-lg font-black text-[#111]">Navigation</span>
              </div>
              <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-semibold ${
                        isActive 
                          ? "bg-[#111] text-white shadow-[0_4px_15px_rgba(0,0,0,0.15)]" 
                          : "text-neutral-500 hover:bg-black/5 hover:text-[#111]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="p-3 border-t border-black/5">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#111] flex items-center justify-center font-bold text-white">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111]">{user?.name || "Admin"}</p>
                    <p className="text-xs text-neutral-400 capitalize">{user?.role || "admin"}</p>
                  </div>
                </div>
                <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-black/5 rounded-2xl text-sm font-semibold">
                  <Home className="w-5 h-5" /> Public Site
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-500 hover:bg-red-50 hover:text-red-500 rounded-2xl text-sm font-semibold">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 relative min-h-screen flex flex-col">
        <div className="flex-1 p-4 pt-20 md:pt-4 sm:p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

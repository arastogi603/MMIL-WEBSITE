"use client";

import { motion } from "framer-motion";
import { Users, CalendarPlus, CheckCircle, Code, ArrowRight, FolderKanban, UserPlus, Zap } from "lucide-react";
import Link from "next/link";
import { withRoleGuard } from "@/components/auth/RoleGuard";
import { dashboardApi } from "@/lib/api/dashboard";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    pendingProjects: 0,
    activeEvents: 0,
    totalMembers: 0,
    serverStatus: 'Online'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(data => {
        if (data) setStats(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = [
    { title: "Pending Projects", value: isLoading ? "..." : stats.pendingProjects, icon: FolderKanban, gradient: "from-blue-500 to-cyan-400" },
    { title: "Active Events", value: isLoading ? "..." : stats.activeEvents, icon: CalendarPlus, gradient: "from-emerald-500 to-green-400" },
    { title: "Total Members", value: isLoading ? "..." : stats.totalMembers, icon: Users, gradient: "from-purple-500 to-pink-400" },
    { title: "Server Status", value: isLoading ? "..." : stats.serverStatus, icon: Zap, gradient: "from-amber-500 to-orange-400" }
  ];

  return (
    <div className="font-['Outfit']">
      <header className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black text-[#111] tracking-tight"
        >
          Command Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-neutral-500 mt-1 font-medium"
        >
          Manage platform operations and approve student submissions.
        </motion.p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/70 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#111]">{stat.value}</h3>
              <p className="text-neutral-400 text-xs md:text-sm font-semibold mt-1 uppercase tracking-wider">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Link href="/admin/events" className="block bg-white/70 backdrop-blur-xl p-7 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-md">
                <CalendarPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#111]">Create New Event</h3>
            </div>
            <p className="text-neutral-500 font-medium mb-6">Draft and publish hackathons or workshops to the public site.</p>
            <div className="flex items-center gap-2 text-[#111] font-bold text-sm group-hover:gap-3 transition-all">
              <span>Open Event Builder</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/admin/projects" className="block bg-white/70 backdrop-blur-xl p-7 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#111]">Review Projects ({isLoading ? "..." : stats.pendingProjects})</h3>
            </div>
            <p className="text-neutral-500 font-medium mb-6">Approve student project submissions so they appear on the public showcase.</p>
            <div className="flex items-center gap-2 text-[#111] font-bold text-sm group-hover:gap-3 transition-all">
              <span>Open Review Queue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Link href="/admin/recruitment" className="block bg-white/70 backdrop-blur-xl p-7 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-md">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#111]">Recruitment</h3>
            </div>
            <p className="text-neutral-500 font-medium mb-6">Manage recruitment cycles and review candidate applications.</p>
            <div className="flex items-center gap-2 text-[#111] font-bold text-sm group-hover:gap-3 transition-all">
              <span>View Applications</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default withRoleGuard(AdminDashboard, ["admin", "core-team"]);

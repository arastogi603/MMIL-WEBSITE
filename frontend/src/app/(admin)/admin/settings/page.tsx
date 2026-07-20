"use client";

import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-['Outfit']">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-20 h-20 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center justify-center mx-auto mb-6">
          <Settings className="w-10 h-10 text-neutral-300" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#111] tracking-tight mb-3">Platform Settings</h1>
        <p className="text-neutral-400 font-medium">Admin configuration settings coming soon.</p>
      </motion.div>
    </div>
  );
}

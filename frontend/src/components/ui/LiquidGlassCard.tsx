"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  status?: "ongoing" | "completed";
}

export function LiquidGlassCard({ children, className = "", onClick, status }: LiquidGlassCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.3)] transition-colors duration-300 cursor-pointer ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--hover-glow, rgba(255,255,255,0.15)), transparent 40%)`,
        }}
      />
      
      {/* Liquid overlay effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
      
      {status === "completed" && (
        <div className="absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full bg-black/5 dark:bg-black/40 backdrop-blur-md border border-black/10 dark:border-white/10 text-[var(--text-primary)] text-[10px] uppercase tracking-widest font-medium shadow-sm dark:shadow-lg">
          Already Finished
        </div>
      )}

      {children}
    </motion.div>
  );
}

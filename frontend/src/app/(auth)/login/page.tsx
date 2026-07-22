"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";
import { isCoreTeam } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-redirect if they try to access /login while already logged in (like hitting the back button)
    if (isAuthenticated && user) {
      if (isCoreTeam(user.role)) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!mounted || isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the Spring Boot backend
      const res = await apiClient.post("/auth/login", { email, password });
      
      // The backend returns { token, user: { id, name, email, role } }
      const { token, user } = res.data;
      
      // Save to Zustand global state
      setAuth(token, user);
      
      // Redirect based on role
      if (isCoreTeam(user.role)) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-['Outfit']">
      
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10">
        <Link href="/" className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md z-50">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in to your MMIL member portal to manage events, projects, and recruitment.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <Link href="/reset-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-400 text-sm">
            Don't have an account? <Link href="/register" className="text-white font-semibold hover:underline">Register here</Link>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Decorative */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] border-l border-white/5 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 glassmorphism p-12 rounded-3xl border border-white/10 max-w-lg">
          <Code className="w-12 h-12 text-blue-400 mb-6" />
          <h2 className="text-3xl font-bold mb-4">The tech society that builds.</h2>
          <p className="text-slate-400 text-lg">Join a community of developers, designers, and innovators pushing the boundaries of what's possible on campus.</p>
        </div>
      </div>
      
    </div>
  );
}

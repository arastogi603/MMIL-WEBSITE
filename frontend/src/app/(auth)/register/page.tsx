"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { apiClient } from "@/lib/api/client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.post("/auth/signup", { name, email, password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-['Outfit'] transition-colors duration-300 relative overflow-hidden text-[var(--text-primary)]"
      style={{ backgroundImage: 'var(--page-bg-img)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* Back Button */}
      <Link href="/" className="absolute top-4 left-4 sm:top-10 sm:left-10 flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[var(--card-border)] backdrop-blur-md z-50 shadow-[0_4px_12px_var(--shadow-color)] hover:shadow-[0_4px_20px_var(--shadow-color)]">
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
        className="w-full max-w-lg relative z-10 my-16 sm:my-12"
      >
        {/* Spatial UI / Liquid Glass Box */}
        <div className="glassmorphism rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-3xl sm:rounded-[2.5rem]" />
          
          {/* Animated Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500 rounded-full blur-[60px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500 rounded-full blur-[60px] pointer-events-none" 
          />

          <div className="relative z-10">
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.h1 variants={itemVariants} className="text-2xl sm:text-4xl font-extrabold mb-1.5 sm:mb-2 tracking-tight text-center">Join MMIL</motion.h1>
              <motion.p variants={itemVariants} className="text-[var(--text-secondary)] mb-6 sm:mb-8 text-center text-xs sm:text-base font-medium">Create your account to register for hackathons and track your certificates.</motion.p>

              {isSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[2rem] bg-[var(--card-hover-bg)] border border-green-500/30 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center mb-6 text-2xl font-bold shadow-inner">✓</div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Registration Successful!</h3>
                  <p className="text-[var(--text-secondary)] font-medium">You can now login with your credentials. Redirecting...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium shadow-inner">
                      {error}
                    </motion.div>
                  )}
                  
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-purple-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]"
                      placeholder="John Doe"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">University Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-purple-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]"
                      placeholder="you@college.edu"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-purple-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)] pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">Confirm</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-purple-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)] pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.div>
                </form>
              )}

              <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center text-[var(--text-secondary)] text-xs sm:text-sm font-medium">
                Already have an account? <Link href="/login" className="text-[var(--text-primary)] font-bold hover:underline transition-colors">Sign in here</Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

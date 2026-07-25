"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code, ArrowRight, ArrowLeft, Mail, KeyRound, Lock, CheckCircle2 } from "lucide-react";
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

type Step = "EMAIL" | "OTP" | "RESET" | "SUCCESS";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/forgot-password", { email });
      setStep("OTP");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value !== "" && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const verifyOtpAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }
    setError("");
    setStep("RESET");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/reset-password", {
        email,
        otp: otp.join(""),
        newPassword
      });
      setStep("SUCCESS");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. OTP might be invalid or expired.");
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
      <Link href="/login" className="absolute top-4 left-4 sm:top-10 sm:left-10 flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group bg-[var(--card-bg)] hover:bg-[var(--card-hover-bg)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[var(--card-border)] backdrop-blur-md z-50 shadow-[0_4px_12px_var(--shadow-color)] hover:shadow-[0_4px_20px_var(--shadow-color)]">
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Login</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // smooth spring
        className="w-full max-w-md relative z-10 my-16 sm:my-0"
      >
        {/* Spatial UI / Liquid Glass Box */}
        <div className="glassmorphism rounded-[2.5rem] p-6 sm:p-12 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_12px_40px_var(--shadow-color),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-2xl relative overflow-hidden">
          
          {/* Subtle gradient highlights for liquid glass feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)] to-transparent opacity-10 pointer-events-none rounded-[2.5rem]" />
          
          {/* Animated Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500 rounded-full blur-[60px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500 rounded-full blur-[60px] pointer-events-none" 
          />

          <div className="relative z-10">
            <motion.div variants={containerVariants} initial="hidden" animate="show">
              
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-10">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-[1.25rem] bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.05)] transform transition-transform hover:scale-105">
                    <Code className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 sm:mb-2 tracking-tight text-center">
                  {step === "EMAIL" && "Forgot Password"}
                  {step === "OTP" && "Enter OTP"}
                  {step === "RESET" && "Reset Password"}
                  {step === "SUCCESS" && "Password Reset!"}
                </h1>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm font-medium">
                  {step === "EMAIL" && "Enter your email and we'll send a code to reset it."}
                  {step === "OTP" && `We've sent a 4-digit code to ${email}`}
                  {step === "RESET" && "Enter your new password below."}
                  {step === "SUCCESS" && "Your password has been successfully reset. Redirecting..."}
                </p>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="p-3.5 mb-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium shadow-inner"
                >
                  {error}
                </motion.div>
              )}

              {step === "EMAIL" && (
                <motion.form variants={itemVariants} onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full pl-12 pr-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-blue-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)] disabled:opacity-50 disabled:hover:scale-100 mt-2"
                  >
                    {isLoading ? "Sending..." : "Send Reset Code"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </motion.form>
              )}

              {step === "OTP" && (
                <motion.form variants={itemVariants} onSubmit={verifyOtpAndProceed} className="space-y-6">
                  <div className="flex justify-center gap-2 sm:gap-4 w-full">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 sm:w-16 sm:h-16 text-center text-lg sm:text-2xl font-black bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl sm:rounded-2xl text-[var(--text-primary)] focus:outline-none focus:border-blue-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)] flex-1 max-w-[64px]"
                      />
                    ))}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)]"
                  >
                    Verify Code
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("EMAIL")}
                    className="w-full text-center text-[11px] sm:text-xs font-bold text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
                  >
                    Use a different email
                  </button>
                </motion.form>
              )}

              {step === "RESET" && (
                <motion.form variants={itemVariants} onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full pl-12 pr-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-blue-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] mb-1.5 sm:mb-2 pl-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[var(--text-secondary)] group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full pl-12 pr-6 py-3.5 sm:py-4 text-sm sm:text-base text-[var(--text-primary)] focus:outline-none focus:border-blue-500 focus:bg-[var(--card-hover-bg)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)]"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm sm:text-base font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)] disabled:opacity-50 disabled:hover:scale-100 mt-2"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </motion.form>
              )}

              {step === "SUCCESS" && (
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center space-y-6 pt-4">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <Link
                    href="/login"
                    className="w-full py-3.5 sm:py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm sm:text-base font-bold flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)]"
                  >
                    Back to Login
                  </Link>
                </motion.div>
              )}

            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

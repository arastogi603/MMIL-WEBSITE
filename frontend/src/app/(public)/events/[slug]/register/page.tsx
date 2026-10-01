"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, MapPin, Check } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth.store";
import { useTheme } from "@/lib/theme/theme";
import dynamic from 'next/dynamic';

const JellyRadio = dynamic<any>(() => import('@/components/JellyRadio'), { ssr: false });
const FolderFloat = dynamic<any>(() => import('@/components/FolderFloat'), { ssr: false });
const CodeSlots = dynamic<any>(() => import('@/components/CodeSlots'), { ssr: false });
import toast from "react-hot-toast";

export default function RegisterFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { isAuthenticated, user } = useAuthStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [event, setEvent] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    apiClient.get(`/events/${resolvedParams.slug}`).then((res) => {
      setEvent(res.data);
      if (res.data.formSchema) {
        try {
          const parsed = JSON.parse(res.data.formSchema);
          setSchema(parsed);
          
          // Pre-populate user name/email if logged in and field exists
          if (user) {
            const initialAnswers: Record<string, any> = {};
            parsed.fields?.forEach((f: any) => {
              const labelLower = (f.label || "").toLowerCase();
              if ((labelLower.includes("name") || labelLower === "full name") && user.name) {
                initialAnswers[f.label] = user.name;
              }
              if ((labelLower.includes("email") || labelLower === "email address") && user.email) {
                initialAnswers[f.label] = user.email;
              }
            });
            if (Object.keys(initialAnswers).length > 0) {
              setAnswers((prev) => ({ ...initialAnswers, ...prev }));
            }
          }
        } catch (e) {
          console.error("Failed to parse form schema", e);
          setSchema({ header: { title: "Error", description: "Form schema is invalid" }, fields: [] });
        }
      } else {
        // Fallback schema if none is provided
        setSchema({
          header: {
            title: `Register for ${res.data.title}`,
            description: "Please fill in the details below to register."
          },
          fields: [
            { label: "Full Name", type: "text", required: true },
            { label: "Email Address", type: "text", required: true },
            { label: "Phone Number", type: "text", required: true }
          ]
        });
        
        // Pre-populate if logged in
        if (user) {
           setAnswers((prev) => ({
             ...prev,
             "Full Name": user.name || "",
             "Email Address": user.email || ""
           }));
        }
      }
    }).catch(err => {
      console.error(err);
      setError("Failed to fetch event data.");
      setEvent({ title: "Error" });
      setSchema({ header: { title: "Error" }, fields: [] });
    });
  }, [resolvedParams.slug, mounted, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields
    if (schema?.fields) {
      for (const f of schema.fields) {
        if (f.required && f.type !== 'image') {
          const val = answers[f.label];
          if (val === undefined || val === null || String(val).trim() === '') {
            const errorMsg = `Please fill in the required field: "${f.label}"`;
            setError(errorMsg);
            toast.error(errorMsg);
            window.scrollTo({ top: 120, behavior: 'smooth' });
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/events/${resolvedParams.slug}/register`, { 
        formAnswers: JSON.stringify(answers) 
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        router.push('/');
      }, 10000);
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Registration failed. Please check your answers and try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsSubmitting(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  if (!event || !schema) {
    return (
      <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-36 pb-24 flex items-center justify-center font-['Outfit']">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 p-8 rounded-[2rem] bg-white/70 dark:bg-[#0c1820]/75 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-xl"
        >
          <div className="w-10 h-10 border-3 border-neutral-300 dark:border-neutral-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-neutral-600 dark:text-neutral-300 font-semibold text-sm tracking-wide">
            Loading registration form...
          </p>
        </motion.div>
      </main>
    );
  }

  const coverImageUrl = schema.header?.coverUrl || event.posterUrl;

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-32 sm:pt-36 pb-24 relative font-['Outfit']">
      {/* Ambient background glow & shapes matching the rest of the site */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[120px]" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-teal-500/10 dark:bg-teal-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Top Header Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-[2.5rem] p-7 sm:p-10 relative overflow-hidden bg-white/70 dark:bg-[#0c1820]/75 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              >
                {/* Gradient Accent Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                {/* Event meta tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {event.type && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {event.type}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/5">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight">
                  {schema.header?.title || `Register for ${event.title}`}
                </h1>

                {schema.header?.description && (
                  <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {schema.header.description}
                  </p>
                )}

                <div className="mt-6 pt-5 border-t border-black/5 dark:border-white/10 flex items-center justify-between flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Required fields marked with *
                  </div>

                  {user && (
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      Filling as <span className="text-neutral-900 dark:text-white font-bold">{user.name || user.email}</span>
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Cover / Poster Image — Fits perfectly without being cropped */}
              {coverImageUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-[2.5rem] overflow-hidden p-2 sm:p-3 bg-white/70 dark:bg-[#0c1820]/75 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex items-center justify-center"
                >
                  <img 
                    src={coverImageUrl} 
                    alt="Event Banner" 
                    className="w-full h-auto max-h-[500px] object-contain rounded-[2rem]" 
                  />
                </motion.div>
              )}

              {/* Error Banner */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold text-sm shadow-sm"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                  <p className="flex-1">{error}</p>
                </motion.div>
              )}

              {/* Form Fields Container */}
              <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
                {schema.fields?.map((f: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.04) }}
                    key={f.id || idx} 
                    className="rounded-[2.5rem] p-7 sm:p-9 bg-white/70 dark:bg-[#0c1820]/75 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-black/20 dark:hover:border-white/20"
                  >
                    <label className="block font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2 leading-snug">
                      {f.label} {f.required && <span className="text-red-500 ml-1 font-black">*</span>}
                    </label>

                    {f.description && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed font-medium">
                        {f.description}
                      </p>
                    )}

                    {!f.description && <div className="mb-4" />}
                    
                    {/* Standalone Image Type */}
                    {f.type === 'image' ? (
                      <div className="w-full flex justify-center p-2 rounded-2xl bg-black/[0.02] dark:bg-black/20 border border-black/5 dark:border-white/5">
                        <img 
                          src={f.imageUrl} 
                          alt={f.label} 
                          className="max-w-full max-h-[420px] object-contain rounded-xl" 
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        {/* Reference Image inside question */}
                        {f.imageUrl && (
                          <div className="mb-6 p-2 rounded-2xl bg-black/[0.02] dark:bg-black/20 border border-black/5 dark:border-white/5 flex justify-center">
                            <img 
                              src={f.imageUrl} 
                              alt="Reference" 
                              className="max-w-full max-h-[360px] object-contain rounded-xl" 
                            />
                          </div>
                        )}
                    
                        {/* 1. Text Input */}
                        {f.type === 'text' && (
                          <div className="relative group z-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-[2rem] blur-md opacity-0 group-hover:opacity-30 group-focus-within:opacity-100 transition duration-500 group-focus-within:duration-200" />
                            <motion.input 
                              whileTap={{ scale: 0.995 }}
                              required={f.required} 
                              type="text" 
                              value={answers[f.label] || ""}
                              placeholder="Type your answer here..." 
                              onChange={e => setAnswers({...answers, [f.label]: e.target.value})} 
                              className="relative w-full px-7 py-5 rounded-[1.8rem] bg-white/90 dark:bg-[#0c1820]/90 backdrop-blur-sm border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all duration-300 font-semibold text-lg shadow-inner"
                            />
                          </div>
                        )}

                        {/* 2. Number Input (Interactive CodeSlots with 5-slot rows) */}
                        {f.type === 'number' && (
                          <div className="pt-2">
                            <div className="py-2 flex items-center justify-start">
                              <CodeSlots 
                                length={10} 
                                slotsPerRow={5}
                                value={answers[f.label] || ""}
                                slotColor={isDark ? "#162834" : "#f1f5f9"}
                                digitColor={isDark ? "#ffffff" : "#0f172a"}
                                accentColor={isDark ? "#38bdf8" : "#2563eb"}
                                inkColor={isDark ? "#ffffff" : "#0f172a"}
                                onChange={(val: string) => setAnswers({...answers, [f.label]: val})} 
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* 3. Textarea Input */}
                        {f.type === 'textarea' && (
                          <div className="relative group z-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-[2rem] blur-md opacity-0 group-hover:opacity-30 group-focus-within:opacity-100 transition duration-500 group-focus-within:duration-200" />
                            <motion.textarea 
                              whileTap={{ scale: 0.995 }}
                              required={f.required} 
                              value={answers[f.label] || ""}
                              placeholder="Write your answer in detail..." 
                              rows={4}
                              onChange={e => setAnswers({...answers, [f.label]: e.target.value})} 
                              className="relative w-full px-7 py-5 rounded-[1.8rem] bg-white/90 dark:bg-[#0c1820]/90 backdrop-blur-sm border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all duration-300 font-semibold text-lg min-h-[160px] resize-y shadow-inner"
                            />
                          </div>
                        )}

                        {/* 4. Dropdown (Interactive FolderFloat) */}
                        {f.type === 'dropdown' && (
                          <div className="relative w-full z-40 min-h-[180px] flex items-center justify-center p-4 rounded-2xl bg-black/[0.02] dark:bg-black/20 border border-black/5 dark:border-white/5">
                            <FolderFloat 
                              items={f.options || []} 
                              label="Select Option"
                              sublabel={answers[f.label] ? `Selected: ${answers[f.label]}` : 'Click to open options'}
                              trigger="click"
                              closeOnSelect={true}
                              onSelect={(val: string) => setAnswers({...answers, [f.label]: val})}
                              folderColor={isDark ? "#1e293b" : "#cbd5e1"}
                              frontColor={isDark ? "#334155" : "#94a3b8"}
                              paperColor={isDark ? "#0f172a" : "#ffffff"}
                              itemColor={isDark ? "#1e293b" : "#f1f5f9"}
                              itemTextColor={isDark ? "#f8fafc" : "#0f172a"}
                              labelColor={isDark ? "#f8fafc" : "#0f172a"}
                            />
                          </div>
                        )}

                        {/* 5. Checkbox / Choices (JellyRadio) */}
                        {f.type === 'checkbox' && (
                          <div className="w-full overflow-x-auto py-2">
                            <JellyRadio 
                              items={f.options || []} 
                              value={answers[f.label]}
                              onChange={(val: string) => setAnswers({...answers, [f.label]: val})}
                              chipColor={isDark ? "#162834" : "#f1f5f9"}
                              textColor={isDark ? "#94a3b8" : "#64748b"}
                              activeColor={isDark ? "#38bdf8" : "#2563eb"}
                              activeTextColor="#ffffff"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Submit & Clear Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
                >
                  <button 
                    disabled={isSubmitting} 
                    type="submit" 
                    className="relative group w-full sm:w-auto transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-60 blur-lg group-hover:opacity-100 transition duration-300 group-hover:duration-200" />
                    <div className="relative w-full px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-[2rem] font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 transform group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { 
                      setAnswers({}); 
                      setError(null); 
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold text-sm transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset form
                  </button>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
              className="rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden bg-white/70 dark:bg-[#0c1820]/75 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.2 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 bg-emerald-500/10 border-2 border-emerald-500/20 shadow-inner"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-black mb-4 text-neutral-900 dark:text-white tracking-tight">
                Registration Successful!
              </h2>

              <p className="text-base sm:text-lg max-w-md mx-auto leading-relaxed text-neutral-600 dark:text-neutral-300">
                You have successfully registered for <span className="font-bold text-neutral-900 dark:text-white">{event.title}</span>. We are excited to have you join us!
              </p>

              <div className="mt-8 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 inline-block">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 animate-pulse">
                  Redirecting to homepage in a moment...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

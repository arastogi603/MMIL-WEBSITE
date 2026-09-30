"use client";

import { useState, useEffect, use, useMemo } from "react";
import { ArrowLeft, Download, Search, Eye, X, AlertCircle, RefreshCw, Users, AlertTriangle, GraduationCap, Copy, Filter, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicationsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "DUPLICATES" | "FIRST" | "SECOND" | "THIRD" | "FOURTH">("ALL");

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/events/${resolvedParams.slug}/applications`);
      setApps(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [resolvedParams.slug]);

  // Helper to parse JSON answers
  const parseAnswers = (raw: any): Record<string, any> => {
    if (!raw) return {};
    if (typeof raw === "object") return raw;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return { raw: String(raw) };
    }
  };

  // Helper to get display name, email, roll no, year
  const getDisplayDetails = (app: any) => {
    const answers = parseAnswers(app.formAnswers);
    let name = app.userName;
    let email = app.userEmail;
    let rollNo = "";
    let yearOfStudy = "";

    // Search keys in answers
    for (const [k, v] of Object.entries(answers)) {
      const key = k.toLowerCase().replace(/[^a-z0-9]/g, "");
      const valStr = String(v || "").trim();

      // Name lookup
      if ((!name || name === "Guest") && (key.includes("name") || key === "fullname")) {
        name = valStr;
      }

      // Email lookup
      if ((!email || email === "Guest") && (key.includes("email") || key.includes("mail"))) {
        email = valStr;
      }

      // Roll number lookup
      if (!rollNo && (key.includes("roll") || key.includes("urn") || key.includes("studentno") || key.includes("admissionno") || key.includes("regno"))) {
        rollNo = valStr;
      }

      // Year of study lookup
      if (!yearOfStudy && (key.includes("year") || key.includes("class") || key.includes("semester"))) {
        yearOfStudy = valStr;
      }
    }

    // Classify Year Normalized: FIRST | SECOND | THIRD | FOURTH | OTHER
    const yUpper = yearOfStudy.toUpperCase();
    let normalizedYear: "FIRST" | "SECOND" | "THIRD" | "FOURTH" | "OTHER" = "OTHER";
    if (yUpper.includes("FIRST") || yUpper.includes("1ST") || yUpper === "1") {
      normalizedYear = "FIRST";
    } else if (yUpper.includes("SECOND") || yUpper.includes("2ND") || yUpper === "2") {
      normalizedYear = "SECOND";
    } else if (yUpper.includes("THIRD") || yUpper.includes("3RD") || yUpper === "3") {
      normalizedYear = "THIRD";
    } else if (yUpper.includes("FOURTH") || yUpper.includes("4TH") || yUpper === "4") {
      normalizedYear = "FOURTH";
    }

    return { 
      name: name || "Guest", 
      email: email || "N/A", 
      rollNo: rollNo || "", 
      yearOfStudy: yearOfStudy || "Not specified",
      normalizedYear,
      answers 
    };
  };

  // Compute Statistics & Duplicate Recognition
  const stats = useMemo(() => {
    const total = apps.length;
    const rollCountMap: Record<string, number> = {};
    const emailCountMap: Record<string, number> = {};
    const yearCounts = { FIRST: 0, SECOND: 0, THIRD: 0, FOURTH: 0, OTHER: 0 };

    apps.forEach((app) => {
      const { email, rollNo, normalizedYear } = getDisplayDetails(app);
      
      // Count roll numbers (if present)
      if (rollNo) {
        const cleanRoll = rollNo.toUpperCase().trim();
        rollCountMap[cleanRoll] = (rollCountMap[cleanRoll] || 0) + 1;
      }

      // Count emails
      if (email && email !== "Guest" && email !== "N/A") {
        const cleanEmail = email.toLowerCase().trim();
        emailCountMap[cleanEmail] = (emailCountMap[cleanEmail] || 0) + 1;
      }

      // Count Year
      yearCounts[normalizedYear] = (yearCounts[normalizedYear] || 0) + 1;
    });

    // Check duplicate count
    let duplicateEntries = 0;
    const duplicateRolls = new Set<string>();
    Object.entries(rollCountMap).forEach(([roll, count]) => {
      if (count > 1) {
        duplicateRolls.add(roll);
        duplicateEntries += count;
      }
    });

    const uniqueRollCount = Object.keys(rollCountMap).length;

    return {
      total,
      duplicateRolls,
      duplicateEntries,
      uniqueParticipants: total - (duplicateEntries > 0 ? duplicateEntries - duplicateRolls.size : 0),
      yearCounts
    };
  }, [apps]);

  // Check if an application is a duplicate
  const isAppDuplicate = (app: any) => {
    const { rollNo } = getDisplayDetails(app);
    if (!rollNo) return false;
    return stats.duplicateRolls.has(rollNo.toUpperCase().trim());
  };

  // Filter applications by search and active filter
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const { name, email, rollNo, answers, normalizedYear } = getDisplayDetails(app);
      const isDup = isAppDuplicate(app);

      // Category filter
      if (activeFilter === "DUPLICATES" && !isDup) return false;
      if (activeFilter === "FIRST" && normalizedYear !== "FIRST") return false;
      if (activeFilter === "SECOND" && normalizedYear !== "SECOND") return false;
      if (activeFilter === "THIRD" && normalizedYear !== "THIRD") return false;
      if (activeFilter === "FOURTH" && normalizedYear !== "FOURTH") return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (name.toLowerCase().includes(q)) return true;
        if (email.toLowerCase().includes(q)) return true;
        if (rollNo.toLowerCase().includes(q)) return true;
        if (JSON.stringify(answers).toLowerCase().includes(q)) return true;
        return false;
      }

      return true;
    });
  }, [apps, activeFilter, searchQuery, stats]);

  // Export to CSV
  const handleExportCSV = () => {
    if (apps.length === 0) return;

    // Collect all unique field keys across all responses
    const allAnswerKeys = new Set<string>();
    apps.forEach((app) => {
      const answers = parseAnswers(app.formAnswers);
      Object.keys(answers).forEach((k) => allAnswerKeys.add(k));
    });
    const customKeys = Array.from(allAnswerKeys);

    const headers = ["ID", "Name", "Email", "Roll No", "Year of Study", "Is Duplicate", "Registered At", ...customKeys];
    
    const rows = apps.map((app) => {
      const { name, email, rollNo, yearOfStudy, answers } = getDisplayDetails(app);
      const isDup = isAppDuplicate(app) ? "YES" : "NO";
      const date = app.registeredAt ? new Date(app.registeredAt).toISOString() : "";
      const customValues = customKeys.map((k) => {
        const val = answers[k];
        if (val === undefined || val === null) return "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [
        `"${app.id || ""}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${rollNo.replace(/"/g, '""')}"`,
        `"${yearOfStudy.replace(/"/g, '""')}"`,
        `"${isDup}"`,
        `"${date}"`,
        ...customValues
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${resolvedParams.slug}-registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-['Outfit'] pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/events"
            className="p-2.5 bg-white/80 hover:bg-white text-neutral-700 rounded-2xl border border-black/5 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900">Event Registrations</h1>
            <p className="text-sm text-neutral-500 font-medium">Event: <span className="font-bold text-neutral-700">{resolvedParams.slug}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="p-3 bg-white/80 hover:bg-white text-neutral-700 rounded-2xl border border-black/5 shadow-sm transition-all flex items-center justify-center"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={apps.length === 0}
            className="px-5 py-2.5 bg-[#111] hover:bg-black text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV ({apps.length})
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Total Registrations */}
        <div className="p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Total Registrations</p>
            <h3 className="text-3xl font-black text-neutral-900">{stats.total}</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              ~{stats.uniqueParticipants} unique participants
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Duplicates by Roll No */}
        <div 
          onClick={() => setActiveFilter(activeFilter === "DUPLICATES" ? "ALL" : "DUPLICATES")}
          className={`p-6 rounded-[2rem] backdrop-blur-xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
            activeFilter === "DUPLICATES"
              ? "bg-amber-100/90 border-amber-300 ring-2 ring-amber-400"
              : "bg-white/80 border-white hover:bg-amber-50/50"
          }`}
        >
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Duplicate Roll Nos</span>
              {stats.duplicateEntries > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </p>
            <h3 className="text-3xl font-black text-amber-900">{stats.duplicateEntries}</h3>
            <p className="text-xs text-amber-700 font-medium mt-1">
              {stats.duplicateRolls.size} repeated roll numbers (Click to filter)
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Copy className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Year of Study Breakdown */}
        <div className="p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Year of Study</p>
            <GraduationCap className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <button
              onClick={() => setActiveFilter(activeFilter === "FIRST" ? "ALL" : "FIRST")}
              className={`p-2 rounded-xl transition-all ${
                activeFilter === "FIRST" ? "bg-indigo-600 text-white shadow-sm font-bold" : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-75">1st Yr</div>
              <div className="text-base font-black">{stats.yearCounts.FIRST}</div>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "SECOND" ? "ALL" : "SECOND")}
              className={`p-2 rounded-xl transition-all ${
                activeFilter === "SECOND" ? "bg-teal-600 text-white shadow-sm font-bold" : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-75">2nd Yr</div>
              <div className="text-base font-black">{stats.yearCounts.SECOND}</div>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "THIRD" ? "ALL" : "THIRD")}
              className={`p-2 rounded-xl transition-all ${
                activeFilter === "THIRD" ? "bg-purple-600 text-white shadow-sm font-bold" : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-75">3rd Yr</div>
              <div className="text-base font-black">{stats.yearCounts.THIRD}</div>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === "FOURTH" ? "ALL" : "FOURTH")}
              className={`p-2 rounded-xl transition-all ${
                activeFilter === "FOURTH" ? "bg-pink-600 text-white shadow-sm font-bold" : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-75">4th Yr</div>
              <div className="text-base font-black">{stats.yearCounts.FOURTH}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, roll number, or answers..."
            className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-black/5 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 text-neutral-800 placeholder:text-neutral-400 font-medium"
          />
        </div>

        {/* Quick Filter Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All (${apps.length})` },
            { id: "DUPLICATES", label: `Duplicates (${stats.duplicateEntries})` },
            { id: "FIRST", label: `1st (${stats.yearCounts.FIRST})` },
            { id: "SECOND", label: `2nd (${stats.yearCounts.SECOND})` },
            { id: "THIRD", label: `3rd (${stats.yearCounts.THIRD})` },
            { id: "FOURTH", label: `4th (${stats.yearCounts.FOURTH})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white/80 hover:bg-white text-neutral-600 border border-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-red-700">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{error}</p>
          </div>
          <button
            onClick={fetchApplications}
            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-neutral-400 font-bold uppercase tracking-wider border-b border-black/5">
                <th className="p-4">Applicant</th>
                <th className="p-4">Roll No / Contact</th>
                <th className="p-4">Year of Study</th>
                <th className="p-4">Answers Preview</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                      <div className="w-7 h-7 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
                      <p className="text-sm font-medium">Loading registrations...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-400 font-medium">
                    {searchQuery || activeFilter !== "ALL"
                      ? "No applications matched your filter/search criteria."
                      : "No registrations recorded yet for this event."}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const { name, email, rollNo, yearOfStudy, normalizedYear, answers } = getDisplayDetails(app);
                  const isDup = isAppDuplicate(app);
                  const answerEntries = Object.entries(answers);

                  return (
                    <tr
                      key={app.id}
                      className={`border-b border-black/5 last:border-0 transition-colors ${
                        isDup ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-neutral-900 flex items-center gap-2">
                          {name}
                          {app.userName === "Guest" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 uppercase">
                              Guest
                            </span>
                          )}
                        </div>
                        {isDup && (
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Duplicate Submission
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {rollNo ? (
                          <div className="font-mono text-xs font-bold text-neutral-900 mb-0.5">
                            Roll: {rollNo}
                          </div>
                        ) : null}
                        <div className="text-neutral-500 font-medium text-xs">
                          {email}
                        </div>
                      </td>
                      <td className="p-4">
                        {normalizedYear !== "OTHER" ? (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                              normalizedYear === "FIRST"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : normalizedYear === "SECOND"
                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                : normalizedYear === "THIRD"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-pink-50 text-pink-700 border border-pink-200"
                            }`}
                          >
                            {normalizedYear} YEAR
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 font-medium">
                            {yearOfStudy}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm max-w-xs">
                        {answerEntries.length === 0 ? (
                          <span className="text-neutral-400 italic text-xs">No custom fields</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {answerEntries.slice(0, 2).map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-block max-w-[180px] truncate px-2.5 py-1 bg-neutral-100/80 rounded-lg text-xs font-medium text-neutral-700"
                              >
                                <span className="font-semibold text-neutral-900">{k}:</span> {String(v)}
                              </span>
                            ))}
                            {answerEntries.length > 2 && (
                              <span className="px-2 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-500">
                                +{answerEntries.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-neutral-500 whitespace-nowrap font-medium">
                        {app.registeredAt
                          ? new Date(app.registeredAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-black/10 max-w-lg w-full p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/5">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Application Details</h3>
                  <p className="text-xs text-neutral-500 font-medium">ID: {selectedApp.id}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-black/5 rounded-full text-neutral-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-4 space-y-4 flex-1">
                {(() => {
                  const { name, email, rollNo, yearOfStudy, normalizedYear, answers } = getDisplayDetails(selectedApp);
                  const isDup = isAppDuplicate(selectedApp);

                  return (
                    <>
                      {isDup && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="font-bold">Duplicate Submission Detected</p>
                            <p className="text-xs text-amber-700">Another registration was found with the same roll number: {rollNo || "N/A"}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-2xl">
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase">Applicant</p>
                          <p className="text-sm font-bold text-neutral-800">{name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase">Email</p>
                          <p className="text-sm font-bold text-neutral-800 break-all">{email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase">Roll Number</p>
                          <p className="text-sm font-bold text-neutral-800">{rollNo || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase">Year of Study</p>
                          <p className="text-sm font-bold text-neutral-800">{yearOfStudy || normalizedYear}</p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-neutral-200/60">
                          <p className="text-xs font-bold text-neutral-400 uppercase">Submission Time</p>
                          <p className="text-sm font-medium text-neutral-700">
                            {selectedApp.registeredAt
                              ? new Date(selectedApp.registeredAt).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-neutral-800 mb-3">All Submitted Form Answers</h4>
                        {Object.keys(answers).length === 0 ? (
                          <p className="text-xs text-neutral-400 italic p-4 bg-neutral-50 rounded-xl">
                            No custom form answers submitted.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {Object.entries(answers).map(([key, value]) => (
                              <div
                                key={key}
                                className="p-3.5 bg-neutral-50 rounded-xl border border-black/5"
                              >
                                <p className="text-xs font-bold text-neutral-500 uppercase mb-1">
                                  {key}
                                </p>
                                <p className="text-sm font-semibold text-neutral-800 whitespace-pre-wrap">
                                  {String(value)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="pt-4 border-t border-black/5 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

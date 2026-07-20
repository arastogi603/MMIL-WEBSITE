"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Award, CheckCircle, XCircle, Search } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function CertificateVerificationPage() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function verifyCert() {
      try {
        // Fetch from backend
        const res = await apiClient.get(`/certificates/verify/${certificateId}`);
        setCertificate(res.data);
      } catch (err) {
        // Fallback for UI purposes if backend isn't up
        if (certificateId === "MMIL-2026-ABCD") {
          setCertificate({
            id: "MMIL-2026-ABCD",
            certificateType: "Winner - 1st Place",
            issueDescription: "For securing 1st place in the Generative AI Hackathon 2026.",
            issuedAt: new Date().toISOString(),
            userId: "student-123",
            eventId: "hack-2026"
          });
        } else {
          setIsError(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (certificateId) {
      verifyCert();
    }
  }, [certificateId]);

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative font-['Outfit']">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-10 left-10 font-bold text-xl tracking-tight text-white z-10">
        MMIL.
      </Link>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-white/5 border border-white/10 rounded-full mx-auto flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Certificate Verification</h1>
          <p className="text-slate-400">Verifying credential ID: <span className="text-white font-mono">{certificateId}</span></p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glassmorphism p-10 rounded-3xl border border-red-500/30 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Invalid Certificate</h2>
            <p className="text-slate-400 mb-8">We could not find a certificate matching this ID in our records. Please check the ID and try again.</p>
            <Link href="/" className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-semibold">
              Return Home
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glassmorphism p-10 rounded-3xl border border-green-500/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
              <h2 className="text-3xl font-bold text-white mb-2">Verified Credential</h2>
              <p className="text-green-400 font-semibold bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20">Official Document</p>
            </div>

            <div className="space-y-6 bg-[#0a0a0a]/50 p-6 rounded-2xl border border-white/5">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Award Type</p>
                <p className="text-xl font-bold text-white">{certificate.certificateType}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Description</p>
                <p className="text-white text-lg">{certificate.issueDescription}</p>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Date of Issue</p>
                  <p className="text-white font-medium">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Credential ID</p>
                  <p className="text-white font-mono bg-white/5 px-2 py-1 rounded border border-white/10">{certificate.id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

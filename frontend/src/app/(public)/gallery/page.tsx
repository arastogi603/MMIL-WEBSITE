"use client";

import React, { useEffect, useState } from "react";
import DomeGallery from "@/components/DomeGallery";
import { useTheme } from "@/lib/theme/theme";

export default function GalleryPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const placeholders = [
    { src: "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop", alt: "Gallery Image 1" },
    { src: "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop", alt: "Gallery Image 2" },
    { src: "https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop", alt: "Gallery Image 3" },
    { src: "https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop", alt: "Gallery Image 4" },
    { src: "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop", alt: "Gallery Image 5" },
    { src: "https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop", alt: "Gallery Image 6" },
  ];

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#040E12", // Same color palette for both modes
      color: "#ffffff",
      paddingTop: "100px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ maxWidth: "1200px", width: "100%", padding: "0 2rem", textAlign: "center" }}>
        <h1 style={{
          fontFamily: "var(--font-josefin)",
          fontSize: "clamp(3rem, 8vw, 5rem)",
          fontWeight: 900,
          marginBottom: "1rem",
          textTransform: "uppercase"
        }}>
          Gallery
        </h1>
        <p style={{
          fontFamily: "var(--font-script), cursive",
          fontSize: "1.5rem",
          color: "#aaaaaa",
          marginBottom: "3rem"
        }}>
          Explore our memorable moments
        </p>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1400px",
        height: "clamp(450px, 85vh, 900px)",
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        margin: "0 auto",
        padding: "2rem",
        ...(theme === "dark" ? {
          // Black color just like the navbar
          background: "#050505",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
        } : {
          // Warm color just opposite of what nav bar is
          background: "#F4EBE1",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 10px 30px rgba(244, 235, 225, 0.15)"
        })
      }}>
        <DomeGallery images={placeholders} grayscale={false} segments={25} fit={0.65} />
      </div>
      
      <div style={{ height: "100px" }}></div>
    </div>
  );
}

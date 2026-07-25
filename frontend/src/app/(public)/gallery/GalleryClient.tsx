"use client";

import React, { useEffect, useState } from "react";
import DomeGallery from "@/components/DomeGallery";
import { useTheme } from "@/lib/theme/theme";

interface GalleryClientProps {
  imageUrls: string[];
}

export default function GalleryClient({ imageUrls }: GalleryClientProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Format images for the DomeGallery component
  const images = imageUrls.map(url => ({ src: url, alt: "Gallery Image" }));
  
  // Dynamically calculate the number of segments based on how many photos there are.
  // The DomeGallery puts 5 photos per segment column.
  // We want to make sure the dome is large enough to comfortably fit all photos!
  const calculatedSegments = Math.max(25, Math.ceil(images.length / 3) + 5);

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
          background: "#050505",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
        } : {
          background: "#F4EBE1",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 10px 30px rgba(244, 235, 225, 0.15)"
        })
      }}>
        <DomeGallery 
          images={images} 
          grayscale={false} 
          segments={calculatedSegments} 
          fit={0.65} 
        />
      </div>
      
      <div style={{ height: "100px" }}></div>
    </div>
  );
}

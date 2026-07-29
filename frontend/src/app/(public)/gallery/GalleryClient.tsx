"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface GalleryClientProps {
  imageUrls: string[];
}

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=1200&auto=format&fit=crop",
];

// Pre-computed deterministic tilt seed generator (-5deg to +5deg)
const getTiltSeed = (index: number): number => {
  const sinVal = Math.sin((index + 1) * 12.9898);
  return Number((sinVal * 5.0).toFixed(1));
};

// Pre-computed deterministic vertical offset (-20px to +20px)
const getOffsetY = (index: number): number => {
  const cosVal = Math.cos((index + 1) * 17.234);
  return Number((cosVal * 20.0).toFixed(0));
};

// 3 Size Tiers for scattered collage effect
type SizeTier = "small" | "medium" | "large";
const getSizeTier = (index: number): SizeTier => {
  const rem = index % 5;
  if (rem === 0 || rem === 3) return "large";
  if (rem === 1 || rem === 4) return "medium";
  return "small";
};

/* ----------------------------------------------------
   Tile Image with URL Encoding, Skeleton Shimmer & Fallback
---------------------------------------------------- */
function GalleryTileImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Safely URL-encode local image paths containing spaces or special characters
  const safeSrc = useMemo(() => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return encodeURI(src);
  }, [src]);

  if (hasError || !safeSrc) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 select-none p-4 text-center">
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-mono text-zinc-500">MMIL Photo</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse z-10" />
      )}
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 380px, 420px"
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </>
  );
}

export default function GalleryClient({ imageUrls }: GalleryClientProps) {
  const images = useMemo(() => {
    return imageUrls && imageUrls.length > 0 ? imageUrls : DEFAULT_FALLBACK_IMAGES;
  }, [imageUrls]);

  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const bandRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Group images into horizontal row-bands (3 photos per band)
  const bands = useMemo(() => {
    const itemsPerBand = 3;
    const result: { url: string; globalIndex: number }[][] = [];
    for (let i = 0; i < images.length; i += itemsPerBand) {
      result.push(
        images.slice(i, i + itemsPerBand).map((url, idx) => ({
          url,
          globalIndex: i + idx,
        }))
      );
    }
    return result;
  }, [images]);

  // Lightbox slides mapping (safely URL-encoded)
  const slides = useMemo(() => {
    return images.map((url, i) => ({
      src: url.startsWith("http") ? url : encodeURI(url),
      alt: `MMIL Gallery Photo ${i + 1}`,
    }));
  }, [images]);

  /* ----------------------------------------------------
     Viewport Band-by-Band GSAP Batch Reveal Animation
  ---------------------------------------------------- */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    bandRefs.current.forEach((bandEl) => {
      if (!bandEl) return;

      const cardEls = Array.from(bandEl.querySelectorAll(".scatter-card")) as HTMLDivElement[];
      if (cardEls.length === 0) return;

      // Initial hidden state
      gsap.set(cardEls, {
        opacity: 0,
        y: 40,
        scale: 0.9,
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Trigger stagger reveal when band enters viewport
              gsap.to(cardEls, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
                onComplete: () => {
                  cardEls.forEach((el) => {
                    el.style.willChange = "auto";
                  });
                },
              });

              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(bandEl);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [bands.length]);

  return (
    <main className="min-h-screen text-[var(--text-primary)] bg-transparent pt-32 md:pt-40 pb-28 relative font-['Outfit'] select-none">
      {/* Custom Styles for yet-another-react-lightbox Polish */}
      <style jsx global>{`
        .yarl__container {
          background-color: rgba(5, 15, 20, 0.96) !important;
          backdrop-filter: blur(20px);
          --yarl__color_button: #ffffff;
          --yarl__color_button_active: #2563eb;
        }
        .yarl__thumbnails_track {
          gap: 8px !important;
        }
        .yarl__thumbnail {
          border-radius: 12px !important;
          opacity: 0.6 !important;
          transition: all 0.2s ease-out !important;
          overflow: hidden !important;
          border: 2px solid transparent !important;
        }
        .yarl__thumbnail_active {
          opacity: 1 !important;
          border-color: #2563eb !important;
          transform: scale(1.05);
        }
        .yarl__navigation_prev,
        .yarl__navigation_next {
          background: rgba(255, 255, 255, 0.12) !important;
          backdrop-filter: blur(8px);
          border-radius: 9999px !important;
          width: 48px !important;
          height: 48px !important;
          margin: 0 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s ease-out !important;
        }
        .yarl__navigation_prev:hover,
        .yarl__navigation_next:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          transform: scale(1.08);
        }
      `}</style>

      {/* ----------------------------------------------------
          PAGE HEADER
      ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-black tracking-tight text-[var(--text-primary)] mb-3 uppercase"
        >
          GALLERY
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-xl md:text-2xl text-[var(--text-secondary)] font-['Caveat'] font-medium max-w-2xl mx-auto"
        >
          A scattered collage of our memorable moments & highlights
        </motion.p>
      </div>

      {/* ----------------------------------------------------
          SCATTERED WALL COLLAGE (NORMAL PAGE SCROLL)
      ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col gap-12 sm:gap-16">
        {bands.map((band, bandIdx) => (
          <div
            key={`band-${bandIdx}`}
            ref={(el) => {
              bandRefs.current[bandIdx] = el;
            }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 min-h-[380px] sm:min-h-[460px] py-4"
          >
            {band.map(({ url, globalIndex }) => {
              const tier = getSizeTier(globalIndex);
              const tiltSeed = getTiltSeed(globalIndex);
              const offsetY = getOffsetY(globalIndex);

              // Dynamic dimensions based on 3 size tiers
              const sizeClasses =
                tier === "large"
                  ? "w-full sm:w-[380px] md:w-[420px] h-[340px] sm:h-[460px]"
                  : tier === "medium"
                  ? "w-full sm:w-[310px] md:w-[340px] h-[300px] sm:h-[400px]"
                  : "w-full sm:w-[250px] md:w-[270px] h-[260px] sm:h-[340px]";

              return (
                <div
                  key={`photo-${globalIndex}`}
                  onClick={() => setLightboxIndex(globalIndex)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.willChange = "transform";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.willChange = "auto";
                  }}
                  className={`scatter-card relative rounded-2xl p-2.5 sm:p-3 bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-md hover:shadow-2xl hover:scale-[1.03] backdrop-blur-md transition-all duration-300 cursor-pointer group ${sizeClasses}`}
                  style={{
                    transform: `translate3d(0, ${offsetY}px, 0) rotate(${tiltSeed}deg)`,
                  }}
                >
                  {/* Photo Frame */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-black/10">
                    <GalleryTileImage
                      src={url}
                      alt={`MMIL Gallery Photo ${globalIndex + 1}`}
                      priority={globalIndex < 4}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

                    {/* Index Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-mono tracking-wider">
                      #{`0${globalIndex + 1}`.slice(-2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------
          FULLSCREEN LIGHTBOX MODAL (YET-ANOTHER-REACT-LIGHTBOX)
      ---------------------------------------------------- */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        render={{
          slideHeader: () => (
            <div className="absolute top-4 left-5 text-white/90 text-sm font-mono tracking-widest font-bold z-50 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 select-none">
              {`0${lightboxIndex + 1}`.slice(-2)} / {`0${images.length}`.slice(-2)}
            </div>
          ),
        }}
      />
    </main>
  );
}

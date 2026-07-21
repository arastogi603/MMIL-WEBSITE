"use client";

import { useTheme } from "@/lib/theme/theme";

/**
 * Responsive background matching the Figma design exactly.
 * - Light mode: white bg + scattered light gray rounded-rect shapes
 * - Dark mode: deep teal (#040E12) bg + atmospheric gradient ellipses + glass rectangles
 *
 * All positions are converted from the 1440×1024 Figma artboard to percentages.
 */
export function BackgroundShapes() {
  const { theme } = useTheme();

  if (theme === "dark") {
    return <DarkBackground />;
  }

  return <LightBackground />;
}

/* ════════════════════════════════════════════════
   LIGHT MODE BACKGROUND
   ════════════════════════════════════════════════ */
function LightBackground() {
  return (
    <div className="background-shapes hidden md:block">
      {/* Scattered soft rounded-rect blocks matching Figma light mode */}
      <div className="bg-shape" style={{ top: "5%", left: "3%", width: 180, height: 140, transform: "rotate(8deg)" }} />
      <div className="bg-shape" style={{ top: "12%", left: "18%", width: 120, height: 100, transform: "rotate(-5deg)" }} />
      <div className="bg-shape" style={{ top: "22%", left: "8%", width: 90, height: 90, transform: "rotate(20deg)" }} />
      <div className="bg-shape" style={{ top: "3%", right: "5%", width: 160, height: 120, transform: "rotate(-8deg)" }} />
      <div className="bg-shape" style={{ top: "15%", right: "15%", width: 100, height: 100, transform: "rotate(12deg)" }} />
      <div className="bg-shape" style={{ top: "8%", right: "28%", width: 130, height: 110, transform: "rotate(-3deg)" }} />
      <div className="bg-shape" style={{ top: "35%", left: "25%", width: 140, height: 140, transform: "rotate(15deg)" }} />
      <div className="bg-shape" style={{ top: "40%", left: "45%", width: 160, height: 130, transform: "rotate(-10deg)" }} />
      <div className="bg-shape" style={{ top: "30%", right: "20%", width: 110, height: 110, transform: "rotate(25deg)" }} />
      <div className="bg-shape" style={{ top: "45%", right: "8%", width: 150, height: 120, transform: "rotate(-15deg)" }} />
      <div className="bg-shape" style={{ top: "50%", left: "5%", width: 130, height: 130, transform: "rotate(-12deg)" }} />
      <div className="bg-shape" style={{ top: "60%", left: "15%", width: 100, height: 80, transform: "rotate(8deg)" }} />
      <div className="bg-shape" style={{ bottom: "15%", left: "10%", width: 170, height: 140, transform: "rotate(-8deg)" }} />
      <div className="bg-shape" style={{ bottom: "8%", left: "30%", width: 120, height: 100, transform: "rotate(18deg)" }} />
      <div className="bg-shape" style={{ bottom: "20%", right: "10%", width: 180, height: 150, transform: "rotate(10deg)" }} />
      <div className="bg-shape" style={{ bottom: "5%", right: "25%", width: 100, height: 100, transform: "rotate(-20deg)" }} />
      <div className="bg-shape" style={{ bottom: "10%", left: "55%", width: 140, height: 110, transform: "rotate(5deg)" }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   DARK MODE BACKGROUND — exact Figma CSS
   All positions: percentage of 1440×1024 artboard
   ════════════════════════════════════════════════ */
function DarkBackground() {
  return (
    <div
      className="hidden md:block"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        background: "radial-gradient(50% 50% at 50% 50%, #3C708A 0%, #0F1015 100%)",
      }}
    >
      {/* Rectangle 62 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '22.95%', height: '32.28%', left: '9.72%', top: '13.28%', background: '#BFBFBF', opacity: 0.2, border: '3px solid #81D4FE', boxShadow: '10px 10px 10px #001019', borderRadius: '30px' }} />
      {/* Rectangle 63 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '5.56%', height: '7.81%', left: '6.88%', top: '45.51%', background: '#BFBFBF', opacity: 0.2, border: '3px solid #81D4FE', boxShadow: '10px 10px 10px #001019', borderRadius: '30px' }} />
      {/* Rectangle 72 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '5.56%', height: '7.81%', left: '106.25%', top: '37.70%', background: '#BFBFBF', opacity: 0.2, border: '3.5px solid rgba(0, 0, 0, 0.35)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 67 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '12.50%', height: '11.72%', left: '96.46%', top: '33.79%', background: '#BFBFBF', opacity: 0.2, border: '3.5px solid rgba(0, 0, 0, 0.35)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 69 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '12.50%', height: '20.02%', left: '66.81%', top: '25.49%', background: '#BFBFBF', opacity: 0.2, border: '3.5px solid rgba(0, 0, 0, 0.35)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 66 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '9.72%', height: '13.67%', left: '38.33%', top: '44.63%', background: 'rgba(191, 191, 191, 0.8)', opacity: 0.2, border: '2px solid rgba(116, 116, 116, 0.6)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 70 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '7.43%', height: '15.63%', left: '109.10%', top: '41.21%', background: '#BFBFBF', opacity: 0.2, border: '3.5px solid rgba(0, 0, 0, 0.35)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 64 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '11.11%', height: '15.63%', left: '29.93%', top: '45.51%', background: '#BFBFBF', opacity: 0.2, border: '3px solid #81D4FE', boxShadow: '10px 10px 10px #001019', borderRadius: '30px' }} />
      {/* Rectangle 71 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '11.11%', height: '15.63%', left: '86.81%', top: '73.14%', background: '#BFBFBF', opacity: 0.2, border: '3.5px solid rgba(0, 0, 0, 0.35)', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)', borderRadius: '30px' }} />
      {/* Rectangle 65 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '21.11%', height: '33.98%', left: '45.35%', top: '45.51%', background: '#BFBFBF', opacity: 0.2, border: '3px solid #81D4FE', boxShadow: '10px 10px 10px #001019', borderRadius: '30px', transform: 'rotate(-90deg)' }} />
      {/* Rectangle 68 */}
      <div style={{ boxSizing: 'border-box', position: 'absolute', width: '22.57%', height: '34.96%', left: '76.60%', top: '41.21%', background: '#BFBFBF', opacity: 0.2, border: '3px solid #81D4FE', boxShadow: '10px 10px 10px #001019', borderRadius: '30px' }} />

      {/* Noise & Texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}

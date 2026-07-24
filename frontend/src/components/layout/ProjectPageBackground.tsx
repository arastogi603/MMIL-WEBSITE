"use client";

import { useTheme } from "@/lib/theme/theme";

/**
 * Project page-specific background from Figma.
 * Similar to the main dark bg but with a different gradient
 * arrangement — larger bottom blue glow, slightly different glass rects.
 * This is a fixed background that sits behind the page content.
 */
export function ProjectPageBackground({ isVisible = true }: { isVisible?: boolean }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: isLight ? "var(--background)" : "#040E12",
        opacity: isVisible ? (isLight ? 0.3 : 1) : 0, // Fade out when not visible
        transition: "opacity 0.6s ease-in-out",
        willChange: "opacity",
      }}
    >
      {/* ── Polygon 5 — top-left blue glow ── */}
      <div
        style={{
          position: "absolute",
          width: "31.11%",
          height: "52.73%",
          left: "-6.53%",
          top: "-10.16%",
          background: "#60A5C7",
          opacity: 0.4,
          filter: "blur(50px)",
          borderRadius: "30%",
        }}
      />

      {/* ── Polygon 4 — top-right blue glow ── */}
      <div
        style={{
          position: "absolute",
          width: "25.06%",
          height: "40.63%",
          left: "51.25%",
          top: "-10.16%",
          background: "#60A5C7",
          opacity: 0.2,
          filter: "blur(50px)",
          borderRadius: "30%",
        }}
      />

      {/* ── Group 3722: Bottom gradient glow (opacity 0.6, blur 150px) ── */}
      <div
        style={{
          position: "absolute",
          width: "167.22%",
          height: "83.69%",
          left: "-23.82%",
          top: "58.69%",
          opacity: 0.6,
          filter: "blur(150px)",
        }}
      >
        {/* Ellipse 6 — dark teal base */}
        <div
          style={{
            position: "absolute",
            width: "94%",
            height: "75%",
            left: 0,
            top: 0,
            background: "#001019",
            transform: "matrix(-1, 0.01, -0.03, -1, 0, 0)",
            borderRadius: "50%",
          }}
        />

        {/* Ellipse 5 — medium teal */}
        <div
          style={{
            position: "absolute",
            width: "94%",
            height: "75%",
            left: "5.12%",
            top: "10.97%",
            background: "#002B40",
            transform: "matrix(-1, 0.01, -0.03, -1, 0, 0)",
            borderRadius: "50%",
          }}
        />

        {/* Ellipse 4 — bright teal */}
        <div
          style={{
            position: "absolute",
            width: "75.71%",
            height: "52.27%",
            left: "10.06%",
            top: "30.17%",
            background: "#1B5673",
            transform: "matrix(-1, 0.01, -0.03, -1, 0, 0)",
            borderRadius: "50%",
          }}
        />

        {/* Ellipse 3 — cyan glow */}
        <div
          style={{
            position: "absolute",
            width: "79.79%",
            height: "53.76%",
            left: "10.06%",
            top: "43.7%",
            background: "#81D4FE",
            transform: "matrix(-1, 0.01, -0.03, -1, 0, 0)",
            borderRadius: "50%",
          }}
        />

        {/* Ellipse 2 — white highlight */}
        <div
          style={{
            position: "absolute",
            width: "54.74%",
            height: "27.77%",
            left: "19.87%",
            top: "46.23%",
            background: "#FFFFFF",
            opacity: 0.1,
            transform: "matrix(-1, 0.01, -0.03, -1, 0, 0)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── Small scattered glows ── */}
      <div
        style={{
          position: "absolute",
          width: "6.46%",
          height: "9.86%",
          left: "85.14%",
          top: "14.55%",
          background: "#D9D9D9",
          opacity: 0.05,
          filter: "blur(35px)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "9.38%",
          height: "11.91%",
          left: "52.71%",
          top: "50.78%",
          background: "#D9D9D9",
          opacity: 0.05,
          filter: "blur(35px)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "2.85%",
          height: "4%",
          left: "8.26%",
          top: "47.36%",
          background: "#2C627D",
          opacity: 0.6,
          filter: "blur(35px)",
          borderRadius: "50%",
        }}
      />

      {/* ── Glass rectangles (right edge) ── */}
      <div
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          right: "-5%",
          top: "37.7%",
          background: "#BFBFBF",
          opacity: 0.2,
          border: "3.5px solid rgba(0, 0, 0, 0.35)",
          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.25)",
          borderRadius: 30,
          boxSizing: "border-box" as const,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 120,
          right: "-1.5%",
          top: "33.79%",
          background: "rgba(0, 0, 0, 0.68)",
          opacity: 0.05,
          border: "3.5px solid rgba(0, 0, 0, 0.35)",
          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.25)",
          borderRadius: 30,
          boxSizing: "border-box" as const,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 107,
          height: 160,
          right: "-9.3%",
          top: "41.21%",
          background: "#BFBFBF",
          opacity: 0.2,
          border: "3.5px solid rgba(0, 0, 0, 0.35)",
          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.25)",
          borderRadius: 30,
          boxSizing: "border-box" as const,
        }}
      />

      {/* ── Group 3812: Glass rectangles with teal borders (opacity 0.3) ── */}
      <div
        style={{
          position: "absolute",
          width: "92.29%",
          height: "84.96%",
          left: "5.69%",
          top: "8.89%",
          opacity: 0.3,
          filter: "drop-shadow(2px 2px 10px rgba(255, 255, 255, 0.25))",
        }}
      >
        {/* Rectangle 62 */}
        <div
          style={{
            position: "absolute",
            width: "24.87%",
            height: "38.05%",
            left: "9.26%",
            top: "15.06%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.05,
            border: "3px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 63 */}
        <div
          style={{
            position: "absolute",
            width: "6.02%",
            height: "9.2%",
            left: "6.17%",
            top: "53.1%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.05,
            border: "3px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 69 */}
        <div
          style={{
            position: "absolute",
            width: "13.54%",
            height: "23.56%",
            left: "87.21%",
            top: "10.46%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.1,
            border: "3.5px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 66 */}
        <div
          style={{
            position: "absolute",
            width: "10.53%",
            height: "16.09%",
            left: "50.41%",
            top: "10.46%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.1,
            border: "2px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 64 */}
        <div
          style={{
            position: "absolute",
            width: "12.03%",
            height: "18.39%",
            left: "17.42%",
            top: "80.52%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.05,
            border: "3px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 71 */}
        <div
          style={{
            position: "absolute",
            width: "12.03%",
            height: "18.39%",
            left: "69.68%",
            top: "92.07%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.1,
            border: "3.5px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
        {/* Rectangle 65 — rotated */}
        <div
          style={{
            position: "absolute",
            width: "22.87%",
            height: "40%",
            left: "42.59%",
            top: "57.13%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.05,
            border: "3px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
            transform: "rotate(-90deg)",
          }}
        />
        {/* Rectangle 68 */}
        <div
          style={{
            position: "absolute",
            width: "24.45%",
            height: "41.15%",
            left: "81.72%",
            top: "47.93%",
            background: "rgba(255, 255, 255, 0.5)",
            opacity: 0.1,
            border: "3px solid rgba(129, 212, 254, 0.5)",
            boxShadow: "10px 10px 10px #001019",
            borderRadius: 30,
            boxSizing: "border-box" as const,
          }}
        />
      </div>

      {/* ── Noise & Texture overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.1,
          mixBlendMode: "overlay" as const,
        }}
      />
    </div>
  );
}

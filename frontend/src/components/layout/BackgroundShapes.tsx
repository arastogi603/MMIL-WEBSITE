"use client";

import { useTheme } from "@/lib/theme/theme";

export function BackgroundShapes() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <img
        src={theme === "dark" ? "/bg-dark.svg" : "/bg-light.svg"}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}

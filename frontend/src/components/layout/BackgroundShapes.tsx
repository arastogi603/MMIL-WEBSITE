"use client";

import { useTheme } from "@/lib/theme/theme";
import Image from "next/image";

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
      <Image
        src={theme === "dark" ? "/bg-dark.png" : "/bg-light.svg"}
        alt="Background"
        fill
        priority
        quality={100}
        unoptimized
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}

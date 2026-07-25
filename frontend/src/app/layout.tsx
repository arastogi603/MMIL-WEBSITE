import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MMIL — Microsoft Mobile Innovation Lab",
  description: "The premier technical society at JSS Academy of Technical Education, dedicated to fostering innovation, collaboration, and continuous learning.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundShapes } from "@/components/layout/BackgroundShapes";
import { InitialLoader } from "@/components/layout/InitialLoader";
import { ThemeProvider } from "@/lib/theme/theme";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, geist.variable)}
      suppressHydrationWarning
    >
      <body 
        className="font-[family-name:var(--font-poppins)]"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <ThemeProvider>
          <InitialLoader />
          <BackgroundShapes />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

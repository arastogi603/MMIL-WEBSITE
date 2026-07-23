import type { Metadata } from "next";
import { Inter, Josefin_Sans, Geist_Mono, Bebas_Neue, Caveat, Geist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-script",
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

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, geistMono.variable, bebasNeue.variable, josefin.variable, caveat.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
import { BackgroundPattern } from "@/components/layout/BackgroundPattern";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111]">
        <BackgroundPattern />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

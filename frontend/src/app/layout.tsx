import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundShapes } from "@/components/layout/BackgroundShapes";
import { InitialLoader } from "@/components/layout/InitialLoader";
import { ThemeProvider } from "@/lib/theme/theme";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MMIL — Microsoft Mobile Innovation Lab",
  description: "The premier technical society of IT Department at JSS Academy of Technical Education, dedicated to fostering innovation, collaboration, and continuous learning.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={cn("h-full", "antialiased", poppins.variable, geist.variable, poppins.className, "font-sans")}
      suppressHydrationWarning
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} className={poppins.className}>
        <ThemeProvider>
          <AuthProvider>
            <InitialLoader />
            <BackgroundShapes />
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


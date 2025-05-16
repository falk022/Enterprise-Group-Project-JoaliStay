"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Exclude navbar and footer from dashboard pages
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isDashboard && <Navbar />}
        <div className={`flex-grow ${!isDashboard ? "pt-20" : ""}`}>
          {children}
        </div>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}

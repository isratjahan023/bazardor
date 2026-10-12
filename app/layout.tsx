import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Navbar from "../components/Navbar";
import PriceTicker from "../components/PriceTicker";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, দামের পরিবর্তন এবং বাজারভিত্তিক তথ্য এক নজরে।",
};

function NavbarSkeleton() {
  return (
    <div
      role="status"
      className="border-b border-[#e3ebe5] bg-[#fafcfb]"
    >
      <span className="sr-only">নেভিগেশন লোড হচ্ছে</span>

      <div className="mx-auto max-w-6xl animate-pulse px-4 py-4">
        <div className="h-10 w-40 rounded-lg bg-[#e3ebe5]" />
        <div className="mt-6 h-8 rounded-lg bg-[#e3ebe5]" />
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>

        <PriceTicker />

        <div className="flex-1">
          <Suspense
            fallback={
              <p role="status" className="px-4 py-10 text-center">
                পেজ লোড হচ্ছে…
              </p>
            }
          >
            {children}
          </Suspense>
        </div>

        <Footer />
      </body>
    </html>
  );
}
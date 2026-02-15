import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import ToastContainer from "@/components/ToastContainer";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AD Commerce Web",
  description: "Application for AD Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900`}
      >
        <Providers>
          <Suspense
            fallback={
              <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md h-16" />
            }
          >
            <Header />
          </Suspense>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}

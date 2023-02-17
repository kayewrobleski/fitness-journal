"use client";
// These styles apply to every route in the application
import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import Toaster from "@/components/toaster";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  variable: "--font-inter",
});

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children } : Props ) {
  return (
    <html lang="en">
      <body className={inter.variable}>
          <SessionProvider>
            <Toaster />
            {children}
          </SessionProvider>
      </body>
    </html>
  );
}

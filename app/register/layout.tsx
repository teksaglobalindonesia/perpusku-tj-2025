"use client";

import type { ReactNode } from "react";
import { Roboto, Urbanist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "@/app/globals.css";


const robotoFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const urbanistFont = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-urbanist",
});


export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">
        <main className="min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
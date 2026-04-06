import type { Metadata } from "next";
import { Roboto, Urbanist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

import Navbar from "@/components/custom/navbar";

export const metadata: Metadata = {
  title: "PerpusKU",
  description: "Web Administration",
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${robotoFont.variable} ${urbanistFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-gray-50 text-gray-900">
        <NextTopLoader showSpinner={false} height={3} />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}
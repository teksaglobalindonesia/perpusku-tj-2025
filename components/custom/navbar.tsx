"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NAV_ITEMS: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Book", href: "/buku" },
  { name: "Member", href: "/anggota" },
  { name: "Loan", href: "/peminjaman" },
  { name: "Return", href: "/pengembalian" },
  { name: "Logout", href: "/login" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
          Perpus<span className="text-gray-800">Ku</span>
        </h1>

        {/* Hamburger Button (Mobile) */}
        <button
          className="sm:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6 md:gap-8 text-sm font-medium text-gray-700">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 transition-colors ${
                  active
                    ? "text-blue-600"
                    : "hover:text-blue-600 text-gray-700"
                }`}
              >
                {item.name}
                <span
                  aria-hidden
                  className={`absolute left-0 right-0 -bottom-2 h-0.5 rounded-full transition-all ${
                    active
                      ? "bg-blue-600 scale-x-100"
                      : "bg-transparent scale-x-0"
                  }`}
                  style={{ transformOrigin: "left" }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 pb-4 gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

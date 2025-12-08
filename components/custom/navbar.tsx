"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_ITEMS: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname() || "/";

  // helper: apakah href aktif (cocokkan prefix agar /buku/123 juga tetap aktif)
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  return (
    <nav className="bg-white shadow-sm px-10 py-4 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-blue-600">Perpus<span className="text-2xl font-bold text-gray-800">Ku</span></h1>

      <div className="flex gap-8 text-sm font-medium text-gray-700">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 transition-colors ${
                active ? "text-blue-600" : "hover:text-blue-600 text-gray-700"
              }`}
            >
              <span>{item.name}</span>

              {/* animated underline */}
              <span
                aria-hidden
                className={`absolute left-0 right-0 -bottom-2 h-0.5 rounded-full transition-all ${
                  active ? "bg-blue-600 scale-x-100" : "bg-transparent"
                }`}
                style={{
                  transformOrigin: "left",
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

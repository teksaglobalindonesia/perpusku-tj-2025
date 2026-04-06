"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Book", href: "/buku" },
  { name: "Member", href: "/anggota" },
  { name: "Loan", href: "/peminjaman" },
  { name: "Return", href: "/pengembalian" },
  { name: "Logout", logout: true },
];

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cookieUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];
    if (cookieUser) setUser(JSON.parse(cookieUser));
    setHydrated(true); // client ready
  }, []);

  if (!hydrated) return null; // jangan render sebelum client ready

  const handleLogout = () => {
    document.cookie = `token=; path=/; max-age=0`;
    document.cookie = `user=; path=/; max-age=0`;
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
          Perpus<span className="text-gray-800">Ku</span>
        </h1>

        <div className="hidden sm:flex gap-6 md:gap-8 text-sm font-medium text-gray-700">
          {NAV_ITEMS.map((item) =>
            item.logout ? (
              <button
                key={item.name}
                onClick={handleLogout}
                className="py-1 text-red-600 hover:text-red-700 transition"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={`relative py-1 transition-colors ${
                  isActive(item.href!) ? "text-blue-600" : "hover:text-blue-600 text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
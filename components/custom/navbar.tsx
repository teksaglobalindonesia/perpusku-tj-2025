'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: 'Dashboard', href: '/' },
    { name: 'Buku', href: '/buku' },
    { name: 'Anggota', href: '/anggota' },
    { name: 'Peminjaman', href: '/peminjaman' },
    { name: 'Pengembalian', href: '/pengembalian' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#2b2540] shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <h2 className="text-2xl font-extrabold text-white">
          SIDU APP
        </h2>

        <button
          className="text-3xl text-white md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <ul className="hidden items-center gap-6 md:flex">
          {menu.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`transition ${
                  path === item.href
                    ? 'border-b-2 border-purple-400 pb-1 font-semibold text-purple-300'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div className="border-t border-purple-700 bg-[#2b2540] md:hidden">
          <ul className="flex flex-col gap-4 px-5 py-4">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block transition ${
                    path === item.href
                      ? 'font-semibold text-purple-300'
                      : 'text-white/80'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

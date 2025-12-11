'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const path = usePathname();

  const menu = [
    { name: 'Dashboard', href: '/' },
    { name: 'Buku', href: '/buku' },
    { name: 'Anggota', href: '/anggota' },
    { name: 'Peminjaman', href: '/peminjaman' },
    { name: 'Pengembalian', href: '/pengembalian' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-green-300 bg-[#DFF5E3]/80 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h2 className="text-3xl font-bold text-green-700">PerpusKu</h2>

        <ul className="flex items-center gap-6 font-medium text-green-700">
          {menu.map((item) => (
            <li key={item.name}>
              <Link
                className={`${
                  path === item.href
                    ? 'border-b-2 border-green-700 pb-1'
                    : 'opacity-80 hover:opacity-100'
                }`}
                href={item.href}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

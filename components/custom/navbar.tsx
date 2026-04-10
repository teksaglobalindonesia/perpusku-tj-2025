'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { logoutUser } from '@/lib/auth';

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    setMounted(true);

    const hasCookie = document.cookie.includes('token');
    setIsLogin(hasCookie);
  }, []);

  if (!mounted) return null;

  if (path === '/login') return null;

  if (path === '/register') return null;

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

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

        {/* BUTTON MENU MOBILE */}
        <button
          className="text-3xl text-green-700 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        {/* MENU DESKTOP */}
        <ul className="hidden items-center gap-6 font-medium text-green-700 md:flex">
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

          {/* 🔥 TAMBAHAN BUTTON LOGIN / LOGOUT */}
          {isLogin ? (
            <div className="ml-4 flex items-center gap-2">
              <Link href="/register">Register</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className="ml-4">
              Login
            </Link>
          )}
        </ul>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="border-t border-green-300 bg-[#DFF5E3] shadow-inner md:hidden">
          <ul className="flex flex-col gap-4 px-4 py-4 font-medium text-green-700">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block w-full ${
                    path === item.href
                      ? 'font-semibold text-green-800'
                      : 'opacity-80'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* MOBILE LOGIN / LOGOUT */}
            {isLogin ? (
              <>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

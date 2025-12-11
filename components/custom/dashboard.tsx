'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function DashboardContent() {
  const buku = [
    {
      judul: 'Narasi Perihal Ayah',
      kategori: 'Family Fiction',
      penulis: 'Jaquenza Eden',
      stok: 0,
      cover: '/images/narasi-perihal-ayah.jpeg'
    },
    {
      judul: 'Laut Bercerita',
      kategori: 'Historical Fiction',
      penulis: 'Leila S. Chudori',
      stok: 3,
      cover: '/images/laut-bercerita.jpg'
    },
    {
      judul: 'Bandung After Rain',
      kategori: 'Romance',
      penulis: 'Wulan Nur Amalia',
      stok: 5,
      cover: '/images/Bandung After Rain.jpeg'
    },
    {
      judul: 'Sisi Tergelap Surga',
      kategori: 'Fiksi',
      penulis: 'saya',
      stok: 5,
      cover: '/images/Sisi Tergelap Surga.jpeg'
    }
  ];

  const peminjaman = [
    {
      judul: 'Bandung After Rain',
      peminjam: 'Salsa',
      peminjaman: '9 Des 2025',
      pengembalian: '11 Des 2025'
    },
    {
      judul: 'Narasi Perihal Ayah',
      peminjam: 'Rendi',
      peminjaman: '9 Des 2025',
      pengembalian: '13 Des 2025'
    }
  ];

  const pengembalian = [
    {
      judul: 'Laut Bercerita',
      peminjam: 'Widi',
      peminjaman: '8 Des 2025',
      pengembalian: '10 Des 2025'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* BOX SUMMARY */}
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded bg-white p-5 text-center shadow">
          <p className="text-gray-600">Total Buku</p>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="rounded bg-white p-5 text-center shadow">
          <p className="text-gray-600">Buku Tersedia</p>
          <p className="text-3xl font-bold">90</p>
        </div>
        <div className="rounded bg-white p-5 text-center shadow">
          <p className="text-gray-600">Dipinjam Hari Ini</p>
          <p className="text-3xl font-bold">{peminjaman.length}</p>
        </div>
        <div className="rounded bg-white p-5 text-center shadow">
          <p className="text-gray-600">Pengembalian Hari Ini</p>
          <p className="text-3xl font-bold">{pengembalian.length}</p>
        </div>
      </div>

      {/* STOK BUKU */}
      <div className="mb-10 rounded bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Stok Buku</h3>
          <a href="/dashboard/buku" className="text-green-600 hover:underline">
            Lihat Semua
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {buku.map((b, i) => (
            <div key={i} className="rounded border p-3 shadow-sm">
              <img src={b.cover} className="h-40 w-full rounded object-cover" />
              <p className="mt-2 font-semibold">{b.judul}</p>

              <p
                className={`mt-1 w-fit rounded px-2 py-1 text-sm ${
                  b.stok > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {b.stok > 0 ? 'Tersedia' : 'Habis'}
              </p>

              <p className="mt-1 text-sm text-gray-600">Stok: {b.stok}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PEMINJAMAN & PENGEMBALIAN */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PEMINJAMAN */}
        <div className="rounded bg-white p-6 shadow">
          <div className="mb-4 flex justify-between">
            <h3 className="text-xl font-semibold">Peminjaman Hari Ini</h3>
            <a
              href="/dashboard/peminjaman"
              className="text-green-600 hover:underline"
            >
              Detail
            </a>
          </div>

          {peminjaman.map((p, i) => (
            <div key={i} className="mb-3 border-b pb-3">
              <p className="font-semibold">{p.peminjam}</p>
              <p className="text-sm text-gray-600">{p.judul}</p>
              <p className="text-sm text-gray-500">{p.peminjaman}</p>
            </div>
          ))}
        </div>

        {/* PENGEMBALIAN */}
        <div className="rounded bg-white p-6 shadow">
          <div className="mb-4 flex justify-between">
            <h3 className="text-xl font-semibold">Pengembalian Hari Ini</h3>
            <a
              href="/dashboard/pengembalian"
              className="text-green-600 hover:underline"
            >
              Detail
            </a>
          </div>

          {pengembalian.map((p, i) => (
            <div key={i} className="mb-3 border-b pb-3">
              <p className="font-semibold">{p.peminjam}</p>
              <p className="text-sm text-gray-600">{p.judul}</p>
              <p className="text-sm text-gray-500">{p.pengembalian}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

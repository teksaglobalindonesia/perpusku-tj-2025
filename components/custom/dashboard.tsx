'use client';

import Link from 'next/link';

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
      stok: 12,
      cover: '/images/laut-bercerita.jpg'
    },
    {
      judul: 'Bandung After Rain',
      kategori: 'Romance',
      penulis: 'Wulan Nur Amalia',
      stok: 10,
      cover: '/images/bandung-after-rain.jpeg'
    },
    {
      judul: 'Sisi Tergelap Surga',
      kategori: 'Fiksi',
      penulis: 'saya',
      stok: 20,
      cover: '/images/sisi-tergelap-surga.jpeg'
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
      peminjam: 'sean',
      peminjaman: '8 Des 2025',
      pengembalian: '10 Des 2025'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* BOX SUMMARY */}
      <div className="mb-10 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded bg-white p-4 text-center shadow">
          <p className="text-sm text-gray-600">Total Buku</p>
          <p className="text-2xl font-bold">100</p>
        </div>

        <div className="rounded bg-white p-4 text-center shadow">
          <p className="text-sm text-gray-600">Buku Tersedia</p>
          <p className="text-2xl font-bold">80</p>
        </div>

        <div className="rounded bg-white p-4 text-center shadow">
          <p className="text-sm text-gray-600">Dipinjam Hari Ini</p>
          <p className="text-2xl font-bold">{peminjaman.length}</p>
        </div>

        <div className="rounded bg-white p-4 text-center shadow">
          <p className="text-sm text-gray-600">Pengembalian Hari Ini</p>
          <p className="text-2xl font-bold">{pengembalian.length}</p>
        </div>
      </div>

      {/* STOK BUKU */}
      <div className="mb-10 rounded bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold md:text-xl">Stok Buku</h3>
          <Link
            href="/buku"
            className="text-sm text-green-600 hover:underline md:text-base"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {buku.map((b, i) => (
            <div key={i} className="rounded border bg-white p-3 shadow-sm">
              <img
                src={b.cover}
                className="h-32 w-full rounded object-cover md:h-40"
              />
              <p className="mt-2 text-sm font-semibold md:text-base">
                {b.judul}
              </p>

              <p
                className={`mt-1 w-fit rounded px-2 py-1 text-xs md:text-sm ${
                  b.stok > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {b.stok > 0 ? 'Tersedia' : 'Habis'}
              </p>

              <p className="mt-1 text-xs text-gray-600 md:text-sm">
                Stok: {b.stok}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PEMINJAMAN & PENGEMBALIAN */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PEMINJAMAN */}
        <div className="rounded bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold md:text-xl">
              Peminjaman Hari Ini
            </h3>
            <Link
              href="/peminjaman"
              className="text-sm text-green-600 hover:underline md:text-base"
            >
              Detail
            </Link>
          </div>

          {peminjaman.map((p, i) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="text-sm font-semibold md:text-base">{p.peminjam}</p>
              <p className="text-xs text-gray-600 md:text-sm">{p.judul}</p>
              <p className="text-xs text-gray-500 md:text-sm">{p.peminjaman}</p>
            </div>
          ))}
        </div>

        {/* PENGEMBALIAN */}
        <div className="rounded bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold md:text-xl">
              Pengembalian Hari Ini
            </h3>
            <Link
              href="/pengembalian"
              className="text-sm text-green-600 hover:underline md:text-base"
            >
              Detail
            </Link>
          </div>

          {pengembalian.map((p, i) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="text-sm font-semibold md:text-base">{p.peminjam}</p>
              <p className="text-xs text-gray-600 md:text-sm">{p.judul}</p>
              <p className="text-xs text-gray-500 md:text-sm">
                {p.pengembalian}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

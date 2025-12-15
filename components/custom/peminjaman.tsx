'use client';

import { useState } from 'react';

export default function PeminjamanPage() {
  const [search, setSearch] = useState('');
  const [showTambah, setShowTambah] = useState(false);

  const peminjamanData = [
    {
      id: 1,
      judul: 'Narasi Perihal Ayah',
      peminjam: 'Rina Putri',
      pinjam: '17 Juli 2025, 08.00',
      kembali: '24 Juli 2025',
      status: 'normal'
    },
    {
      id: 2,
      judul: 'Laut Bercerita',
      peminjam: 'Bagas Pratama',
      pinjam: '10 Juli 2025, 08.00',
      kembali: '17 Juli 2025',
      status: 'terlambat'
    },
    {
      id: 3,
      judul: 'Sisi Tergelap Surga',
      peminjam: 'Siti Marlina',
      pinjam: '17 Juli 2025, 08.00',
      kembali: '24 Juli 2025',
      status: 'normal'
    },
    {
      id: 4,
      judul: 'Bandung After Rain',
      peminjam: 'Rendi',
      pinjam: '10 Juli 2025, 08.00',
      kembali: '17 Juli 2025',
      status: 'terlambat'
    }
  ];

  const filtered = peminjamanData.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Peminjaman</h1>

      {/* SEARCH + TAMBAH */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowTambah(true)}
          className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
        >
          Tambah Peminjaman
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-green-800">
                  Judul Buku: {item.judul}
                </p>
                <p className="text-gray-600">Peminjam: {item.peminjam}</p>
                <p className="text-gray-600">Peminjaman: {item.pinjam}</p>
                <p className="text-gray-600">Pengembalian: {item.kembali}</p>

                {item.status === 'terlambat' && (
                  <span className="mt-2 inline-block rounded-lg bg-[#FFD6D6] px-3 py-1 text-xs font-semibold text-[#7A1F1F]">
                    TERLAMBAT
                  </span>
                )}
              </div>

              <button className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700">
                KEMBALIKAN
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          Data peminjaman tidak ditemukan.
        </p>
      )}

      {/* ================= POPUP TAMBAH PEMINJAMAN (STYLE DISAMAKAN) ================= */}
      {showTambah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            {/* HEADER */}
            <div className="border-b px-5 py-3">
              <h2 className="text-xl font-bold text-green-700">
                Tambah Peminjaman
              </h2>
            </div>

            {/* BODY */}
            <div className="space-y-3 px-5 py-4 text-sm">
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Buku
                </label>
                <select className="w-full rounded-lg border p-2 focus:outline-green-600">
                  <option>Pilih Buku</option>
                  <option>Narasi Perihal Ayah</option>
                  <option>Laut Bercerita</option>
                  <option>Sisi Tergelap Surga</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Anggota
                </label>
                <select className="w-full rounded-lg border p-2 focus:outline-green-600">
                  <option>Pilih Anggota</option>
                  <option>Rina Putri</option>
                  <option>Bagas Pratama</option>
                  <option>Siti Marlina</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Tanggal Peminjaman
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border p-2 focus:outline-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Tanggal Pengembalian
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border p-2 focus:outline-green-600"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={() => setShowTambah(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => setShowTambah(false)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

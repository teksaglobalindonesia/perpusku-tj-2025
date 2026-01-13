'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const PeminjamanPage = () => {
  const [search, setSearch] = useState('');
  const [showTambah, setShowTambah] = useState(false);
  const [showPilihBuku, setShowPilihBuku] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState<any>(null);
  const [showPilihAnggota, setShowPilihAnggota] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [showKembalikan, setShowKembalikan] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const anggota = [
    {
      id: 1,
      nama: 'Rina Putri',
      nomor: 'AG001',
      alamat: 'Jakarta Selatan',
      email: 'rina@gmail.com'
    },
    {
      id: 2,
      nama: 'Bagas Pratama',
      nomor: 'AG002',
      alamat: 'Bandung',
      email: 'bagas@gmail.com'
    },
    {
      id: 3,
      nama: 'Siti Marlina',
      nomor: 'AG003',
      alamat: 'Depok',
      email: 'siti@gmail.com'
    }
  ];

  const buku = [
    {
      judul: 'Narasi Perihal Ayah',
      kategori: 'Family Fiction',
      penulis: 'Jaquenza Eden',
      penerbit: 'Gramedia',
      tahun: '2022',
      stok: 0,
      cover: '/images/narasi-perihal-ayah.jpeg'
    },
    {
      judul: 'Laut Bercerita',
      kategori: 'Historical Fiction',
      penulis: 'Leila S. Chudori',
      penerbit: 'Gramedia',
      tahun: '2017',
      stok: 12,
      cover: '/images/laut-bercerita.jpg'
    },
    {
      judul: 'Bandung After Rain',
      kategori: 'Romance',
      penulis: 'Wulan Nur Amalia',
      penerbit: 'Ice Cube',
      tahun: '2021',
      stok: 10,
      cover: '/images/bandung-after-rain.jpeg'
    },
    {
      judul: 'Sisi Tergelap Surga',
      kategori: 'Fiksi',
      penulis: 'Brian Khrisna',
      penerbit: 'Mediakita',
      tahun: '2020',
      stok: 20,
      cover: '/images/sisi-tergelap-surga.jpeg'
    }
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/loan/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        });

        const json = await res.json();
        setLoans(json?.data || []);
      } catch (err) {
        console.error('Gagal ambil peminjaman:', err);
      }
    })();
  }, []);

  const filtered = loans.filter((item) =>
    (item.book?.title ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const isLate = (returnDate?: string) => {
    if (!returnDate) return false;

    const dueDate = new Date(returnDate);
    dueDate.setHours(0, 0, 0, 0);

    return today > dueDate;
  };

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
                  {item.book?.title}
                </p>
                <p className="text-gray-600">Peminjam: {item.member?.name}</p>
                <p className="text-gray-600">Peminjaman: {item.loan_date}</p>
                <p className="text-gray-600">
                  Pengembalian: {item.return_date}
                </p>

                {isLate(item.return_date) && (
                  <span className="mt-2 inline-block rounded-lg bg-[#FFD6D6] px-3 py-1 text-xs font-semibold text-[#7A1F1F]">
                    TERLAMBAT
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedPeminjaman(item);
                  setShowKembalikan(true);
                }}
                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-center text-xs font-medium text-white hover:bg-green-700 sm:w-auto"
              >
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

      {/* POPUP TAMBAH PEMINJAMAN */}
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

                <button
                  type="button"
                  onClick={() => setShowPilihBuku(true)}
                  className="w-full rounded-lg border p-2 text-left hover:border-green-600"
                >
                  {selectedBuku ? selectedBuku.judul : 'Pilih Buku'}
                </button>
              </div>
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Anggota
                </label>
                <button
                  type="button"
                  onClick={() => setShowPilihAnggota(true)}
                  className="w-full rounded-lg border p-2 text-left hover:border-green-600"
                >
                  {selectedAnggota ? selectedAnggota.nama : 'Pilih Anggota'}
                </button>
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
                  Durasi Pengembalian
                </label>
                <select className="w-full rounded-lg border p-2 focus:outline-green-600">
                  <option value="7">1 Minggu</option>
                  <option value="14">2 Minggu</option>
                  <option value="30">1 Bulan (30 Hari)</option>
                </select>
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

      {showPilihBuku && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
            {/* HEADER */}
            <div className="border-b px-5 py-3">
              <h3 className="text-lg font-bold text-green-700">Pilih Buku</h3>
            </div>

            {/* LIST BUKU */}
            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
              {buku.map((b, i) => (
                <button
                  key={i}
                  disabled={b.stok === 0}
                  onClick={() => {
                    setSelectedBuku(b);
                    setShowPilihBuku(false);
                  }}
                  className={`flex w-full gap-4 rounded-xl border p-3 text-left transition
                    ${
                      b.stok === 0
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:border-green-600'
                    }`}
                >
                  <img
                    src={b.cover}
                    alt={b.judul}
                    className="h-20 w-14 rounded-lg object-cover"
                  />

                  <div className="flex-1 text-sm">
                    <h4 className="font-semibold text-gray-800">{b.judul}</h4>
                    <p className="text-xs text-gray-600">
                      Penulis: {b.penulis}
                    </p>
                    <p className="text-xs text-gray-600">
                      Penerbit: {b.penerbit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tahun: {b.tahun} • {b.kategori}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs
                        ${
                          b.stok === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                    >
                      {b.stok === 0 ? 'Stok Habis' : `Stok: ${b.stok}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t px-5 py-3">
              <button
                onClick={() => setShowPilihBuku(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showPilihAnggota && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
            {/* HEADER */}
            <div className="border-b px-5 py-3">
              <h3 className="text-lg font-bold text-green-700">
                Pilih Anggota
              </h3>
            </div>

            {/* LIST ANGGOTA */}
            <div className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4">
              {anggota.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAnggota(a);
                    setShowPilihAnggota(false);
                  }}
                  className="w-full rounded-xl border p-3 text-left transition hover:border-green-600"
                >
                  <h4 className="font-semibold text-gray-800">{a.nama}</h4>
                  <p className="text-xs text-gray-600">
                    No. Anggota: {a.nomor}
                  </p>
                  <p className="text-xs text-gray-500">Alamat: {a.alamat}</p>
                  <p className="text-xs text-gray-500">Email: {a.email}</p>
                </button>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end border-t px-5 py-3">
              <button
                onClick={() => setShowPilihAnggota(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP KEMBALIKAN */}
      {showKembalikan && selectedPeminjaman && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white shadow-lg">
            {/* HEADER */}
            <div className="border-b px-4 py-3 sm:px-5">
              <h3 className="text-lg font-bold text-green-700">
                Konfirmasi Pengembalian
              </h3>
            </div>

            {/* BODY */}
            <div className="space-y-2 px-4 py-4 text-sm sm:px-5">
              <p className="text-gray-700">
                Apakah buku berikut ingin dikembalikan?
              </p>

              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <p className="font-semibold text-gray-800">
                  {selectedPeminjaman.book?.title}
                </p>
                <p className="text-gray-600">
                  Peminjam: {selectedPeminjaman.member?.name}
                </p>
                <p className="text-gray-600">
                  Tanggal Pinjam: {selectedPeminjaman.loan_date}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
              <button
                onClick={() => {
                  setShowKembalikan(false);
                  setSelectedPeminjaman(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  setShowKembalikan(false);
                  setSelectedPeminjaman(null);
                }}
                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-center text-sm text-white hover:bg-green-700 sm:w-auto"
              >
                Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeminjamanPage;

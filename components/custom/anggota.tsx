'use client';

import { useState } from 'react';

export default function AnggotaPage() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPeminjaman, setShowPeminjaman] = useState(false);

  const [newAnggota, setNewAnggota] = useState({
    nama: '',
    nomor: '',
    alamat: '',
    email: ''
  });

  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [anggotaToDelete, setAnggotaToDelete] = useState<any>(null);

  const anggotaData = [
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

  const peminjamanData: Record<number, any[]> = {
    1: [
      {
        id: 1,
        judul: 'Laut Bercerita',
        penulis: 'Leila S. Chudori',
        kategori: 'Historical Fiction',
        pinjam: '2025-12-01',
        kembali: '-',
        status: 'dipinjam'
      },
      {
        id: 2,
        judul: 'Narasi Perihal Ayah',
        penulis: 'Jaquenza Eden',
        kategori: 'Family Fiction',
        pinjam: '2025-11-20',
        kembali: '2025-11-25',
        status: 'dikembalikan'
      }
    ],
    2: [
      {
        id: 1,
        judul: 'Laut Bercerita',
        penulis: 'Leila S. Chudori',
        kategori: 'Historical Fiction',
        pinjam: '2025-11-25',
        kembali: '-',
        status: 'terlambat'
      }
    ],
    3: [
      {
        id: 1,
        judul: 'Narasi Perihal Ayah',
        penulis: 'Jaquenza Eden',
        kategori: 'Family Fiction',
        pinjam: '2025-11-15',
        kembali: '-',
        status: 'terlambat'
      },
      {
        id: 2,
        judul: 'Laut Bercerita',
        penulis: 'Leila S. Chudori',
        kategori: 'Historical Fiction',
        pinjam: '2025-11-10',
        kembali: '2025-11-17',
        status: 'dikembalikan'
      }
    ]
  };

  const filtered = anggotaData.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Data Anggota</h1>

      {/* SEARCH + ADD */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari nama anggota..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowAdd(true)}
          className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
        >
          Tambah Anggota
        </button>
      </div>

      {/* CARD LIST */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-xl border bg-white p-4 shadow-sm"
          >
            <h2 className="mb-1 text-xl font-bold text-green-800">
              {item.nama}
            </h2>
            <p className="text-gray-500">Nomor Anggota: {item.nomor}</p>
            <p className="text-gray-500">Alamat: {item.alamat}</p>
            <p className="mb-4 text-gray-500">Email: {item.email}</p>

            <div className="mt-auto flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedAnggota(item);
                  setShowPeminjaman(true);
                }}
                className="rounded-lg bg-[#CFE8FF] px-3 py-2 text-sm font-medium text-[#1E4A7B]"
              >
                Lihat Peminjaman
              </button>
              <button
                onClick={() => {
                  setSelectedAnggota(item);
                  setShowEdit(true);
                }}
                className="rounded-lg bg-[#FFF3C4] px-3 py-2 text-sm font-medium text-[#7A5C00] hover:bg-[#FFE9A1]"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setAnggotaToDelete(item);
                  setShowDelete(true);
                }}
                className="rounded-lg bg-[#FFD6D6] px-3 py-2 text-sm font-medium text-[#7A1F1F] hover:bg-[#FFBFBF]"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DATA KOSONG */}
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          Anggota tidak ditemukan.
        </p>
      )}

      {/* POPUP TAMBAH */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-xl font-bold text-green-700">
                Tambah Anggota
              </h2>
            </div>

            <div className="px-5 py-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.nama}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, nama: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nomor Anggota
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.nomor}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, nomor: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.alamat}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, alamat: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mb-2 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.email}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={() => {
                  setNewAnggota({ nama: '', nomor: '', alamat: '', email: '' });
                  setShowAdd(false);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>

              <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDIT */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-xl font-bold text-green-700">Edit Anggota</h2>
            </div>

            <div className="px-5 py-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota.nama}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    nama: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nomor Anggota
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota.nomor}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    nomor: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota.alamat}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    alamat: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="mb-2 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota.email}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    email: e.target.value
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={() => {
                  setSelectedAnggota({
                    id: null,
                    nama: '',
                    nomor: '',
                    alamat: '',
                    email: ''
                  });
                  setShowEdit(false);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>

              <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DELETE */}
      {showDelete && anggotaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus anggota{' '}
              <span className="font-semibold">{anggotaToDelete.nama}</span>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  setShowDelete(false);
                }}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {/* POPUP LIHAT PEMINJAMAN */}
      {showPeminjaman && selectedAnggota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-green-700">
                  Peminjaman Buku
                </h2>
                <p className="text-sm text-gray-500">{selectedAnggota.nama}</p>
              </div>
              <button onClick={() => setShowPeminjaman(false)}>✕</button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {(peminjamanData[selectedAnggota.id] || []).length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Belum ada data peminjaman
                </p>
              ) : (
                peminjamanData[selectedAnggota.id].map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <h3 className="font-semibold">{item.judul}</h3>
                    <p className="text-sm text-gray-600">
                      {item.penulis} • {item.kategori}
                    </p>
                    <p className="text-sm text-gray-600">
                      Pinjam: {item.pinjam}
                    </p>
                    <p className="text-sm text-gray-600">
                      Kembali: {item.kembali}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded px-3 py-1 text-xs font-semibold ${
                        item.status === 'dikembalikan'
                          ? 'bg-[#DFF3E3] text-[#1E6B3A]'
                          : item.status === 'dipinjam'
                          ? 'bg-[#E0ECFF] text-[#1E4A7B]'
                          : 'bg-[#FFD6D6] text-[#7A1F1F]'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

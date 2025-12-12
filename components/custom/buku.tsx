'use client';

import { useState } from 'react';

export default function BukuPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [previewCover, setPreviewCover] = useState<string | null>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewCover) URL.revokeObjectURL(previewCover);

    const url = URL.createObjectURL(file);
    setPreviewCover(url);
  };

  const openModal = () => {
    if (previewCover) URL.revokeObjectURL(previewCover);
    setPreviewCover(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (previewCover) URL.revokeObjectURL(previewCover);
    setPreviewCover(null);
    setShowModal(false);
  };

  const [buku, setBuku] = useState([
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
    },
    {
      judul: 'Iyan Bukan Anak Tengah',
      kategori: 'Family Fiction',
      penulis: 'Armaraher',
      penerbit: 'Elek Media',
      tahun: '2023',
      stok: 5,
      cover: '/images/iyan-bukan-anak-tengah.jpeg'
    }
  ]);

  const filteredBooks = buku.filter((b) =>
    b.judul.toLowerCase().includes(search.toLowerCase())
  );

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [previewEditCover, setPreviewEditCover] = useState<string | null>(null);

  const openEditModal = (book: any) => {
    setEditData({ ...book });
    setPreviewEditCover(book.cover);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (previewEditCover) URL.revokeObjectURL(previewEditCover);
    setPreviewEditCover(null);
    setShowEditModal(false);
  };

  const handleEditCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewEditCover) URL.revokeObjectURL(previewEditCover);

    const url = URL.createObjectURL(file);
    setPreviewEditCover(url);
  };

  // belum ada API → cuma close
  const saveEdit = () => {
    closeEditModal();
  };

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const openDeleteModal = (book: any) => {
    setDeleteTarget(book);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setShowDeleteModal(false);
  };

  // belum API → cuma close modal
  const confirmDelete = () => {
    closeDeleteModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700 md:text-2xl">
          Daftar Buku
        </h1>
      </div>

      {/* SEARCH + BUTTON */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openModal}
          className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
        >
          Tambah Buku
        </button>
      </div>

      {/* LIST BUKU */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {filteredBooks.map((b, index) => (
          <div
            key={index}
            className="flex flex-col rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <img
              src={b.cover}
              alt={b.judul}
              className="h-40 w-full rounded-xl object-cover md:h-48"
            />

            {/* CONTAINER INFO BUKU */}
            <div className="mt-3 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-gray-800 md:text-base">
                {b.judul}
              </h3>

              <div className="text-xs text-gray-600 md:text-sm">
                <span className="font-medium text-gray-700">Penulis:</span>{' '}
                {b.penulis}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 md:text-sm">
                <span>{b.penerbit}</span>
                <span>•</span>
                <span>{b.tahun}</span>
              </div>

              <div className="text-xs text-gray-500 md:text-sm">
                Kategori: {b.kategori}
              </div>

              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    b.stok === 0
                      ? 'bg-red-100 text-red-700'
                      : b.stok <= 10
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {b.stok === 0 ? 'Stok Habis' : `Stok: ${b.stok}`}
                </span>
              </div>
            </div>

            {/* TOMBOL — SELALU DI BAWAH */}
            <div className="mt-auto flex justify-between pt-3">
              <button
                onClick={() => openEditModal(b)}
                className="rounded-full bg-green-100 px-3 py-2 text-xs text-green-700 transition hover:bg-green-200 md:text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => openDeleteModal(b)}
                className="rounded-full bg-red-100 px-3 py-2 text-xs text-red-700 transition hover:bg-red-200 md:text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DATA KOSONG */}
      {filteredBooks.length === 0 && (
        <p className="mt-10 text-center text-gray-600">Buku tidak ditemukan.</p>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-base font-semibold text-gray-800">
                Tambah Buku
              </h2>
            </div>

            <div
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: '65vh' }}
            >
              <div className="flex flex-col gap-3 text-sm">
                <input
                  type="text"
                  placeholder="Judul Buku"
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  placeholder="Penulis"
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  placeholder="Penerbit"
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  placeholder="Tahun Terbit"
                  className="rounded-lg border p-2"
                />

                <select className="rounded-lg border p-2 text-gray-700">
                  <option value="">Pilih Kategori</option>
                  <option>Family Fiction</option>
                  <option>Romance</option>
                  <option>Historical Fiction</option>
                  <option>Fiksi</option>
                  <option>Fantasy</option>
                  <option>Thriller</option>
                </select>

                <input
                  type="number"
                  placeholder="Jumlah Stok"
                  className="rounded-lg border p-2"
                />

                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Upload Cover Buku
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="w-full rounded-lg border p-2"
                  />

                  {previewCover && (
                    <img
                      src={previewCover}
                      alt="preview"
                      className="mt-3 h-40 w-full rounded-lg border object-contain md:h-48"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-white px-5 py-3">
              <button
                onClick={closeModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>

              <button className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white">
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDIT BUKU */}
      {showEditModal && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-base font-semibold text-gray-800">
                Edit Buku
              </h2>
            </div>

            <div
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: '65vh' }}
            >
              <div className="flex flex-col gap-3 text-sm">
                <input
                  type="text"
                  value={editData.judul}
                  onChange={(e) =>
                    setEditData({ ...editData, judul: e.target.value })
                  }
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  value={editData.penulis}
                  onChange={(e) =>
                    setEditData({ ...editData, penulis: e.target.value })
                  }
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  value={editData.penerbit}
                  onChange={(e) =>
                    setEditData({ ...editData, penerbit: e.target.value })
                  }
                  className="rounded-lg border p-2"
                />
                <input
                  type="text"
                  value={editData.tahun}
                  onChange={(e) =>
                    setEditData({ ...editData, tahun: e.target.value })
                  }
                  className="rounded-lg border p-2"
                />

                <select
                  value={editData.kategori}
                  onChange={(e) =>
                    setEditData({ ...editData, kategori: e.target.value })
                  }
                  className="rounded-lg border p-2 text-gray-700"
                >
                  <option>Family Fiction</option>
                  <option>Romance</option>
                  <option>Historical Fiction</option>
                  <option>Fiksi</option>
                  <option>Fantasy</option>
                  <option>Thriller</option>
                </select>

                <input
                  type="number"
                  value={editData.stok}
                  onChange={(e) =>
                    setEditData({ ...editData, stok: Number(e.target.value) })
                  }
                  className="rounded-lg border p-2"
                />

                {/* GANTI COVER */}
                <div>
                  <label className="mb-1 block text-xs text-gray-600">
                    Ganti Cover Buku
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditCoverChange}
                    className="w-full rounded-lg border p-2"
                  />

                  {previewEditCover && (
                    <img
                      src={previewEditCover}
                      className="mt-3 h-40 w-full rounded-lg border object-contain md:h-48"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={closeEditModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* POPUP HAPUS */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus buku{' '}
              <span className="font-semibold">{deleteTarget.judul}</span>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

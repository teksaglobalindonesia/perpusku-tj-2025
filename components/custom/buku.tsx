"use client";

import { useState } from "react";
import Link from "next/link";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];

const books = [
  {
    id: 1,
    title: "A Smart Bunny",
    author: "Jonathan Miles",
    publisher: "Kids World",
    year: 2022,
    category: "Anak-anak",
    stock: 12,
    image: "/img/foto1.jpg",
  },
  {
    id: 2,
    title: "The Clever Bee",
    author: "Laura White",
    publisher: "Edu Press",
    year: 2021,
    category: "Edukasi",
    stock: 8,
    image: "/img/foto2.jpg",
  },
];

export default function BukuPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setPreview(null);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#2b2540] text-white border-r border-purple-800/40 p-6">
        <h1 className="mb-10 text-3xl font-extrabold tracking-wide text-purple-300">
          LIBRAVA
        </h1>
        <nav className="flex flex-col gap-2">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700/40 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 w-full p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Data Buku</h2>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari buku..."
              className="rounded-full border border-purple-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-6 py-2 font-semibold text-white hover:bg-purple-800 transition"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-purple-200 p-5 shadow-sm"
            >
              <img
                src={item.image}
                className="mb-4 h-48 w-full rounded-xl object-cover"
              />

              <h3 className="mb-1 text-xl font-bold text-purple-700">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600">Penulis: {item.author}</p>
              <p className="text-sm text-gray-600">Penerbit: {item.publisher}</p>
              <p className="text-sm text-gray-600">Tahun: {item.year}</p>
              <p className="text-sm text-gray-600">Kategori: {item.category}</p>
              <p className="text-sm font-semibold">
                Stok:{" "}
                <span
                  className={
                    item.stock > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {item.stock}
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    setPreview(item.image);
                    setModal("edit");
                  }}
                  className="rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("delete");
                  }}
                  className="rounded-lg bg-red-500 py-2 text-white hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300">
            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-purple-700">
                  {modal === "add" ? "Tambah Buku" : "Edit Buku"}
                </h2>

                <div className="space-y-3">
                  <input defaultValue={selected?.title} placeholder="Judul Buku" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input defaultValue={selected?.author} placeholder="Penulis" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input defaultValue={selected?.publisher} placeholder="Penerbit" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input type="number" defaultValue={selected?.year} placeholder="Tahun Terbit" className="w-full rounded-lg border border-purple-300 p-3" />
                  <select defaultValue={selected?.category} className="w-full rounded-lg border border-purple-300 p-3">
                    <option value="">Pilih Kategori</option>
                    <option>Anak-anak</option>
                    <option>Edukasi</option>
                    <option>Fiksi</option>
                    <option>Non-Fiksi</option>
                    <option>Ilmu Pengetahuan</option>
                    <option>Puisi</option>
                  </select>
                  <input type="number" defaultValue={selected?.stock} placeholder="Jumlah Stok" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input type="file" accept="image/*" onChange={handleImage} />

                  {preview && (
                    <img src={preview} className="h-40 w-full rounded-xl object-cover" />
                  )}
                </div>
              </>
            )}

            {modal === "delete" && (
              <h2 className="mb-6 text-center text-lg font-semibold text-red-600">
                Yakin ingin menghapus buku ini?
              </h2>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-lg bg-gray-400 px-4 py-2 text-white"
              >
                Batal
              </button>
              <button
                onClick={closeModal}
                className={`rounded-lg px-4 py-2 text-white ${
                  modal === "delete"
                    ? "bg-red-600"
                    : "bg-purple-700"
                }`}
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

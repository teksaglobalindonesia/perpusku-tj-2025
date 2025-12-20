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
    <div className="flex min-h-screen bg-[#111] text-white">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[#D4AF37]/40 bg-[#111] p-5">
        <h2 className="mb-10 text-3xl font-bold text-[#D4AF37]">LIBRAVA</h2>
        <nav className="flex flex-col gap-3">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 hover:bg-[#D4AF37]/20"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 w-full p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-3xl font-bold text-[#D4AF37]">Data Buku</h3>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari buku..."
              className="rounded-full border border-[#D4AF37]/40 bg-black px-4 py-2 text-sm"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-[#D4AF37] px-6 py-2 font-semibold text-black"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D4AF37]/30 bg-[#1c1c1c] p-5"
            >
              <img
                src={item.image}
                className="mb-4 h-48 w-full rounded-xl object-cover"
              />

              <h3 className="mb-1 text-xl font-bold text-[#D4AF37]">
                {item.title}
              </h3>
              <p className="text-sm">Penulis: {item.author}</p>
              <p className="text-sm">Penerbit: {item.publisher}</p>
              <p className="text-sm">Tahun: {item.year}</p>
              <p className="text-sm">Kategori: {item.category}</p>
              <p className="text-sm">Stok: {item.stock}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    setPreview(item.image);
                    setModal("edit");
                  }}
                  className="rounded-lg bg-[#D4AF37] py-2 text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("delete");
                  }}
                  className="rounded-lg bg-red-600 py-2"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-[#222] p-6">
            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
                  {modal === "add" ? "Tambah Buku" : "Edit Buku"}
                </h2>

                <div className="space-y-3">
                  <input defaultValue={selected?.title} placeholder="Judul Buku" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input defaultValue={selected?.author} placeholder="Penulis" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input defaultValue={selected?.publisher} placeholder="Penerbit" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input type="number" defaultValue={selected?.year} placeholder="Tahun Terbit" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <select defaultValue={selected?.category} className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3">
                    <option value="">Pilih Kategori</option>
                    <option>Anak-anak</option>
                    <option>Edukasi</option>
                    <option>Fiksi</option>
                    <option>Non-Fiksi</option>
                    <option>Ilmu Pengetahuan</option>
                    <option>Puisi</option>
                  </select>
                  <input type="number" defaultValue={selected?.stock} placeholder="Jumlah Stok" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input type="file" accept="image/*" onChange={handleImage} />

                  {preview && (
                    <img src={preview} className="h-40 w-full rounded-xl object-cover" />
                  )}
                </div>
              </>
            )}

            {modal === "delete" && (
              <>
                <h2 className="mb-6 text-center text-xl font-semibold">
                  Yakin ingin menghapus buku ini?
                </h2>
              </>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg bg-gray-500 px-4 py-2">
                Batal
              </button>
              <button
                onClick={closeModal}
                className={`rounded-lg px-4 py-2 ${
                  modal === "delete"
                    ? "bg-red-600"
                    : "bg-[#D4AF37] text-black"
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

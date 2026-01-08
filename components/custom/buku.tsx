"use client";

import {useEffect, useState } from "react";
import Link from "next/link";
import {BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];


const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [books, setBooks] = useState <any[]>([]);

useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
          },
          cache: "no-store",
        });
  
        const json = await res.json();
        setBooks(json?.data || []);
      } catch (err) {
        console.error("Gagal ambil buku:",  err);
      }
    })();
  }, []);
  
  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
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
          {filteredBooks.map((b, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-purple-200 p-5 shadow-sm"
            >
              <img
                src={b.cover?.url ? `${BASE_URL}${b.cover?.url}` : "/placeholder-book.jpg"}
                alt={b.title}
                className="mb-4 h-48 w-full rounded-xl object-cover"
              />

              <h3 className="mb-1 text-xl font-bold text-purple-700">
                {b.title}
              </h3>

              <p className="text-sm text-gray-600">Penulis: {b.writer}</p>
              <p className="text-sm text-gray-600">Penerbit: {b.publisher}</p>
              <p className="text-sm text-gray-600">Tahun: {b.published_year}</p>
              <p className="text-sm text-gray-600">Kategori: {b.categories?.map((c: any) => c.name).join(", ")}</p>
              <p className="text-sm font-semibold">
                stock:{" "}
                 
                <span
                  className={
                    b.stock > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {b.stock}
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelected(b);
                    setModal("edit");
                  }}
                  className="rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(b);
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
                  <input defaultValue={selected?.writer} placeholder="Penulis" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input defaultValue={selected?.publisher} placeholder="Penerbit" className="w-full rounded-lg border border-purple-300 p-3" />
                  <input type="number" defaultValue={selected?.published_year} placeholder="Tahun Terbit" className="w-full rounded-lg border border-purple-300 p-3" />
                  <select defaultValue={selected?.categories} className="w-full rounded-lg border border-purple-300 p-3">
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
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BukuPage;
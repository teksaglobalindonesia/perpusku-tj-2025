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

const members = [
  {
    id: 1,
    name: "Shela Putri",
    number: "AGT-001",
    address: "Jl. Merdeka No. 10",
    email: "shela@mail.com",
    borrowed: [
      { title: "A Smart Bunny", date: "2025-01-10" },
      { title: "The Clever Bee", date: "2025-01-15" },
    ],
    returned: [{ title: "Calm Clouds", date: "2025-01-05" }],
  },
  {
    id: 2,
    name: "Dimas Pratama",
    number: "AGT-002",
    address: "Jl. Sudirman No. 5",
    email: "dimas@mail.com",
    borrowed: [{ title: "Useful Tree", date: "2025-01-18" }],
    returned: [],
  },
];

export default function AnggotaPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [modal, setModal] = useState<"view" | "edit" | "add" | "delete" | null>(null);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setModal(null);
    setSelected(null);
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
          <h3 className="text-3xl font-bold text-[#D4AF37]">Data Anggota</h3>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari anggota..."
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
          {filteredMembers.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D4AF37]/30 bg-[#1c1c1c] p-6"
            >
              <h3 className="mb-1 text-xl font-bold text-[#D4AF37]">{item.name}</h3>
              <p className="text-sm">Nomor: {item.number}</p>
              <p className="text-sm">Alamat: {item.address}</p>
              <p className="text-sm">Email: {item.email}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("view");
                  }}
                  className="rounded-lg bg-blue-600 py-2 text-sm"
                >
                  Lihat
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("edit");
                  }}
                  className="rounded-lg bg-[#D4AF37] py-2 text-sm text-black"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("delete");
                  }}
                  className="rounded-lg bg-red-600 py-2 text-sm"
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
            {modal === "view" && selected && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
                  Riwayat Peminjaman
                </h2>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Dipinjam</h4>
                  {selected.borrowed.length ? (
                    <ul className="list-disc list-inside text-sm">
                      {selected.borrowed.map((b: any, i: number) => (
                        <li key={i}>
                          {b.title} <span className="text-gray-400">({b.date})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Tidak ada</p>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Dikembalikan</h4>
                  {selected.returned.length ? (
                    <ul className="list-disc list-inside text-sm">
                      {selected.returned.map((b: any, i: number) => (
                        <li key={i}>
                          {b.title} <span className="text-gray-400">({b.date})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Tidak ada</p>
                  )}
                </div>
              </>
            )}

            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="mb-4 text-2xl font-bold text-[#D4AF37]">
                  {modal === "add" ? "Tambah Anggota" : "Edit Anggota"}
                </h2>
                <div className="space-y-3">
                  <input defaultValue={selected?.name} placeholder="Nama Anggota" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input defaultValue={selected?.number} placeholder="Nomor Anggota" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input defaultValue={selected?.address} placeholder="Alamat" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                  <input defaultValue={selected?.email} placeholder="Email" className="w-full rounded-lg border border-[#D4AF37]/40 bg-black p-3" />
                </div>
              </>
            )}

            {modal === "delete" && (
              <>
                <h2 className="mb-6 text-center text-xl font-semibold">
                  Yakin ingin menghapus?
                </h2>
              </>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg bg-gray-500 px-4 py-2">
                Batal
              </button>
              {modal !== "view" && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

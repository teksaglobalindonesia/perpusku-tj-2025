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
    name: "agatha celine jjavorka",
    address: "Jl. Jakarta",
    email: "agathavorka2@gmail.com",
    borrowed: [
      { title: "A Smart Bunny", date: "2025-01-10" },
      { title: "The Clever Bee", date: "2025-01-15" },
    ],
    returned: [{ title: "Calm Clouds", date: "2025-01-05" }],
  },
  {
    id: 2,
    name: "anak agung aldebaran",
    address: "Jl. Busan",
    email: "aldebaranagung@gmail.com",
    borrowed: [{ title: "Useful Tree", date: "2025-01-18" }],
    returned: [],
  },
   {
    id: 3,
    name: "i gede satria jati wibawa",
    address: "Jl. Tabanan",
    email: "sajajaja08@gmail.com",
    borrowed: [{ title: "Useful Tree", date: "2025-01-18" }],
    returned: [],
  },
   {
    id: 4,
    name: "lionel jastive mouel",
    address: "Jl. Manado",
    email: "jastive35@gmail.com",
    borrowed: [{ title: "Useful Tree", date: "2025-01-18" }],
    returned: [],
  },
];

export default function AnggotaPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [modal, setModal] =
    useState<"view" | "add" | "edit" | "delete" | null>(null);

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#2b2540] text-white border-r border-purple-800/40 p-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-2xl md:hidden"
        >
          ✕
        </button>

        <h1 className="mb-10 text-3xl font-extrabold tracking-wide text-purple-300">
          LIBRAVA
        </h1>

        <nav className="flex flex-col gap-2">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                item.name === "Anggota"
                  ? "bg-purple-700/40"
                  : "hover:bg-purple-700/40"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <main className="ml-0 md:ml-64 w-full p-4 sm:p-6">
        <div className="mb-5 flex justify-between md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-purple-700 px-4 py-2 text-white font-semibold"
          >
            ☰
          </button>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Data Anggota</h2>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="w-full sm:w-72 rounded-full border border-purple-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-6 py-2 text-white font-semibold"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-purple-200 p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-purple-700">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">Alamat: {item.address}</p>
              <p className="text-sm text-gray-600">Email: {item.email}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("view");
                  }}
                  className="rounded-lg border border-purple-300 py-2 text-sm hover:bg-purple-100"
                >
                  Lihat
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("edit");
                  }}
                  className="rounded-lg bg-purple-600 py-2 text-sm text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(item);
                    setModal("delete");
                  }}
                  className="rounded-lg bg-red-500 py-2 text-sm text-white"
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
            {modal === "view" && selected && (
              <>
                <h2 className="mb-4 text-xl font-bold text-purple-700">
                  Riwayat Peminjaman
                </h2>

                <div className="mb-4">
                  <p className="font-semibold text-purple-600 mb-2">Dipinjam</p>
                  {selected.borrowed.length ? (
                    <ul className="space-y-1 text-sm">
                      {selected.borrowed.map((b: any, i: number) => (
                        <li
                          key={i}
                          className="rounded-lg bg-purple-50 px-3 py-2"
                        >
                          {b.title}
                          <span className="ml-1 text-gray-500">
                            ({b.date})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada</p>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-purple-600 mb-2">
                    Dikembalikan
                  </p>
                  {selected.returned.length ? (
                    <ul className="space-y-1 text-sm">
                      {selected.returned.map((b: any, i: number) => (
                        <li
                          key={i}
                          className="rounded-lg bg-purple-50 px-3 py-2"
                        >
                          {b.title}
                          <span className="ml-1 text-gray-500">
                            ({b.date})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada</p>
                  )}
                </div>
              </>
            )}

            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="mb-4 text-xl font-bold text-purple-700">
                  {modal === "add" ? "Tambah Anggota" : "Edit Anggota"}
                </h2>
                <div className="space-y-3">
                  <input className="w-full rounded-lg border border-purple-300 p-3 text-sm" placeholder="Nama" />
                  <input className="w-full rounded-lg border border-purple-300 p-3 text-sm" placeholder="Nomor" />
                  <input className="w-full rounded-lg border border-purple-300 p-3 text-sm" placeholder="Alamat" />
                  <input className="w-full rounded-lg border border-purple-300 p-3 text-sm" placeholder="Email" />
                </div>
              </>
            )}

            {modal === "delete" && (
              <h2 className="text-center text-lg font-semibold text-red-600">
                Yakin ingin menghapus anggota ini?
              </h2>
            )}

            {modal === "delete" ? (
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-purple-300 px-6 py-2"
                >
                  Tidak
                </button>
                <button
                  onClick={closeModal}
                  className="rounded-lg bg-red-500 px-6 py-2 text-white"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-purple-300 px-4 py-2"
                >
                  Batal
                </button>
                {modal !== "view" && (
                  <button
                    onClick={closeModal}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-white"
                  >
                    Simpan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

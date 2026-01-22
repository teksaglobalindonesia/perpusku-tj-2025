"use client";

import { useState } from "react";

const initialMembers = [
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
];

export default function AnggotaPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(initialMembers);
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

  const handleDeleteMember = () => {
    if (!selected) return;
    setMembers((prev) => prev.filter((m) => m.id !== selected.id));
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold">Data Anggota</h2>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari anggota..."
              className="w-full sm:w-64 rounded-full border px-4 py-2 text-sm"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-6 py-2 text-white"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredMembers.map((m) => (
            <div
              key={m.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border"
            >
              <div>
                <h3 className="font-bold text-purple-700">{m.name}</h3>
                <p className="text-sm">{m.address}</p>
                <p className="text-sm">{m.email}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("view");
                  }}
                  className="border px-4 py-2 rounded-lg"
                >
                  Lihat
                </button>
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("edit");
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("delete");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            {modal === "view" && selected && (
              <>
                <h2 className="font-bold text-lg mb-4">Riwayat</h2>

                <div className="mb-3">
                  <p className="font-semibold">Dipinjam</p>
                  {selected.borrowed.length ? (
                    selected.borrowed.map((b: any, i: number) => (
                      <p key={i} className="text-sm">
                        {b.title} ({b.date})
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada</p>
                  )}
                </div>

                <div>
                  <p className="font-semibold">Dikembalikan</p>
                  {selected.returned.length ? (
                    selected.returned.map((b: any, i: number) => (
                      <p key={i} className="text-sm">
                        {b.title} ({b.date})
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Tidak ada</p>
                  )}
                </div>
              </>
            )}

            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="font-bold mb-4">
                  {modal === "add" ? "Tambah Anggota" : "Edit Anggota"}
                </h2>
                <div className="space-y-3">
                  <input className="w-full border p-3 rounded-lg" placeholder="Nama" />
                  <input className="w-full border p-3 rounded-lg" placeholder="Alamat" />
                  <input className="w-full border p-3 rounded-lg" placeholder="Email" />
                </div>
              </>
            )}

            {modal === "delete" && (
              <h2 className="text-center text-red-600 font-semibold">
                Yakin ingin menghapus anggota ini?
              </h2>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="border px-4 py-2 rounded-lg"
              >
                Batal
              </button>

              {modal === "delete" ? (
                <button
                  onClick={handleDeleteMember}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Hapus
                </button>
              ) : modal !== "view" ? (
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                  Simpan
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { BASE_URL, MEMBER_NAME, TOKEN } from "../../lib/constant";

const ITEMS_PER_PAGE = 5;

export default function AnggotaPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    id_member: "",
    name: "",
    email: "",
    address: "",
  });

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm({
      id_member: "",
      name: "",
      email: "",
      address: "",
    });
  };

  const fetchMembers = async () => {
    const res = await fetch(`${BASE_URL}/api/member/list`, {
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      cache: "no-store",
    });
    const json = await res.json();
    setMembers(json?.data || []);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const validateForm = () => {
    if (!form.id_member || !form.name || !form.email || !form.address) {
      alert("mohon diisi dengan lengkap");
      return false;
    }
    if (!form.email.endsWith("@gmail.com")) {
      alert("mohon diisi dengan benar");
      return false;
    }
    return true;
  };

  const handleCreateMember = async () => {
    if (!validateForm()) return;

    const res = await fetch(`${BASE_URL}/api/member/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({ data: form }),
    });

    if (res.ok) {
      await fetchMembers();
      closeModal();
    }
  };

  const handleUpdateMember = async () => {
    if (!validateForm()) return;

    const res = await fetch(`${BASE_URL}/api/member/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selected.documentId,
        data: form,
      }),
    });

    if (res.ok) {
      await fetchMembers();
      closeModal();
    }
  };

  const handleDeleteMember = async () => {
    const res = await fetch(`${BASE_URL}/api/member/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selected.documentId,
      }),
    });

    if (res.ok) {
      await fetchMembers();
      closeModal();
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const paginatedMembers = filteredMembers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f6f5fb] px-8 py-6">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Data Anggota</h1>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari anggota..."
              className="w-80 rounded-full border px-4 py-2 text-sm"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-6 py-2 text-white"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {paginatedMembers.map((m) => (
            <div
              key={m.documentId}
              className="flex w-full items-center justify-between rounded-2xl border bg-white px-8 py-6"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">ID: {m.id_member}</p>
                <h3 className="text-lg font-bold text-purple-700">{m.name}</h3>
                <p className="text-sm">{m.email}</p>
                <p className="text-sm">{m.address}</p>
              </div>

              <div className="flex w-[220px] gap-3">
                <button
                  onClick={() => {
                    setSelected(m);
                    setForm({
                      id_member: m.id_member,
                      name: m.name,
                      email: m.email,
                      address: m.address,
                    });
                    setModal("edit");
                  }}
                  className="flex-1 rounded-lg border py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(m);
                    setModal("delete");
                  }}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-white"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-full text-sm ${
                  page === i + 1
                    ? "bg-purple-700 text-white"
                    : "border bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8">
            {(modal === "add" || modal === "edit") && (
              <>
                <h2 className="mb-6 text-center text-lg font-bold">
                  {modal === "add" ? "Tambah Anggota" : "Edit Anggota"}
                </h2>
                <div className="space-y-3">
                  <input
                    value={form.id_member}
                    onChange={(e) => setForm({ ...form, id_member: e.target.value })}
                    placeholder="Nomor Anggota"
                    className="w-full rounded-lg border p-3"
                  />
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama Anggota"
                    className="w-full rounded-lg border p-3"
                  />
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    className="w-full rounded-lg border p-3"
                  />
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Alamat"
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </>
            )}

            {modal === "delete" && (
              <div className="space-y-6 text-center">
                <h2 className="text-lg font-semibold text-red-600">
                  Yakin ingin menghapus anggota ini?
                </h2>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="rounded-lg border px-8 py-2"
                  >
                    Tidak
                  </button>
                  <button
                    onClick={handleDeleteMember}
                    className="rounded-lg bg-red-500 px-8 py-2 text-white"
                  >
                    Ya
                  </button>
                </div>
              </div>
            )}

            {(modal === "add" || modal === "edit") && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-lg border px-4 py-2"
                >
                  Batal
                </button>
                <button
                  onClick={modal === "add" ? handleCreateMember : handleUpdateMember}
                  className="rounded-lg bg-purple-600 px-6 py-2 text-white"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

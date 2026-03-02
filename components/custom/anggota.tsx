"use client";

import { useState, useEffect } from "react";
import { BASE_URL, MEMBER_NAME, TOKEN } from "../../lib/constant";

const PAGE_SIZE = 6;

const AnggotaPage = () => {
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<
    "add" | "edit" | "delete" | "loan" | null
  >(null);
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

  const fetchAllMembers = async () => {
    try {
      let currentPage = 1;
      let totalPage = 1;
      let allData: any[] = [];

      while (currentPage <= totalPage) {
        const res = await fetch(
          `${BASE_URL}/api/member/list?page=${currentPage}&page_size=${PAGE_SIZE}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: TOKEN,
              "x-member-name": MEMBER_NAME,
            },
            cache: "no-store",
          }
        );

        const json = await res.json();
        allData = [...allData, ...(json?.data || [])];
        totalPage = json?.meta?.pagination?.page_count || 1;
        currentPage++;
      }

      setAllMembers(allData);
    } catch {}
  };

  const fetchLoans = async () => {
    const res = await fetch(`${BASE_URL}/api/loan/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      cache: "no-store",
    });

    const json = await res.json();
    setLoans(json?.data || []);
  };

const isLate = (returnDate?: string, actualReturnDate?: string) => {
  if (!returnDate || !actualReturnDate) return false;

  const due = new Date(returnDate);
  const actual = new Date(actualReturnDate);

  due.setHours(0, 0, 0, 0);
  actual.setHours(0, 0, 0, 0);

  return actual > due;
};

  const getLoanStatus = (loan: any) => {
    const actualReturn =
      loan.actual_return_date ??
      loan.return?.actual_return_date ??
      loan.actualReturnDate ??
      null;

    if (!actualReturn) {
      return isPastDue(loan.return_date) ? 'TERLAMBAT' : 'DIPINJAM';
    }

    return isLate(loan.return_date, actualReturn)
      ? 'TERLAMBAT'
      : 'DIKEMBALIKAN';
  };

  const isPastDue = (returnDate?: string) => {
    if (!returnDate) return false;

    const today = new Date();
    const due = new Date(returnDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };
  
  useEffect(() => {
    fetchAllMembers();
    fetchLoans();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredMembers = allMembers.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE) || 1;

  const members = filteredMembers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const renderPagination = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`rounded-lg px-4 py-2 text-sm ${
          page === p
            ? "bg-purple-700 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {p}
      </button>
    ));
  };

  const handleCreateMember = async () => {
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
      await fetchAllMembers();
      closeModal();
    }
  };

  const handleUpdateMember = async () => {
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
      await fetchAllMembers();
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
      body: JSON.stringify({ documentId: selected.documentId }),
    });

    if (res.ok) {
      await fetchAllMembers();
      closeModal();
    }
  };

  const filteredLoans = loans.filter(
    (loan) => loan.member?.documentId === selected?.documentId
  );

  return (
    <div className="min-h-screen bg-[#f6f5fb] px-8 py-6">
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold">Data Anggota</h1>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari anggota..."
            className="w-80 rounded-full border px-4 py-2 text-sm"
          />
          <button
            onClick={() => setModal("add")}
            className="rounded-full bg-purple-700 px-6 py-2 text-sm font-semibold text-white"
          >
            + Tambah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map((m) => (
          <div
            key={m.documentId}
            className="flex justify-between rounded-xl border bg-white px-8 py-4"
          >
            <div>
              <p className="text-xs text-gray-500">ID: {m.id_member}</p>
              <h3 className="text-base font-semibold text-purple-700">
                {m.name}
              </h3>
              <p className="text-sm">{m.email}</p>
              <p className="text-sm">{m.address}</p>
            </div>

            <div className="flex w-[360px] gap-3">
              <button
                onClick={() => {
                  setSelected(m);
                  setModal("loan");
                }}
                className="flex-1 rounded-lg bg-blue-500 py-1.5 text-sm text-white"
              >
                Lihat
              </button>
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
                className="flex-1 rounded-lg bg-yellow-400 py-1.5 text-sm font-semibold text-black"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelected(m);
                  setModal("delete");
                }}
                className="flex-1 rounded-lg bg-red-500 py-1.5 text-sm text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        {renderPagination()}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8">
            {modal === "add" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Tambah Anggota</h2>
                <input
                  value={form.id_member}
                  onChange={(e) =>
                    setForm({ ...form, id_member: e.target.value })
                  }
                  placeholder="ID Member"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Nama"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Alamat"
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="border px-4 py-1 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateMember}
                    className="bg-purple-700 text-white px-4 py-1 rounded"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {modal === "edit" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Edit Anggota</h2>
                <input
                  value={form.id_member}
                  onChange={(e) =>
                    setForm({ ...form, id_member: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="border px-4 py-1 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpdateMember}
                    className="bg-purple-700 text-white px-4 py-1 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            )}

            {modal === "delete" && (
              <div className="space-y-6 text-center">
                <h2 className="text-xl font-bold">
                  Yakin hapus {selected?.name}?
                </h2>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="border px-4 py-1 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteMember}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            )}

            {modal === "loan" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  Peminjaman {selected?.name}
                </h2>
                {filteredLoans.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Tidak ada peminjaman
                  </p>
                ) : (
          filteredLoans.map((loan) => {
              const status = getLoanStatus(loan);

              return (
                <div
                  key={loan.documentId}
                  className="border rounded p-3 space-y-1"
                >
                  <p className="font-semibold">
                    {loan.book?.title}
                  </p>

                  <p className="text-sm">
                    Tanggal Pinjam: {loan.loan_date}
                  </p>

                  <p className="text-sm">
                    Tanggal Kembali: {loan.return_date || "-"}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded px-3 py-1 text-xs font-semibold ${
                      status === "DIKEMBALIKAN"  
                        ? "bg-[#DFF3E3] text-[#1E6B3A]" 
                        : status === "DIPINJAM"
                        ? "bg-[#E0ECFF] text-[#1E4A7B]"
                        : "bg-[#FFD6D6] text-[#7A1F1F]"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })
                )}
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="border px-4 py-1 rounded"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnggotaPage;

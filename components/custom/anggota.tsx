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
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
      } | null>(null);
        
        const showToast = (
        message: string,
        type: "success" | "error"
      ) => {
        setToast({ message, type });
  
        setTimeout(() => {
          setToast(null);
        }, 1000);
      };

const [errors, setErrors] = useState({
  id_member: "",
  name: "",
  email: "",
  address: "",
});

  const [form, setForm] = useState({
    id_member: "",
    name: "",
    email: "",
    address: "",
  });

  const closeModal = () => {
  setModal(null);
  setSelected(null);
  setSubmitted(false);

  setErrors({
    id_member: "",
    name: "",
    email: "",
    address: "",
  });

  setForm({
    id_member: "",
    name: "",
    email: "",
    address: "",
  });
};

  const fetchAllMembers = async () => {
  setLoading(true);

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
    setLoading(false);
  } catch {
    setLoading(false);
  }
};

 const fetchLoans = async () => {
  try {
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
  } catch {}
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

const validateForm = () => {
  const newErrors = {
    id_member: "",
    name: "",
    email: "",
    address: "",
  };

  if (!form.id_member) newErrors.id_member = "ID anggota wajib diisi";
  if (!form.name) newErrors.name = "Nama wajib diisi";
  if (!form.email) {
  newErrors.email = "Email wajib diisi";
} else if (!/\S+@\S+\.\S+/.test(form.email)) {
  newErrors.email = "Format email tidak valid";
}
  if (!form.address) newErrors.address = "Alamat wajib diisi";

  setErrors(newErrors);

  return !Object.values(newErrors).some((e) => e !== "");
};

 const handleCreateMember = async () => {
  setSubmitted(true);

  if (!validateForm()) return;

  const res = await fetch(`${BASE_URL}/api/member/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: JSON.stringify({
      data: {
        ...form,
        id_member: `librava-member-${form.id_member}`,
      },
    }),
  });

  if (res.ok) {
    showToast("Anggota berhasil ditambahkan", "success");
    await fetchAllMembers();
    closeModal();
  } else {
    showToast("Gagal menambahkan anggota", "error");
  }
};

const handleUpdateMember = async () => {
  setSubmitted(true);

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
      data: {
        ...form,
        id_member: `librava-member-${form.id_member}`,
      },
    }),
  });

  if (res.ok) {
    showToast("Data anggota berhasil diperbarui", "success");
    await fetchAllMembers();
    closeModal();
  } else {
    showToast("Gagal memperbarui data", "error");
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
    showToast("Anggota berhasil dihapus", "success");
    await fetchAllMembers();
    closeModal();
  } else {
    showToast("Gagal menghapus anggota", "error");
  }
};

  const filteredLoans = loans.filter(
    (loan) => loan.member?.documentId === selected?.documentId
  );

  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5fb]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Memuat data anggota...</p>
      </div>
    </div>
  );
}

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

      {members.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      className="mb-6 w-40 opacity-80"
      alt="Anggota tidak ditemukan"
    />

    <h3 className="text-lg font-semibold text-gray-700">
      Anggota tidak ditemukan
    </h3>

    <p className="text-sm text-gray-500">
      Coba gunakan kata kunci lain
    </p>
  </div>
) : (
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
                id_member: m.id_member.replace("librava-member-", ""),
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
)}

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {members.length > 0 && search === "" && (
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
)}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8">
            {modal === "add" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Tambah Anggota</h2>
                <div className="flex items-center border rounded overflow-hidden">
              <span className="bg-gray-100 px-3 text-sm text-gray-600">
                librava-member-
              </span>

              <input
                type="text"
                value={form.id_member.replace("librava-member-", "")}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setForm({
                    ...form,
                    id_member: value,
                  });
                }}
                className="flex-1 p-2 text-sm outline-none"
              />
            </div>

            {submitted && errors.id_member && (
  <p className="text-xs text-red-500">{errors.id_member}</p>
)}
                <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Nama"
                className="w-full border p-2 rounded"
              />

              {submitted && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
                <input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
              className="w-full border p-2 rounded"
            />

            {submitted && errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
               <input
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            placeholder="Alamat"
            className="w-full border p-2 rounded"
          />

         {submitted && errors.address && (
  <p className="text-xs text-red-500">{errors.address}</p>
)}
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

              <div className="flex items-center border rounded overflow-hidden">
                <span className="bg-gray-100 px-3 text-sm text-gray-600">
                  librava-member-
                </span>

                <input
                  type="text"
                  value={form.id_member.replace("librava-member-", "")}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setForm({
                      ...form,
                      id_member: value,
                    });
                  }}
                  className={`flex-1 p-2 text-sm outline-none ${
                    submitted && errors.id_member ? "border-red-500" : ""
                  }`}
                />
              </div>

              {submitted && errors.id_member && (
                <p className="text-xs text-red-500">{errors.id_member}</p>
              )}

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className={`w-full border p-2 rounded ${
                  submitted && errors.name ? "border-red-500" : ""
                }`}
              />

              {submitted && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`w-full border p-2 rounded ${
                  submitted && errors.email ? "border-red-500" : ""
                }`}
              />

              {submitted && errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}

              <input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className={`w-full border p-2 rounded ${
                  submitted && errors.address ? "border-red-500" : ""
                }`}
              />

              {submitted && errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}

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
      {toast && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-md">
    <div
      className={`w-[320px] rounded-2xl p-6 text-center shadow-xl border
      ${
        toast.type === "success"
          ? "bg-purple-500/90 border-purple-400 text-white"
          : "bg-red-500/90 border-red-400 text-white"
      }`}
    >
      <div className="mb-2 text-lg">
        {toast.type === "success" ? "✔" : "⚠"}
      </div>

      <p className="text-sm font-medium">{toast.message}</p>

      {/* LOADING SPINNER */}
      <div className="mt-4 flex justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
    </div>
        </div>
  </div>
)}
</div>
  );
};

export default AnggotaPage;                                                               
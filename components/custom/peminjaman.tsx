"use client";

import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME } from "../../lib/constant";

const PAGE_SIZE = 6;

export default function PeminjamanPage() {
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<any[]>([]);
  const [searchBook, setSearchBook] = useState("");
  const [searchMember, setSearchMember] = useState("");
  const [selectedBuku, setSelectedBuku] = useState<any>(null);
  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPilihBuku, setShowPilihBuku] = useState(false);
  const [showPilihAnggota, setShowPilihAnggota] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
} | null>(null);

const showToast = (message: string, type: "success" | "error") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 1000);
};

const [formData, setFormData] = useState({
  bookId: "",
  memberId: "",
  loanDate: "",
  returnDate: "",
});

const fetchLoans = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
      search: search || "",
    });

    const res = await fetch(
      `${BASE_URL}/api/loan/list?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) return;

    if (!Array.isArray(json?.data)) return;

    setLoans(json.data);
    setTotalPages(json?.meta?.pagination?.page_count || 1);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const fetchBooks = async () => {
  const params = new URLSearchParams({
    page: "1",
    page_size: "100", 
  });

  const res = await fetch(`${BASE_URL}/api/book/list?${params.toString()}`, {
    headers: { Authorization: TOKEN, "x-member-name": MEMBER_NAME },
  });

  const json = await res.json();
  setBooks(json?.data || []);
};

  const fetchMembers = async () => {
  const params = new URLSearchParams({
    page: "1",
    page_size: "100",
  });

  const res = await fetch(`${BASE_URL}/api/member/list?${params.toString()}`, {
    headers: { Authorization: TOKEN, "x-member-name": MEMBER_NAME },
  });

  const json = await res.json();
  setMembers(json?.data || []);
};

  useEffect(() => {
    fetchLoans();
    fetchBooks();
    fetchMembers();
  }, []);

    useEffect(() => {
      fetchLoans();
    }, [page, search]);
  
    useEffect(() => {
      setPage(1);
    }, [search]);

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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  const newErrors: any = {};

  if (!formData.bookId) newErrors.bookId = "Buku wajib dipilih";
  if (!formData.memberId) newErrors.memberId = "Anggota wajib dipilih";
  if (!formData.loanDate) newErrors.loanDate = "Tanggal pinjam wajib diisi";
  if (!formData.returnDate) newErrors.returnDate = "Tanggal kembali wajib diisi";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  const res = await fetch(`${BASE_URL}/api/loan/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: JSON.stringify({
      data: {
        book: formData.bookId,
        member: formData.memberId,
        loan_date: formData.loanDate,
        return_date: formData.returnDate,
      },
    }),
  });

  if (!res.ok) {
    showToast("Gagal menambahkan peminjaman", "error");
    return;
  }

  showToast("Peminjaman berhasil ditambahkan", "success");

  setShowAdd(false);
  setErrors({});

  setFormData({
    bookId: "",
    memberId: "",
    loanDate: "",
    returnDate: "",
  });

  fetchLoans();
};

  const handleReturn = async () => {
  const res = await fetch(`${BASE_URL}/api/return/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: JSON.stringify({
      data: {
        loan: selectedLoan.documentId,
        actual_return_date: new Date().toISOString().split("T")[0],
      },
    }),
  });

if (!res.ok) {
  showToast("Gagal mengembalikan buku", "error");
  return;
}

showToast("Buku berhasil dikembalikan", "success");

  setShowConfirm(false);
  fetchLoans();
};

  const getStatus = (loan: any) => {
    if (!loan.return) return "DIPINJAM";
    const planned = new Date(loan.return_date);
    const actual = new Date(loan.return.actual_return_date);
    if (actual > planned) return "TERLAMBAT";
    return "DIKEMBALIKAN";
  };

  const getStatusStyle = (status: string) => {
    if (status === "DIPINJAM") return "bg-blue-700 text-white";
    if (status === "DIKEMBALIKAN") return "bg-green-600 text-white";
    if (status === "TERLAMBAT") return "bg-red-600 text-white";
    return "bg-gray-500 text-white";
  };

  const filtered = loans.filter((l) =>
    l.book?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBook = books.find((b) => b.documentId === formData.bookId);
  const selectedMember = members.find((m) => m.documentId === formData.memberId);

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5fb]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Memuat data peminjaman...</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="mx-auto max-w-full px-8 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Peminjaman
          </h1>
          <div className="flex w-full gap-3 sm:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku..."
              className="w-full rounded-full border px-5 py-2 text-sm sm:w-80"
            />
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full bg-purple-700 px-6 py-2 text-white">
          + Tambah
        </button>


          </div>
        </div>

        <div className="space-y-6">
          {filtered.map((loan) => {
            const status = getStatus(loan);
            return (
              <div key={loan.documentId} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-purple-700">
                      {loan.book?.title}
                    </h3>
                    <p className="text-sm">
                      Peminjam: {loan.member?.name}
                    </p>
                    <div className="flex gap-8 text-sm text-gray-600">
                      <div>Pinjam: {loan.loan_date}</div>
                      <div>Kembali: {loan.return_date}</div>
                    </div>
                  </div>

                  <span className={`min-w-[120px] text-center rounded-full px-4 py-2 text-sm font-semibold shadow ${getStatusStyle(status)}`}>
                    {status}
                  </span>
                </div>

                {!loan.return && (
  <div className="mt-5 flex gap-3">

    <button
      onClick={() => {
        setSelectedLoan(loan);

        setFormData({
          bookId: loan.book?.documentId,
          memberId: loan.member?.documentId,
          loanDate: loan.loan_date,
          returnDate: loan.return_date,
        });

        setShowEdit(true);
      }}
      className="rounded-lg bg-yellow-500 px-7 py-2 text-sm font-semibold text-white"
    >
      Edit
    </button>

    <button
      onClick={() => {
        setSelectedLoan(loan);
        setShowConfirm(true);
      }}
      className="rounded-lg bg-green-600 px-7 py-2 text-sm font-semibold text-white"
    >
      Kembalikan
    </button>

  </div>
)}
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center gap-2">
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
      </main>

      {showAdd && (
        <Modal title="Tambah Peminjaman" onClose={() => setShowAdd(false)}>
          <div className="space-y-4">
            <button
              onClick={() => setShowPilihBuku(true)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                errors.bookId ? "border-red-500" : ""
              }`}
            >
              {selectedBook ? selectedBook.title : "Pilih Buku"}
            </button>
            {errors.bookId && (
              <p className="text-xs text-red-500">{errors.bookId}</p>
            )}

            <button
              onClick={() => setShowPilihAnggota(true)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                errors.memberId ? "border-red-500" : ""
              }`}
            >
              {selectedMember ? selectedMember.name : "Pilih Anggota"}
            </button>
            {errors.memberId && (
              <p className="text-xs text-red-500">{errors.memberId}</p>
            )}

            <input
            type="date"
            name="loanDate"
            value={formData.loanDate}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${
              errors.loanDate ? "border-red-500" : ""
            }`}
          />
          {errors.loanDate && (
            <p className="text-xs text-red-500">{errors.loanDate}</p>
          )}

            <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm ${
            errors.returnDate ? "border-red-500" : ""
          }`}
        />
        {errors.returnDate && (
          <p className="text-xs text-red-500">{errors.returnDate}</p>
        )}

          <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => {
              setShowAdd(false);
              setErrors({});
            }}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-purple-700 px-6 py-2 text-sm font-semibold text-white"
          >
            Simpan
          </button>
        </div>
          </div>
        </Modal>
      )}

{showPilihBuku && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
      <div className="border-b px-5 py-3">
        <h3 className="text-lg font-bold text-purple-800">Pilih Buku</h3>
      </div>
      <div className="px-5 pt-4">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-"
          value={searchBook}
          onChange={(e) => setSearchBook(e.target.value)}
        />
      </div>

      <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
        {books
          .filter((b) =>
            b.title?.toLowerCase().includes(searchBook.toLowerCase())
          )
          .map((b) => (
            <button
              key={b.documentId}
              disabled={b.stock === 0}
              onClick={() => {
                setSelectedBuku(b);
                setFormData({
                  ...formData,
                  bookId: b.documentId,
                });
                setShowPilihBuku(false);
                setSearchBook("");
              }}
              className={`flex w-full gap-4 rounded-xl border p-3 text-left transition
              ${
                b.stock === 0
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-purple-800"
              }`}
            >
              <img
                src={
                  b.cover?.url
                    ? `${BASE_URL}${b.cover.url}`
                    : "/placeholder-book.jpg"
                }
                alt={b.title}
                className="h-26 w-16 rounded-lg object-cover"
              />

              <div className="flex-1 text-sm">
                <h4 className="font-semibold text-gray-800">{b.title}</h4>
                <p className="text-xs text-gray-600">
                  Penulis: {b.writer}
                </p>
                <p className="text-xs text-gray-600">
                  Penerbit: {b.publisher}
                </p>
                <p className="text-xs text-gray-500">
                  Tahun: {b.published_year} • {b.categories?.name}
                </p>

                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs
                  ${
                    b.stock === 0
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {b.stock === 0 ? "Stok Habis" : `Stok: ${b.stock}`}
                </span>
              </div>
            </button>
          ))}
      </div>

      <div className="w-full rounded-lg flex justify-end border-t px-5 py-2">
        <button
          onClick={() => {
            setShowPilihBuku(false);
            setSearchBook(""); 
          }}
          className="w-full rounded-lg bg-purple-700 py-2 text-sm font-semibold text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}


     {showPilihAnggota && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
      <div className="border-b px-5 py-3">
        <h3 className="text-lg font-bold text-purple-800">Pilih Anggota</h3>
      </div>

      <div className="px-5 pt-4">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600"
          value={searchMember}
          onChange={(e) => setSearchMember(e.target.value)}
        />
      </div>

      <div className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4">
        {members
          .filter(
            (m) =>
              m.name?.toLowerCase().includes(searchMember.toLowerCase()) ||
              m.email?.toLowerCase().includes(searchMember.toLowerCase())
          )
          .map((m) => (
            <button
              key={m.documentId}
              onClick={() => {
                setSelectedAnggota(m);
                setFormData({
                  ...formData,
                  memberId: m.documentId,
                });
                setShowPilihAnggota(false);
                setSearchMember("");
              }}
              className="w-full rounded-xl border p-3 text-left transition hover:border-purple-800"
            >
              <h4 className="text-sm font-semibold text-gray-800">
                {m.name}
              </h4>
              <p className="text-xs text-gray-600">{m.email}</p>
            </button>
            
          ))}
      </div>
      <div className="w-full rounded-lg flex justify-end border-t px-5 py-2">
        <button
          onClick={() => {
            setShowPilihAnggota(false);
            setSearchMember(""); 
          }}
          className="w-full rounded-lg bg-purple-700 py-2 text-sm font-semibold text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

      {showConfirm && selectedLoan && (
  <Modal title="Konfirmasi Pengembalian" onClose={() => setShowConfirm(false)}>
    <div className="text-center space-y-4">
      <p>
        Yakin mengembalikan <br />
        <span className="font-semibold text-purple-700">
          {selectedLoan.book?.title}
        </span>
        ?
      </p>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded-lg border px-6 py-2 text-sm"
        >
          Batal
        </button>

        <button
          onClick={handleReturn}
          className="rounded-lg bg-green-600 px-6 py-2 text-sm text-white"
        >
          Kembalikan
        </button>
      </div>
    </div>
  </Modal>
)}
      {showConfirm && selectedLoan && (
        <Modal title="Konfirmasi Pengembalian" onClose={() => setShowConfirm(false)}>
          <div className="text-center space-y-4">
            <p>
              Yakin mengembalikan <br />
              <span className="font-semibold text-purple-700">
                {selectedLoan.book?.title}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border px-6 py-2 text-sm"
              >
                Batal
              </button>

              <button
                onClick={handleReturn}
                className="rounded-lg bg-green-600 px-6 py-2 text-sm text-white"
              >
                Kembalikan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* TOAST */}
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

            <div className="mt-4 flex justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          </div>
        </div>
      )}
</div>
);
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-center text-xl font-bold text-purple-700">
          {title}
        </h2>
        {children}
      </div>
    </div>

  );
}


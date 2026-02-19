"use client";

import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME } from "../../lib/constant";

export default function PeminjamanPage() {
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  const [bookSearch, setBookSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
    borrowDate: "",
    returnDate: "",
  });

  const fetchLoans = async () => {
    const res = await fetch(`${BASE_URL}/api/loan/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
    });
    const json = await res.json();
    setLoans(json?.data || []);
  };

  const fetchBooks = async () => {
    const res = await fetch(`${BASE_URL}/api/book/list`, {
      headers: { Authorization: TOKEN, "x-member-name": MEMBER_NAME },
    });
    const json = await res.json();
    setBooks(json?.data || []);
  };

  const fetchMembers = async () => {
    const res = await fetch(`${BASE_URL}/api/member/list`, {
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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch(`${BASE_URL}/api/loan/add`, {
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
          loan_date: formData.borrowDate,
          return_date: formData.returnDate,
        },
      }),
    });

    setShowAdd(false);
    setFormData({
      bookId: "",
      memberId: "",
      borrowDate: "",
      returnDate: "",
    });
    fetchLoans();
  };

  const handleReturn = async () => {
    await fetch(`${BASE_URL}/api/return/add`, {
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

  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const selectedBook = books.find((b) => b.documentId === formData.bookId);
  const selectedMember = members.find((m) => m.documentId === formData.memberId);

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
              className="rounded-full bg-purple-700 px-6 py-2 text-sm font-semibold text-white"
            >
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
                  <div className="mt-5">
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
      </main>

      {showAdd && (
        <Modal title="Tambah Peminjaman" onClose={() => setShowAdd(false)}>
          <div className="space-y-4 relative">

            <div className="relative">
              <div onClick={() => setShowBookDropdown(!showBookDropdown)} className="w-full cursor-pointer rounded-lg border px-4 py-2 text-sm bg-white">
                {selectedBook ? selectedBook.title : "Pilih Buku"}
              </div>

              {showBookDropdown && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
                  <input
                    placeholder="Cari buku..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full border-b px-4 py-2 text-sm"
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredBooks.map((b) => (
                      <div
                        key={b.documentId}
                        onClick={() => {
                          setFormData({ ...formData, bookId: b.documentId });
                          setShowBookDropdown(false);
                          setBookSearch("");
                        }}
                        className="p-4 hover:bg-purple-50 cursor-pointer border-b text-sm"
                      >
                        {b.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div onClick={() => setShowMemberDropdown(!showMemberDropdown)} className="w-full cursor-pointer rounded-lg border px-4 py-2 text-sm bg-white">
                {selectedMember ? selectedMember.name : "Pilih Member"}
              </div>

              {showMemberDropdown && (
                <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
                  <input
                    placeholder="Cari member..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full border-b px-4 py-2 text-sm"
                  />
                  <div className="max-h-60 overflow-y-auto">
                    {filteredMembers.map((m) => (
                      <div
                        key={m.documentId}
                        onClick={() => {
                          setFormData({ ...formData, memberId: m.documentId });
                          setShowMemberDropdown(false);
                          setMemberSearch("");
                        }}
                        className="p-4 hover:bg-purple-50 cursor-pointer border-b text-sm"
                      >
                        {m.name} - {m.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <input type="date" name="borrowDate" value={formData.borrowDate} onChange={handleChange} className="w-full rounded-lg border px-4 py-2 text-sm" />
            <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} className="w-full rounded-lg border px-4 py-2 text-sm" />

            <button onClick={handleSubmit} className="w-full rounded-lg bg-purple-700 py-2 text-sm font-semibold text-white">
              Simpan
            </button>
          </div>
        </Modal>
      )}

      {showConfirm && selectedLoan && (
        <Modal title="Konfirmasi Pengembalian" onClose={() => setShowConfirm(false)}>
          <p className="text-center text-sm">
            Yakin mengembalikan
            <br />
            <span className="font-semibold text-purple-700">
              {selectedLoan.book?.title}
            </span>
            ?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={() => setShowConfirm(false)} className="rounded-lg border px-8 py-2 text-sm">
              Tidak
            </button>
            <button onClick={handleReturn} className="rounded-lg bg-green-600 px-8 py-2 text-sm text-white">
              Kembalikan
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-purple-700 text-center">
          {title}
        </h2>
        {children}
        <div className="mt-6 text-center">
          <button onClick={onClose} className="rounded-lg border px-6 py-2 text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

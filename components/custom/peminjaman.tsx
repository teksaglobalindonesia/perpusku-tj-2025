"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const PeminjamanPage = () => {
  const [search, setSearch] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

const [showAddModal, setShowAddModal] = useState(false);
const [showBookModal, setShowBookModal] = useState(false);
const [showMemberModal, setShowMemberModal] = useState(false);

const [selectedBook, setSelectedBook] = useState<any>(null);
const [selectedMember, setSelectedMember] = useState<any>(null);

const [newLoanDate, setNewLoanDate] = useState("");
const [newReturnDate, setNewReturnDate] = useState("");


  // Dummy data peminjaman
  const loans = [
    {
      id: 1,
      title: "Dr. STONE",
      borrower: "Ahmad Rizki",
      loanDate: "2025-12-01",
      returnDate: "2025-12-15",
    },
    {
      id: 2,
      title: "Death Note",
      borrower: "Siti Aisyah",
      loanDate: "2025-12-01",
      returnDate: "2025-12-03",
    },
    {
      id: 3,
      title: "Harry Potter",
      borrower: "Budi Santoso",
      loanDate: "2025-11-28",
      returnDate: "2025-12-01",
    },
  ];

  const books = [
  { id: 1, title: "Dr. STONE" },
  { id: 2, title: "Death Note" },
  { id: 3, title: "Harry Potter" },
];

const members = [
  { id: 1, name: "Ahmad Rizki" },
  { id: 2, name: "Siti Aisyah" },
  { id: 3, name: "Budi Santoso" },
];


  const today = new Date();

  const filteredLoans = loans.filter((loan) =>
    loan.title.toLowerCase().includes(search.toLowerCase())
  );

  const isLate = (returnDate: string) => {
    const dueDate = new Date(returnDate);
    return dueDate < today;
  };

  const handleReturn = (loan: any) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
    Data Peminjaman
  </h1>

  <button
    onClick={() => setShowAddModal(true)}
    className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    + Tambah Peminjaman
  </button>
</div>


      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow mb-6 sm:mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari judul buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      {/* List Peminjaman */}
      <div className="space-y-3 sm:space-y-4">
        {filteredLoans.map((loan) => {
          const late = isLate(loan.returnDate);

          return (
            <div
              key={loan.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Info */}
              <div className="flex flex-col gap-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {loan.title}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500">
                  <span>Peminjam: {loan.borrower}</span>
                  <span>Pinjam: {loan.loanDate}</span>
                  <span>Kembali: {loan.returnDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {late && (
                    <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-red-100 text-red-600">
                      Terlambat
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2 justify-end sm:justify-start">
                <button
                  onClick={() => handleReturn(loan)}
                  className="text-[11px] sm:text-xs px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  Kembalikan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLoans.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-sm">
          Data peminjaman tidak ditemukan
        </div>
      )}

      {/* Modal Kembalikan */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">
              Konfirmasi Pengembalian
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin mengembalikan buku{" "}
              <span className="font-semibold text-gray-800">
                {selectedLoan.title}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-800">
                {selectedLoan.borrower}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Ya, Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Peminjaman */}
{showAddModal && (
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-scale-in">
      <h2 className="text-lg font-semibold mb-4">Tambah Peminjaman</h2>

      <div className="space-y-4">
        {/* Pilih Buku */}
        <div>
          <label className="text-xs text-gray-500">Buku</label>
          <button
            type="button"
            onClick={() => setShowBookModal(true)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border text-left hover:bg-gray-50"
          >
            {selectedBook ? selectedBook.title : "Pilih Buku"}
          </button>
        </div>

        {/* Pilih Anggota */}
        <div>
          <label className="text-xs text-gray-500">Anggota</label>
          <button
            type="button"
            onClick={() => setShowMemberModal(true)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border text-left hover:bg-gray-50"
          >
            {selectedMember ? selectedMember.name : "Pilih Anggota"}
          </button>
        </div>

        {/* Tanggal Pinjam */}
        <div>
          <label className="text-xs text-gray-500">Tanggal Pinjam</label>
          <input
            type="date"
            value={newLoanDate}
            onChange={(e) => setNewLoanDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none"
          />
        </div>

        {/* Tanggal Kembali */}
        <div>
          <label className="text-xs text-gray-500">Tanggal Pengembalian</label>
          <input
            type="date"
            value={newReturnDate}
            onChange={(e) => setNewReturnDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
        >
          Batal
        </button>
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Pilih Buku */}
{showBookModal && (
  <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-sm rounded-2xl p-5 animate-scale-in">
      <h3 className="text-sm font-semibold mb-4">Pilih Buku</h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => {
              setSelectedBook(book);
              setShowBookModal(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm"
          >
            {book.title}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowBookModal(false)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Pilih Anggota */}
{showMemberModal && (
  <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-sm rounded-2xl p-5 animate-scale-in">
      <h3 className="text-sm font-semibold mb-4">Pilih Anggota</h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => {
              setSelectedMember(member);
              setShowMemberModal(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm"
          >
            {member.name}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowMemberModal(false)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PeminjamanPage;

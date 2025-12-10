"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const PengembalianPage = () => {
  const [search, setSearch] = useState("");

  // Dummy data pengembalian
  const returns = [
    {
      id: 1,
      title: "Dr. STONE",
      borrower: "Ahmad Rizki",
      loanDate: "2025-12-01",
      estimatedReturnDate: "2025-12-10",
      actualReturnDate: "2025-12-12",
    },
    {
      id: 2,
      title: "Death Note",
      borrower: "Siti Aisyah",
      loanDate: "2025-12-01",
      estimatedReturnDate: "2025-12-05",
      actualReturnDate: "2025-12-05",
    },
    {
      id: 3,
      title: "Harry Potter",
      borrower: "Budi Santoso",
      loanDate: "2025-11-20",
      estimatedReturnDate: "2025-11-25",
      actualReturnDate: "2025-11-30",
    },
  ];

  // Filter berdasarkan judul buku
  const filteredReturns = returns.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Cek keterlambatan
  const isLate = (estimated: string, actual: string) => {
    const est = new Date(estimated);
    const act = new Date(actual);
    return act > est;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Data Pengembalian
        </h1>
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

      {/* List Data */}
      <div className="space-y-3 sm:space-y-4">
        {filteredReturns.map((item) => {
          const late = isLate(
            item.estimatedReturnDate,
            item.actualReturnDate
          );

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Info */}
              <div className="flex flex-col gap-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {item.title}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500">
                  <span>Peminjam: {item.borrower}</span>
                  <span>Pinjam: {item.loanDate}</span>
                  <span>Estimasi: {item.estimatedReturnDate}</span>
                  <span>Dikembalikan: {item.actualReturnDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {late && (
                    <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-red-100 text-red-600">
                      Terlambat
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReturns.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-sm">
          Data pengembalian tidak ditemukan
        </div>
      )}
    </div>
  );
};

export default PengembalianPage;

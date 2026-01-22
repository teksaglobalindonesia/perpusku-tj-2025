"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME } from "@/lib/constant";



const PengembalianPage = () => {
const [search, setSearch] = useState("");
const [returns, setReturns] = useState<any[]>([]);
const [books, setBooks] = useState<any[]>([]);
const [members, setMembers] = useState<any[]>([]);
const ITEMS_PER_PAGE = 4;
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  setCurrentPage(1);
}, [search]);

useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/return/list`, {
        method: "GET",
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });

      const json = await res.json();
      setReturns(json?.data ?? []);
    } catch (err) {
      console.error("Gagal ambil pengembalian:", err);
    }
  })();
}, []);

  // Filter Search
const filteredReturns = returns.filter((item) =>
  item.book?.title?.toLowerCase().includes(search.toLowerCase())
);

const totalPages = Math.ceil(filteredReturns.length / ITEMS_PER_PAGE);

const paginatedReturns = filteredReturns.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  // Cek keterlambatan
  const isLate = (estimated: string, actual: string) => {
    if (!estimated || !actual) return false;
  
    const estimatedDate = new Date(estimated);
    const actualDate = new Date(actual);
  
    // hitung selisih hari
    const diffTime = actualDate.getTime() - estimatedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    // late kalau lebih dari 1 hari
    return diffDays > 1;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Return Data
        </h1>
      </div>
      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow mb-6 sm:mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>
      {/* List Data */}
      <div className="space-y-3 sm:space-y-4">
        {paginatedReturns.map((item) => {
            const late = isLate(
              item.return_date,
              item.return?.actual_return_date
            );

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Info */}
              <div className="flex flex-col gap-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {item.book?.title}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500">
                  <span>Borrower: {item.member?.name}</span>
                  <span>Loan Date: {item.loan_date}</span>
                  <span>Estimate: {item.return_date}</span>
                  <span>
                     Returned:{" "}
                     {item.return?.actual_return_date ?? "-"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                {late && (
                    <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-red-100 text-red-600">
                      Late Return
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
          Return data not found
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PengembalianPage;

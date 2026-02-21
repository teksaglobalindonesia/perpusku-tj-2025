"use client";

import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

const PAGE_SIZE = 6;

export default function PengembalianPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

      useEffect(() => {
      fetchReturns();
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

  const fetchReturns = async () => {
        try {
          const params = new URLSearchParams({
            page: String(page),
            page_size: String(PAGE_SIZE),
            search: search || "",
          });
    
          const res = await fetch(
            `${BASE_URL}/api/return/list?${params.toString()}`,
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
    
          setReturns(json.data);
          setTotalPages(json?.meta?.pagination?.page_count || 1);
        } catch {}
      };

  const filtered = returns.filter((item) =>
  item.book?.title?.toLowerCase().includes(search.toLowerCase())
);


  return (
    <div className="min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="mx-auto max-w-full px-8 py-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Pengembalian
          </h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul buku..."
            className="w-full rounded-full border px-5 py-2 text-sm sm:w-80"
          />
        </div>

        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="w-full rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-bold text-purple-700">
                    {item.book?.title}
                  </h3>

                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold">Peminjam:</span>{" "}
                      {item.member?.name}
                    </div>
                    <div>{item.member?.email}</div>
                    <div>{item.member?.address}</div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <div>Pinjam: {item.loan_date}</div>
                    <div>Rencana Kembali: {item.return_date}</div>
                    <div>
                      Dikembalikan:{" "}
                      {item.return?.actual_return_date}
                    </div>
                  </div>
                </div>

                <span className="min-w-[140px] text-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow">
                  DIKEMBALIKAN
                </span>
              </div>
            </div>
          ))}
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
    </div>
  );
}

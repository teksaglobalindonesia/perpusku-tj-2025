"use client";

import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

export default function PengembalianPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/return/list`, {
        method: "GET",
        headers: {
            Authorization: TOKEN,
           "x-member-name": MEMBER_NAME,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        return;
      }

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter((item) =>
    item.book?.title.toLowerCase().includes(search.toLowerCase())
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

        {loading && (
          <div className="text-center text-sm text-gray-500">
            Loading...
          </div>
        )}

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
      </main>
    </div>
  );
}

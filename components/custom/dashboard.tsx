"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../custom/navbar";


const ITEMS_PER_PAGE = 3;

const booksData = [
  { id: 1, title: "Harry Potter", genre: "Fantasy", author: "J.K. Rowling", stock: 12, image: "/img/novel 1.jpeg" },
  { id: 2, title: "The Hunger Games", genre: "Dystopia", author: "Suzanne Collins", stock: 0, image: "/img/novel 2.jpeg" },
  { id: 3, title: "Aku Ini Binatang Jalang", genre: "Puisi", author: "Chairil Anwar", stock: 5, image: "/img/puisi 1.jpeg" },
  { id: 4, title: "Milk and Honey", genre: "Puisi", author: "Rupi Kaur", stock: 7, image: "/img/puisi 2.jpeg" },
  { id: 5, title: "Perahu Kertas", genre: "Novel", author: "Dewi Lestari", stock: 0, image: "/img/sol 1.jpeg" },
];

const borrowToday = [
  { id: 1, title: "Harry Potter", name: "Areksa", borrow: "10 Jan 2026", return: "15 Jan 2026" },
  { id: 2, title: "The Hunger Games", name: "Alena", borrow: "10 Jan 2026", return: "14 Jan 2026" },
  { id: 3, title: "Milk and Honey", name: "Angkasa", borrow: "10 Jan 2026", return: "13 Jan 2026" },
  { id: 4, title: "Perahu Kertas", name: "Sadewa", borrow: "10 Jan 2026", return: "16 Jan 2026" },
];

const returnToday = [
  { id: 1, title: "Milk and Honey", name: "Sadewa", borrow: "5 Jan 2026", return: "10 Jan 2026", status: "Dikembalikan" },
  { id: 2, title: "Perahu Kertas", name: "Sheyln", borrow: "6 Jan 2026", return: "10 Jan 2026", status: "Terlambat" },
  { id: 3, title: "Norwegian Wood", name: "Alica", borrow: "7 Jan 2026", return: "10 Jan 2026", status: "Dikembalikan" },
  { id: 4, title: "Harry Potter", name: "Raka", borrow: "4 Jan 2026", return: "10 Jan 2026", status: "Dikembalikan" },
];

const paginate = (data: any[], page: number) =>
  data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

const totalPage = (data: any[]) =>
  Math.ceil(data.length / ITEMS_PER_PAGE);

export default function Dashboard() {
  const [searchBook, setSearchBook] = useState("");
  const [searchBorrow, setSearchBorrow] = useState("");
  const [searchReturn, setSearchReturn] = useState("");

  const [bookPage, setBookPage] = useState(1);
  const [borrowPage, setBorrowPage] = useState(1);
  const [returnPage, setReturnPage] = useState(1);

  const books = booksData.filter(b =>
    b.title.toLowerCase().includes(searchBook.toLowerCase())
  );

  const borrows = borrowToday.filter(b =>
    b.title.toLowerCase().includes(searchBorrow.toLowerCase())
  );

  const returns = returnToday.filter(r =>
    r.title.toLowerCase().includes(searchReturn.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="w-full px-6 py-8">
        <section>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Stok Buku</h2>
            <input value={searchBook} onChange={e => {setSearchBook(e.target.value); setBookPage(1);}} placeholder="Cari buku..." className="rounded-full border px-4 py-2 text-sm"/>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {paginate(books, bookPage).map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border">
                <img src={b.image} className="h-40 w-full object-cover rounded-xl mb-3"/>
                <h3 className="font-bold text-purple-700">{b.title}</h3>
                <p className="text-sm">{b.genre}</p>
                <p className="text-sm">{b.author}</p>
                <p className={`mt-2 font-semibold ${b.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {b.stock > 0 ? "Tersedia" : "Habis"}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button onClick={() => setBookPage(p => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">&lt;</button>
            {Array.from({ length: totalPage(books) }).map((_, i) => (
              <button key={i} onClick={() => setBookPage(i + 1)} className={`h-8 w-8 rounded-full ${bookPage === i + 1 ? "bg-purple-700 text-white" : "border"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setBookPage(p => Math.min(p + 1, totalPage(books)))} className="px-3 py-1 border rounded">&gt;</button>
          </div>
        </section>

        <section>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Peminjaman Hari Ini</h2>
            <input value={searchBorrow} onChange={e => {setSearchBorrow(e.target.value); setBorrowPage(1);}} placeholder="Cari buku..." className="rounded-full border px-4 py-2 text-sm"/>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {paginate(borrows, borrowPage).map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-4 border">
                <h3 className="font-bold text-purple-700">{b.title}</h3>
                <p className="text-sm">Peminjam: {b.name}</p>
                <p className="text-sm">Pinjam: {b.borrow}</p>
                <p className="text-sm">Kembali: {b.return}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button onClick={() => setBorrowPage(p => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">&lt;</button>
            {Array.from({ length: totalPage(borrows) }).map((_, i) => (
              <button key={i} onClick={() => setBorrowPage(i + 1)} className={`h-8 w-8 rounded-full ${borrowPage === i + 1 ? "bg-purple-700 text-white" : "border"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setBorrowPage(p => Math.min(p + 1, totalPage(borrows)))} className="px-3 py-1 border rounded">&gt;</button>
          </div>
        </section>

        <section>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Pengembalian Hari Ini</h2>
            <input value={searchReturn} onChange={e => {setSearchReturn(e.target.value); setReturnPage(1);}} placeholder="Cari buku..." className="rounded-full border px-4 py-2 text-sm"/>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {paginate(returns, returnPage).map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border">
                <h3 className="font-bold text-purple-700">{r.title}</h3>
                <p className="text-sm">Peminjam: {r.name}</p>
                <p className="text-sm">Pinjam: {r.borrow}</p>
                <p className="text-sm">Kembali: {r.return}</p>
                <p className={`mt-2 font-semibold ${r.status === "Dikembalikan" ? "text-green-600" : "text-red-500"}`}>
                  {r.status}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button onClick={() => setReturnPage(p => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">&lt;</button>
            {Array.from({ length: totalPage(returns) }).map((_, i) => (
              <button key={i} onClick={() => setReturnPage(i + 1)} className={`h-8 w-8 rounded-full ${returnPage === i + 1 ? "bg-purple-700 text-white" : "border"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setReturnPage(p => Math.min(p + 1, totalPage(returns)))} className="px-3 py-1 border rounded">&gt;</button>
          </div>
        </section>

      </main>
    </div>
  );
}

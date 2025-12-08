"use client";

import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Dummy kategori (nanti bisa ganti dari API Strapi)
  const categories = ["Novel", "Komik", "Pendidikan", "Sejarah", "Teknologi", "Magic"];

  // Dummy data buku (sesuai struktur baru)
  const books = [
    {
      id: 1,
      title: "Dr. STONE",
      author: "Riichiro Inagaki",
      publisher: "Shueisha",
      year: 2017,
      category: "Komik",
      stock: 5,
      cover: "dr-stone.jpg",
    },
    {
      id: 2,
      title: "Death Note",
      author: "Tsugumi Ohba",
      publisher: "Shueisha",
      year: 2003,
      category: "Komik",
      stock: 0,
      cover: "death-note.jpg",
    },
    {
      id: 3,
      title: "How to Win at Chess",
      author: "Levy Rozman",
      publisher: "Penguin",
      year: 2020,
      category: "Pendidikan",
      stock: 3,
      cover: "chess-guide.jpg",
    },
    {
      id: 4,
      title: "Harry Potter",
      author: "J.K. Rowling",
      publisher: "Bloomsburry Publishing",
      year: 2001,
      category: "Magic",
      stock: 10,
      cover: "harry-potter.jpg",
    },
  ];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleDelete = (book: any) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Data Buku</h1>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">
          <FiPlus />
          <span>Tambah Buku</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari judul buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      {/* Grid Buku */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {/* Cover */}
            <div className="w-full h-48 bg-gray-100 overflow-hidden">
              <img
                src={`/images/${book.cover}`}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {book.title}
                </h2>

                <p className="text-xs text-gray-500">
                   {book.author}
                </p>
                <p className="text-xs text-gray-500">
                   {book.publisher} • {book.year}
                </p>

                <span className="inline-block mt-2 px-2 py-1 text-[11px] bg-blue-100 text-blue-700 rounded-full">
                  {book.category}
                </span>

                <span
                  className={`ml-2 inline-block px-2 py-1 text-[11px] font-medium rounded-full ${
                    book.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {book.stock > 0
                    ? `Stok: ${book.stock}`
                    : "Stok Habis"}
                </span>
              </div>

              {/* Action */}
              <div className="flex mt-6 justify-end gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          Buku tidak ditemukan 📭
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5">Edit Buku</h2>

            <div className="space-y-3">
              <input
                type="text"
                defaultValue={selectedBook.title}
                placeholder="Judul buku"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                defaultValue={selectedBook.author}
                placeholder="Penulis"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                defaultValue={selectedBook.publisher}
                placeholder="Penerbit"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="number"
                defaultValue={selectedBook.year}
                placeholder="Tahun terbit"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              {/* Select kategori */}
              <select
                defaultValue={selectedBook.category}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="number"
                defaultValue={selectedBook.stock}
                placeholder="Jumlah stok"
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Batal
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {showDeleteModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">Hapus Buku</h2>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-800">
                {selectedBook.title}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Batal
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuPage;

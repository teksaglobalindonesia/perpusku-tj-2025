"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME } from "@/lib/constant";

const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // contoh kategori sementara (nanti fetch dari API)
  const categories = [
    { id: 2, name: "Sci-Fi" },
    { id: 8, name: "Psychological" },
    { id: 9, name: "Romance" },
    { id: 10, name: "Comedy" },
  ];

  // form: semua value disimpan sebagai string agar controlled input aman
  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    categories: "", // string id or ""
    stock: "",
    cover: null as File | null,
    loans: ""
  });

  // helper untuk dapatkan URL cover dalam berbagai bentuk respons Strapi
  const getCoverUrl = (cover: any) => {
    if (!cover) return "/no-image.png";

    // jika cover adalah string path "/uploads/xxx.jpg" atau full url
    if (typeof cover === "string") {
      // jika sudah absolute URL
      if (cover.startsWith("http")) return cover;
      return `${BASE_URL}${cover}`;
    }

    // jika object { url: "/uploads/..." }
    if (cover?.url) {
      return cover.url.startsWith("http") ? cover.url : `${BASE_URL}${cover.url}`;
    }

    // jika bentuk Strapi media: { data: { attributes: { url: "/uploads/..." } } }
    if (cover?.data?.attributes?.url) {
      const url = cover.data.attributes.url;
      return url.startsWith("http") ? url : `${BASE_URL}${url}`;
    }

    return "/no-image.png";
  };


  const refreshBooks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/book/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });
  
      const json = await res.json();
      setBooks(json?.data || []);
    } catch (err) {
      console.error("Gagal refresh buku:", err);
    }
  };
  useEffect(() => {
    refreshBooks();
  }, []);
    
  // GET DATA
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
          },
          cache: "no-store",
        });
  
        const json = await res.json();
        setBooks(json?.data || []);
      } catch (err) {
        console.error("Gagal ambil buku:", err);
      }
    })();
  }, []);
  

  // filter search berdasarkan title
  const filteredBooks = books.filter((book) =>
    (book.title || "").toString().toLowerCase().includes(search.toLowerCase())
  );

  // buka modal edit — set form sesuai struktur API (categories disimpan sebagai string id)
  const handleEdit = (book: any) => {
    setSelectedBook(book);

    setForm({
      title: book.title || "",
      writer: book.writer || "",
      publisher: book.publisher || "",
      published_year: book.published_year?.toString() || "",
      stock: String(book.stock ?? ""),
      cover: (typeof book.cover === "string" ? book.cover : (book.cover?.url ?? book.cover?.data?.attributes?.url ?? "")) || "",
      categories: book.categories?.[0]?.id?.toString() || "" // store as string
    });

    setShowEditModal(true);
  };

  const handleDelete = (book: any) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  // CREATE
  const handleCreate = async () => {
    const fd = new FormData();
  
    fd.append("title", form.title);
    fd.append("writer", form.writer);
    fd.append("publisher", form.publisher);
    fd.append("published_year", form.published_year);
    fd.append("stock", form.stock);
    fd.append("category_id", form.categories);
  
    if (form.cover) {
      fd.append("cover", form.cover);
    }
  
    const res = await fetch(`${BASE_URL}/api/book/add`, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: fd,
    });
  
    if (!res.ok) {
      console.error(await res.text());
      return;
    }
  
    setShowAddModal(false);
    await refreshBooks();

  };
  

  // UPDATE
  const handleUpdate = async () => {
    if (!selectedBook?.id) return;

    try {
const payload = {
  data: {
    title: form.title,
    writer: form.writer,
    publisher: form.publisher,
    published_year: form.published_year,
    stock: Number(form.stock),
    cover: form.cover,
    categories: form.categories ? [Number(form.categories)] : []
  }
};


      const res = await fetch(`${BASE_URL}/api/book/update/${selectedBook.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
          "x-member-name": MEMBER_NAME
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update error:", text);
      } else {
        const json = await res.json();
        console.log("UPDATE RESPONSE:", json);
      }

      setShowEditModal(false);
      setSelectedBook(null);
      await refreshBooks();

    } catch (err) {
      console.error("Gagal update buku", err);
    }
  };

  // DELETE
  const handleDestroy = async () => {
    if (!selectedBook?.id) return;
  
    const res = await fetch(
      `${BASE_URL}/api/book/delete/${selectedBook.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
      }
    );
  
    if (!res.ok) {
      console.error(await res.text());
      return;
    }
  
    setShowDeleteModal(false);
    setSelectedBook(null);
    await refreshBooks();

  };
  

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Data Buku</h1>

        <button
          onClick={() => {
            setForm({
              title: "",
              writer: "",
              publisher: "",
              published_year: "",
              categories: "",
              stock: "",
              cover: null,
              loans: ""
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          type="button"
        >
          <FiPlus /> Tambah Buku
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl shadow mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari judul buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-sm text-gray-500">Memuat data...</p>}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow flex flex-col overflow-hidden">
            <div className="h-40 bg-gray-100">
              <img src={getCoverUrl(book.cover)} alt={book.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h2 className="font-semibold text-gray-800">{book.title}</h2>
                <p className="text-xs text-gray-500">Penulis: {book.writer || "-"}</p>
                <p className="text-xs text-gray-500">{book.publisher} • {book.published_year ?? "-"}</p>
                <p className="text-xs mt-2">Kategori: {book.categories?.map((cat: any) => cat.name).join(", ") || "-"}</p>
                <p className="text-xs mt-1">Stok: {book.stock ?? "-"}</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => handleEdit(book)} type="button" className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(book)} type="button" className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
      {showAddModal && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
    {/* Modal */}
    <div
      className="bg-white w-full max-w-lg rounded-xl p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="font-semibold text-lg mb-4">Tambah Buku</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Writer"
          value={form.writer}
          onChange={(e) => setForm({ ...form, writer: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Publisher"
          value={form.publisher}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Published year"
          value={form.published_year}
          onChange={(e) =>
            setForm({ ...form, published_year: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <select
          value={form.categories}
          onChange={(e) => setForm({ ...form, categories: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Pilih kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({
              ...form,
              cover: e.target.files ? e.target.files[0] : null,
            })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded border"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={() => {
            console.log("SIMPAN CLICKED");
            handleCreate();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}



      {/* Modal Edit */}
      {showEditModal && selectedBook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative z-10">
            <h2 className="font-semibold text-lg mb-4">Edit Buku</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Writer"
                value={form.writer}
                onChange={(e) => setForm({ ...form, writer: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Publisher"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Published year"
                value={form.published_year}
                onChange={(e) => setForm({ ...form, published_year: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <select
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>)}
              </select>

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border p-2 rounded"
              />

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, cover: file });
  }}
  className="w-full border p-2 rounded"
/>

            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowEditModal(false)} type="button" className="px-4 py-2 rounded border">Batal</button>
              <button type="button" onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}

{showDeleteModal && selectedBook && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowDeleteModal(false)}
    />

    {/* Modal */}
    <div
      className="bg-white w-full max-w-sm rounded-xl p-6 relative z-10 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="font-semibold mb-4">Hapus Buku</h2>

      <p className="text-sm mb-6">
        Yakin ingin menghapus <b>{selectedBook.title}</b>?
      </p>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowDeleteModal(false)}
          type="button"
          className="px-4 py-2 rounded border"
        >
          Batal
        </button>

        <button
          onClick={handleDestroy}
          type="button"
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
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

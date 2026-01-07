"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME } from "@/lib/constant";

const BukuPage = () => {
  const [search, setSearch] = useState("");
type ModalType = "add" | "edit" | "delete" | "preview" | null;

const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);



  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

const fetchCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/book-category/list`, {
      method: "GET",
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      cache: "no-store",
    });

    const json = await res.json();
    setCategories(json?.data || []);
  } catch (err) {
    console.error("Gagal ambil category:", err);
  }
};
const openModal = (type: ModalType, book?: any) => {
  setSelectedBook(book || null);
  setActiveModal(type);
};

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center"
    onClick={onClose} 
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50" />

    {/* Content */}
    <div
      className="relative z-10 bg-white rounded-xl p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);


  // form: semua value disimpan sebagai string agar controlled input aman
  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    categories: "",
    stock: "",
    cover: null as File | null,
    loans: ""
  });

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

const closeModal = () => {
  setActiveModal(null);
  setSelectedBook(null);
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

useEffect(() => {
  fetchCategories();
}, []);


const openEditModal = (book: any) => {
  setSelectedBook(book);
  setForm({
    title: book.title || "",
    writer: book.writer || "",
    publisher: book.publisher || "",
    published_year: book.published_year || "",
    stock: book.stock?.toString() || "",
    categories: book.categories?.[0]?.id?.toString() || "",
    cover: null,
    loans: "",
  });
  setActiveModal("edit");
};


  const handleDelete = (book: any) => {
    setSelectedBook(book);
    setActiveModal("delete");
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
  
    setActiveModal(null);
    await refreshBooks();

  };
  

  // UPDATE
const handleUpdate = async () => {
  if (!selectedBook?.id) return;

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

  const res = await fetch(
    `${BASE_URL}/api/book/update/${selectedBook.id}`,
    {
      method: "PATCH", 
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: fd,
    }
  );

  if (!res.ok) {
    console.error(await res.text());
    return;
  }

  setActiveModal(null);
  await refreshBooks();
};

  // DELETE
const handleDestroy = async () => {
  if (!selectedBook?.documentId || isDeleting) return;

  setIsDeleting(true);

  try {
    const res = await fetch(`${BASE_URL}/api/book/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selectedBook.documentId,
      }),
    });

    if (!res.ok) {
      console.error("STATUS:", res.status);
      console.error("RESPONSE:", await res.text());
      return;
    }

    setActiveModal(null);
    setSelectedBook(null);
    await refreshBooks();
  } catch (err) {
    console.error("Delete error:", err);
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Data Buku</h1>

        <button
         type= "button"
          onClick={() => {
            setSelectedBook(null);
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
            setActiveModal("add");
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
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
<img
  src={getCoverUrl(book.cover)}
  alt={book.title}
  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
  onClick={() => {
    setPreviewImage(getCoverUrl(book.cover));
    setActiveModal("preview");
  }}
/>


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
                <button onClick={() => openModal("edit", book)}>Edit</button>

                <button onClick={() => openModal("delete", book)} type="button" className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
{activeModal === "add" && (
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
          onClick={() => setActiveModal(null)}
          className="px-4 py-2 rounded border"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}

{activeModal === "preview" && previewImage && (
  <div
    className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
    onClick={() => setActiveModal(null)}
  >
    <div
      className="relative max-w-4xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={() => setActiveModal(null)}
        className="absolute -top-10 right-0 text-white text-2xl font-bold"
      >
        ✕
      </button>

      <img
        src={previewImage}
        alt="Preview Cover"
        className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
      />
    </div>
  </div>
)}


      {/* Modal Edit */}
{activeModal === "edit" && selectedBook && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setActiveModal(null)}
    />

    {/* Modal */}
    <div
      className="bg-white w-full max-w-lg rounded-xl p-6 relative z-10"
      onClick={(e) => e.stopPropagation()}
    >
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setForm({ ...form, cover: file });
          }}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-8 mt-4">
        <button
          type="button"
          onClick={() => setActiveModal(null)}
          className="px-4 py-2 rounded border"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

{activeModal === "delete" && selectedBook && (
  <Modal onClose={closeModal}>
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Hapus Buku
        </h2>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-600 mb-6">
        Yakin ingin menghapus buku
        <span className="font-semibold text-gray-800">
          {" "}
          “{selectedBook.title}”
        </span>
        ?<br />
        Tindakan ini tidak dapat dibatalkan.
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleDestroy}
          disabled={isDeleting}
          className="
            px-4 py-2 text-sm rounded-lg
            bg-red-600 text-white
            hover:bg-red-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {isDeleting ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </div>
  </Modal>
)}

    </div>
  );
};

export default BukuPage;

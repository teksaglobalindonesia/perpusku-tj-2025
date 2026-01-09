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

const [page, setPage] = useState(1);
const PAGE_SIZE = 8;

const [total, setTotal] = useState(0);
const totalPages = Math.ceil(total / PAGE_SIZE);


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
    className="fixed inset-0 z-[9999] flex items-center justify-center "
    onClick={onClose} 
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 " />

    {/* Content */}
    <div
      className="relative z-10 bg-white rounded-xl p-6 animate-scale-in"
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

 const fetchBooks = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: PAGE_SIZE.toString(),
      search: search,
    });

    const res = await fetch(
      `${BASE_URL}/api/book/list?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();
     console.log("FULL RESPONSE", json);

    setBooks(json?.data || []);
    setTotal(json?.meta?.pagination?.total || 0);
  } catch (err) {
    console.error("Gagal fetch buku:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchCategories();
}, []);

useEffect(() => {
  fetchBooks();
}, [page, search]);


const openEditModal = (book: any) => {
  setSelectedBook(book);

  setForm({
    title: book.title ?? "",
    writer: book.writer ?? "",
    publisher: book.publisher ?? "",
    published_year: book.published_year?.toString() ?? "",
    stock: book.stock?.toString() ?? "",
    categories: book.categories?.[0]?.id?.toString() ?? "",
    cover: null, 
    loans: book.loans ?? "",
  });

  setActiveModal("edit");
};


  const handleDelete = (book: any) => {
    setSelectedBook(book);
    setActiveModal("delete");
  };

  // CREATE
const handleCreate = async () => {
  if (
    !form.title ||
    !form.writer ||
    !form.publisher ||
    !form.published_year ||
    !form.stock ||
    !form.categories
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  const payload = {
    title: form.title,
    writer: form.writer,
    publisher: form.publisher,
    published_year: form.published_year,
    stock: Number(form.stock),
    categories: [form.categories], // SESUAI POSTMAN
  };

  const fd = new FormData();

  fd.append("data", JSON.stringify(payload));

  if (form.cover) {
    fd.append("cover", form.cover);
  }

  try {
    const res = await fetch(`${BASE_URL}/api/book/add`, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: fd,
    });

    const text = await res.text();
    console.log("CREATE RESPONSE:", text);

    if (!res.ok) {
      alert("Gagal menambah buku");
      return;
    }

    setActiveModal(null);
    await fetchBooks();

    setForm({
      title: "",
      writer: "",
      publisher: "",
      published_year: "",
      categories: "",
      stock: "",
      cover: null,
      loans: "",
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
  }
};


  // UPDATE
const handleUpdate = async () => {
  if (!selectedBook?.documentId) {
    console.error("documentId TIDAK ADA", selectedBook);
    return;
  }

  const fd = new FormData();
  fd.append("documentId", selectedBook.documentId);
  fd.append("data", JSON.stringify({
    title: form.title,
    writer: form.writer,
    publisher: form.publisher,
    published_year: form.published_year,
    stock: form.stock,
     categories: form.categories
        ? { set: [Number(form.categories)] }
        : undefined,
  }));
    if (form.cover) {
    fd.append("cover", form.cover); 
  }


  const res = await fetch(`${BASE_URL}/api/book/edit`, {
    method: "PATCH",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: fd,
  });

  const text = await res.text();
  console.log("RESPONSE:", text);

  if (!res.ok) return;

  setActiveModal(null);
  await fetchBooks();
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
    await fetchBooks();
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
        <h1 className="text-xl font-bold text-gray-800">Book List</h1>

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
          <FiPlus /> Add Book
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl shadow mb-6 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
<input
  type="text"
  placeholder="Search by title..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  className="w-full outline-none text-sm"
/>

      </div>

      {/* Loading */}
      {loading && <p className="text-center text-sm text-gray-500">Loading...</p>}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
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
                <p className="text-xs text-gray-500">Writer: {book.writer || "-"}</p>
                <p className="text-xs text-gray-500">{book.publisher} • {book.published_year ?? "-"}</p>
                <p className="text-xs mt-2">Category: {book.categories?.map((cat: any) => cat.name).join(", ") || "-"}</p>
                <p className="text-xs mt-1">Stock: {book.stock ?? "-"}</p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => openEditModal(book)}>Edit</button>
                <button onClick={() => openModal("delete", book)} type="button" className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded">
                  Delete
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
      className="bg-white w-full max-w-lg rounded-xl p-6 relative animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="font-semibold text-lg mb-4">Add Book</h2>

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
          <option value="">Select Category</option>
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
          Cancel
        </button>

        <button
          type="button"
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
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
      className="relative max-w-4xl w-full animate-scale-in"
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
      className="bg-white w-full max-w-lg rounded-xl p-6 relative z-10 animate-scale-in "
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
          <option value="">Select Category</option>
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
          Cancel
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
    <div className="w-full max-w-sm animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 ">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          Delete Book
        </h2>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete the
        <span className="font-semibold text-gray-800">
          {" "}
          “{selectedBook.title}”
          {" "} 
        </span>
          book?
        <br />
        This action can't be undone.
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
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
          {isDeleting ? "Menghapus..." : "Delete"}
        </button>
      </div>
    </div>
  </Modal>
)}
{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-3 py-1 text-sm rounded border disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`px-3 py-1 text-sm rounded border ${
          p === page
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100"
        }`}
      >
        {p}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-3 py-1 text-sm rounded border disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default BukuPage;

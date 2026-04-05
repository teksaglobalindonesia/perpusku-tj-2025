"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME } from "@/lib/constant";
import Modal from "../custom/Modal";

type ModalType = "add" | "edit" | "delete" | "preview" | "add-category" | null;

  const BukuPage = () => {
  const [search, setSearch] = useState("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const [categoryName, setCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryErrors, setCategoryErrors] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<any>(null);
  const [errors, setErrors] = useState({
  title: "",
  writer: "",
  publisher: "",
  published_year: "",
  stock: "",
  categories: "",
});

  const openModal = (type: ModalType, book?: any) => {
    setSelectedBook(book || null);
    setActiveModal(type);
  };

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [totalBooks, setTotalBooks] = useState(0);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500); // hilang 2.5 detik
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/book-category/list?page=1&page_size=1000`,
        {
          headers: {
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
          },
          cache: "no-store",
        }
      );
  
      const json = await res.json();
      setCategories(json?.data || []);
      return json?.data || [];
    } catch (err) {
      console.error("Gagal ambil category:", err);
      return [];
    }
  };
  

const handleSaveCategory = async () => {
  if (!categoryInput.trim()) {
    setCategoryErrors("Category name is required");
    return;
  }

  setLoadingCategory(true);

  try {
    const url = editingCategory
      ? `${BASE_URL}/api/book-category/edit`
      : `${BASE_URL}/api/book-category/add`;

    const method = editingCategory ? "PATCH" : "POST";

    const body = editingCategory
      ? {
          documentId: editingCategory.documentId,
          data: { name: categoryInput },
        }
      : {
          data: { name: categoryInput },
        };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    await fetchCategories();
    setCategoryInput("");
    setEditingCategory(null);
    setCategoryErrors("");
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingCategory(false);
  }
};

const handleEditCategory = (cat: any) => {
  setEditingCategory(cat);
  setCategoryInput(cat.name);
};

const handleDeleteCategory = (cat: any) => {
  setDeleteCategoryTarget(cat);
};
const confirmDeleteCategory = async () => {
  if (!deleteCategoryTarget) return;

  try {
    const res = await fetch(`${BASE_URL}/api/book-category/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: deleteCategoryTarget.documentId,
      }),
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    await fetchCategories();
    setDeleteCategoryTarget(null);
  } catch (err) {
    console.error(err);
  }
};

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

     const totalFromAPI = json?.meta?.pagination?.total || 0;
     setTotal(totalFromAPI);       // ← pagination
     setTotalBooks(totalFromAPI);  // ← statistik
     
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
  const newErrors = {
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    stock: "",
    categories: "",
  };

  if (!form.title) {
    newErrors.title = "Title is required";
  }

  if (!form.writer) {
    newErrors.writer = "Writer is required";
  }

  if (!form.publisher) {
    newErrors.publisher = "Publisher is required";
  }

  if (!form.published_year) {
    newErrors.published_year = "Published year is required";
  } else if (isNaN(Number(form.published_year))) {
    newErrors.published_year = "Published year must be a number";
  }

  // Stock: boleh 0, tapi tetap wajib diisi
  if (form.stock === "" || form.stock === null || form.stock === undefined) {
    newErrors.stock = "Stock is required";
  } else if (isNaN(Number(form.stock))) {
    newErrors.stock = "Stock must be a number";
  }

  if (!form.categories) {
    newErrors.categories = "Category is required";
  }

  setErrors(newErrors);

  // kalau ada error, stop
  if (Object.values(newErrors).some((err) => err !== "")) {
    return;
  }

  const payload = {
    title: form.title,
    writer: form.writer,
    publisher: form.publisher,
    published_year: form.published_year,
    stock: Number(form.stock), // 0 tetap valid
    categories: [form.categories],
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

    showSuccess("Book added successfully!");
    setActiveModal(null);
    await fetchBooks();

    // reset form
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

  const newErrors = {
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    stock: "",
    categories: "",
  };

  if (!form.title) {
    newErrors.title = "Title is required";
  }

  if (!form.writer) {
    newErrors.writer = "Writer is required";
  }

  if (!form.publisher) {
    newErrors.publisher = "Publisher is required";
  }

  if (!form.published_year) {
    newErrors.published_year = "Published year is required";
  } else if (isNaN(Number(form.published_year))) {
    newErrors.published_year = "Published year must be a number";
  }

  // Stock: boleh 0, tapi tetap wajib diisi
  if (form.stock === "" || form.stock === null || form.stock === undefined) {
    newErrors.stock = "Stock is required";
  } else if (isNaN(Number(form.stock))) {
    newErrors.stock = "Stock must be a number";
  }

  if (!form.categories) {
    newErrors.categories = "Category is required";
  }

  setErrors(newErrors);

  // Kalau masih ada error → stop submit
  if (Object.values(newErrors).some((err) => err !== "")) {
    return;
  }

  const fd = new FormData();

  fd.append("documentId", selectedBook.documentId);

  fd.append(
    "data",
    JSON.stringify({
      title: form.title,
      writer: form.writer,
      publisher: form.publisher,
      published_year: form.published_year,
      stock: Number(form.stock),
      categories: form.categories
        ? { set: [Number(form.categories)] }
        : undefined,
    })
  );

  if (form.cover) {
    fd.append("cover", form.cover);
  }

  try {
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
    showSuccess("Book updated successfully!");
  } catch (err) {
    console.error("UPDATE ERROR:", err);
  }
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
    showSuccess("Book deleted successfully!");
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
        <div className="flex gap-2">
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
              >
                 Manage Category
              </button>
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
        </div>
      {/* Search */}
      <div className="bg-white p-3 rounded-xl shadow-lg mb-6 flex items-center gap-3">
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
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total Books</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {totalBooks}
          </h3>
        </div>
      </div>
      {/* Loading */}
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            Loading books...
          </p>
        ) : books.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            Books not found{search? ` for "${search}"` : ""}
          </p>
        ) : (
          books.map((book) => (
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
                  <p className="text-xs text-gray-500">
                    {book.publisher} • {book.published_year ?? "-"}
                  </p>
                  <p className="text-xs mt-2">
                    Category: {book.categories?.map((cat: any) => cat.name).join(", ") || "-"}
                  </p>
                  <p className="text-xs mt-1">Stock: {book.stock ?? "-"}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => openEditModal(book)}>Edit</button>
                  <button
                    onClick={() => openModal("delete", book)}
                    type="button"
                    className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add */}
      {activeModal === "add" && (
        <Modal onClose={() => setActiveModal(null)}>
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
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title}
                </p>
              )}

              <input
                type="text"
                placeholder="Writer"
                value={form.writer}
                onChange={(e) => setForm({ ...form, writer: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.writer ? "border-red-500" : ""
                }`}
              />
              {errors.writer && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.writer}
                </p>
              )}

              <input
                type="text"
                placeholder="Publisher"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.publisher ? "border-red-500" : ""
                }`}
              />
              {errors.publisher && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.publisher}
                </p>
              )}

              <input
                type="number"
                placeholder="Published year"
                value={form.published_year}
                onChange={(e) =>
                  setForm({ ...form, published_year: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.published_year ? "border-red-500" : ""
                }`}
              />
              {errors.published_year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.published_year}
                </p>
              )}

              <select
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.categories ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categories && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categories}
                </p>
              )}

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  errors.stock ? "border-red-500" : ""
                }`}
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stock}
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    cover: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
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
                Submit
              </button>
            </div>
          </div>
        </Modal>
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
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setErrors({ ...errors, title: "" });
                  }}
                  className="w-full border p-2 rounded"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                    {errors.title}
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Writer"
                  value={form.writer}
                  onChange={(e) => {
                    setForm({ ...form, writer: e.target.value });
                    setErrors({ ...errors, writer: "" });
                  }}
                  className="w-full border p-2 rounded"
                />
                {errors.writer && (
                  <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                    {errors.writer}
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Publisher"
                  value={form.publisher}
                  onChange={(e) => {
                    setForm({ ...form, publisher: e.target.value });
                    setErrors({ ...errors, publisher: "" });
                  }}
                  className="w-full border p-2 rounded"
                />
                {errors.publisher && (
                  <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                    {errors.publisher}
                  </p>
                )}

                <input
                  type="number"
                  placeholder="Published year"
                  value={form.published_year}
                  onChange={(e) => {
                    setForm({ ...form, published_year: e.target.value });
                    setErrors({ ...errors, published_year: "" });
                  }}
                  className="w-full border p-2 rounded"
                />
                {errors.published_year && (
                  <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                    {errors.published_year}
                  </p>
                )}                

                <select
                  value={form.categories}
                  onChange={(e) => {
                    setForm({ ...form, categories: e.target.value });
                    setErrors({ ...errors, categories: "" });
                  }}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categories && (
                  <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                    {errors.categories}
                  </p>
                )}

                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => {
                    setForm({ ...form, stock: e.target.value });
                    setErrors({ ...errors, stock: "" });
                  }}
                  className="w-full border p-2 rounded"
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock}
                  </p>
                )}

                  {selectedBook.cover && (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500">Current Cover</p>
                      <img
                        src={`${BASE_URL}${selectedBook.cover.url}`}
                        className="w-20 h-28 object-cover rounded border"
                      />
                    </div>
                  )}
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
      {/* Modal Delete*/}
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
              This action can&apos;t be undone.
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
      {/* Modal Manage Category*/}
      {categoryModalOpen && (
      <Modal onClose={() => setCategoryModalOpen(false)}>
        <div className="w-full max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Manage Category</h2>

          {/* INPUT */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setCategoryErrors("");
              }}
              placeholder="Category name"
              className="flex-1 border p-2 rounded text-sm"
            />
            <button
              onClick={handleSaveCategory}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              {editingCategory ? "Update" : "Add"}
            </button>
          </div>

          {categoryErrors && (
            <p className="text-red-500 text-xs mb-2">{categoryErrors}</p>
          )}

          {/* LIST */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span className="text-sm">{cat.name}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="text-xs px-2 py-1 bg-yellow-100 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )}
      {deleteCategoryTarget && (
        <Modal onClose={() => setDeleteCategoryTarget(null)}>
          <div className="w-full max-w-sm animate-scale-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl font-bold">!</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Category
              </h2>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 mb-6">
              Yakin mau hapus category
              <span className="font-semibold text-gray-800">
                {" "}
                “{deleteCategoryTarget.name}”
              </span>
              ?
              <br />
              Ini ga bisa di-undo.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteCategoryTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* OTHER */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-[99999] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg animate-scale-in">
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BukuPage;

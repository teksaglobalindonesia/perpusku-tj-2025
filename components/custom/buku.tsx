"use client";

import { useEffect, useState } from "react";
import { BASE_URL, TOKEN, MEMBER_NAME } from "../../lib/constant";

const PAGE_SIZE = 8;

const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | "preview" | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
  title: "",
  writer: "",
  publisher: "",
  published_year: "",
  stock: "",
  category: "",
  cover: "",
});

  const [toast, setToast] = useState<{
      message: string;
      type: "success" | "error";
    } | null>(null);
      
      const showToast = (
      message: string,
      type: "success" | "error"
    ) => {
      setToast({ message, type });

      setTimeout(() => {
        setToast(null);
      }, 1000);
    };

  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    stock: "",
  });

  const fetchCategories = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        page_size: "100",
      });

      const res = await fetch(
        `${BASE_URL}/api/book-category/list?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setCategories([]);
        return;
      }

      setCategories(Array.isArray(json?.data) ? json.data : []);
    } catch {
      setCategories([]);
    }
  };

  const fetchBooks = async () => {
  setLoading(true);

  try {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(PAGE_SIZE),
      search: search || "",
    });

    const res = await fetch(
      `${BASE_URL}/api/book/list?${params.toString()}`,
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

    if (!res.ok) {
      setLoading(false);
      return;
    }

    if (!Array.isArray(json?.data)) {
      setLoading(false);
      return;
    }

    setBooks(json.data);
    setTotalPages(json?.meta?.pagination?.page_count || 1);
    setLoading(false);
  } catch {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
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

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setPreview(null);
    setCoverFile(null);
    setSelectedCategory("");
    setSubmitted(false);
    setForm({
      title: "",
      writer: "",
      publisher: "",
      published_year: "",
      stock: "",
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

 const handleCreateBook = async () => {

  setSubmitted(true);

  const newErrors = {
    title: form.title ? "" : "Judul buku wajib diisi",
    writer: form.writer ? "" : "Penulis wajib diisi",
    publisher: form.publisher ? "" : "Penerbit wajib diisi",
    published_year: form.published_year ? "" : "Tahun terbit wajib diisi",
    stock: form.stock ? "" : "Stok wajib diisi",
    category: selectedCategory ? "" : "Kategori wajib dipilih",
    cover: coverFile ? "" : "Cover buku wajib diupload",
  };

  setErrors(newErrors);

  if (Object.values(newErrors).some((e) => e !== "")) return;

  const formData = new FormData();

  if (coverFile) {
    formData.append("cover", coverFile);
  }

  formData.append(
    "data",
    JSON.stringify({
      title: form.title,
      writer: form.writer,
      publisher: form.publisher,
      published_year: form.published_year,
      stock: Number(form.stock),
      categories: [selectedCategory],
    })
  );

  const res = await fetch(`${BASE_URL}/api/book/add`, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: formData,
  });

  if (!res.ok) {
    showToast("Gagal menambahkan buku", "error");
    return;
  }

  showToast("Buku berhasil ditambahkan", "success");

  await fetchBooks();
  closeModal();
  setErrors({
  title: "",
  writer: "",
  publisher: "",
  published_year: "",
  stock: "",
  category: "",
  cover: "",
});
};

  const handleEditBook = async () => {

  setSubmitted(true);

  const newErrors = {
    title: form.title ? "" : "Judul buku wajib diisi",
    writer: form.writer ? "" : "Penulis wajib diisi",
    publisher: form.publisher ? "" : "Penerbit wajib diisi",
    published_year: form.published_year ? "" : "Tahun terbit wajib diisi",
    stock: form.stock ? "" : "Stok wajib diisi",
    category: selectedCategory ? "" : "Kategori wajib dipilih",
    cover: coverFile ? "": "",
  };

  setErrors(newErrors);

  if (Object.values(newErrors).some((e) => e !== "")) return;

  const formData = new FormData();

  if (coverFile) {
    formData.append("cover", coverFile);
  }

  formData.append("documentId", selected.documentId);

  formData.append(
    "data",
    JSON.stringify({
      title: form.title,
      writer: form.writer,
      publisher: form.publisher,
      published_year: form.published_year,
      stock: Number(form.stock),
      categories: selectedCategory ? [selectedCategory] : [],
    })
  );

  const res = await fetch(`${BASE_URL}/api/book/edit`, {
    method: "PATCH",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
    },
    body: formData,
  });

  if (!res.ok) {
    showToast("Gagal mengedit buku", "error");
    return;
  }

  showToast("Buku berhasil diperbarui", "success");

  await fetchBooks();
  closeModal();
  setErrors({
  title: "",
  writer: "",
  publisher: "",
  published_year: "",
  stock: "",
  category: "",
  cover: "",
});
};

  const handleDeleteBook = async () => {
  const res = await fetch(`${BASE_URL}/api/book/delete`, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentId: selected.documentId }),
  });

  if (!res.ok) {
    showToast("Gagal menghapus buku", "error");
    return;
  }

  showToast("Buku berhasil dihapus", "success");

  await fetchBooks();
  closeModal();
};

 const handleCreateCategory = async () => {
  if (!categoryName) {
    showToast("Nama kategori tidak boleh kosong", "error");
    return;
  }

  const res = await fetch(`${BASE_URL}/api/book-category/add`, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "x-member-name": MEMBER_NAME,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { name: categoryName } }),
  });

  if (!res.ok) {
    showToast("Gagal menambahkan kategori", "error");
    return;
  }

  showToast("Kategori berhasil ditambahkan", "success");

  await fetchCategories();
  setCategoryName("");
  setCategoryModal(false);
};

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5fb]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Memuat data buku...</p>
      </div>
    </div>
  );
}

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <main className="w-full px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Data Buku</h2>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari buku..."
              className="rounded-full border px-4 py-2 text-sm"
            />
            <button
              onClick={() => setCategoryModal(true)}
              className="rounded-full bg-green-600 px-5 py-2 text-sm text-white"
            >
              + Kategori
            </button>
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-5 py-2 text-sm text-white"
            >
              + Buku
            </button>
          </div>
        </div>

        {books.length === 0 ? (
  <div className="flex w-full flex-col items-center justify-center py-20 text-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      className="mb-6 w-40 opacity-80"
      alt="Buku tidak ditemukan"
    />

    <h3 className="text-lg font-semibold text-gray-700">
      Buku tidak ditemukan
    </h3>

    <p className="text-sm text-gray-500">
      Coba gunakan kata kunci lain
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {books.map((b) => (
      <div
        key={b.documentId}
        className="flex flex-col overflow-hidden rounded-2xl bg-white shadow"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={
              b.cover?.url
                ? `${BASE_URL}${b.cover.url}`
                : "/placeholder-book.jpg"
            }
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 py-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-purple-700">
            {b.title}
          </h3>

          <p className="text-xs text-gray-600">
            penerbit: {b.publisher}
          </p>

          <p className="text-xs text-gray-600">
            tahun terbit: {b.published_year}
          </p>

          <p className="text-xs text-gray-600">
            kategori:{" "}
            {Array.isArray(b.categories)
              ? b.categories.map((c: any) => c?.name).join(", ")
              : ""}
          </p>

          <div className="mt-auto text-xs">
            Stok:{" "}
            <span
              className={
                b.stock > 0 ? "text-green-600" : "text-red-500"
              }
            >
              {b.stock}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t px-3 py-2">
          <button
            onClick={() => {
              setSelected(b);
              setForm({
                title: b.title,
                writer: b.writer,
                publisher: b.publisher,
                published_year: String(b.published_year),
                stock: String(b.stock),
              });

              setSelectedCategory(
                b.categories?.[0]?.id?.toString() || ""
              );

              setModal("edit");
            }}
            className="rounded-lg bg-yellow-400 py-1.5 text-xs text-black"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setSelected(b);
              setModal("delete");
            }}
            className="rounded-lg bg-red-500 py-1.5 text-xs text-white"
          >
            Hapus
          </button>
        </div>
      </div>
    ))}
  </div>
)}

        {books.length > 0 && search === "" && (
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
)}

        {modal === "delete" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center">
              <h3 className="mb-6 text-lg font-semibold">
                Yakin ingin menghapus buku ini?
              </h3>
              <div className="flex justify-center gap-4">
                <button onClick={closeModal} className="rounded-lg border px-6 py-2 text-sm">
                  Tidak
                </button>
                <button onClick={handleDeleteBook} className="rounded-lg bg-red-600 px-6 py-2 text-sm text-white">
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === "preview" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeModal}>
            <img src={preview || ""} className="max-h-[80vh] rounded-xl" />
          </div>
        )}

        {modal && modal !== "delete" && modal !== "preview" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8">
              <h2 className="mb-6 text-center text-lg font-bold">
                {modal === "add" ? "Tambah Buku" : "Edit Buku"}
              </h2>

              <div className="space-y-3">
                <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Judul Buku"
              className="w-full rounded-lg border p-3 text-sm"
            />
            {submitted && errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
                <input
              value={form.writer}
              onChange={(e) => setForm({ ...form, writer: e.target.value })}
              placeholder="Penulis"
              className="w-full rounded-lg border p-3 text-sm"
            />
            {submitted && errors.writer && (
              <p className="text-xs text-red-500 mt-1">{errors.writer}</p>
            )}
               <input
                            value={form.publisher}
                            onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                            placeholder="Penerbit"
                            className="w-full rounded-lg border p-3 text-sm"
                          />
                         {submitted && errors.publisher && (
  <p className="text-xs text-red-500 mt-1">{errors.publisher}</p>
)}
                <input
                type="number"
                value={form.published_year}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setForm({ ...form, published_year: val });
                  }
                }}
                placeholder="Tahun Terbit"
                className="w-full rounded-lg border p-3 text-sm"
              />

              {submitted && errors.published_year && (
  <p className="text-xs text-red-500 mt-1">{errors.published_year}</p>
)}
              <input
              type="number"
              value={form.stock}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setForm({ ...form, stock: val });
                }
              }}
              placeholder="Stok"
              className="w-full rounded-lg border p-3 text-sm"
            />

           {submitted && errors.stock && (
  <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
)}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border p-3 text-sm"
                >
                  <option value="">Pilih Kategori</option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                  {submitted && errors.category && (
                    <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                  )}
                <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full text-sm"
              />

              {submitted && errors.cover && (
                <p className="text-xs text-red-500 mt-1">{errors.cover}</p>
              )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={closeModal} className="rounded-lg border px-4 py-2 text-sm">Batal</button>
                <button
  onClick={async (e) => {
    const btn = e.currentTarget;

    const original = btn.innerHTML;

    btn.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin rounded-full"></div>
        Memproses
      </div>
    `;

    btn.disabled = true;

    if (modal === "add") {
      await handleCreateBook();
    } else {
      await handleEditBook();
    }

    btn.innerHTML = original;
    btn.disabled = false;
  }}
  className="flex items-center justify-center rounded-lg bg-purple-700 px-6 py-2 text-sm text-white"
>
  Simpan
</button>
              </div>
            </div>
          </div>
        )}

        {categoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-green-700">
                Tambah Kategori
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateCategory();
                }}
              >
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-lg border p-3 text-sm"
                  placeholder="Nama kategori"
                />

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryModal(false)}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
            </main>
{toast && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-md">
    <div
      className={`w-[320px] rounded-2xl p-6 text-center shadow-xl border
      ${
        toast.type === "success"
          ? "bg-purple-500/90 border-purple-400 text-white"
          : "bg-red-500/90 border-red-400 text-white"
      }`}
    >
      <div className="mb-2 text-lg">
        {toast.type === "success" ? "✔" : "⚠"}
      </div>

      <p className="text-sm font-medium">{toast.message}</p>

      {/* LOADING SPINNER */}
      <div className="mt-4 flex justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};  

export default BukuPage;

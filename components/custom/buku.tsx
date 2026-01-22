"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL, TOKEN, MEMBER_NAME } from "../../lib/constant";

const ITEMS_PER_PAGE = 8;

const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | "preview" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    writer: "",
    publisher: "",
    published_year: "",
    stock: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/book-category/list`, {
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });
      const json = await res.json();
      setCategories(json?.data || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/book/list`, {
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });
      const json = await res.json();
      setBooks(json?.data || []);
    })();
  }, []);

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setPreview(null);
    setCoverFile(null);
    setSelectedCategory("");
    setForm({
      title: "",
      writer: "",
      publisher: "",
      published_year: "",
      stock: "",
    });
  };

  const handleCreateBook = async () => {
    if (!selectedCategory) return;

    const formData = new FormData();
    if (coverFile) formData.append("cover", coverFile);
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

    const json = await res.json();
    if (!res.ok) return;

    setBooks((prev) => [json, ...prev]);
    closeModal();
  };

  const handleEditBook = async () => {
    if (!selected?.documentId || !selectedCategory) return;

    const formData = new FormData();
    if (coverFile) formData.append("cover", coverFile);

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

    formData.append("documentId", selected.documentId);

    const res = await fetch(`${BASE_URL}/api/book/edit`, {
      method: "PATCH",
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) return;

    setBooks((prev) =>
      prev.map((b) => (b.documentId === selected.documentId ? json : b))
    );

    closeModal();
  };

  const handleDeleteBook = async () => {
    if (!selected?.documentId) return;

    const res = await fetch(`${BASE_URL}/api/book/delete`, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId: selected.documentId }),
    });

    if (!res.ok) return;

    setBooks((prev) => prev.filter((b) => b.documentId !== selected.documentId));
    closeModal();
  };

  const filteredBooks = books
    .filter((b) => b?.title)
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
     <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Data Buku</h2>
          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari buku..."
              className="rounded-full border px-4 py-2 text-sm"
            />
            <button onClick={() => setModal("add")} className="rounded-full bg-purple-700 px-5 py-2 text-sm text-white">
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {paginatedBooks.map((b) => (
    <div
      key={b.documentId}
      className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
    >
      {/* COVER */}
      <div
        className="relative h-44 w-full cursor-pointer bg-gray-100"
        onClick={() => {
          setPreview(b.cover?.url ? `${BASE_URL}${b.cover.url}` : null);
          setModal("preview");
        }}
      >
        <img
          src={
            b.cover?.url
              ? `${BASE_URL}${b.cover.url}`
              : "/placeholder-book.jpg"
          }
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-purple-700">
          {b.title}
        </h3>

        <p className="text-xs text-gray-600">
          <span className="font-medium">Penulis:</span> {b.writer}
        </p>

        <p className="text-xs text-gray-600">
          <span className="font-medium">Tahun:</span> {b.published_year}
        </p>

        {/* CATEGORY */}
        <div className="mt-1 flex flex-wrap gap-1">
          {b.categories?.map((c: any) => (
            <span
              key={c.id}
              className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700"
            >
              {c.name}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2 text-xs">
          Stok:{" "}
          <span
            className={`font-semibold ${
              b.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {b.stock}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t p-3">
        <button
          onClick={() => {
            setSelected(b);
            setForm({
              title: b.title,
              writer: b.writer,
              publisher: b.publisher,
              published_year: b.published_year,
              stock: String(b.stock),
            });
            setSelectedCategory(b.categories?.[0]?.id || "");
            setPreview(
              b.cover?.url ? `${BASE_URL}${b.cover.url}` : null
            );
            setModal("edit");
          }}
          className="rounded-lg bg-purple-600 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
        >
          Edit
        </button>

        <button
          onClick={() => {
            setSelected(b);
            setModal("delete");
          }}
          className="rounded-lg bg-red-500 py-1.5 text-xs font-medium text-white hover:bg-red-600"
        >
          Hapus
        </button>
      </div>
    </div>
  ))}
</div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`rounded-md px-3 py-1 text-sm ${
                  page === i + 1 ? "bg-purple-700 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {modal === "preview" && preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={closeModal}>
          <img src={preview} className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" />
        </div>
      )}

      {modal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-purple-700">Tambah Buku</h2>
            <div className="space-y-3">
              <input name="title" onChange={handleChange} placeholder="Judul" className="w-full rounded-lg border p-2 text-sm" />
              <input name="writer" onChange={handleChange} placeholder="Penulis" className="w-full rounded-lg border p-2 text-sm" />
              <input name="publisher" onChange={handleChange} placeholder="Penerbit" className="w-full rounded-lg border p-2 text-sm" />
              <input name="published_year" onChange={handleChange} placeholder="Tahun" className="w-full rounded-lg border p-2 text-sm" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-lg border p-2 text-sm">
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input name="stock" type="number" onChange={handleChange} placeholder="Stok" className="w-full rounded-lg border p-2 text-sm" />
              <input type="file" onChange={handleImage} />
              {preview && <img src={preview} className="h-32 w-full rounded-lg object-cover" />}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white">Batal</button>
              <button onClick={handleCreateBook} className="rounded-lg bg-purple-700 px-4 py-2 text-sm text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {modal === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-purple-700">Edit Buku</h2>
            <div className="space-y-3">
              <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-lg border p-2 text-sm" />
              <input name="writer" value={form.writer} onChange={handleChange} className="w-full rounded-lg border p-2 text-sm" />
              <input name="publisher" value={form.publisher} onChange={handleChange} className="w-full rounded-lg border p-2 text-sm" />
              <input name="published_year" value={form.published_year} onChange={handleChange} className="w-full rounded-lg border p-2 text-sm" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-lg border p-2 text-sm">
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full rounded-lg border p-2 text-sm" />
              <input type="file" onChange={handleImage} />
              {preview && <img src={preview} className="h-32 w-full rounded-lg object-cover" />}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white">Batal</button>
              <button onClick={handleEditBook} className="rounded-lg bg-purple-700 px-4 py-2 text-sm text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h2 className="mb-6 text-center text-sm font-semibold text-red-600">Yakin ingin menghapus buku ini?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={closeModal} className="rounded-lg bg-gray-400 px-4 py-2 text-sm text-white">Batal</button>
              <button onClick={handleDeleteBook} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BukuPage;

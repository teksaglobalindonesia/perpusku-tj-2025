"use client";

import {useEffect, useState } from "react";
import Link from "next/link";
import {BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

const nav_items = [
  { name: "Dashboard", href: "/" },
  { name: "Buku", href: "/buku" },
  { name: "Anggota", href: "/anggota" },
  { name: "Peminjaman", href: "/peminjaman" },
  { name: "Pengembalian", href: "/pengembalian" },
];


const BukuPage = () => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
const [categories, setCategories] = useState<any[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string>("");

const [coverFile, setCoverFile] = useState<File | null>(null);

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

  const [books, setBooks] = useState <any[]>([]);

useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/book-category/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
  })();
}, []);

const handleCreateBook = async () => {
  if (!selectedCategory) {
    alert("Kategori wajib dipilih");
    return;
  }

  try {
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

    const json = await res.json();

    if (!res.ok) {
      console.error(json);
      alert(json?.error?.message || "Gagal tambah buku");
      return;
    }

    setBooks((prev) => [json.data, ...prev]);
    closeModal();
  } catch (err) {
    console.error("CREATE BOOK ERROR:", err);
    alert("Terjadi kesalahan");
  }
};


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
        console.error("Gagal ambil buku:",  err);
      }
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
  
const filteredBooks = books
  .filter((b) => b && b.title)
  .filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

const handleDeleteBook = async () => {
  if (!selected?.documentId) return;
  console.log("DELETE URL:", `${BASE_URL}/api/book/delete`);
  try {
    const res = await fetch(`${BASE_URL}/api/book/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selected.documentId,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Gagal hapus buku:", json);
      alert(json?.error?.message || "Gagal menghapus buku");
      return;
    }

    setBooks((prev) =>
      prev.filter((b) => b.documentId !== selected.documentId)
    );

    closeModal();
  } catch (err) {
    console.error("Error delete:", err);
    alert("Terjadi kesalahan saat menghapus buku");
  }
};


  return (
    <div className="flex min-h-screen bg-[#f6f5fb] text-[#2b2540]">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#2b2540] text-white border-r border-purple-800/40 p-6">
        <h1 className="mb-10 text-3xl font-extrabold tracking-wide text-purple-300">
          LIBRAVA
        </h1>
        <nav className="flex flex-col gap-2">
          {nav_items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700/40 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="ml-64 w-full p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Data Buku</h2>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari buku..."
              className="rounded-full border border-purple-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button
              onClick={() => setModal("add")}
              className="rounded-full bg-purple-700 px-6 py-2 font-semibold text-white hover:bg-purple-800 transition"
            >
              + Tambah
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((b) => (
            <div
              key={b.documentId}
              className="rounded-2xl bg-white border border-purple-200 p-5 shadow-sm"
            >
              <img
                src={b.cover?.url ? `${BASE_URL}${b.cover?.url}` : "/placeholder-book.jpg"}
                alt={b.title}
                className="mb-4 h-48 w-full rounded-xl object-cover"
              />

              <h3 className="mb-1 text-xl font-bold text-purple-700">
                {b?.title || "-"}
              </h3>

              <p className="text-sm text-gray-600">Penulis: {b?.writer || "-"}</p>
              <p className="text-sm text-gray-600">Penerbit: {b?.publisher || "-"}</p>
              <p className="text-sm text-gray-600">Tahun: {b.published_year ?? "-"}</p>
              <p className="text-sm text-gray-600">Kategori: {b.categories?.map((c: any) => c.name).join(", ")}</p>
              <p className="text-sm font-semibold">
                stock:{" "}
                 
                <span
                  className={
                    b.stock > 0 ? "text-green-600" : "text-red-500"
                  }
                >
                  {b.stock ?? "-"}
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
onClick={() => {
  setSelected(b);
  setForm({
    title: b.title || "",
    writer: b.writer || "",
    publisher: b.publisher || "",
    published_year: b.published_year || "",
    stock: b.stock?.toString() || "",
  });
  setSelectedCategory(b.categories?.[0]?.id || "");
  setModal("edit");
}}
                  className="rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(b);
                    setModal("delete");
                  }}
                  className="rounded-lg bg-red-500 py-2 text-white hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

{modal === "add" && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300">
      <h2 className="mb-4 text-2xl font-bold text-purple-700">
        Tambah Buku
      </h2>

      <div className="space-y-3">
        <input name="title" onChange={handleChange} placeholder="Judul Buku" className="w-full rounded-lg border p-3" />
        <input name="writer" onChange={handleChange} placeholder="Penulis" className="w-full rounded-lg border p-3" />
        <input name="publisher" onChange={handleChange} placeholder="Penerbit" className="w-full rounded-lg border p-3" />
        <input name="published_year" type="text" onChange={handleChange} placeholder="Tahun Terbit" className="w-full rounded-lg border p-3" />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input name="stock" type="number" onChange={handleChange} placeholder="Stok" className="w-full rounded-lg border p-3" />
        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && <img src={preview} className="h-40 w-full rounded-xl object-cover" />}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={closeModal} className="bg-gray-400 px-4 py-2 rounded-lg text-white">
          Batal
        </button>
        <button onClick={handleCreateBook} className="bg-purple-700 px-4 py-2 rounded-lg text-white">
          Simpan
        </button>
      </div>
    </div>
  </div>
)}

{modal === "edit" && selected &&(
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 border border-purple-300">
      <h2 className="mb-4 text-2xl font-bold text-purple-700">
        Edit Buku
      </h2>

      <div className="space-y-3">
        <input  className="w-full rounded-lg border p-3" />
        <input  className="w-full rounded-lg border p-3" />
        <input className="w-full rounded-lg border p-3" />
        <input type="number" className="w-full rounded-lg border p-3" />
        <input type="number" className="w-full rounded-lg border p-3" />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={closeModal} className="bg-gray-400 px-4 py-2 rounded-lg text-white">
          Batal
        </button>
        <button className="bg-purple-700 px-4 py-2 rounded-lg text-white">
          Simpan Perubahan
        </button>
      </div>
    </div>
  </div>
)}

{modal === "delete" && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 border border-red-300">
      <h2 className="mb-6 text-center text-lg font-semibold text-red-600">
        Yakin ingin menghapus buku ini?
      </h2>

      <div className="flex justify-center gap-4">
        <button
          onClick={closeModal}
          className="rounded-lg bg-gray-400 px-4 py-2 text-white"
        >
          Batal
        </button>
        <button
          onClick={handleDeleteBook}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default BukuPage;
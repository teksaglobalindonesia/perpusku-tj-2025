'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const BukuPage = () => {
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: '',
    writer: '',
    publisher: '',
    published_year: '',
    stock: ''
  });
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book-category/list`, {
          method: 'GET',
          headers: {
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        });

        const json = await res.json();

        if (!res.ok || !Array.isArray(json?.data)) {
          console.error('Invalid category response:', json);
          setCategories([]);
          return;
        }

        setCategories(json.data);
      } catch (error) {
        console.error('Gagal fetch kategori:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book-category/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        });

        const json = await res.json();
        setCategories(json?.data || []);
      } catch (err) {
        console.error('Gagal ambil category:', err);
      }
    })();
  }, []);

  const handleCreateBook = async () => {
    if (!selectedCategory) {
      alert('Kategori wajib dipilih');
      return;
    }

    if (!form.title || !form.writer || !form.publisher) {
      alert('Semua field wajib diisi');
      return;
    }

    try {
      const formData = new FormData();

      if (coverFile) {
        formData.append('cover', coverFile);
      }

      formData.append(
        'data',
        JSON.stringify({
          title: form.title,
          writer: form.writer,
          publisher: form.publisher,
          published_year: form.published_year,
          stock: Number(form.stock),
          categories: [selectedCategory]
        })
      );

      const res = await fetch(`${BASE_URL}/api/book/add`, {
        method: 'POST',
        headers: {
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: formData
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        alert(json?.error?.message || 'Gagal tambah buku');
        return;
      }

      setBooks((prev) => [json.data, ...prev]);
      closeModal();
    } catch (err) {
      console.error('CREATE BOOK ERROR:', err);
      alert('Terjadi kesalahan');
    }
  };

  const openModal = () => {
    if (previewCover) URL.revokeObjectURL(previewCover);
    setPreviewCover(null);
    setModal('add');
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setPreviewCover(null);
    setCoverFile(null);
    setSelectedCategory('');
    setForm({
      title: '',
      writer: '',
      publisher: '',
      published_year: '',
      stock: ''
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/book/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        });

        const json = await res.json();
        setBooks(json?.data || []);
      } catch (err) {
        console.error('Gagal ambil buku:', err);
      }
    })();
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b &&
      typeof b.title === 'string' &&
      b.title.toLowerCase().includes(search.toLowerCase())
  );

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [previewEditCover, setPreviewEditCover] = useState<string | null>(null);

  const openEditModal = (book: any) => {
    setEditData({ ...book });
    setPreviewEditCover(book.cover);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (previewEditCover) URL.revokeObjectURL(previewEditCover);
    setPreviewEditCover(null);
    setShowEditModal(false);
  };

  const handleDeleteBook = async () => {
    if (!selected?.documentId) return;
    console.log('DELETE URL:', `${BASE_URL}/api/book/delete`);
    try {
      const res = await fetch(`${BASE_URL}/api/book/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          documentId: selected.documentId
        })
      });

      const json = await res.json();

      if (!res.ok) {
        console.error('Gagal hapus buku:', json);
        alert(json?.error?.message || 'Gagal menghapus buku');
        return;
      }

      setBooks((prev) =>
        prev.filter((b) => b.documentId !== selected.documentId)
      );

      closeModal();
    } catch (err) {
      console.error('Error delete:', err);
      alert('Terjadi kesalahan saat menghapus buku');
    }
  };

  const fetchBooks = async () => {
    const res = await fetch(`${BASE_URL}/api/book/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
        'x-member-name': MEMBER_NAME
      },
      cache: 'no-store'
    });

    const json = await res.json();
    setBooks(json?.data || []);
  };

  const openDeleteModal = (book: any) => {
    setSelected(book);
    setModal('delete');
  };

  const closeDeleteModal = () => {
    setModal(null);
    setSelected(null);
  };

  const confirmDelete = () => {
    closeDeleteModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700 md:text-2xl">
          Daftar Buku
        </h1>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari judul buku..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={openModal}
          className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
        >
          Tambah Buku
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {filteredBooks.map((b) => (
          <div
            key={b.documentId}
            className="flex items-center justify-between gap-6 rounded-lg border border-[#c48a5a] bg-white p-4 shadow-sm"
          >
            <img
              src={
                b?.cover?.url
                  ? `${BASE_URL}${b.cover.url}`
                  : '/placeholder-book.jpg'
              }
              alt={b?.title || 'Buku'}
              className="h-28 w-20 rounded object-contain"
            />

            <div className="flex flex-1 flex-col gap-1 text-sm">
              <h3 className="text-base font-semibold text-gray-800">
                {b.title}
              </h3>

              <div className="text-xs text-gray-600 md:text-sm">
                <span className="font-medium text-gray-700">Penulis:</span>{' '}
                {b.writer}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 md:text-sm">
                <span>{b.publisher}</span>
                <span>•</span>
                <span>{b.published_year}</span>
              </div>

              <div className="text-xs text-gray-500 md:text-sm">
                Kategori: {b.categories?.map((c: any) => c.name).join(', ')}
              </div>

              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    b.stock === 0
                      ? 'bg-red-100 text-red-700'
                      : b.stock <= 20
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {b.stock === 0 ? 'Stok Habis' : `Stok: ${b.stock}`}
                </span>
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => openEditModal(b)}
                className="rounded-full bg-green-100 px-3 py-2 text-sm text-green-700"
              >
                Edit
              </button>

              <button
                onClick={() => openDeleteModal(b)}
                className="rounded-full bg-red-100 px-3 py-2 text-sm text-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="mt-10 text-center text-gray-600">Buku tidak ditemukan.</p>
      )}

      {/* MODAL ADD */}
      {modal === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-base font-semibold text-green-700">
                Tambah Buku
              </h2>
            </div>

            <div
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: '65vh' }}
            >
              <div className="flex flex-col gap-3 text-sm">
                <input
                  name="title"
                  onChange={handleChange}
                  placeholder="Judul Buku"
                  className="rounded-lg border p-2"
                />
                <input
                  name="writer"
                  onChange={handleChange}
                  placeholder="Penulis"
                  className="rounded-lg border p-2"
                />
                <input
                  name="publisher"
                  onChange={handleChange}
                  placeholder="Penerbit"
                  className="rounded-lg border p-2"
                />
                <input
                  name="published_year"
                  type="text"
                  onChange={handleChange}
                  placeholder="Tahun Terbit"
                  className="rounded-lg border p-2"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border p-2"
                >
                  <option value="">Pilih Kategori</option>

                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.documentId} value={cat.documentId}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading kategori...</option>
                  )}
                </select>

                <input
                  name="stock"
                  type="number"
                  onChange={handleChange}
                  placeholder="Stok"
                  className="rounded-lg border p-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="w-full rounded-lg border p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-white px-5 py-3">
              <button
                onClick={closeModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleCreateBook}
                className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDIT BUKU */}
      {showEditModal && editData?.title && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-base font-semibold text-gray-800">
                Edit Buku
              </h2>
            </div>

            <div
              className="overflow-y-auto px-5 py-4"
              style={{ maxHeight: '65vh' }}
            >
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <input
                    type="text"
                    placeholder="Judul Buku"
                    value={editData?.title || ''}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Penulis"
                    value={editData.writer}
                    onChange={(e) =>
                      setEditData({ ...editData, writer: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Penerbit"
                    value={editData.publisher}
                    onChange={(e) =>
                      setEditData({ ...editData, publisher: e.target.value })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tahun Terbit"
                    value={editData.published_year}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        published_year: e.target.value
                      })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <select
                    placeholder="Kategori"
                    value={editData.categories}
                    onChange={(e) =>
                      setEditData({ ...editData, categories: e.target.value })
                    }
                    className="w-full rounded-lg border p-2 text-gray-700"
                  >
                    <option>Family Fiction</option>
                    <option>Romance</option>
                    <option>Historical Fiction</option>
                    <option>Fiksi</option>
                    <option>Fantasy</option>
                    <option>Thriller</option>
                  </select>
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Stok"
                    value={editData.stock}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        stock: Number(e.target.value)
                      })
                    }
                    className="w-full rounded-lg border p-2"
                  />
                </div>

                <div>
                  <input
                    type="file"
                    placeholder="Cover"
                    accept="image/*"
                    className="w-full rounded-lg border p-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={closeEditModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>
              <button className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP HAPUS */}
      {modal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {' '}
              Apakah Anda yakin ingin menghapus buku{' '}
              <span className="font-semibold">{selected?.title}</span>?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteBook}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white"
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

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
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState<any>({});
  const [showDelete, setShowDelete] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<any>(null);

  const handleWriterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
    setForm({ ...form, writer: value });
  };

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

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

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        cover: 'File harus berupa gambar (jpg, png, webp)'
      }));
      return;
    }

    setErrors((prev: any) => ({ ...prev, cover: '' }));

    setCoverFile(file);
    setPreviewCover(URL.createObjectURL(file));
  };

  const fetchCategories = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        page_size: '100'
      });

      const res = await fetch(
        `${BASE_URL}/api/book-category/list?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        }
      );

      const json = await res.json();

      if (!res.ok || !Array.isArray(json?.data)) {
        setCategories([]);
        return;
      }

      setCategories(json.data);
    } catch (error) {
      console.error('Gagal fetch kategori:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      showNotification('Nama kategori wajib diisi', 'error');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/book-category/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          data: {
            name: categoryName
          }
        })
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        showNotification(
          json?.error?.message || 'Gagal tambah kategori',
          'error'
        );
        return;
      }

      showNotification('Kategori berhasil ditambahkan', 'success');

      setCategoryName('');
      setShowCategoryModal(false);

      await fetchCategories();
    } catch (err) {
      console.error('CREATE CATEGORY ERROR:', err);
      showNotification('Terjadi kesalahan', 'error');
    }
  };

  const handleUpdateCategory = async () => {
    const res = await fetch(`${BASE_URL}/api/book-category/edit`, {
      method: 'PATCH',
      headers: {
        Authorization: TOKEN,
        'x-member-name': MEMBER_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentId: selectedCategoryId,
        data: { name: categoryName }
      })
    });

    if (!res.ok) {
      showNotification('Gagal update kategori', 'error');
      return;
    }

    showNotification('Kategori berhasil diupdate', 'success');

    await fetchCategories();
    setCategoryName('');
    setIsEditCategory(false);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete?.documentId) return;

    const res = await fetch(`${BASE_URL}/api/book-category/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
        'x-member-name': MEMBER_NAME
      },
      body: JSON.stringify({
        documentId: categoryToDelete.documentId
      })
    });

    if (!res.ok) {
      showNotification('Gagal hapus kategori', 'error');
      return;
    }

    showNotification('Kategori berhasil dihapus', 'success');

    await fetchCategories();
    setShowDeleteCategory(false);
    setCategoryToDelete(null);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    }

    if (!form.writer.trim()) {
      newErrors.writer = 'Penulis wajib diisi';
    }

    if (!form.publisher.trim()) {
      newErrors.publisher = 'Penerbit wajib diisi';
    }

    if (!form.published_year) {
      newErrors.published_year = 'Tahun wajib diisi';
    }

    if (!form.stock) {
      newErrors.stock = 'Stok wajib diisi';
    }

    if (!selectedCategory) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!selectedCategory) {
      newErrors.categories = 'Kategori wajib diisi';
    }

    if (!coverFile) {
      newErrors.cover = 'Cover buku wajib diupload';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBook = async () => {
    if (!validateForm()) {
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

      showNotification('Buku berhasil ditambahkan', 'success');

      await fetchBooks();
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
    setErrors({});

    setForm({
      title: '',
      writer: '',
      publisher: '',
      published_year: '',
      stock: ''
    });
  };

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [previewEditCover, setPreviewEditCover] = useState<string | null>(null);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);

  const openEditModal = (book: any) => {
    setEditData({
      ...book,
      categories: book.categories?.[0]?.documentId || ''
    });

    setPreviewEditCover(
      book.cover?.url ? `${BASE_URL}${book.cover.url}` : null
    );

    setEditCoverFile(null);
    setShowEditModal(true);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditCoverFile(file);
      setPreviewEditCover(URL.createObjectURL(file));
    }
  };

  const validateEditForm = () => {
    const newErrors: any = {};

    if (!editData?.title?.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    }

    if (!editData?.writer?.trim()) {
      newErrors.writer = 'Penulis wajib diisi';
    }

    if (!editData?.publisher?.trim()) {
      newErrors.publisher = 'Penerbit wajib diisi';
    }

    if (!editData?.published_year) {
      newErrors.published_year = 'Tahun wajib diisi';
    }

    if (!editData?.categories) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!editData?.stock && editData?.stock !== 0) {
      newErrors.stock = 'Stok wajib diisi';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateBook = async () => {
    if (!editData?.documentId) return;

    if (!validateEditForm()) return;

    try {
      const formData = new FormData();

      if (editCoverFile) {
        formData.append('cover', editCoverFile);
      }

      formData.append('documentId', editData.documentId);

      formData.append(
        'data',
        JSON.stringify({
          title: editData.title,
          writer: editData.writer,
          publisher: editData.publisher,
          published_year: editData.published_year,
          stock: Number(editData.stock),
          categories: [editData.categories]
        })
      );

      const res = await fetch(`${BASE_URL}/api/book/edit`, {
        method: 'PATCH',
        headers: {
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: formData
      });

      const json = await res.json();

      if (!res.ok) {
        console.error(json);
        alert(json?.error?.message || 'Gagal update buku');
        return;
      }

      showNotification('Buku berhasil diperbarui', 'success');

      await fetchBooks();
      closeEditModal();
    } catch (err) {
      console.error('UPDATE BOOK ERROR:', err);
      alert('Terjadi kesalahan');
    }
  };

  const closeEditModal = () => {
    if (previewEditCover) URL.revokeObjectURL(previewEditCover);
    setPreviewEditCover(null);
    setShowEditModal(false);
    setErrors({});
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete?.documentId) return;

    try {
      const res = await fetch(`${BASE_URL}/api/book/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          documentId: bookToDelete.documentId
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error?.message || 'Gagal menghapus buku');
        return;
      }

      showNotification('Buku berhasil dihapus', 'success');

      await fetchBooks();
      setShowDelete(false);
      setBookToDelete(null);
    } catch (err) {
      console.error('Error delete:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        search: search || ''
      });

      const res = await fetch(
        `${BASE_URL}/api/book/list?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: TOKEN,
            'x-member-name': MEMBER_NAME
          },
          cache: 'no-store'
        }
      );

      const json = await res.json();

      console.log('BOOK LIST RESPONSE:', json);

      if (!res.ok) {
        console.error('FETCH BOOK ERROR:', json);
        return;
      }

      if (!Array.isArray(json?.data)) {
        console.warn('DATA BOOK BUKAN ARRAY');
        return;
      }

      const data = json?.data || [];

      const filtered = search
        ? data.filter(
            (b: any) => b.title?.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      setBooks(filtered);

      setTotalPages(json?.meta?.pagination?.page_count || 1);
    } catch (err) {
      console.error('Gagal ambil buku:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const renderPagination = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`rounded-lg px-4 py-2 text-sm ${
          page === p
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {p}
      </button>
    ));
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

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
    <>
      {notification && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className={`animate-alertPop w-[320px] rounded-2xl p-6 text-center text-white shadow-2xl ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <div className="mb-3 text-4xl">
              {notification.type === 'success' ? '✔' : '✖'}
            </div>

            <h3 className="mb-1 text-lg font-semibold">
              {notification.type === 'success'
                ? 'Berhasil'
                : 'Terjadi Kesalahan'}
            </h3>

            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-700 md:text-2xl">
            Daftar Buku
          </h1>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Cari judul buku..."
            className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="rounded-full bg-green-400 px-5 py-3 text-white shadow hover:bg-green-300"
            >
              + Kategori
            </button>

            <button
              onClick={openModal}
              className="rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700"
            >
              Tambah Buku
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {books.map((b) => (
            <div
              key={b.documentId}
              className="flex items-center justify-between gap-6 rounded-lg border border-[#c48a5a] bg-white p-5 shadow-md transition hover:shadow-lg"
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
                  onClick={() => {
                    setBookToDelete(b);
                    setShowDelete(true);
                  }}
                  className="rounded-full bg-red-100 px-3 py-2 text-sm text-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/*PAGINATION*/}
        {books.length > 0 && (
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

        {books.length === 0 && (
          <p className="mt-10 text-center text-gray-600">
            Buku tidak ditemukan.
          </p>
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
                    type="text"
                    maxLength={120}
                    onChange={handleChange}
                    placeholder="Judul Buku"
                    className="rounded-lg border p-2"
                  />

                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                  )}
                  <input
                    name="writer"
                    type="text"
                    value={form.writer}
                    onChange={handleWriterChange}
                    placeholder="Penulis"
                    className="rounded-lg border p-2"
                  />

                  {errors.writer && (
                    <p className="text-xs text-red-500">{errors.writer}</p>
                  )}
                  <input
                    name="publisher"
                    type="text"
                    maxLength={100}
                    onChange={handleChange}
                    placeholder="Penerbit"
                    className="rounded-lg border p-2"
                  />

                  {errors.publisher && (
                    <p className="text-xs text-red-500">{errors.publisher}</p>
                  )}
                  <input
                    name="published_year"
                    type="number"
                    onChange={handleChange}
                    placeholder="Tahun Terbit"
                    className="rounded-lg border p-2"
                  />

                  {errors.published_year && (
                    <p className="text-xs text-red-500">
                      {errors.published_year}
                    </p>
                  )}

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
                  {errors.category && (
                    <p className="text-xs text-red-500">{errors.category}</p>
                  )}

                  <input
                    name="stock"
                    type="number"
                    onChange={handleChange}
                    placeholder="Stok"
                    className="rounded-lg border p-2"
                  />

                  {errors.stock && (
                    <p className="text-xs text-red-500">{errors.stock}</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className={`w-full rounded-lg border p-2 ${
                      errors.cover ? 'border-red-500' : ''
                    }`}
                  />

                  {errors.cover && (
                    <p className="text-xs text-red-500">{errors.cover}</p>
                  )}
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

        {/* MODAL EDIT BUKU */}
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
                    {errors.title && (
                      <p className="text-xs text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={editData.writer}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ''
                        );
                        setEditData({ ...editData, writer: value });
                      }}
                      className="w-full rounded-lg border p-2"
                    />
                    {errors.writer && (
                      <p className="text-xs text-red-500">{errors.writer}</p>
                    )}
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
                    {errors.publisher && (
                      <p className="text-xs text-red-500">{errors.publisher}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="number"
                      maxLength={4}
                      min="1900"
                      max="2100"
                      step="1"
                      value={editData.published_year}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          published_year: e.target.value
                        })
                      }
                      className="w-full rounded-lg border p-2"
                    />
                    {errors.published_year && (
                      <p className="text-xs text-red-500">
                        {errors.published_year}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      value={editData.categories || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, categories: e.target.value })
                      }
                      className="w-full rounded-lg border p-2"
                    >
                      <option value="">Pilih Kategori</option>

                      {categories.map((cat) => (
                        <option key={cat.documentId} value={cat.documentId}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500">{errors.category}</p>
                    )}
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
                    {errors.stock && (
                      <p className="text-xs text-red-500">{errors.stock}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImage}
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
                <button
                  onClick={handleUpdateBook}
                  className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {showDelete && bookToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Konfirmasi Hapus
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus buku{' '}
                <span className="font-semibold">{bookToDelete.title}</span>?
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowDelete(false)}
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

        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-green-700">
                Kelola Kategori
              </h2>

              <div className="space-y-3">
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-lg border p-3 text-sm"
                  placeholder="Nama kategori"
                />

                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {categories.map((c) => (
                    <div
                      key={c.documentId}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <span className="text-sm">{c.name}</span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryName(c.name);
                            setSelectedCategoryId(c.documentId);
                            setIsEditCategory(true);
                          }}
                          className="text-xs text-green-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCategoryToDelete(c);
                            setShowDeleteCategory(true);
                          }}
                          className="text-xs text-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCategoryModal(false);
                      setIsEditCategory(false);
                      setCategoryName('');
                    }}
                    className="rounded-lg border px-4 py-2 text-sm"
                  >
                    Batal
                  </button>

                  <button
                    onClick={() => {
                      if (isEditCategory) {
                        handleUpdateCategory();
                      } else {
                        handleCreateCategory();
                      }
                    }}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
                  >
                    {isEditCategory ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteCategory && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800">
                Konfirmasi Hapus
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus kategori{' '}
                <span className="font-semibold">{categoryToDelete.name}</span>?
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteCategory(false)}
                  className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
                >
                  Batal
                </button>

                <button
                  onClick={handleDeleteCategory}
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BukuPage;

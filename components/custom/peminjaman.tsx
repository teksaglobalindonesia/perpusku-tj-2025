'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const PeminjamanPage = () => {
  const [search, setSearch] = useState('');
  const [showTambah, setShowTambah] = useState(false);
  const [showPilihBuku, setShowPilihBuku] = useState(false);
  const [selectedBuku, setSelectedBuku] = useState<any>(null);
  const [showPilihAnggota, setShowPilihAnggota] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [showKembalikan, setShowKembalikan] = useState(false);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [loanDate, setLoanDate] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [searchBook, setSearchBook] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [totalPages, setTotalPages] = useState(1);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [members, setMembers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        page_size: '500'
      });

      const res = await fetch(
        `${BASE_URL}/api/member/list?${params.toString()}`,
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
      setMembers(json?.data || []);
    } catch (err) {
      console.error('Gagal ambil anggota:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({
        page: '1',
        page_size: '500'
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
      setBooks(json?.data || []);
    } catch (err) {
      console.error('Gagal ambil buku:', err);
    }
  };

  const fetchLoans = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        search: search
      });

      const res = await fetch(
        `${BASE_URL}/api/loan/list?${params.toString()}`,
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

      const data = json?.data || [];

      const filtered = search
        ? data.filter(
            (l: any) =>
              l.book?.title?.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      setLoans(filtered);

      if (json?.meta?.pagination?.page_count) {
        setTotalPages(json.meta.pagination.page_count);
      }
    } catch (err) {
      console.error('Gagal ambil peminjaman:', err);
    }
  };

  const calculateReturnDate = (loanDate: string, duration: number) => {
    const date = new Date(loanDate);
    date.setDate(date.getDate() + duration);
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!selectedBuku) {
      newErrors.book = 'Buku wajib dipilih';
    }

    if (!selectedAnggota) {
      newErrors.member = 'Anggota wajib dipilih';
    }

    if (!loanDate) {
      newErrors.loanDate = 'Tanggal peminjaman wajib diisi';
    }

    if (!duration) {
      newErrors.duration = 'Durasi wajib dipilih';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateLoan = async () => {
    if (!validateForm()) return;

    const returnDate = calculateReturnDate(loanDate, Number(duration));

    try {
      const res = await fetch(`${BASE_URL}/api/loan/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          data: {
            book: selectedBuku.documentId,
            member: selectedAnggota.documentId,
            loan_date: loanDate,
            return_date: returnDate,
            duration: Number(duration)
          }
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error?.message || 'Gagal tambah peminjaman');
        return;
      }

      showNotification('Peminjaman berhasil ditambahkan', 'success');

      await fetchLoans();

      setSelectedBuku(null);
      setSelectedAnggota(null);
      setLoanDate('');
      setDuration('7');
      setShowTambah(false);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchLoans();
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
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {p}
      </button>
    ));
  };

  const isLate = (returnDate?: string, actualReturnDate?: string) => {
    if (!returnDate || !actualReturnDate) return false;

    const due = new Date(returnDate);
    const actual = new Date(actualReturnDate);

    due.setHours(0, 0, 0, 0);
    actual.setHours(0, 0, 0, 0);

    return actual > due;
  };

  const handleReturnLoan = async () => {
    if (!selectedPeminjaman) return;

    try {
      const res = await fetch(`${BASE_URL}/api/return/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          data: {
            loan: selectedPeminjaman.documentId,
            actual_return_date: new Date().toLocaleDateString('en-CA')
          }
        })
      });

      if (!res.ok) {
        alert('Gagal mengembalikan buku');
        return;
      }

      showNotification('Peminjaman berhasil dikembalikan', 'success');

      await fetchLoans();

      setShowKembalikan(false);
      setSelectedPeminjaman(null);

      window.location.href = '/pengembalian';
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    }
  };

  const isPastDue = (returnDate?: string) => {
    if (!returnDate) return false;

    const today = new Date();
    const due = new Date(returnDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  const getLoanStatus = (loan: any) => {
    if (loan.return?.actual_return_date) {
      return isLate(loan.return_date, loan.return.actual_return_date)
        ? 'TERLAMBAT'
        : 'DIKEMBALIKAN';
    }

    return isPastDue(loan.return_date) ? 'TERLAMBAT' : null;
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

      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-green-700">Peminjaman</h1>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <input
            type="text"
            placeholder="Cari judul buku..."
            className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setShowTambah(true)}
            className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
          >
            Tambah Peminjaman
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {loans.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-5 shadow-md transition hover:shadow-lg "
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1 text-sm">
                  <p className="text-lg font-semibold text-green-800">
                    {item.book?.title}
                  </p>
                  <p className="text-gray-500">Peminjam: {item.member?.name}</p>
                  <p className="text-gray-500">Peminjaman: {item.loan_date}</p>
                  <p className="text-gray-500">
                    Pengembalian: {item.return_date}
                  </p>

                  {(() => {
                    const status = getLoanStatus(item);

                    if (status === 'DIKEMBALIKAN') {
                      return (
                        <span className="mt-2 inline-block rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          DIKEMBALIKAN
                        </span>
                      );
                    }

                    if (status === 'TERLAMBAT') {
                      return (
                        <span className="mt-2 inline-block rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          TERLAMBAT
                        </span>
                      );
                    }

                    return null;
                  })()}
                </div>

                <button
                  disabled={!!item.return}
                  onClick={() => {
                    setSelectedPeminjaman(item);
                    setShowKembalikan(true);
                  }}
                  className={`flex w-full items-center justify-center rounded-lg px-4 py-2 text-xs font-medium text-white sm:w-auto
                  ${
                    item.return
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {item.return ? 'KEMBALIKAN' : 'KEMBALIKAN'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/*PAGINATION*/}
        {loans.length > 0 && (
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

        {loans.length === 0 && (
          <p className="mt-10 text-center text-gray-600">
            Data peminjaman tidak ditemukan.
          </p>
        )}

        {/* MODAL TAMBAH PEMINJAMAN */}
        {showTambah && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="flex w-full max-w-[430px] flex-col rounded-xl bg-white shadow-lg md:max-w-[500px]">
              <div className="border-b px-5 py-3">
                <h2 className="text-xl font-bold text-green-700">
                  Tambah Peminjaman
                </h2>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm">
                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Buku
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPilihBuku(true)}
                    className="w-full rounded-lg border p-2 text-left hover:border-green-600"
                  >
                    {selectedBuku ? selectedBuku.title : 'Pilih Buku'}
                  </button>
                  {errors.book && (
                    <p className="mt-1 text-xs text-red-500">{errors.book}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Anggota
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPilihAnggota(true)}
                    className="w-full rounded-lg border p-2 text-left hover:border-green-600"
                  >
                    {selectedAnggota ? selectedAnggota.name : 'Pilih Anggota'}
                  </button>
                  {errors.member && (
                    <p className="mt-1 text-xs text-red-500">{errors.member}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Tanggal Peminjaman
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border p-2 focus:outline-green-600"
                    value={loanDate}
                    onChange={(e) => setLoanDate(e.target.value)}
                  />
                  {errors.loanDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.loanDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block font-medium text-gray-700">
                    Durasi Pengembalian
                  </label>
                  <select
                    className="w-full rounded-lg border p-2 focus:outline-green-600"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Pilih durasi</option>
                    <option value="7">1 Minggu</option>
                    <option value="14">2 Minggu</option>
                    <option value="30">1 Bulan (30 Hari)</option>
                  </select>
                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t px-5 py-3">
                <button
                  onClick={() => {
                    setShowTambah(false);
                    setErrors({});
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateLoan}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {showPilihBuku && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
              <div className="border-b px-5 py-3">
                <h3 className="text-lg font-bold text-green-700">Pilih Buku</h3>
              </div>
              <input
                type="text"
                placeholder="Cari judul buku..."
                className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600"
                value={searchBook}
                onChange={(e) => setSearchBook(e.target.value)}
              />
              <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-4">
                {books
                  .filter(
                    (b) =>
                      b.title?.toLowerCase().includes(searchBook.toLowerCase())
                  )
                  .map((b, i) => (
                    <button
                      key={i}
                      disabled={b.stock === 0}
                      onClick={() => {
                        setSelectedBuku(b);
                        setShowPilihBuku(false);
                      }}
                      className={`flex w-full gap-4 rounded-xl border p-3 text-left transition
                    ${
                      b.stock === 0
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:border-green-600'
                    }`}
                    >
                      <img
                        src={
                          b.cover?.url
                            ? `${BASE_URL}${b.cover.url}`
                            : '/placeholder-book.jpg'
                        }
                        alt={b.title}
                        className="h-26 w-16 rounded-lg object-cover"
                      />

                      <div className="flex-1 text-sm">
                        <h4 className="font-semibold text-gray-800">
                          {b.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Penulis: {b.writer}
                        </p>
                        <p className="text-xs text-gray-600">
                          Penerbit: {b.publisher}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tahun: {b.published_year} • {b.categories?.name}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs
                        ${
                          b.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                        >
                          {b.stock === 0 ? 'Stok Habis' : `Stok: ${b.stock}`}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
              <div className="flex justify-end border-t px-5 py-3">
                <button
                  onClick={() => setShowPilihBuku(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {showPilihAnggota && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[520px] rounded-xl bg-white shadow-lg">
              <div className="border-b px-5 py-3">
                <h3 className="text-lg font-bold text-green-700">
                  Pilih Anggota
                </h3>
              </div>
              <input
                type="text"
                placeholder="Cari nama / no anggota..."
                className="w-full rounded-lg border p-2 text-sm focus:outline-green-600"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
              />
              <div className="max-h-[60vh] space-y-3 overflow-y-auto px-5 py-4">
                {members
                  .filter(
                    (a) =>
                      a.name
                        ?.toLowerCase()
                        .includes(searchMember.toLowerCase()) ||
                      a.id_member
                        ?.toLowerCase()
                        .includes(searchMember.toLowerCase())
                  )
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setSelectedAnggota(a);
                        setShowPilihAnggota(false);
                      }}
                      className="w-full rounded-xl border p-3 text-left transition hover:border-green-600"
                    >
                      <h4 className="font-semibold text-gray-800">{a.name}</h4>
                      <p className="text-xs text-gray-500">
                        Alamat: {a.address}
                      </p>
                      <p className="text-xs text-gray-500">Email: {a.email}</p>
                      <p className="text-xs text-gray-600">
                        ID Anggota: {a.id_member}
                      </p>
                    </button>
                  ))}
              </div>
              <div className="flex justify-end border-t px-5 py-3">
                <button
                  onClick={() => setShowPilihAnggota(false)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL KEMBALIKAN */}
        {showKembalikan && selectedPeminjaman && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[380px] rounded-xl bg-white shadow-lg">
              <div className="border-b px-4 py-3 sm:px-5">
                <h3 className="text-lg font-bold text-green-700">
                  Konfirmasi Pengembalian
                </h3>
              </div>
              <div className="space-y-2 px-4 py-4 text-sm sm:px-5">
                <p className="text-gray-700">
                  Apakah buku berikut ingin dikembalikan?
                </p>

                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <p className="font-semibold text-gray-800">
                    {selectedPeminjaman.book?.title}
                  </p>
                  <p className="text-gray-600">
                    Peminjam: {selectedPeminjaman.member?.name}
                  </p>
                  <p className="text-gray-600">
                    Tanggal Pinjam: {selectedPeminjaman.loan_date}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
                <button
                  onClick={() => {
                    setShowKembalikan(false);
                    setSelectedPeminjaman(null);
                  }}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
                >
                  Batal
                </button>

                <button
                  onClick={handleReturnLoan}
                  className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 sm:w-auto"
                >
                  Kembalikan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PeminjamanPage;

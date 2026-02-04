'use client';

import { useEffect, useState } from 'react';
import { BASE_URL, TOKEN, MEMBER_NAME } from '../../lib/constant';

const AnggotaPage = () => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showPeminjaman, setShowPeminjaman] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const [totalPages, setTotalPages] = useState(1);

  const [newAnggota, setNewAnggota] = useState({
    name: '',
    id_member: '',
    address: '',
    email: ''
  });

  const [selectedAnggota, setSelectedAnggota] = useState<any>(null);
  const [anggotaToDelete, setAnggotaToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        search: search
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

      if (json?.meta?.pagination?.page_count) {
        setTotalPages(json.meta.pagination.page_count);
      }
    } catch (err) {
      console.error('Gagal ambil anggota:', err);
    }
  };

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

  const handleCreateAnggota = async () => {
    if (
      !newAnggota.name ||
      !newAnggota.id_member ||
      !newAnggota.address ||
      !newAnggota.email
    ) {
      alert('Semua field wajib diisi');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/member/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          data: newAnggota
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error?.message || 'Gagal tambah anggota');
        return;
      }

      await fetchMembers();
      setShowAdd(false);

      setNewAnggota({
        name: '',
        id_member: '',
        address: '',
        email: ''
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnggota = async () => {
    if (!selectedAnggota?.documentId) return;

    if (
      !selectedAnggota.name ||
      !selectedAnggota.id_member ||
      !selectedAnggota.address ||
      !selectedAnggota.email
    ) {
      alert('Semua field wajib diisi');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/member/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          documentId: selectedAnggota.documentId,
          data: {
            name: selectedAnggota.name,
            id_member: selectedAnggota.id_member,
            address: selectedAnggota.address,
            email: selectedAnggota.email
          }
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error?.message || 'Gagal update anggota');
        return;
      }

      await fetchMembers();
      setShowEdit(false);
      setSelectedAnggota(null);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnggota = async () => {
    if (!anggotaToDelete?.documentId) return;

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/member/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
          'x-member-name': MEMBER_NAME
        },
        body: JSON.stringify({
          documentId: anggotaToDelete.documentId
        })
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error?.message || 'Gagal hapus anggota');
        return;
      }

      await fetchMembers();
      setShowDelete(false);
      setAnggotaToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchLoans = async () => {
    const res = await fetch(`${BASE_URL}/api/loan/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN,
        'x-member-name': MEMBER_NAME
      },
      cache: 'no-store'
    });

    const json = await res.json();
    setLoans(json?.data || []);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const isLate = (returnDate?: string, actualReturnDate?: string) => {
    if (!returnDate || !actualReturnDate) return false;

    const due = new Date(returnDate);
    const actual = new Date(actualReturnDate);

    due.setHours(0, 0, 0, 0);
    actual.setHours(0, 0, 0, 0);

    return actual > due;
  };

  const getLoanStatus = (loan: any) => {
    const actualReturn =
      loan.actual_return_date ||
      loan.return?.actual_return_date ||
      loan.actualReturnDate ||
      null;

    if (!actualReturn) {
      return isPastDue(loan.return_date) ? 'TERLAMBAT' : 'DIPINJAM';
    }

    return isLate(loan.return_date, actualReturn)
      ? 'TERLAMBAT'
      : 'DIKEMBALIKAN';
  };

  const isPastDue = (returnDate?: string) => {
    if (!returnDate) return false;

    const today = new Date();
    const due = new Date(returnDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  const filteredLoans = loans.filter(
    (loan) => loan.member?.documentId === selectedAnggota?.documentId
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Data Anggota</h1>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <input
          type="text"
          placeholder="Cari nama anggota..."
          className="w-full rounded-full border p-3 shadow-sm focus:outline-green-600 sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowAdd(true)}
          className="w-full rounded-full bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700 sm:w-auto"
        >
          Tambah Anggota
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {members.map((item) => (
          <div
            key={item.documentId}
            className="flex flex-col rounded-xl border bg-white p-5 shadow-md transition hover:shadow-lg"
          >
            <h2 className="mb-1 text-xl font-bold text-green-800">
              {item.name}
            </h2>
            <p className="text-gray-600">Alamat: {item.address}</p>
            <p className="text-gray-600">{item.email}</p>
            <p className="mb-4 text-gray-500">ID Anggota: {item.id_member}</p>

            <div className="mt-auto flex flex-wrap gap-2 sm:flex-nowrap">
              <button
                onClick={() => {
                  setSelectedAnggota(item);
                  setShowPeminjaman(true);
                }}
                className="rounded-lg bg-[#CFE8FF] px-3 py-2 text-sm font-medium text-[#1E4A7B]"
              >
                Peminjaman
              </button>
              <button
                onClick={() => {
                  setSelectedAnggota(item);
                  setShowEdit(true);
                }}
                className="rounded-lg bg-[#FFF3C4] px-3 py-2 text-sm font-medium text-[#7A5C00] hover:bg-[#FFE9A1]"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setAnggotaToDelete(item);
                  setShowDelete(true);
                }}
                className="rounded-lg bg-[#FFD6D6] px-3 py-2 text-sm font-medium text-[#7A1F1F] hover:bg-[#FFBFBF]"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* DATA KOSONG */}
      {members.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          Anggota tidak ditemukan.
        </p>
      )}

      {/* POPUP TAMBAH */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex max-h-[90vh] w-full max-w-[430px] flex-col overflow-y-auto rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-xl font-bold text-green-700">
                Tambah Anggota
              </h2>
            </div>

            <div className="px-5 py-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.name}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, name: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nomor Anggota
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.id_member}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, id_member: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.address}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, address: e.target.value })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mb-2 w-full rounded-lg border p-2 focus:outline-green-600"
                value={newAnggota.email}
                onChange={(e) =>
                  setNewAnggota({ ...newAnggota, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={() => {
                  setNewAnggota({
                    name: '',
                    id_member: '',
                    address: '',
                    email: ''
                  });
                  setShowAdd(false);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={handleCreateAnggota}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDIT */}
      {showEdit && selectedAnggota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex max-h-[90vh] w-full max-w-[430px] flex-col overflow-y-auto rounded-xl bg-white shadow-lg md:max-w-[500px]">
            <div className="border-b px-5 py-3">
              <h2 className="text-xl font-bold text-green-700">Edit Anggota</h2>
            </div>

            <div className="px-5 py-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota?.name || ''}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    name: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nomor Anggota
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota?.id_member || ''}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    id_member: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <input
                className="mb-3 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota?.address || ''}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    address: e.target.value
                  })
                }
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="mb-2 w-full rounded-lg border p-2 focus:outline-green-600"
                value={selectedAnggota?.email || ''}
                onChange={(e) =>
                  setSelectedAnggota({
                    ...selectedAnggota,
                    email: e.target.value
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 border-t px-5 py-3">
              <button
                onClick={() => {
                  setSelectedAnggota({
                    id: null,
                    name: '',
                    id_member: '',
                    address: '',
                    email: ''
                  });
                  setShowEdit(false);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={handleUpdateAnggota}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DELETE */}
      {showDelete && anggotaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[380px] rounded-xl bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Konfirmasi Hapus
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus anggota{' '}
              <span className="font-semibold">{anggotaToDelete.name}</span>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="rounded-lg bg-gray-200 px-4 py-1.5 text-sm"
              >
                Batal
              </button>

              <button
                onClick={handleDeleteAnggota}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP LIHAT PEMINJAMAN */}
      {showPeminjaman && selectedAnggota && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <h2 className="text-xl font-bold text-green-700">
                  Peminjaman Buku
                </h2>
                <p className="text-sm text-gray-500">{selectedAnggota.name}</p>
              </div>
              <button onClick={() => setShowPeminjaman(false)}>✕</button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {filteredLoans.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Belum ada data peminjaman
                </p>
              ) : (
                filteredLoans.map((loan) => {
                  const status = getLoanStatus(loan);

                  return (
                    <div
                      key={loan.documentId}
                      className="rounded-lg border p-4"
                    >
                      <h3 className="font-semibold">{loan.book?.title}</h3>

                      <p className="text-sm text-gray-600">
                        Tanggal Pinjam: {loan.loan_date}
                      </p>

                      <p className="text-sm text-gray-600">
                        Tanggal Kembali: {loan.return_date}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded px-3 py-1 text-xs font-semibold ${
                          status === 'DIKEMBALIKAN'
                            ? 'bg-[#DFF3E3] text-[#1E6B3A]'
                            : status === 'DIPINJAM'
                            ? 'bg-[#E0ECFF] text-[#1E4A7B]'
                            : 'bg-[#FFD6D6] text-[#7A1F1F]'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnggotaPage;

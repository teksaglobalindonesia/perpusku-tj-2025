"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

const AnggotaPage = () => {
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedLoans, setSelectedLoans] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [showBookDetailModal, setShowBookDetailModal] = useState(false);
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
const [selectedBook, setSelectedBook] = useState<any>(null);
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  address: "",
  id_member: "",
});

const totalMembers = members.length;

 //Label Status Loan
 const getLoanStatus = (loan: any) => {
  // sudah dikembalikan
  if (loan.return) {
    return {
      label: "Returned",
      className: "bg-green-100 text-green-700",
    };
  }

  const today = new Date();
  const loanDate = new Date(loan.loan_date);
  const returnDate = loan.return_date
    ? new Date(loan.return_date)
    : null;

  //   BELUM WAKTUNYA DIPINJAM
  if (loanDate > today) {
    return {
      label: "Reserved",
      className: "bg-blue-100 text-blue-700",
    };
  }

  //  TELAT
  if (returnDate && today > returnDate) {
    return {
      label: "Late",
      className: "bg-red-100 text-red-600",
    };
  }

  //  SEDANG DIPINJAM
  return {
    label: "Borrowed",
    className: "bg-yellow-100 text-yellow-700",
  };
};



 // GET DATA
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/member/list`, {
        method: "GET",
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });

      const json = await res.json();
      setMembers(json?.data ?? []);
    } catch (err) {
      console.error("Gagal ambil anggota:", err);
    }
  })();
}, []);



const handleViewLoans = async (member: any) => {
  setSelectedMember(member);
  setShowLoanModal(true);

  try {
    const res = await fetch(
      `${BASE_URL}/api/loan/list?id_member=${member.documentId}`,
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
    setSelectedLoans(json?.data || []);
  } catch (err) {
    console.error("Gagal ambil peminjaman:", err);
  }
};


const filteredMembers = members.filter((member) =>
  member.name.toLowerCase().includes(search.toLowerCase())
);

const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

const paginatedMembers = filteredMembers.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);


const [addForm, setAddForm] = useState({
  name: "",
  email: "",
  address: "",
  id_member: "",
});

const handleCreateMember = async () => {
  if (
    !addForm.name ||
    !addForm.email ||
    !addForm.address ||
    !addForm.id_member
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/member/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        data: addForm, 
      }),
    });

    const text = await res.text();
    console.log("ADD MEMBER RESPONSE:", text);

    if (!res.ok) {
      alert("Gagal menambah anggota");
      return;
    }

    setShowAddModal(false);
    setAddForm({
      name: "",
      email: "",
      address: "",
      id_member: "",
    });

    // refresh list
    const refreshed = await fetch(`${BASE_URL}/api/member/list`, {
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
    });

    const json = await refreshed.json();
    setMembers(json.data || []);
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
  }
};


const handleEdit = (member: any) => {
  setSelectedMember(member);

  setEditForm({
    name: member.name ?? "",
    email: member.email ?? "",
    address: member.address ?? "",
    id_member: member.id_member ?? "",
  });

  setShowEditModal(true);
};

const handleUpdateMember = async () => {
  if (!selectedMember?.documentId) return;

  try {
    const res = await fetch(`${BASE_URL}/api/member/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selectedMember.documentId,
        data: editForm,
      }),
    });

    if (!res.ok) {
      console.error("UPDATE GAGAL:", await res.text());
      return;
    }

    setShowEditModal(false);
    setSelectedMember(null);

    // refresh list
    const refreshed = await fetch(`${BASE_URL}/api/member/list`, {
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
    });

    const json = await refreshed.json();
    setMembers(json.data || []);
  } catch (err) {
    console.error("Gagal update anggota:", err);
  }
};


  const handleDelete = (member: any) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleDeleteMember = async () => {
  if (!selectedMember?.id) return;

  try {
    const res = await fetch(`${BASE_URL}/api/member/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        documentId: selectedMember.documentId,
      }),
    });

    if (!res.ok) {
      console.error("STATUS:", res.status);
      console.error("RESPONSE:", await res.text());
      return;
    }

    setShowDeleteModal(false);
    setSelectedMember(null);

    // refresh list
    const refreshed = await fetch(`${BASE_URL}/api/member/list`, {
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
    });
    const json = await refreshed.json();
    setMembers(json.data || []);

  } catch (err) {
    console.error("Gagal hapus anggota:", err);
  }
};
useEffect(() => {
  setCurrentPage(1);
}, [search]);


  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Member List
        </h1>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow text-sm sm:text-base">
          <FiPlus />
          <span>Add Member</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow mb-6 sm:mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total Members</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {totalMembers}
          </h3>
        </div>
      </div>

        {/* List Anggota */}
        <div className="space-y-3 sm:space-y-4">
          {paginatedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Bagian kiri - info */}
              <div className="flex flex-col gap-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {member.name}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500">
                  <span>Member ID: {member.id}</span>
                  <span>Address: {member.address}</span>
                  <span>{member.email}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">

                  <span
                    className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full`}
                  >
                    {member.id_member}
                  </span>
                </div>
              </div>
            {/* Bagian kanan - action */}
            <div className="flex gap-2 justify-end sm:justify-start flex-wrap">

              <button
                onClick={() => handleViewLoans(member)}
                className="text-[11px] sm:text-xs px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                Loans
              </button>
              <button
                onClick={() => handleEdit(member)}
                className="text-[11px] sm:text-xs px-4 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member)}
                className="text-[11px] sm:text-xs px-4 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-sm">
          Member data not found
        </div>
      )}
        {/* Modal Peminjaman */}
        {showLoanModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 animate-scale-in">
              <h2 className="text-lg font-semibold mb-4">
                Loan - {selectedMember.name}
              </h2>
              {selectedLoans.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Loans Data not found.
                </p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedLoans.map((loan) => {
                    const status = getLoanStatus(loan);
                    return(
                    <div
                      key={loan.id}
                      className="border rounded-lg p-3 text-sm"
                    >
                      <p className="font-medium">{loan.book?.title}</p>
                      <p className="text-xs text-gray-500">
                        Loan Date: {loan.loan_date}
                      </p>
                      <p className="text-xs text-gray-500">
                        Return Date: {loan.return_date ?? "-"}
                      </p>
                        <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.className}`}>
                        {status.label}
                        </span>
                    <button onClick={() => {
                        setSelectedBook(loan.book);
                        setShowBookDetailModal(true);
                        }}
                        className="mt-2 text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded">
                      Book&apos;s Detail
                    </button>
                    </div>
                  )})}
                </div>
              )}
              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setShowLoanModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showBookDetailModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6 relative animate-scale-in">
              <h2 className="text-lg font-semibold mb-4">Detail Buku</h2>
              <div className="space-y-2 text-sm">
                <p><b>Title:</b> {selectedBook.title}</p>
                <p><b>Writer:</b> {selectedBook.writer}</p>
                <p><b>Publisher:</b> {selectedBook.publisher}</p>
                <p><b>Published Year:</b> {selectedBook.published_year}</p>
                <p><b>Stock:</b> {selectedBook.stock}</p>
              </div>
                <Link href="/buku" className="text-xs sm:text-sm text-blue-600 hover:underline">
                    See more
                </Link>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowBookDetailModal(false)}
                  className="px-4 py-2 rounded bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal Edit */}
        {showEditModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 animate-scale-in">
              <h2 className="text-lg font-semibold mb-5">Edit Member</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Member name"
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                />

                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                />

                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  placeholder="Address"
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                />

                <input
                  type="text"
                  value={editForm.id_member}
                  onChange={(e) =>
                    setEditForm({ ...editForm, id_member: e.target.value })
                  }
                  placeholder="ID Number"
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateMember}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      {/* Modal Delete */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Member</h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {selectedMember.name}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button onClick={handleDeleteMember}className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Tambah */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5">Add Member</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="ID Number"
                value={addForm.id_member}
                onChange={(e) =>
                  setAddForm({ ...addForm, id_member: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Address"
                value={addForm.address}
                onChange={(e) =>
                  setAddForm({ ...addForm, address: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="email"
                placeholder="Email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateMember}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-100 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default AnggotaPage;

"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BASE_URL, TOKEN, MEMBER_NAME} from "../../lib/constant";

const PeminjamanPage = () => {
  const [search, setSearch] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

const [showAddModal, setShowAddModal] = useState(false);
const [showBookModal, setShowBookModal] = useState(false);
const [showMemberModal, setShowMemberModal] = useState(false);

const [selectedBook, setSelectedBook] = useState<any>(null);
const [selectedMember, setSelectedMember] = useState<any>(null);

const [newLoanDate, setNewLoanDate] = useState("");
const [newReturnDate, setNewReturnDate] = useState("");

const [loans, setLoans] = useState<any[]>([]);
const [books, setBooks] = useState<any[]>([]);
const [members, setMembers] = useState<any[]>([]);

const ITEMS_PER_PAGE = 4;
const [currentPage, setCurrentPage] = useState(1);

const getCoverUrl = (cover?: any) => {
  if (!cover?.url) return null;
  return `${BASE_URL}${cover.url}`;
};


useEffect(() => {
  if (!showAddModal) return;

  (async () => {
    try {
      const [bookRes, memberRes] = await Promise.all([
        fetch(`${BASE_URL}/api/book/list`, {
          headers: {
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
          },
        }),
        fetch(`${BASE_URL}/api/member/list`, {
          headers: {
            Authorization: TOKEN,
            "x-member-name": MEMBER_NAME,
          },
        }),
      ]);

      const bookJson = await bookRes.json();
      const memberJson = await memberRes.json();

      setBooks(bookJson?.data ?? []);
      setMembers(memberJson?.data ?? []);
    } catch (err) {
      console.error("Gagal fetch book/member:", err);
    }
  })();
}, [showAddModal]);

const today = new Date();

useEffect(() => {
  setCurrentPage(1);
}, [search]);


const filteredLoans = loans.filter((loan) =>
  loan.book?.title
    ? loan.book.title.toLowerCase().includes(search.toLowerCase())
    : false
);
const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);

const paginatedLoans = filteredLoans.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

const isLate = (returnDate: string) => {
  return new Date(returnDate) < new Date();
};

  const handleReturn = (loan: any) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  const handleCreateLoan = async () => {
  if (
    !selectedBook ||
    !selectedMember ||
    !newLoanDate ||
    !newReturnDate
  ) {
    alert("Semua field wajib diisi");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/loan/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        data: {
          book: selectedBook.documentId,
          member: selectedMember.documentId,
          loan_date: newLoanDate,
          return_date: newReturnDate,
        },
      }),
    });

    const text = await res.text();
    console.log("ADD LOAN RESPONSE:", text);

    if (!res.ok) {
      alert("Gagal menambah peminjaman");
      return;
    }

    // reset state
    setShowAddModal(false);
    setSelectedBook(null);
    setSelectedMember(null);
    setNewLoanDate("");
    setNewReturnDate("");

    // refresh loan list
    const refreshed = await fetch(`${BASE_URL}/api/loan/list`, {
      headers: {
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      cache: "no-store",
    });

    const json = await refreshed.json();
    setLoans(json?.data ?? []);
  } catch (err) {
    console.error("ADD LOAN ERROR:", err);
  }
};
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/loan/list`, {
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      });

      const json = await res.json();
      console.log("LOANS:", json.data);
      setLoans(json?.data ?? []);
    } catch (err) {
      console.error("Gagal fetch loan:", err);
    }
  })();
}, []);
useEffect(() => {
  (async () => {
    const res = await fetch(
      `${BASE_URL}/api/book/list`,
      {
        headers: {
          Authorization: TOKEN,
          "x-member-name": MEMBER_NAME,
        },
        cache: "no-store",
      }
    );

    const json = await res.json();
    setBooks(json?.data ?? []);
  })();
}, []);
const findBook = (bookId: string) =>
  books.find(b => b.documentId === bookId);

const handleConfirmReturn = async () => {
  if (!selectedLoan) return;

  try {
    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(`${BASE_URL}/api/return/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "x-member-name": MEMBER_NAME,
      },
      body: JSON.stringify({
        data: {
          loan: selectedLoan.documentId, // 🔥 INI PENTING
          actual_return_date: today,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("RETURN ERROR:", err);
      alert("Gagal mengembalikan buku");
      return;
    }

    setLoans(prev =>
      prev.filter(l => l.documentId !== selectedLoan.documentId)
    );

    // reset modal
    setShowReturnModal(false);
    setSelectedLoan(null);

  } catch (err) {
    console.error("RETURN FAILED:", err);
  }
};
const isReturned = (loan: any) => {
  return !!loan.return;
};


  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
    Loan Data
  </h1>

  <button
    onClick={() => setShowAddModal(true)}
    className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    + Add Loan
  </button>
</div>


      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow mb-6 sm:mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

      {/* List Peminjaman */}
      <div className="space-y-3 sm:space-y-4">
        
        {paginatedLoans.map((loan) => {
          console.log("BOOK:", loan.book);
          console.log("BOOK COVER:", loan.book?.cover);
          console.log("COVER URL:", getCoverUrl(loan.book?.cover));
          const late = isLate(loan.return_date);
          const book = findBook(loan.book);
          return (
            <div
              key={loan.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Info */}
            <div className="flex gap-4">
             {/* Text */}
              <div className="flex flex-col gap-1">
               <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                {loan.book?.title}
               </h2>
               <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500">
                 <span>Borrower: {loan.member?.name}</span>
                 <span>Borrow Date: {loan.loan_date}</span>
                 <span>Estimated Return Date: {loan.return_date}</span>
               </div>
               <div className="flex flex-row gap-2">
               {isReturned(loan) ? (
                 <span className="mt-1 inline-block w-fit px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-100 text-green-700">
                  Returned
                 </span>
                 
                 ) 
                  : null}
                 {late && (
                  <span className="mt-1 inline-block w-fit px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-100 text-red-600">
                  Late
                  </span>
                 )}
                 {isReturned(loan) && (
                  <p className="text-[11px] text-gray-500">
                    Returned at: {loan.return.actual_return_date}
                  </p>
                 )}
                </div>
               </div>
              </div>
              {/* Action */}
              <div className="flex gap-2 justify-end sm:justify-start">
               <button
                  disabled={isReturned(loan)}
                  onClick={() => handleReturn(loan)}
                  className={`text-[11px] sm:text-xs px-4 py-1.5 rounded-lg transition ${
                  isReturned(loan)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                 }`}>
                 Return
               </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredLoans.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-sm">
          Loan Data not found
        </div>
      )}

      {/* Modal Kembalikan */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">
              Return Confirmation
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to return the{" "}
              <span className="font-semibold text-gray-800">
                {selectedLoan.book?.title}
              </span>{" "}
              book from{" "}
              <span className="font-semibold text-gray-800">
                {selectedLoan.member?.name}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                Yes, Return it
              </button>
            </div>
          </div>
        </div>
      )}

{/* Modal Tambah Peminjaman */}
{showAddModal && (
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-scale-in">
      <h2 className="text-lg font-semibold mb-4">Add Loans</h2>

      <div className="space-y-4">
        {/* Pilih Buku */}
        <div>
          <label className="text-xs text-gray-500">Book</label>
          <button
            type="button"
            onClick={() => setShowBookModal(true)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border text-left hover:bg-gray-50"
          >
            {selectedBook ? selectedBook.title : "Select Book"}
          </button>
        </div>

        {/* Pilih Anggota */}
        <div>
          <label className="text-xs text-gray-500">Member</label>
          <button
            type="button"
            onClick={() => setShowMemberModal(true)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border text-left hover:bg-gray-50"
          >
            {selectedMember ? selectedMember.name : "Select Member"}
          </button>
        </div>

        {/* Tanggal Pinjam */}
        <div>
          <label className="text-xs text-gray-500">Borrowing Date</label>
          <input
            type="date"
            value={newLoanDate}
            onChange={(e) => setNewLoanDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none"
          />
        </div>

        {/* Tanggal Kembali */}
        <div>
          <label className="text-xs text-gray-500">Return Date</label>
          <input
            type="date"
            value={newReturnDate}
            onChange={(e) => setNewReturnDate(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateLoan}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal Pilih Buku */}
{showBookModal && (
  <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl p-5 animate-scale-in">
      <h3 className="text-sm font-semibold mb-4">Select Book</h3>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {books.map((book) =>{
         console.log("BOOK:", book);
         console.log("BOOK COVER:", book.cover);
         return (
          <button
            key={book.id}
            onClick={() => {
              setSelectedBook(book);
              setShowBookModal(false);
            }}
            className="w-full text-left p-3 rounded-xl border hover:bg-blue-50 transition flex gap-4"
          >
            
            {/* Cover */}
            <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
               <img
               src={`${BASE_URL}${book.cover.url}`}
               alt={book.title}
               className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-800">
                {book.title}
              </p>
              <p className="text-[11px] text-gray-500">
                Writer: {book.writer}
              </p>
              <p className="text-[11px] text-gray-500">
                Publisher: {book.publisher}
              </p>
              <p className="text-[11px] text-gray-500">
                Published Year: {book.published_year}
              </p>
              <p className="text-[11px] text-gray-500">
                Category: {book.categories?.[0]?.name ?? "-"}
              </p>

              {/* Stok */}
              <span
                className={`mt-1 inline-block w-fit px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  book.stock > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}>
                {book.stock > 0 ? `Stok: ${book.stock}` : "Stok Habis"}
              </span>
            </div>
          </button>
        )})}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowBookModal(false)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal Pilih Anggota */}
{showMemberModal && (
  <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl p-5 animate-scale-in">
      <h3 className="text-sm font-semibold mb-4">Select Member</h3>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => {
              setSelectedMember(member);
              setShowMemberModal(false);
            }}
            className="w-full text-left p-3 rounded-xl border hover:bg-blue-50 transition"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-800">
                {member.name}
              </p>
              <p className="text-[11px] text-gray-500">
                Member ID: {member.id_member}
              </p>
              <p className="text-[11px] text-gray-500">
                Address: {member.address}
              </p>
              <p className="text-[11px] text-gray-500">
                Email: {member.email}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowMemberModal(false)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
{/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8">
    <button
      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

export default PeminjamanPage;

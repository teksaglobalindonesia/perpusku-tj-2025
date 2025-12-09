"use client";

import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

const AnggotaPage = () => {
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);


  // Dummy data anggota
  const members = [
    {
      id: 1,
      name: "Ahmad Rizki",
      no_member: "2023001",
      address: "Kerobokan Kelod",
      email: "ahmadfahrezi@yahoo.com",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Siti Aisyah",
      no_member: "2023002",
      address: "jl. taman sari 1",
      email: "sitiaisyah@outlook.com",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Budi Santoso",
      no_member: "2023003",
      address: "Kuta Utara",
      email: "budisantoso@gmail.com",
      status: "Nonaktif",
    },
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleDelete = (member: any) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Data Anggota
        </h1>

        <button onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow text-sm sm:text-base">
          <FiPlus />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow mb-6 sm:mb-8 flex items-center gap-3">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama anggota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none text-sm text-gray-700"
        />
      </div>

{/* List Anggota */}
<div className="space-y-3 sm:space-y-4">
  {filteredMembers.map((member) => (
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
          <span>Nomor Anggota: {member.no_member}</span>
          <span>Alamat: {member.address}</span>
          <span>{member.email}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">

          <span
            className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full ${
              member.status === "Aktif"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {member.status}
          </span>
        </div>
      </div>

      {/* Bagian kanan - action */}
      <div className="flex gap-2 justify-end sm:justify-start">
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
          Hapus
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Kalau kosong */}
      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-500 mt-12 text-sm">
          Anggota tidak ditemukan
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 animate-scale-in">
            <h2 className="text-lg font-semibold mb-5">Edit Anggota</h2>

            <div className="space-y-3">
              <input
                type="text"
                defaultValue={selectedMember.name}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                defaultValue={selectedMember.nis}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                defaultValue={selectedMember.class}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                defaultValue={selectedMember.phone}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <select
                defaultValue={selectedMember.gender}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              >
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>

              <select
                defaultValue={selectedMember.status}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              >
                <option>Aktif</option>
                <option>Nonaktif</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
              >
                Batal
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Hapus Anggota</h2>

            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus{" "}
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
                Batal
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Tambah */}
{showAddModal && (
  <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 animate-scale-in">
      <h2 className="text-lg font-semibold mb-5">Tambah Anggota</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nama anggota"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Nomor anggota"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Alamat"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <select className="w-full border rounded-lg px-4 py-2 text-sm">
          <option value="">Pilih Status</option>
          <option>Aktif</option>
          <option>Nonaktif</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
        >
          Cancel
        </button>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm">
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AnggotaPage;

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Search,
  X,
  Pencil,
  Trash2,
  SlidersHorizontal,
} from "lucide-react"

export default function SheepPage() {
  const [sheep, setSheep] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showColumnPanel, setShowColumnPanel] = useState(false) // ✅ toggle column panel
  const [editingSheep, setEditingSheep] = useState(null)
  const [formData, setFormData] = useState({
    kode: "",
    berat_awal: "",
    tanggal_beli: "",
    tempat_beli: "",
    berat_jual: "",
    harga_beli: "",
    harga_terjual: "",
    tanggal_terjual: "",
    total_pakan: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [search, setSearch] = useState("")
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "kode",
    "berat_awal",
    "tanggal_beli",
    "tempat_beli",
    "harga_beli",
    "harga_terjual",
    "profit",
  ])

  const itemsPerPage = 12

  const columns = [
    { key: "id", label: "ID" },
    { key: "kode", label: "Kode" },
    { key: "berat_awal", label: "Berat Awal (kg)" },
    { key: "tanggal_beli", label: "Tanggal Beli" },
    { key: "tempat_beli", label: "Tempat Beli" },
    { key: "berat_jual", label: "Berat Jual (kg)" },
    { key: "harga_beli", label: "Harga Beli" },
    { key: "harga_terjual", label: "Harga Terjual" },
    { key: "tanggal_terjual", label: "Tanggal Terjual" },
    { key: "total_pakan", label: "Total Pakan" },
    { key: "profit", label: "Profit" },
  ]

  function formatRupiah(value) {
    if (!value || isNaN(value)) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  function handleRupiahChange(field, value) {
    const numericValue = value.replace(/[^0-9]/g, "")
    setFormData({ ...formData, [field]: numericValue })
  }

  useEffect(() => {
    fetchSheep()
  }, [sortField, sortOrder])

  async function fetchSheep() {
    setLoading(true)
    const { data, error } = await supabase
      .from("sheep_data")
      .select("*")
      .ilike("kode", `%${search}%`)
      .order(sortField, { ascending: sortOrder === "asc" })
    if (!error) setSheep(data)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const hargaBeli = Number(formData.harga_beli) || 0
    const hargaTerjual = Number(formData.harga_terjual) || 0
    const totalPakan = Number(formData.total_pakan) || 0
    const profit =
      hargaTerjual && hargaBeli ? hargaTerjual - hargaBeli - totalPakan : null
    const payload = {
      ...formData,
      harga_beli: hargaBeli,
      harga_terjual: hargaTerjual,
      total_pakan: totalPakan,
      profit,
    }
    if (editingSheep) {
      await supabase.from("sheep_data").update(payload).eq("id", editingSheep.id)
    } else {
      await supabase.from("sheep_data").insert([payload])
    }
    fetchSheep()
    resetForm()
  }

  function resetForm() {
    setFormData({
      kode: "",
      berat_awal: "",
      tanggal_beli: "",
      tempat_beli: "",
      berat_jual: "",
      harga_beli: "",
      harga_terjual: "",
      tanggal_terjual: "",
      total_pakan: "",
    })
    setEditingSheep(null)
    setShowForm(false)
  }

  async function handleDelete(id) {
    if (confirm("Delete this sheep?")) {
      await supabase.from("sheep_data").delete().eq("id", id)
      fetchSheep()
    }
  }

  function handleEdit(s) {
    setEditingSheep(s)
    setFormData({
      kode: s.kode || "",
      berat_awal: s.berat_awal || "",
      tanggal_beli: s.tanggal_beli || "",
      tempat_beli: s.tempat_beli || "",
      berat_jual: s.berat_jual || "",
      harga_beli: s.harga_beli?.toString() || "",
      harga_terjual: s.harga_terjual?.toString() || "",
      tanggal_terjual: s.tanggal_terjual || "",
      total_pakan: s.total_pakan?.toString() || "",
    })
    setShowForm(true)
  }

  function handleSort(field) {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  function toggleColumn(key) {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSheep = sheep.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sheep.length / itemsPerPage)

  return (
    <div className="max-w-7xl mx-auto p-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">🐑 Sheep Management</h1>
        <div className="flex gap-3">
          {/* Toggle column panel */}
          <button
            onClick={() => setShowColumnPanel((p) => !p)}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
          >
            <SlidersHorizontal size={18} />
            Columns
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingSheep(null)
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
          >
            {showForm ? <X size={20} /> : <PlusCircle size={20} />}
            {showForm ? "Close" : "Add Sheep"}
          </button>
        </div>
      </div>

      {/* Column Selector – collapsible */}
      {showColumnPanel && (
        <div className="mb-4 bg-white p-4 rounded shadow animate-fadeIn">
          <p className="font-semibold mb-2">Show / Hide Columns:</p>
          <div className="flex flex-wrap gap-4">
            {columns.map((col) => (
              <label key={col.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => toggleColumn(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search sheep by kode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchSheep()}
          className="border p-2 rounded-lg w-full md:w-1/3 text-black"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-left border-collapse text-black">
          <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <tr>
              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((col) => (
                  <th
                    key={col.key}
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}{" "}
                    {sortField === col.key && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : currentSheep.length > 0 ? (
              currentSheep.map((s) => (
                <tr key={s.id} className="border-b hover:bg-blue-50 transition">
                  {columns
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key} className="p-3">
                        {col.key === "kode" ? (
                          <Link
                            href={`/sheep/${s.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {s[col.key]}
                          </Link>
                        ) : col.key.includes("harga") ||
                          col.key === "total_pakan" ||
                          col.key === "profit" ? (
                          formatRupiah(s[col.key])
                        ) : col.key.includes("tanggal") ? (
                          s[col.key] ? new Date(s[col.key]).toLocaleDateString() : "-"
                        ) : (
                          s[col.key] || "-"
                        )}
                      </td>
                    ))}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + 1}
                  className="text-center p-4 text-gray-500"
                >
                  No sheep found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

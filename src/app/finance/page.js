"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function FinancePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [finance, setFinance] = useState([])
  const [form, setForm] = useState({ nama: "", modal_beli: "", profit: "" })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/profile")
      else setUser(data.session.user)
    })
  }, [router])

  useEffect(() => {
    fetchFinance()
  }, [])

  async function fetchFinance() {
    let { data, error } = await supabase.from("finance").select("*")
    if (!error) setFinance(data)
  }

  async function addFinance(e) {
    e.preventDefault()
    const { error } = await supabase.from("finance").insert([form])
    if (!error) {
      setForm({ nama: "", modal_beli: "", profit: "" })
      fetchFinance()
    }
  }

  if (!user) return <p className="p-6">Redirecting...</p>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-600">💰 Data Keuangan</h1>

      {/* Form */}
      <form
        onSubmit={addFinance}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow"
      >
        <input
          className="border p-2 rounded focus:outline-green-400"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-green-400"
          placeholder="Modal Beli"
          type="number"
          value={form.modal_beli}
          onChange={(e) => setForm({ ...form, modal_beli: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-green-400"
          placeholder="Profit"
          type="number"
          value={form.profit}
          onChange={(e) => setForm({ ...form, profit: e.target.value })}
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Tambah
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white rounded-lg shadow text-sm">
          <thead className="bg-green-100 text-green-700">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Modal Beli</th>
              <th className="border p-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {finance.map((f) => (
              <tr key={f.id} className="hover:bg-green-50">
                <td className="border p-2">{f.nama}</td>
                <td className="border p-2">{f.modal_beli}</td>
                <td className="border p-2">{f.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

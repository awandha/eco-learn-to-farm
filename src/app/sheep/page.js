"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function SheepPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sheep, setSheep] = useState([])
  const [form, setForm] = useState({ kode: "", harga_beli: "", jumlah: "" })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/profile")
      else setUser(data.session.user)
    })
  }, [router])

  useEffect(() => {
    fetchSheep()
  }, [])

  async function fetchSheep() {
    let { data, error } = await supabase.from("sheep_data").select("*")
    if (!error) setSheep(data)
  }

  async function addSheep(e) {
    e.preventDefault()
    const { error } = await supabase.from("sheep_data").insert([form])
    if (!error) {
      setForm({ kode: "", harga_beli: "", jumlah: "" })
      fetchSheep()
    }
  }

  if (!user) return <p className="p-6">Redirecting...</p>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">🐑 Data Domba</h1>

      {/* Form */}
      <form
        onSubmit={addSheep}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow"
      >
        <input
          className="border p-2 rounded focus:outline-blue-400"
          placeholder="Kode"
          value={form.kode}
          onChange={(e) => setForm({ ...form, kode: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-blue-400"
          placeholder="Harga Beli"
          type="number"
          value={form.harga_beli}
          onChange={(e) => setForm({ ...form, harga_beli: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-blue-400"
          placeholder="Jumlah"
          type="number"
          value={form.jumlah}
          onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white rounded-lg shadow text-sm">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="border p-2">Kode</th>
              <th className="border p-2">Harga Beli</th>
              <th className="border p-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {sheep.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50">
                <td className="border p-2">{s.kode}</td>
                <td className="border p-2">{s.harga_beli}</td>
                <td className="border p-2">{s.jumlah}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

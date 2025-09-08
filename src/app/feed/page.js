"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function FeedPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [feed, setFeed] = useState([])
  const [form, setForm] = useState({ tanggal: "", jumlah: "", harga: "" })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/profile")
      else setUser(data.session.user)
    })
  }, [router])

  useEffect(() => {
    fetchFeed()
  }, [])

  async function fetchFeed() {
    let { data, error } = await supabase.from("feed").select("*")
    if (!error) setFeed(data)
  }

  async function addFeed(e) {
    e.preventDefault()
    const { error } = await supabase.from("feed").insert([form])
    if (!error) {
      setForm({ tanggal: "", jumlah: "", harga: "" })
      fetchFeed()
    }
  }

  if (!user) return <p className="p-6">Redirecting...</p>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-700">🌾 Data Pakan</h1>

      {/* Form */}
      <form
        onSubmit={addFeed}
        className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow"
      >
        <input
          className="border p-2 rounded focus:outline-green-400"
          type="date"
          value={form.tanggal}
          onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-green-400"
          placeholder="Jumlah (kg)"
          type="number"
          value={form.jumlah}
          onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
        />
        <input
          className="border p-2 rounded focus:outline-green-400"
          placeholder="Harga"
          type="number"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: e.target.value })}
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Tambah
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white rounded-lg shadow text-sm">
          <thead className="bg-green-100 text-green-700">
            <tr>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Jumlah (kg)</th>
              <th className="border p-2">Harga</th>
            </tr>
          </thead>
          <tbody>
            {feed.map((f) => (
              <tr key={f.id} className="hover:bg-green-50">
                <td className="border p-2">{f.tanggal}</td>
                <td className="border p-2">{f.jumlah}</td>
                <td className="border p-2">{f.harga}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

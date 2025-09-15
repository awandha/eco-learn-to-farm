"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function SheepDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sheep, setSheep] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState("weight")

  // Records
  const [weightRecords, setWeightRecords] = useState([])
  const [healthRecords, setHealthRecords] = useState([])
  const [breedingRecords, setBreedingRecords] = useState([])

  // Forms
  const [weightForm, setWeightForm] = useState({ weight: "", notes: "" })
  const [healthForm, setHealthForm] = useState({ condition: "", treatment: "", medicine: "", notes: "" })
  const [breedingForm, setBreedingForm] = useState({ mate_id: "", result: "", notes: "" })

  // ✅ Format Rupiah
  function formatRupiah(value) {
    if (!value) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/profile")
      else setUser(data.session.user)
    })
  }, [router])

  useEffect(() => {
    if (id) {
      fetchSheep()
      fetchRecords()
    }
  }, [id])

  async function fetchSheep() {
    let { data } = await supabase.from("sheep_data").select("*").eq("id", id).single()
    setSheep(data)
    setFormData(data)
  }

  async function fetchRecords() {
    let { data: w } = await supabase.from("weight_records").select("*").eq("sheep_id", id).order("date", { ascending: false })
    let { data: h } = await supabase.from("health_records").select("*").eq("sheep_id", id).order("date", { ascending: false })
    let { data: b } = await supabase.from("breeding_records").select("*").eq("sheep_id", id).order("date", { ascending: false })
    setWeightRecords(w || [])
    setHealthRecords(h || [])
    setBreedingRecords(b || [])
  }

  async function handleUpdateSheep(e) {
    e.preventDefault()
    const profit =
      formData.harga_terjual && formData.harga_beli
        ? Number(formData.harga_terjual) - Number(formData.harga_beli) - Number(formData.total_pakan || 0)
        : null

    const payload = { ...formData, profit }
    const { error } = await supabase.from("sheep_data").update(payload).eq("id", id)
    if (error) console.error(error)
    else {
      setSheep(payload)
      setEditing(false)
    }
  }

  async function addWeight(e) {
    e.preventDefault()
    await supabase.from("weight_records").insert([{ sheep_id: id, ...weightForm }])
    setWeightForm({ weight: "", notes: "" })
    fetchRecords()
  }

  async function addHealth(e) {
    e.preventDefault()
    await supabase.from("health_records").insert([{ sheep_id: id, ...healthForm }])
    setHealthForm({ condition: "", treatment: "", medicine: "", notes: "" })
    fetchRecords()
  }

  async function addBreeding(e) {
    e.preventDefault()
    await supabase.from("breeding_records").insert([{ sheep_id: id, ...breedingForm }])
    setBreedingForm({ mate_id: "", result: "", notes: "" })
    fetchRecords()
  }

  if (!user) return <p className="p-6">Redirecting...</p>
  if (!sheep) return <p className="p-6">Loading...</p>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-600">🐑 Detail Domba: {sheep.kode}</h1>

      {/* Sheep Info Editable */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {editing ? (
          <form onSubmit={handleUpdateSheep} className="grid grid-cols-2 gap-3 text-black">
            {[
              { name: "kode", label: "Kode" },
              { name: "berat_awal", label: "Berat Awal (kg)" },
              { name: "tanggal_beli", label: "Tanggal Beli" },
              { name: "tempat_beli", label: "Tempat Beli" },
              { name: "berat_jual", label: "Berat Jual (kg)" },
              { name: "harga_beli", label: "Harga Beli (Rp)" },
              { name: "harga_terjual", label: "Harga Terjual (Rp)" },
              { name: "tanggal_terjual", label: "Tanggal Terjual" },
              { name: "total_pakan", label: "Total Pakan (Rp)" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold text-sm text-gray-700">{field.label}</label>
                <input
                  type={
                    field.name.includes("harga") || field.name.includes("pakan")
                      ? "number"
                      : field.name.includes("tanggal")
                      ? "date"
                      : "text"
                  }
                  className="border p-2 rounded text-black"
                  value={formData?.[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                />
              </div>
            ))}
            <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
              Save
            </button>
          </form>
        ) : (
          <>
            <div className="space-y-1 text-black"> 
              <p><strong>Kode:</strong> {sheep.kode}</p>
              <p><strong>Berat Awal:</strong> {sheep.berat_awal} kg</p>
              <p><strong>Tanggal Beli:</strong> {sheep.tanggal_beli}</p>
              <p><strong>Tempat Beli:</strong> {sheep.tempat_beli}</p>
              <p><strong>Berat Jual:</strong> {sheep.berat_jual}</p>
              <p><strong>Harga Beli:</strong> {formatRupiah(sheep.harga_beli)}</p>
              <p><strong>Harga Terjual:</strong> {formatRupiah(sheep.harga_terjual)}</p>
              <p><strong>Tanggal Terjual:</strong> {sheep.tanggal_terjual}</p>
              <p><strong>Total Pakan:</strong> {formatRupiah(sheep.total_pakan)}</p>
              <p><strong>Profit:</strong> {formatRupiah(sheep.profit)}</p>
              <button onClick={() => setEditing(true)} className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded">
                Edit
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["weight", "health", "breeding"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600 font-semibold" : "text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "weight" && (
        <div>
          <form onSubmit={addWeight} className="flex gap-2 mb-4">
            <input className="border p-2 rounded flex-1" type="number" placeholder="Weight (kg)" value={weightForm.weight} onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })} required />
            <input className="border p-2 rounded flex-1" placeholder="Notes" value={weightForm.notes} onChange={(e) => setWeightForm({ ...weightForm, notes: e.target.value })} />
            <button type="submit" className="bg-blue-500 text-white px-4 rounded">Add</button>
          </form>
          <ul className="space-y-2">
            {weightRecords.map((r) => (
              <li key={r.id} className="p-2 border rounded bg-white">
                <p><strong>{r.date}:</strong> {r.weight} kg</p>
                <p className="text-sm text-gray-600">{r.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "health" && (
        <div>
          <form onSubmit={addHealth} className="grid grid-cols-2 gap-2 mb-4">
            <input className="border p-2 rounded" placeholder="Condition" value={healthForm.condition} onChange={(e) => setHealthForm({ ...healthForm, condition: e.target.value })} required />
            <input className="border p-2 rounded" placeholder="Treatment" value={healthForm.treatment} onChange={(e) => setHealthForm({ ...healthForm, treatment: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Medicine" value={healthForm.medicine} onChange={(e) => setHealthForm({ ...healthForm, medicine: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Notes" value={healthForm.notes} onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })} />
            <button type="submit" className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
          </form>
          <ul className="space-y-2">
            {healthRecords.map((r) => (
              <li key={r.id} className="p-2 border rounded bg-white">
                <p><strong>{r.date}:</strong> {r.condition}</p>
                <p className="text-sm text-gray-600">{r.treatment} | {r.medicine}</p>
                <p className="text-sm">{r.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "breeding" && (
        <div>
          <form onSubmit={addBreeding} className="grid grid-cols-2 gap-2 mb-4">
            <input className="border p-2 rounded" placeholder="Mate ID" type="number" value={breedingForm.mate_id} onChange={(e) => setBreedingForm({ ...breedingForm, mate_id: e.target.value })} />
            <input className="border p-2 rounded" placeholder="Result (pregnant/not)" value={breedingForm.result} onChange={(e) => setBreedingForm({ ...breedingForm, result: e.target.value })} />
            <input className="border p-2 rounded col-span-2" placeholder="Notes" value={breedingForm.notes} onChange={(e) => setBreedingForm({ ...breedingForm, notes: e.target.value })} />
            <button type="submit" className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
          </form>
          <ul className="space-y-2">
            {breedingRecords.map((r) => (
              <li key={r.id} className="p-2 border rounded bg-white">
                <p><strong>{r.date}:</strong> Result: {r.result}</p>
                <p className="text-sm text-gray-600">Mate ID: {r.mate_id}</p>
                <p className="text-sm">{r.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

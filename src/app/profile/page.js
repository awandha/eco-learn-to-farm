"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login") // login or register
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user)
      }
    })
  }, [])

  async function handleAuth(e) {
    e.preventDefault()
    setError("")
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else router.push("/sheep")
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) setError(error.message)
      else alert("Check your email to confirm registration!")
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Welcome {user.email}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form
        onSubmit={handleAuth}
        className="bg-white p-4 rounded-lg shadow grid gap-3"
      >
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded focus:outline-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded focus:outline-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setMode("register")}
              className="text-blue-500 underline"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-500 underline"
            >
              Login
            </button>
          </>
        )}
      </p>
    </div>
  )
}

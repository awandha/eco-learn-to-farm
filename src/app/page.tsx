import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-white text-black p-6">
      {/* Logo */}
      <Image
        src="/LogoEcoFix.png"
        alt="Eco Learn to Farm Logo"
        width={160}
        height={160}
        className="mb-8"
        priority
      />

      {/* Title & Tagline */}
      <h1 className="text-4xl font-bold mb-2">Eco Learn to Farm</h1>
      <p className="text-lg text-center max-w-xl mb-10">
        Welcome to your Sheep Farm Manager.  
        Track every sheep’s purchase, feeding, and profit details with ease.
      </p>

      {/* Navigation */}
      <Link
        href="/sheep"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
      >
        Manage Sheep Data
      </Link>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-700">
        © {new Date().getFullYear()} Eco Learn to Farm
      </footer>
    </main>
  )
}

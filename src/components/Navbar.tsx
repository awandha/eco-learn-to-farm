"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/LogoEcoFix.png"
            alt="Eco Learn to Farm Logo"
            width={50}
            height={50}
          />
          <span className="font-bold text-xl text-green-700">
            Eco Learn to Farm
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-blue-600">
          <Link href="/sheep" className="hover:underline">Sheep</Link>
          <Link href="/finance" className="hover:underline">Finance</Link>
          <Link href="/feed" className="hover:underline">Feed</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-blue-50 shadow-md">
          <ul className="flex flex-col items-center gap-4 py-4 text-blue-700">
            <li>
              <Link href="/sheep" onClick={() => setMenuOpen(false)}>Sheep</Link>
            </li>
            <li>
              <Link href="/finance" onClick={() => setMenuOpen(false)}>Finance</Link>
            </li>
            <li>
              <Link href="/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
            </li>
            <li>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

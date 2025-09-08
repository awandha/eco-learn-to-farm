import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sheep Farm Manager",
  description: "Manage your sheep farm data with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-50 to-white text-gray-800`}
        suppressHydrationWarning
      >
        {/* Top Navbar */}
        <header className="bg-blue-500 text-white p-4 shadow-md">
          <h1 className="text-lg font-bold text-center">🐑 Sheep Farm Manager</h1>
        </header>

        {/* Main Content */}
        <main className="pb-20 px-4">{children}</main>

        {/* Sticky Bottom Navbar */}
        <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around py-2">
          <Link href="/sheep" className="flex flex-col items-center text-blue-600">
            <span>🐑</span>
            <span className="text-xs">Sheep</span>
          </Link>
          <Link href="/finance" className="flex flex-col items-center text-green-600">
            <span>💰</span>
            <span className="text-xs">Finance</span>
          </Link>
          <Link href="/feed" className="flex flex-col items-center text-green-700">
            <span>🌾</span>
            <span className="text-xs">Feed</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-600">
            <span>👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </footer>
      </body>
    </html>
  );
}

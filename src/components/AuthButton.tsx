"use client"
import Link from "next/link"

export default function AuthButton() {
  return (
    <div className="flex gap-3">
      <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
        Login
      </Link>
      <Link href="/register" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
        Register
      </Link>
    </div>
  )
}

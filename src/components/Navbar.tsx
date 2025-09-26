"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import LogoutButton from "@/components/LogoutButton"

export default function Navbar() {
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
        setRole(profile?.role || null)
      }
    }

    getSession()

    // 👇 Listen to login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setRole(data?.role || null))
      } else {
        setRole(null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <Link href="/" className="text-lg font-bold">
        DGCA Pilot
      </Link>

      <div className="flex gap-4 items-center">
        {session ? (
          <>
            {role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Admin Dashboard
              </Link>
            )}
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

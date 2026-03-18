"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"

export default function GoogleAuthCallbackPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAuthLoading } = useAuth()

  useEffect(() => {
    if (isAuthLoading) return

    if (isAuthenticated && user) {
      router.replace(user.role === "admin" ? "/admin" : "/")
      return
    }

    router.replace("/login?error=google_auth_failed")
  }, [isAuthLoading, isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-[#030303] text-[#e8e8e3] flex items-center justify-center px-6">
      <div className="text-center border border-white/10 px-8 py-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Google Sign-In</p>
        <h1 className="mt-3 text-xl tracking-[0.15em]">Finalizing your login...</h1>
        <p className="mt-3 text-sm text-gray-400">Please wait while we load your account.</p>
      </div>
    </div>
  )
}

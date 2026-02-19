"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signup(email, password)

      if (result?.success) {
        router.push("/account")
      } else {
        setError(result?.message ?? "Unable to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#e8e8e3] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="text-4xl font-serif font-light tracking-[0.25em]"
          >
            U.S ATELIER
          </Link>
          <p className="mt-4 text-xs uppercase tracking-widest text-gray-500">
            Create Your Account
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-10 border border-white/10 p-10"
        >
          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-gray-400">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white focus:ring-0"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-gray-400">
              Password
            </label>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white focus:ring-0"
            />
          </div>

          {error && (
            <p className="text-xs uppercase tracking-widest text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-transparent border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500"
          >
            {loading ? "Creating…" : "Create Account"}
          </Button>
        </form>

        {/* Back to login */}
        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

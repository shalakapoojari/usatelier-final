"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { SignIn2 } from "@/components/ui/clean-minimal-sign-in"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<"email" | "otp">("email")

  const { sendOtp, verifyOtp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null

  const handleSendOtp = async () => {
    if (!email) return setError("Email is required")
    setError("")
    setLoading(true)
    const res = await sendOtp(email)
    if (res.success) {
      setStep("otp")
    } else {
      setError(res.message)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "email") return handleSendOtp()

    setError("")
    setLoading(true)
    const result = await verifyOtp(email, otp)

    if (result.success && result.user) {
      const redirectTo = nextUrl || (result.user.role === "admin" ? "/admin" : "/")
      router.push(redirectTo)
    } else {
      setError(result.message || "Invalid code")
    }
    setLoading(false)
  }

  if (!mounted) return <div className="min-h-screen bg-black" />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,500&family=Inter:wght@200;400&display=swap');

        .login-root {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #000000;
          font-family: 'Inter', sans-serif;
          position: relative;
          color: white;
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          opacity: 0.15;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          filter: contrast(150%) brightness(100%);
        }

        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: slideUp 1s cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-header {
           position: absolute;
           top: 3rem;
           left: 0;
           width: 100%;
           display: flex;
           justify-content: space-between;
           padding: 0 3rem;
           z-index: 20;
        }

        @media (max-width: 768px) {
          .nav-header { top: 2rem; padding: 0 1.5rem; }
        }

        .back-link {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-link:hover { color: white; }

        .brand-heading {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 3.5rem;
          letter-spacing: -0.02em;
          color: white;
          margin-bottom: 3rem;
          text-align: center;
          line-height: 1;
        }

        .legal-footer {
          margin-top: 4rem;
          text-align: center;
          max-width: 280px;
        }

        .legal-text {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.2);
          line-height: 2;
        }

        .legal-link {
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }

        .legal-link:hover {
          color: white;
          border-bottom-color: white;
        }
      `}</style>

      <div className="login-root antialiased">
        <div className="grain-overlay" />

        <div className="nav-header">
          <Link href="/" className="back-link">← Return</Link>
          <span className="back-link" style={{ opacity: 0.2 }}>Maison</span>
        </div>

        <div className="login-container">
          <h1 className="brand-heading">U.S Atelier</h1>

          <div className="w-full">
            <SignIn2
              email={email}
              setEmail={setEmail}
              otp={otp}
              setOtp={setOtp}
              step={step}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              onSendOtp={handleSendOtp}
            />
          </div>

          <div className="legal-footer">
            <p className="legal-text">
              By accessing the atelier, you agree to our{" "}
              <Link href="/terms&conditions" className="legal-link">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/terms&conditions#privacy" className="legal-link">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
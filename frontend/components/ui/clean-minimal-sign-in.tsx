"use client"

import * as React from "react"
import { LogIn, Lock, Mail } from "lucide-react"

interface SignIn2Props {
  email: string
  setEmail: (val: string) => void
  otp: string
  setOtp: (val: string) => void
  step: "email" | "otp"
  error?: string
  loading?: boolean
  onSubmit: (e: React.FormEvent) => void
  onSendOtp: () => void
}

const SignIn2 = ({
  email,
  setEmail,
  otp,
  setOtp,
  step,
  error,
  loading,
  onSubmit,
  onSendOtp,
}: SignIn2Props) => {
  return (
    <div className="flex items-center justify-center bg-transparent z-1 antialiased px-4">
      <div className="w-full max-w-[340px] bg-neutral-950/40 backdrop-blur-3xl rounded-3xl p-8 md:p-10 flex flex-col items-center border border-white/5 shadow-2xl relative overflow-hidden group/card">
        {/* Subtle glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-[80px] pointer-events-none group-hover/card:bg-white/10 transition-all duration-1000" />
        
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 mb-6 border border-white/10 shadow-lg relative z-10 transition-transform duration-700 group-hover/card:scale-105">
          <LogIn className="w-5 h-5 text-zinc-300 font-light" />
        </div>
        
        <h2 className="text-xl mb-2 text-center text-white tracking-[0.3em] serif font-light uppercase">
          {step === "email" ? "WELCOME" : "VERIFY"}
        </h2>
        <p className="text-zinc-500 text-[8px] mb-8 text-center uppercase tracking-[0.4em] leading-relaxed sans font-medium opacity-70">
          {step === "email" ? "Enter your email to continue" : `Check ${email} for your code`}
        </p>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (step === "email") {
              onSendOtp();
            } else {
              onSubmit(e);
            }
          }} 
          className="w-full flex flex-col gap-4 mb-4 relative z-10"
        >
          {step === "email" ? (
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:text-zinc-400">
                <Mail className="w-3 h-3" />
              </span>
              <input
                placeholder="EMAIL ADDRESS"
                type="email"
                value={email}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:ring-[0.5px] focus:ring-white/10 bg-white/[0.01] text-white text-[10px] transition-all placeholder:text-zinc-800 sans tracking-[0.2em] font-light"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div className="relative group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:text-zinc-400">
                <Lock className="w-3 h-3" />
              </span>
              <input
                placeholder="6-DIGIT CODE"
                type="text"
                maxLength={6}
                value={otp}
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:ring-[0.5px] focus:ring-white/10 bg-white/[0.01] text-white text-lg transition-all placeholder:text-zinc-800 sans tracking-[0.5em] font-light text-center"
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          )}

          <div className="w-full flex flex-col gap-2">
            {error && (
              <div className="text-[8px] text-red-500/60 font-medium uppercase tracking-[0.2em] text-center mt-1 sans">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl shadow-xl hover:bg-zinc-200 active:scale-[0.98] transition-all mb-1 mt-4 text-[9px] uppercase tracking-[0.5em] relative overflow-hidden group/btn"
          >
            {loading ? (
               <span className="flex items-center justify-center gap-2 sans">
                  <span className="w-2 h-2 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  {step === "email" ? "SENDING..." : "VERIFYING..."}
               </span>
            ) : (
              <span className="relative z-10 sans">{step === "email" ? "GET ACCESS CODE" : "LOGIN"}</span>
            )}
          </button>
          
          {step === "otp" && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={loading}
              className="text-[7px] text-zinc-600 hover:text-zinc-400 transition-all uppercase tracking-[0.3em] sans font-medium text-center mt-2 group"
            >
              Didn&apos;t receive it? <span className="text-zinc-400 group-hover:text-white transition-colors">Resend</span>
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export { SignIn2 }

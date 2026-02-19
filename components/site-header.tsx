"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function SiteHeader() {
  const navRef = useRef<HTMLDivElement | null>(null)
  const { user, logout } = useAuth()
  const { items } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    })

    return () => ctx.revert()
  }, [])

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      {/* ================= HEADER ================= */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 mix-blend-difference"
      >
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-serif tracking-widest font-bold"
        >
          U.S ATELIER.
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex gap-12 text-xs uppercase tracking-[0.25em] font-medium">
          <Link href="/collections" className="hover:text-gray-400 transition-colors">
            Collections
          </Link>
          <Link href="/campaign" className="hover:text-gray-400 transition-colors">
            Campaign
          </Link>
          <Link href="/maison" className="hover:text-gray-400 transition-colors">
            Maison
          </Link>
          <Link href="/shop" className="hover:text-gray-400 transition-colors">
            Shop
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
          <Link href="/cart" className="hidden md:block hover:text-gray-400">
            Cart ({cartCount})
          </Link>

          {/* Auth */}
          {!user ? (
            <Link href="/login" className="hover:text-gray-400">
              Login
            </Link>
          ) : (
            <div className="hidden md:flex gap-6">
              <Link href="/account" className="hover:text-gray-400">
                Account
              </Link>
              <button
                onClick={logout}
                className="hover:text-gray-400 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 border border-white/30 rounded-full flex flex-col justify-center items-center gap-1"
          >
            <span className="w-4 h-[1px] bg-white"></span>
            <span className="w-4 h-[1px] bg-white"></span>
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#030303] text-[#e8e8e3] z-50 flex flex-col px-8 py-10">
          <div className="flex justify-between items-center mb-16">
            <span className="text-xl font-serif tracking-widest">
              MENU
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-sm uppercase tracking-widest"
            >
              Close
            </button>
          </div>

          <div className="flex flex-col gap-10 text-3xl font-serif">
            <Link href="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
            <Link href="/campaign" onClick={() => setMenuOpen(false)}>Campaign</Link>
            <Link href="/maison" onClick={() => setMenuOpen(false)}>Maison</Link>
            <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({cartCount})
            </Link>
          </div>

          <div className="mt-auto pt-12 border-t border-white/10 text-sm tracking-widest">
            {!user ? (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <div className="flex gap-8">
                <Link href="/account" onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

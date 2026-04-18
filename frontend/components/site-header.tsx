"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import gsap from "gsap"
import { ShoppingBag, User, Search, X, Menu, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { getApiBase } from "@/lib/api-base"
import { SearchOverlay } from "@/components/search-overlay"

const API_BASE = getApiBase()

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { unseenCount: cartUnseen } = useCart()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setDynamicCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        setDynamicCategories([])
      }
    }
    fetchCategories()
  }, [])

  // Sync scroll lock and close menu on route change
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen, isMounted])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinkClass = "relative text-[10px] md:text-[11px] font-sans tracking-[0.15em] uppercase text-white hover:text-white/60 transition-colors duration-300 py-2"

  if (!isMounted) return null

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-[999] bg-transparent">
        <div className="relative w-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 md:px-12 py-6 md:py-8">

          {/* LEFT: Hamburger & Desktop Navigation */}
          <div className="flex items-center gap-8 w-1/3">
            {/* Universal Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="group flex items-center gap-2.5 text-white hover:text-white/60 transition-all duration-300"
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1} className="transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:block text-[11px] font-sans tracking-[0.15em] uppercase mt-0.5">Menu</span>
            </button>

            {/* Desktop Quick Links */}
            <nav className="hidden md:flex items-center gap-8 border-l border-white/20 pl-8">
              <Link href="/view-all" className={navLinkClass}>Shop</Link>

              {/* Categories Dropdown */}
              <div
                className="relative group h-full"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button className={`${navLinkClass} flex items-center gap-1.5`}>
                  Collections
                  <ChevronDown size={12} className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute left-0 top-full pt-4 w-56 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-[#0A0A0A] border border-white/10 p-6 shadow-2xl rounded-none">
                      <ul className="space-y-4">
                        <li>
                          <Link href="/view-all" className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors block">
                            View All Pieces
                          </Link>
                        </li>
                        <div className="h-px w-full bg-white/10 my-2" />
                        {dynamicCategories.map(cat => (
                          <li key={cat.id || cat.name}>
                            <Link
                              href={`/view-all?category=${encodeURIComponent(cat.name)}`}
                              className="text-[11px] capitalize tracking-wide text-white/70 hover:text-white transition-colors block font-serif italic"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* CENTER: Logo (Absolute to ensure perfect dead-center alignment) */}

          {/* RIGHT: Utilities */}
          <div className="flex items-center justify-end gap-5 md:gap-7 w-1/3">
            <button onClick={() => setSearchOverlayOpen(true)} className="hidden sm:block text-white hover:text-white/60 transition-colors" aria-label="Open search">
              <Search size={18} strokeWidth={1} />
            </button>

            <Link href={user ? "/account" : "/login"} className="hidden md:block text-white hover:text-white/60 transition-colors" aria-label={user ? "Go to my account" : "Sign in"}>
              <User size={19} strokeWidth={1} />
            </Link>

            <button onClick={() => router.push('/cart')} className="relative flex items-center gap-2.5 text-white hover:text-white/60 transition-colors" aria-label="View shopping bag">
              <span className="hidden md:block text-[11px] font-sans tracking-[0.15em] uppercase mt-0.5">Cart</span>
              <ShoppingBag size={20} strokeWidth={1} />
              {cartUnseen > 0 ? (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-sans flex items-center justify-center rounded-full">
                  {cartUnseen}
                </span>
              ) : (
                <span className="hidden md:inline-block text-[11px] font-sans tracking-[0.15em] mt-0.5">(0)</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TOP-TO-DOWN SLIDING FULLSCREEN MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[1001] bg-[#0A0A0A] overflow-y-auto transform transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="min-h-full flex flex-col p-6 md:p-12 relative">
          {/* Menu Header inside the sliding overlay */}
          <div className="flex justify-between items-center mb-16 md:mb-24 mt-2">
            <div className="w-1/3"></div> {/* Spacer to keep logo centered */}

            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="w-1/3 text-center font-serif text-xl md:text-2xl tracking-[0.15em] text-white uppercase">
              U.S Atelier
            </Link>

            <div className="w-1/3 flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <span className="text-[11px] font-sans tracking-[0.15em] uppercase mt-0.5 hidden sm:block">Close</span>
                <X size={26} strokeWidth={1} className="transition-transform group-hover:rotate-90 duration-300" />
              </button>
            </div>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col gap-6 md:gap-10 px-2 md:px-8 max-w-4xl mx-auto w-full">
            {[
              { label: 'Shop Now', href: '/view-all' },
              { label: 'The Atelier', href: '/about' },
              { label: 'My Account', href: user ? '/account' : '/login' },
              { label: 'Search', action: () => { setMobileMenuOpen(false); setSearchOverlayOpen(true); } }
            ].map((link, idx) => (
              <div key={idx} className="overflow-hidden">
                {link.href ? (
                  <Link
                    href={link.href}
                    className="group flex items-center gap-6 text-4xl sm:text-6xl md:text-7xl font-serif text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-[12px] font-sans tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors mt-2 md:mt-4">0{idx + 1}</span>
                    <span className="transform transition-transform duration-500 group-hover:translate-x-4">{link.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className="group flex items-center gap-6 text-left text-4xl sm:text-6xl md:text-7xl font-serif text-white/80 hover:text-white transition-colors duration-300 w-full"
                  >
                    <span className="text-[12px] font-sans tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors mt-2 md:mt-4">0{idx + 1}</span>
                    <span className="transform transition-transform duration-500 group-hover:translate-x-4">{link.label}</span>
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Menu Footer */}
          <div className="mt-auto pt-24 px-2 md:px-8 pb-8 max-w-4xl mx-auto w-full">
            <div className="h-px w-full bg-white/10 mb-8" />
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase font-sans">Inquiries</span>
                <a href="mailto:contact@usatelier.in" className="text-[11px] font-sans tracking-[0.15em] text-white/70 hover:text-white transition-colors">
                  CONTACT@USATELIER.IN
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[9px] tracking-[0.3em] text-white/40 uppercase font-sans">Social</span>
                <a href="#" className="text-[11px] font-sans tracking-[0.15em] text-white/70 hover:text-white transition-colors">
                  INSTAGRAM
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        categories={dynamicCategories}
      />
    </>
  )
}
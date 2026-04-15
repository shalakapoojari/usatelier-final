"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white pt-24 pb-12 px-6 md:px-16 border-t border-gray-100">

      {/* Giant ghost brand text - Refined for maximum impact */}
      <div className="absolute bottom-[-5%] left-0 w-full overflow-hidden pointer-events-none select-none">
        <span className="text-[22vw] font-serif italic text-gray-50 leading-none whitespace-nowrap tracking-tighter block">
          U.S Atelier
        </span>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          {/* Brand Identity Section - Expanded to 7 columns for bigger presence */}
          <div className="md:col-span-7 space-y-10">
            <div className="space-y-6">
              <Link href="/" className="inline-block transition-opacity hover:opacity-70">
                <span className="text-3xl md:text-5xl font-serif tracking-[0.1em] uppercase text-black font-medium">
                  U.S ATELIER
                </span>
              </Link>
              <h3 className="text-2xl md:text-4xl font-serif italic tracking-tight text-black leading-[1.1] max-w-xl">
                Premium contemporary fashion <br />
                <span className="font-sans font-light text-gray-400 not-italic">designed with intention.</span>
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.4em] text-black font-bold">
                Crafted in India · Designed for the World
              </p>
              <p className="text-[13px] leading-relaxed text-gray-500 max-w-md">
                Worn with distinction. Every piece tells a story of modern craftsmanship,
                blending a dark elegant aesthetic with timeless minimal design.
              </p>
            </div>
          </div>

          {/* Navigation - Right Aligned for Balance */}
          <div className="md:col-span-2 col-span-1">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-300 mb-8 font-black">Shop</p>
            <ul className="space-y-4 text-[12px] uppercase tracking-widest text-black font-medium">
              <li><Link href="/view-all" className="hover:italic transition-all inline-block">All Products</Link></li>
              <li><Link href="/#best-sellers" className="hover:italic transition-all inline-block">Best Sellers</Link></li>
              <li><Link href="/#featured" className="hover:italic transition-all inline-block">Featured</Link></li>
              <li><Link href="/new-arrivals" className="hover:italic transition-all inline-block">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3 col-span-1 md:text-right">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-300 mb-8 font-black md:justify-end">Support</p>
            <ul className="space-y-4 text-[12px] uppercase tracking-widest text-black font-medium">
              <li><Link href="/account" className="hover:italic transition-all inline-block">My Account</Link></li>
              <li><a href="mailto:usatelier08@gmail.com" className="hover:italic transition-all inline-block">Contact Us</a></li>
              <li><Link href="/terms&conditions" className="hover:italic transition-all inline-block">Terms & Legal</Link></li>
              <li><Link href="/terms&conditions#shipping" className="hover:italic transition-all inline-block">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Clean & Symmetrical */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-gray-100 text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span>© 2026 U.S ATELIER MAISON</span>
          </div>

          <div className="flex items-center gap-8">
            <span className="hidden md:inline-block">Free shipping above ₹2999</span>
            <span className="text-black">✦</span>
            <span>GST & Taxes Inclusive</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
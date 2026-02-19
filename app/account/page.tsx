"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Package, User } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-48 pb-32 px-6 md:px-12">
        <h1 className="font-serif text-5xl font-light mb-20">
          My Account
        </h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-[1000px]">
          {/* Orders */}
          <Link
            href="/account/orders"
            className="group border border-white/10 p-12 hover:border-white/30 transition-colors"
          >
            <Package className="h-8 w-8 mb-8 text-gray-400 group-hover:text-white transition-colors" />

            <h2 className="font-serif text-3xl font-light mb-4">
              Orders
            </h2>

            <p className="text-sm tracking-widest text-gray-500 leading-relaxed">
              View your order history, shipment status, and archived purchases.
            </p>

            <span className="inline-block mt-10 uppercase tracking-widest text-xs text-gray-400 group-hover:text-white transition-colors">
              View Orders →
            </span>
          </Link>

          {/* Profile */}
          <Link
            href="/account/profile"
            className="group border border-white/10 p-12 hover:border-white/30 transition-colors"
          >
            <User className="h-8 w-8 mb-8 text-gray-400 group-hover:text-white transition-colors" />

            <h2 className="font-serif text-3xl font-light mb-4">
              Profile
            </h2>

            <p className="text-sm tracking-widest text-gray-500 leading-relaxed">
              Manage personal details, contact information, and preferences.
            </p>

            <span className="inline-block mt-10 uppercase tracking-widest text-xs text-gray-400 group-hover:text-white transition-colors">
              Edit Profile →
            </span>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

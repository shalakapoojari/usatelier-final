"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ConfirmationPage() {
  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-48 pb-32 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <CheckCircle className="mx-auto mb-8 h-16 w-16 text-white/80" />

          <h1 className="font-serif text-5xl font-light mb-6">
            Order Confirmed
          </h1>

          <p className="text-sm tracking-widest text-gray-400 leading-relaxed mb-12">
            Your order has been placed successfully. A confirmation email will
            be sent shortly with tracking details once dispatched.
          </p>

          <div className="space-y-4">
            <Link
              href="/shop"
              className="block w-full py-4 border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
            >
              Continue Shopping
            </Link>

            <Link
              href="/account/orders"
              className="block w-full py-4 border border-white/20 uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

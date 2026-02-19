"use client"

import type React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  CreditCard,
  Users,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 px-10 py-12">
        <p className="uppercase tracking-[0.4em] text-xs text-gray-500 mb-16">
          Admin
        </p>

        <nav className="space-y-6 text-sm">
          {[
            ["/admin", "Dashboard", LayoutDashboard] as const,
            ["/admin/orders", "Orders", ShoppingCart] as const,
            ["/admin/products", "Products", Package] as const,
            ["/admin/categories", "Categories", FolderOpen] as const,
            ["/admin/payments", "Payments", CreditCard] as const,
            ["/admin/customers", "Customers", Users] as const,
          ].map(([href, label, Icon], index) => (
            <Link
              key={index}
              href={href}
              className="flex items-center gap-4 tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/10 text-xs tracking-widest text-gray-500">
          Admin Panel
        </div>
      </aside>

      {/* MOBILE NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#030303] border-t border-white/10 z-50">
        <nav className="flex justify-around py-4 text-xs tracking-widest">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/payments">Payments</Link>
        </nav>
      </div>

      {/* CONTENT */}
      <main className="flex-1 pb-24 lg:pb-0">
        {children}
      </main>
    </div>
  )
}

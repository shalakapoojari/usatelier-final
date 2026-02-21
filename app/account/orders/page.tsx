"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { orders } from "@/lib/data"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const userOrders = orders.slice(0, 2)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-400"
      case "shipped": return "text-white"
      default: return "text-gray-500"
    }
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <div className="pt-[72px]">
        <AccountSidebar>
          <div className="p-10 max-w-3xl">
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <p className="uppercase tracking-[0.4em] text-xs text-gray-500 mb-2">Account</p>
              <h1 className="font-serif text-4xl font-light">Order History</h1>
            </div>

            {userOrders.length > 0 ? (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block border border-white/10 p-7 group hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="uppercase tracking-widest text-xs mb-2">{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`uppercase tracking-widest text-xs ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </p>
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 space-y-2 text-sm text-gray-400">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.productName} · Size {item.size} × {item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-sm">
                      <span className="uppercase tracking-widest text-xs text-gray-500">Total</span>
                      <span>₹{order.total.toLocaleString("en-IN")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-white/10 py-24 text-center">
                <p className="uppercase tracking-widest text-gray-500 mb-8 text-xs">No orders placed yet</p>
                <Link
                  href="/shop"
                  className="inline-block px-10 py-4 border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </AccountSidebar>
      </div>

      <SiteFooter />
    </div>
  )
}

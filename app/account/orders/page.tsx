"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { orders } from "@/lib/data"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const userOrders = orders.slice(0, 2)

  const getStatusTone = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-white"
      case "shipped":
        return "text-white"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-48 pb-32 px-6 md:px-12">
        {/* Back */}
        <Link
          href="/account"
          className="block mb-12 text-xs uppercase tracking-widest text-gray-500 hover:text-white"
        >
          ← Back to Account
        </Link>

        <h1 className="font-serif text-5xl font-light mb-20">
          Order History
        </h1>

        {userOrders.length > 0 ? (
          <div className="max-w-[900px] space-y-10">
            {userOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block border border-white/10 p-8 group hover:border-white/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="uppercase tracking-widest text-xs mb-2">
                      Order {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`uppercase tracking-widest text-xs ${getStatusTone(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </p>
                    <ChevronRight className="mt-4 ml-auto h-4 w-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3 text-sm text-gray-400">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.productName} · Size {item.size} ×{" "}
                        {item.quantity}
                      </span>
                      <span>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-6 mt-6 flex justify-between">
                  <span className="uppercase tracking-widest text-xs text-gray-500">
                    Total
                  </span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="uppercase tracking-widest text-gray-500 mb-12">
              No orders placed yet
            </p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

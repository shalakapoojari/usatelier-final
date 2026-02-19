"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { orders } from "@/lib/data"

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const order = orders.find((o) => o.id === id)

  if (!order) notFound()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
      case "shipped":
        return "border-white text-white"
      default:
        return "border-white/20 text-gray-400"
    }
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-48 pb-32 px-6 md:px-12">
        <Link
          href="/account/orders"
          className="block mb-12 text-xs uppercase tracking-widest text-gray-500 hover:text-white"
        >
          ← Back to Orders
        </Link>

        <div className="max-w-[900px]">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-20">
            <div>
              <h1 className="font-serif text-5xl font-light mb-4">
                Order {order.id}
              </h1>
              <p className="text-sm text-gray-500">
                Placed on{" "}
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <span
              className={`px-5 py-2 border uppercase tracking-widest text-xs ${getStatusBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <div className="border border-white/10 p-10 mb-12">
            <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-8">
              Items
            </h2>

            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between pb-6 border-b border-white/10 last:border-0"
                >
                  <div>
                    <p className="uppercase tracking-widest text-sm">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Size {item.size} · Quantity {item.quantity}
                    </p>
                  </div>
                  <p>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 mt-8 space-y-3 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white pt-4">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="border border-white/10 p-10">
            <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-6">
              Shipping Address
            </h2>

            <div className="text-sm text-gray-400 leading-relaxed">
              <p>{order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

"use client"

import { useState } from "react"
import { orders } from "@/lib/data"
import Link from "next/link"

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "completed"
  >("all")

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending")
      return order.status === "pending" || order.status === "processing"
    if (activeTab === "completed")
      return order.status === "shipped" || order.status === "delivered"
    return true
  })

  const tabBase =
    "uppercase tracking-widest text-xs pb-4 transition-colors"

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen px-8 py-16">
      {/* ================= HEADER ================= */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
          Admin
        </p>
        <h1 className="font-serif text-5xl font-light">
          Orders
        </h1>
        <p className="mt-4 text-sm tracking-widest text-gray-500">
          Manage and track all customer orders.
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="max-w-[1400px] mx-auto flex gap-12 border-b border-white/10 mb-16">
        <button
          onClick={() => setActiveTab("all")}
          className={`${tabBase} ${
            activeTab === "all"
              ? "text-white border-b border-white"
              : "text-gray-500 hover:text-white"
          }`}
        >
          All ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("pending")}
          className={`${tabBase} ${
            activeTab === "pending"
              ? "text-white border-b border-white"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Pending (
          {
            orders.filter(
              (o) =>
                o.status === "pending" ||
                o.status === "processing"
            ).length
          }
          )
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`${tabBase} ${
            activeTab === "completed"
              ? "text-white border-b border-white"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Completed (
          {
            orders.filter(
              (o) =>
                o.status === "shipped" ||
                o.status === "delivered"
            ).length
          }
          )
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="max-w-[1400px] mx-auto border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {[
                "Order",
                "Customer",
                "Date",
                "Items",
                "Total",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-8 py-6 text-left text-xs uppercase tracking-widest text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-white/5 hover:bg-white/[0.04] transition-colors ${
                  i % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-8 py-6 font-medium">
                  {order.id}
                </td>

                <td className="px-8 py-6">
                  <p className="font-medium">
                    {order.customerName}
                  </p>
                  <p className="text-xs tracking-widest text-gray-500 mt-1">
                    {order.customerEmail}
                  </p>
                </td>

                <td className="px-8 py-6 text-xs tracking-widest text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </td>

                <td className="px-8 py-6">
                  {order.items.length}
                </td>

                <td className="px-8 py-6 font-medium">
                  ${order.total}
                </td>

                <td className="px-8 py-6 uppercase tracking-widest text-xs text-gray-400">
                  {order.status}
                </td>

                <td className="px-8 py-6 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-24 text-center text-sm tracking-widest text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

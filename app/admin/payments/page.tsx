"use client"

import { orders } from "@/lib/data"
import Link from "next/link"

export default function PaymentsPage() {
  const completed = orders.filter(o => o.paymentStatus === "completed")
  const pending = orders.filter(o => o.paymentStatus === "pending")
  const failed = orders.filter(o => o.paymentStatus === "failed")
  const refunded = orders.filter(o => o.paymentStatus === "refunded")

  const revenue = completed.reduce((s, o) => s + o.total, 0)
  const pendingAmount = pending.reduce((s, o) => s + o.total, 0)
  const failedAmount = failed.reduce((s, o) => s + o.total, 0)

  const byMethod = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen px-8 py-16">
      {/* HEADER */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
          Admin
        </p>
        <h1 className="font-serif text-5xl font-light">
          Payments
        </h1>
        <p className="mt-4 text-sm tracking-widest text-gray-500">
          Financial overview and transaction history.
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-8 mb-24">
        {[
          ["Revenue", `$${revenue.toLocaleString()}`, `${completed.length} completed`],
          ["Pending", `$${pendingAmount.toLocaleString()}`, `${pending.length} payments`],
          ["Failed", `$${failedAmount.toLocaleString()}`, `${failed.length} attempts`],
          ["Refunded", refunded.length, "transactions"],
        ].map(([label, value, sub]) => (
          <div key={label} className="border border-white/10 p-8">
            <p className="uppercase tracking-widest text-xs text-gray-500 mb-4">
              {label}
            </p>
            <p className="text-3xl font-light mb-2">{value}</p>
            <p className="text-xs tracking-widest text-gray-500">{sub}</p>
          </div>
        ))}
      </div>

      {/* PAYMENT METHODS */}
      <div className="max-w-[1400px] mx-auto border border-white/10 p-10 mb-24">
        <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-8">
          Payment Methods
        </h2>

        <div className="space-y-6">
          {Object.entries(byMethod).map(([method, amount]) => (
            <div key={method} className="flex justify-between">
              <span className="tracking-widest text-sm">{method}</span>
              <span className="font-medium">${amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="max-w-[1400px] mx-auto border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {["Order", "Customer", "Method", "Amount", "Status", ""].map(h => (
                <th
                  key={h}
                  className="px-8 py-6 text-left uppercase tracking-widest text-xs text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr
                key={o.id}
                className={`border-b border-white/5 hover:bg-white/[0.04] ${
                  i % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-8 py-6 font-medium">{o.id}</td>

                <td className="px-8 py-6">
                  <p>{o.customerName}</p>
                  <p className="text-xs tracking-widest text-gray-500">
                    {o.customerEmail}
                  </p>
                </td>

                <td className="px-8 py-6 text-sm">{o.paymentMethod}</td>

                <td className="px-8 py-6 font-medium">${o.total}</td>

                <td className="px-8 py-6 uppercase tracking-widest text-xs text-gray-400">
                  {o.paymentStatus}
                </td>

                <td className="px-8 py-6 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="uppercase tracking-widest text-xs text-gray-400 hover:text-white"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

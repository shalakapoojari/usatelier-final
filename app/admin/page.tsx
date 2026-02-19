"use client"

import { orders, products } from "@/lib/data"
import Link from "next/link"

export default function AdminDashboard() {
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === "pending").length
  const customers = new Set(orders.map(o => o.customerId)).size
  const avgOrder = revenue / totalOrders || 0

  const recentOrders = orders.slice(0, 6)

  const productSales = orders.reduce((acc, o) => {
    o.items.forEach(i => {
      acc[i.productId] = (acc[i.productId] || 0) + i.quantity
    })
    return acc
  }, {} as Record<string, number>)

  const topProducts = Object.entries(productSales)
    .map(([id, qty]) => ({
      product: products.find(p => p.id === id),
      qty,
    }))
    .filter(p => p.product)
    .slice(0, 5)

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen px-8 py-16">
      {/* HEADER */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
          Admin Overview
        </p>
        <h1 className="font-serif text-5xl font-light">
          Dashboard
        </h1>
        <p className="mt-4 text-sm tracking-widest text-gray-500">
          Store performance at a glance.
        </p>
      </div>

      {/* METRICS */}
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-5 gap-8 mb-24">
        {[
          ["Revenue", `$${revenue.toLocaleString()}`],
          ["Orders", totalOrders],
          ["Pending", pendingOrders],
          ["Customers", customers],
          ["Avg Order", `$${avgOrder.toFixed(2)}`],
        ].map(([label, value]) => (
          <div key={label} className="border border-white/10 p-8">
            <p className="uppercase tracking-widest text-xs text-gray-500 mb-4">
              {label}
            </p>
            <p className="text-3xl font-light">{value}</p>
          </div>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16">
        {/* RECENT ORDERS */}
        <div className="border border-white/10 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="uppercase tracking-widest text-xs text-gray-400">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="uppercase tracking-widest text-xs text-gray-500 hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="space-y-6">
            {recentOrders.map(o => (
              <div
                key={o.id}
                className="flex justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs tracking-widest text-gray-500">
                    {o.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${o.total}</p>
                  <p className="text-xs tracking-widest text-gray-500 uppercase">
                    {o.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="border border-white/10 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="uppercase tracking-widest text-xs text-gray-400">
              Top Products
            </h2>
            <Link
              href="/admin/products"
              className="uppercase tracking-widest text-xs text-gray-500 hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="space-y-6">
            {topProducts.map((p, i) => (
              <div
                key={p.product!.id}
                className="flex justify-between border-b border-white/5 pb-4"
              >
                <div>
                  <p className="font-medium">
                    {i + 1}. {p.product!.name}
                  </p>
                  <p className="text-xs tracking-widest text-gray-500">
                    {p.product!.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{p.qty} sold</p>
                  <p className="text-xs tracking-widest text-gray-500">
                    ${p.product!.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

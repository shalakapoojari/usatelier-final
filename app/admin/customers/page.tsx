"use client"

import { orders } from "@/lib/data"

export default function CustomersPage() {
  // Extract unique customers from orders
  const customers = orders.reduce((acc, order) => {
    if (!acc.find((c) => c.id === order.customerId)) {
      acc.push({
        id: order.customerId,
        name: order.customerName,
        email: order.customerEmail,
        orders: orders.filter((o) => o.customerId === order.customerId).length,
        totalSpent: orders
          .filter((o) => o.customerId === order.customerId)
          .reduce((sum, o) => sum + o.total, 0),
        lastOrder: order.date,
      })
    }
    return acc
  }, [] as any[])

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen px-8 py-16">
      {/* ================= HEADER ================= */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
          Admin
        </p>
        <h1 className="font-serif text-5xl font-light">
          Customers
        </h1>
        <p className="mt-4 text-sm tracking-widest text-gray-500 max-w-xl">
          Overview of all customer accounts and purchasing activity.
        </p>
      </div>

      {/* ================= TABLE ================= */}
      <div className="max-w-[1400px] mx-auto border border-white/10 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-8 py-6 text-xs uppercase tracking-widest text-gray-500">
                Customer
              </th>
              <th className="px-8 py-6 text-xs uppercase tracking-widest text-gray-500">
                ID
              </th>
              <th className="px-8 py-6 text-xs uppercase tracking-widest text-gray-500">
                Orders
              </th>
              <th className="px-8 py-6 text-xs uppercase tracking-widest text-gray-500">
                Total Spent
              </th>
              <th className="px-8 py-6 text-xs uppercase tracking-widest text-gray-500">
                Last Order
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, i) => (
              <tr
                key={customer.id}
                className={`border-b border-white/5 transition-colors ${
                  i % 2 === 0 ? "bg-white/[0.02]" : ""
                } hover:bg-white/[0.05]`}
              >
                {/* Customer */}
                <td className="px-8 py-6">
                  <div>
                    <p className="font-medium tracking-wide">
                      {customer.name}
                    </p>
                    <p className="text-xs tracking-widest text-gray-500 mt-1">
                      {customer.email}
                    </p>
                  </div>
                </td>

                {/* ID */}
                <td className="px-8 py-6 text-xs tracking-widest text-gray-500">
                  {customer.id}
                </td>

                {/* Orders */}
                <td className="px-8 py-6 font-medium">
                  {customer.orders}
                </td>

                {/* Total Spent */}
                <td className="px-8 py-6 font-medium">
                  ${customer.totalSpent.toLocaleString()}
                </td>

                {/* Last Order */}
                <td className="px-8 py-6 text-xs tracking-widest text-gray-500">
                  {new Date(customer.lastOrder).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-24 text-center text-sm tracking-widest text-gray-500"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

"use client"

import { use } from "react"
import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { collections, products } from "@/lib/data"

export default function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const collection = collections.find((c) => c.id === id)

  if (!collection) notFound()

  // Map collection → categories
  const collectionProducts = products.filter((p) => {
    if (id === "essentials") return p.category === "Basics"
    if (id === "knitwear") return p.category === "Knitwear"
    if (id === "tailoring")
      return p.category === "Trousers" || p.category === "Shirts"
    return false
  })

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      {/* ================= INTRO ================= */}
      <section className="pt-48 pb-24 px-6 text-center max-w-3xl mx-auto">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-400 mb-6">
          Collection
        </p>

        <h1 className="font-serif text-6xl md:text-7xl font-light mb-6">
          {collection.name}
        </h1>

        <p className="text-sm tracking-widest text-gray-500">
          {collection.description}
        </p>
      </section>

      {/* ================= PRODUCTS ================= */}
      <main className="px-6 md:px-12 pb-32">
        {collectionProducts.length > 0 ? (
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="uppercase tracking-widest text-gray-500">
              No pieces available yet
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

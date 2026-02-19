"use client"

import { useState } from "react"
import {
  customCategories,
  addCustomCategory,
  deleteCustomCategory,
  products,
  updateProduct,
} from "@/lib/data"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CategoriesPage() {
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    addCustomCategory(newCategoryName.trim())
    setNewCategoryName("")
  }

  const handleDeleteCategory = (category: string) => {
    if (!confirm(`Delete category "${category}"? This cannot be undone.`))
      return

    deleteCustomCategory(category)

    products.forEach((product) => {
      if (product.customCategories?.includes(category)) {
        updateProduct(product.id, {
          customCategories: product.customCategories.filter(
            (c) => c !== category
          ),
        })
      }
    })
  }

  const getCategoryProductCount = (category: string) =>
    products.filter((p) =>
      p.customCategories?.includes(category)
    ).length

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen px-8 py-16">
      {/* ================= HEADER ================= */}
      <div className="max-w-[1400px] mx-auto mb-20">
        <p className="uppercase tracking-[0.5em] text-xs text-gray-500 mb-4">
          Admin
        </p>
        <h1 className="font-serif text-5xl font-light">
          Categories
        </h1>
        <p className="mt-4 text-sm tracking-widest text-gray-500 max-w-xl">
          Create, organize, and maintain custom product groupings.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-24">
        {/* ================= ADD CATEGORY ================= */}
        <section className="border border-white/10 p-10">
          <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-8">
            Create New Category
          </h2>

          <div className="flex gap-6 max-w-xl">
            <Input
              value={newCategoryName}
              onChange={(e) =>
                setNewCategoryName(e.target.value)
              }
              placeholder="Category name"
              className="bg-transparent border-white/20 text-white placeholder:text-gray-600"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory()
              }}
            />

            <Button
              onClick={handleAddCategory}
              className="border border-white/40 bg-transparent uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </section>

        {/* ================= CATEGORY LIST ================= */}
        <section>
          <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-12">
            Existing Categories ({customCategories.length})
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customCategories.map((category) => (
              <div
                key={category}
                className="border border-white/10 p-8 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-2xl font-light mb-2">
                    {category}
                  </h3>
                  <p className="text-xs tracking-widest text-gray-500">
                    {getCategoryProductCount(category)} PRODUCTS
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-8">
                  <Link
                    href={`/collections/${category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      handleDeleteCategory(category)
                    }
                    className="uppercase tracking-widest text-xs text-red-500 hover:text-red-400 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TAG INFO ================= */}
        <section className="border border-white/10 p-10 max-w-3xl">
          <h2 className="uppercase tracking-widest text-xs text-gray-400 mb-6">
            Product Tags
          </h2>

          <p className="text-sm tracking-widest text-gray-500 mb-8">
            These system tags can be applied directly to products.
          </p>

          <div className="flex gap-3 mb-8">
            <Badge className="bg-white text-black">
              Featured
            </Badge>
            <Badge className="bg-white text-black">
              New Arrival
            </Badge>
            <Badge className="bg-white text-black">
              Bestseller
            </Badge>
          </div>

          <Link
            href="/admin/products"
            className="inline-block border border-white/30 px-8 py-4 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
          >
            Go to Products
          </Link>
        </section>
      </div>
    </div>
  )
}

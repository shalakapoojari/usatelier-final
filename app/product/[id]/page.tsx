"use client"

import { useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart-context"

import { ChevronDown, ChevronUp } from "lucide-react"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const router = useRouter()
  const { addItem } = useCart()

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [showDescription, setShowDescription] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  if (!product) notFound()

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
    })

    router.push("/cart")
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      {/* ================= PRODUCT ================= */}
      <main className="pt-40 px-6 md:px-12 pb-32">
        <div className="grid md:grid-cols-2 gap-20 items-start max-w-[1400px] mx-auto">
          {/* ================= IMAGES ================= */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />

              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-1 ring-white/40"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS ================= */}
          <div className="sticky top-32">
            {/* Title */}
            <p className="uppercase tracking-[0.35em] text-xs text-gray-400 mb-4">
              {product.category}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
              {product.name}
            </h1>

            <p className="text-2xl mb-10">${product.price}</p>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            {/* Size */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-xs">
                  Select Size
                </span>
                {!product.inStock && (
                  <span className="text-xs uppercase text-red-500">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    disabled={!product.inStock}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 text-xs tracking-widest border transition-all ${
                      selectedSize === size
                        ? "border-white text-white"
                        : "border-white/20 text-gray-400 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-4 border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* Accordions */}
            <div className="mt-16 border-t border-white/10">
              {/* Description */}
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full py-6"
              >
                <span className="uppercase tracking-widest text-xs">
                  Description
                </span>
                {showDescription ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {showDescription && (
                <p className="pb-6 text-gray-400 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {(product.fabric || product.care) && (
              <div className="border-t border-white/10">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full py-6"
                >
                  <span className="uppercase tracking-widest text-xs">
                    Fabric & Care
                  </span>
                  {showDetails ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {showDetails && (
                  <div className="pb-6 text-gray-400 text-sm space-y-2">
                    {product.fabric && (
                      <p>Fabric: {product.fabric}</p>
                    )}
                    {product.care && <p>Care: {product.care}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RELATED ================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-40 max-w-[1400px] mx-auto">
            <h2 className="font-serif text-3xl font-light mb-12 text-center">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="group">
                    <div className="relative aspect-[3/4] overflow-hidden mb-4">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm uppercase tracking-widest">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ${p.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

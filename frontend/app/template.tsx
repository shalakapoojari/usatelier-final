"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { CartProvider } from "@/lib/cart-context"

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [])

  return (
    <CartProvider>
      <div ref={containerRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </CartProvider>
  )
}

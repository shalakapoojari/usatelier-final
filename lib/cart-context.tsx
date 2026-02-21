"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  // isHydrated as STATE (not ref) means the save effect
  // only re-runs after this flips to true via a re-render —
  // guaranteeing items are already populated before we ever save.
  const [isHydrated, setIsHydrated] = useState(false)

  // STEP 1 — Load from localStorage exactly once after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) setItems(JSON.parse(saved))
    } catch {
      // ignore corrupt data
    }
    setIsHydrated(true)
  }, [])

  // STEP 2 — Persist to localStorage, but ONLY after hydration is done.
  // Because isHydrated is in the deps array, this effect re-runs when it
  // flips to true (after the load effect). At that point items already has
  // the loaded values, so we never accidentally save an empty array.
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items, isHydrated])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === newItem.id && i.size === newItem.size
      )
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

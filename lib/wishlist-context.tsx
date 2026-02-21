"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type WishlistItem = {
    id: string
    name: string
    price: number
    image: string
    category: string
}

type WishlistContextType = {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (id: string) => void
    toggleItem: (item: WishlistItem) => void
    isWishlisted: (id: string) => boolean
    count: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([])

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("wishlist")
            if (saved) setItems(JSON.parse(saved))
        } catch { }
    }, [])

    // Persist to localStorage when changed
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(items))
    }, [items])

    const addItem = (item: WishlistItem) => {
        setItems((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev
            return [...prev, item]
        })
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const toggleItem = (item: WishlistItem) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.id === item.id)
            return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item]
        })
    }

    const isWishlisted = (id: string) => items.some((i) => i.id === id)

    return (
        <WishlistContext.Provider
            value={{ items, addItem, removeItem, toggleItem, isWishlisted, count: items.length }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const ctx = useContext(WishlistContext)
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
    return ctx
}

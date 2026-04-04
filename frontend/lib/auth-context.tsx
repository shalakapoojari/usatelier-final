"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getApiBase, apiFetch, clearCSRFToken } from "@/lib/api-base"

const API_BASE = getApiBase()

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  profilePic?: string
  role: "user" | "admin"
  isNewSignup?: boolean
  addresses?: any[]
}

type AuthContextType = {
  user: User | null
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; user?: User; message?: string }>
  updateProfile: (data: { firstName: string; lastName: string; phone: string; profilePic?: string }) => Promise<{ success: boolean; message: string }>
  logout: () => void
  refreshUser: () => Promise<User | null>
  isAuthenticated: boolean
  isAdmin: boolean
  isAuthLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const SESSION_USER_KEY = "auth_user_session"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem(SESSION_USER_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const restoreUserFromSession = async (): Promise<User | null> => {
    try {
      const res = await apiFetch(API_BASE, "/api/auth/user")
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          const restored: User = {
            id: data.id || "",
            email: data.user,
            firstName: data.firstName || data.user.split("@")[0],
            lastName: data.lastName || "",
            phone: data.phone || "",
            profilePic: data.profilePic || "",
            role: data.isAdmin ? "admin" : "user",
            isNewSignup: data.isNewSignup || false,
            addresses: data.addresses || [],
          }
          setUser(restored)
          localStorage.setItem(SESSION_USER_KEY, JSON.stringify(restored))
          return restored
        }
      }
      setUser(null)
      localStorage.removeItem(SESSION_USER_KEY)
      return null
    } catch {
      // Flask not reachable — keep localStorage snapshot for this tab
      return user
    }
  }

  // On mount: restore session from Flask server
  useEffect(() => {
    const restore = async () => {
      try {
        await restoreUserFromSession()
      } finally {
        setIsAuthLoading(false)
      }
    }
    restore()
  }, [])

  const refreshUser = async (): Promise<User | null> => {
    setIsAuthLoading(true)
    try {
      return await restoreUserFromSession()
    } finally {
      setIsAuthLoading(false)
    }
  }

  const sendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiFetch(API_BASE, "/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      return { success: res.ok, message: data.message || data.error || "Failed to send OTP" }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const res = await apiFetch(API_BASE, "/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const loggedIn: User = {
          id: data.id || "",
          email: data.user || email,
          firstName: data.firstName || email.split("@")[0],
          lastName: data.lastName || "",
          phone: data.phone || "",
          profilePic: data.profilePic || "",
          role: data.isAdmin ? "admin" : "user",
          addresses: data.addresses || [],
        }
        setUser(loggedIn)
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(loggedIn))
        return { success: true, user: loggedIn }
      }
      return { success: false, message: data.error || "Verification failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const updateProfile = async (data: { firstName: string; lastName: string; phone: string; profilePic?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiFetch(API_BASE, "/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        if (user) {
          const updatedUser = { ...user, ...data }
          setUser(updatedUser)
          localStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser))
        }
        return { success: true, message: json.message }
      }
      return { success: false, message: json.error || "Update failed" }
    } catch {
      return { success: false, message: "Network error" }
    }
  }

  const logout = async () => {
    try {
      await apiFetch(API_BASE, "/api/auth/logout", {
        method: "POST",
      })
    } catch {
      // Ignore network errors on logout
    }
    setUser(null)
    localStorage.removeItem(SESSION_USER_KEY)
    clearCSRFToken() // SECURITY: Clear CSRF token on logout
    // Keep cart and wishlist in localStorage — both are guest-friendly
    // localStorage.removeItem("wishlist")
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

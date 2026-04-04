"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User as UserIcon, Camera, Loader2 } from "lucide-react"
import { useToast } from "@/lib/toast-context"
import { getApiBase, apiFetch } from "@/lib/api-base"

import { useAuth } from "@/lib/auth-context"

const API_BASE = getApiBase()

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePic: "",
  })

  const [isUploading, setIsUploading] = useState(false)

  // Sync form data when user is loaded/restored
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
      })
    }
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await apiFetch(API_BASE, "/api/upload/profile", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setFormData(prev => ({ ...prev, profilePic: data.url }))
        showToast("Image uploaded. Save changes to finalize.", "info")
      } else {
        showToast(data.error || "Upload failed", "info")
      }
    } catch (err) {
      showToast("Network error", "info")
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { success, message } = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profilePic: formData.profilePic,
      })

      if (success) {
        showToast("Profile updated successfully", "info")
      } else {
        showToast(message || "Failed to update profile", "info")
      }
    } catch (err) {
      showToast("An error occurred", "info")
    }
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <div className="pt-28 md:pt-52">
        <AccountSidebar>
          <div className="p-5 md:p-10 max-w-2xl">
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <p className="uppercase tracking-[0.4em] text-xs text-gray-500 mb-2">Account</p>
              <h1 className="font-serif text-4xl font-light">Settings</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <p className="uppercase tracking-widest text-xs text-gray-400 mb-8">Personal Information</p>

                {/* Profile Picture Upload */}
                <div className="flex items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                      {formData.profilePic ? (
                        <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={32} className="text-gray-600" />
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={20} />
                        </div>
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors shadow-lg">
                      <Camera size={14} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-widest mb-1">Your Avatar</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      Upload a square image for best results.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">First Name</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Last Name</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      readOnly
                      className="bg-transparent border-white/10 text-gray-500 placeholder:text-gray-600 focus:border-white/20 opacity-70 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Phone (Optional)</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  className="border border-white/40 bg-transparent uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                >
                  Save Changes
                </Button>
                <Link
                  href="/account"
                  className="inline-flex items-center px-6 py-2 border border-white/10 uppercase tracking-widest text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>

            <div className="mt-16 pt-10 border-t border-white/10">
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-5">Security</p>
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] leading-relaxed">
                Your account is secured via passwordless email authentication. 
                Each time you sign in, a secure one-time code is sent to your email.
              </p>
            </div>
          </div>
        </AccountSidebar>
      </div>

      <SiteFooter />
    </div>
  )
}

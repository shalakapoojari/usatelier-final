"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountSidebar } from "@/components/account-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/lib/toast-context"

export default function ProfilePage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast("Profile updated successfully", "info")
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <div className="pt-[72px]">
        <AccountSidebar>
          <div className="p-10 max-w-xl">
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <p className="uppercase tracking-[0.4em] text-xs text-gray-500 mb-2">Account</p>
              <h1 className="font-serif text-4xl font-light">Settings</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <p className="uppercase tracking-widest text-xs text-gray-400 mb-5">Personal Information</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      className="bg-transparent border-white/20 text-white placeholder:text-gray-600 focus:border-white/50"
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
          </div>
        </AccountSidebar>
      </div>

      <SiteFooter />
    </div>
  )
}

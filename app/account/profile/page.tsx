"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
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
    alert("Profile updated successfully!")
  }

  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-48 pb-32 px-6 md:px-12">
        <Link
          href="/account"
          className="block mb-12 text-xs uppercase tracking-widest text-gray-500 hover:text-white"
        >
          ← Back to Account
        </Link>

        <h1 className="font-serif text-5xl font-light mb-20">
          Profile
        </h1>

        <div className="max-w-[600px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-10 border border-white/10 p-12"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-transparent border-white/20 text-white placeholder:text-gray-600"
              />

              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-transparent border-white/20 text-white placeholder:text-gray-600"
              />
            </div>

            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-gray-600"
            />

            <Input
              name="phone"
              type="tel"
              placeholder="Phone (Optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="bg-transparent border-white/20 text-white placeholder:text-gray-600"
            />

            <div className="flex gap-6 pt-6">
              <Button
                type="submit"
                className="border border-white/40 bg-transparent uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
              >
                Save Changes
              </Button>

              <Link
                href="/account"
                className="inline-flex items-center px-8 py-4 border border-white/20 uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

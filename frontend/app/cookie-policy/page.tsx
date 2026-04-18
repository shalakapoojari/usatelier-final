"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content:
      "Cookies are small text files placed on your device when you visit a website. They help us recognise your device, remember your preferences, and improve your experience on usatelier.com. Some cookies are essential for the site to function; others are optional and only placed with your consent.",
  },
  {
    id: "types-of-cookies",
    title: "2. Types of Cookies We Use",
    content:
      "Essential Cookies: These are strictly necessary for our website to function and cannot be switched off. They include session cookies that keep you logged in, CSRF protection tokens that secure form submissions, and cart/wishlist state cookies.\n\nAnalytics Cookies (with consent): We use Vercel Analytics to understand how visitors interact with our site, which pages are visited most, and how users navigate. This data is aggregated and anonymised.\n\nPreference Cookies (with consent): We may store your size, currency, and display preferences to personalise your shopping experience on return visits.",
  },
  {
    id: "how-we-use-cookies",
    title: "3. How We Use Cookies",
    content:
      "We use cookies to maintain your authenticated session securely, protect against Cross-Site Request Forgery (CSRF) attacks, remember your shopping cart and wishlist across visits, understand site usage to improve performance and user experience, and remember your cookie consent preference so we do not ask you again.",
  },
  {
    id: "third-party-cookies",
    title: "4. Third-Party Cookies",
    content:
      "Our payment processing partners (Razorpay) may set their own cookies during the checkout process to facilitate secure payments. These cookies are governed by their own privacy policies. We do not control third-party cookies and recommend reviewing the privacy policies of any third parties whose services we use.",
  },
  {
    id: "managing-cookies",
    title: "5. Managing Your Cookie Preferences",
    content:
      "You can manage your cookie preferences at any time by clearing your browser's local storage or cookies. Most web browsers also allow you to control cookies through their settings. Note that disabling essential cookies may affect the functionality of our website — for example, you may not be able to stay logged in or complete a purchase.",
  },
  {
    id: "consent",
    title: "6. Cookie Consent",
    content:
      "When you first visit usatelier.com, you will be presented with a cookie consent banner. By clicking 'Accept All', you consent to our use of all cookies described in this policy. By clicking 'Essential Only', only strictly necessary cookies will be placed. You can change your preference at any time by clearing your browser storage or contacting us.",
  },
  {
    id: "updates",
    title: "7. Updates to This Policy",
    content:
      "We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. Please check this page periodically for the latest information.",
  },
  {
    id: "contact",
    title: "8. Contact",
    content:
      "If you have any questions about our use of cookies, please contact us at usatelier08@gmail.com.",
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-52 pb-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-16">
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-600 mb-6">Legal</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-8 italic text-white">Cookie Policy</h1>
            <p className="text-gray-500 text-sm tracking-widest max-w-2xl mx-auto leading-relaxed">
              Last updated: April 2026. This policy explains what cookies are, how U.S Atelier uses them, and how you can manage your preferences.
            </p>
          </section>

          <section className="space-y-8">
            {sections.map((section) => (
              <div id={section.id} key={section.title} className="border border-white/10 bg-white/2 p-6 md:p-8">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#C8A45D] mb-4">{section.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </section>

          <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-gray-500">
            Your continued use of our website with cookies enabled constitutes acceptance of this policy.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

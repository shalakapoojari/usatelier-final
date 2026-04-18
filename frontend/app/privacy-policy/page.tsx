"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us — including your name, email address, shipping address, and phone number when you create an account or place an order. Payment card details are never stored on our servers; they are processed exclusively by PCI-DSS compliant third-party processors (Razorpay / Stripe). We also automatically collect device, browser, and usage information when you visit our website.",
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to process and fulfill your orders, send order confirmations and shipping updates, respond to your enquiries, improve our website and services, and, with your consent, send you marketing communications. We do not sell, trade, or rent your personal information to third parties.",
  },
  {
    id: "legal-basis",
    title: "3. Legal Basis for Processing (GDPR / DPDP)",
    content:
      "For users in the European Union, UK, or countries covered by similar data protection laws (including India's Digital Personal Data Protection Act, 2023): we process your data on the basis of contractual necessity (fulfilling your order), legitimate interests (fraud prevention, service improvement), and your explicit consent (marketing emails). You may withdraw consent at any time by contacting us.",
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking Technologies",
    content:
      "We use essential cookies required for site functionality (session management, CSRF protection) and, with your consent, analytics cookies to understand how visitors use our site. You can manage your cookie preferences at any time via the cookie settings banner. For full details, please read our Cookie Policy.",
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing & Third Parties",
    content:
      "We share your data only with service providers necessary to operate our business — including our payment processor, logistics partners (Delhivery), and email service providers. All third parties are contractually bound to protect your data and may not use it for their own purposes. We may disclose data if required by law or to protect the rights and safety of U.S Atelier or our users.",
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content:
      "We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are retained for a minimum of 7 years as required under Indian tax law. You may request deletion of your account data at any time (see Your Rights below).",
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content:
      "Depending on your location, you may have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data ('right to be forgotten'); restrict or object to certain processing; and data portability. To exercise any of these rights, contact us at usatelier08@gmail.com. We will respond within 30 days.",
  },
  {
    id: "data-security",
    title: "8. Data Security",
    content:
      "We implement industry-standard technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. Our web application uses HTTPS/TLS encryption, HTTP security headers (HSTS, CSP, X-Frame-Options), and server-side session management. However, no method of transmission over the internet is 100% secure.",
  },
  {
    id: "international-transfers",
    title: "9. International Data Transfers",
    content:
      "U.S Atelier is operated from India. If you are accessing our services from outside India, please be aware that your information may be transferred to and processed in India. We ensure such transfers comply with applicable data protection laws.",
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content:
      "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a minor, please contact us immediately.",
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or by emailing you. Your continued use of our services after any changes constitutes your acceptance of the updated policy.",
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content:
      "For any privacy-related questions, data access requests, or concerns, please contact us at: usatelier08@gmail.com. We aim to address all requests within 30 calendar days.",
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#030303] text-[#e8e8e3] min-h-screen">
      <SiteHeader />

      <main className="pt-52 pb-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-16">
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-600 mb-6">Legal</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-8 italic text-white">Privacy Policy</h1>
            <p className="text-gray-500 text-sm tracking-widest max-w-2xl mx-auto leading-relaxed">
              Last updated: April 2026. This policy describes how U.S Atelier collects, uses, and protects your personal information in compliance with GDPR, CCPA, and India's Digital Personal Data Protection Act 2023.
            </p>
          </section>

          <section className="space-y-8">
            {sections.map((section) => (
              <div id={section.id} key={section.title} className="border border-white/10 bg-white/2 p-6 md:p-8">
                <h2 className="text-[11px] uppercase tracking-[0.25em] text-[#C8A45D] mb-4">{section.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </section>

          <p className="mt-12 text-center text-xs uppercase tracking-[0.2em] text-gray-500">
            By using this website, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const CONSENT_KEY = "usatelier_cookie_consent"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Small delay so the page renders first
      const t = setTimeout(() => {
        setVisible(true)
        requestAnimationFrame(() => setAnimateIn(true))
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = (type: "all" | "essential") => {
    localStorage.setItem(CONSENT_KEY, type)
    setAnimateIn(false)
    setTimeout(() => setVisible(false), 500)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease",
        transform: animateIn ? "translateY(0)" : "translateY(110%)",
        opacity: animateIn ? 1 : 0,
      }}
    >
      {/* Backdrop blur bar */}
      <div
        style={{
          background: "rgba(0,0,0,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          {/* Text */}
          <div style={{ flex: "1 1 360px", minWidth: 0 }}>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "0.35rem",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              Cookie Notice
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                fontFamily: "var(--font-sans, sans-serif)",
                maxWidth: "560px",
              }}
            >
              We use essential cookies to operate this site securely, and optional analytics cookies to improve your experience. By clicking{" "}
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>Accept All</strong>, you consent to all cookies.{" "}
              <Link
                href="/cookie-policy"
                style={{
                  color: "#C8A45D",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(200,164,93,0.3)",
                  transition: "border-color 0.2s",
                }}
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexShrink: 0,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => accept("essential")}
              aria-label="Accept essential cookies only"
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.4)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "0.6rem 1.25rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontFamily: "var(--font-sans, sans-serif)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
              }}
            >
              Essential Only
            </button>

            <button
              onClick={() => accept("all")}
              aria-label="Accept all cookies"
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#000",
                background: "#fff",
                border: "1px solid #fff",
                padding: "0.6rem 1.25rem",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontFamily: "var(--font-sans, sans-serif)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e8e8e3"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff"
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"

export function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            // Once visible, unobserve to keep it visible
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    const scanAndObserve = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        observer.observe(el)
      })
    }

    // Initial scan
    scanAndObserve()

    // Re-scan after short delay for dynamically rendered content
    const t1 = setTimeout(scanAndObserve, 400)
    const t2 = setTimeout(scanAndObserve, 1200)

    return () => {
      observer.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return <>{children}</>
}

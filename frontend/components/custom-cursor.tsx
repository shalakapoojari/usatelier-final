"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(hover: none)").matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let hovering = false
    let rafId: number

    // Smooth ring follow with lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)

      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      ring.style.transform = `translate(${ringX - (hovering ? 24 : 14)}px, ${ringY - (hovering ? 24 : 14)}px)`

      rafId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest("a, button, [role='button'], input, textarea, select, label")) {
        hovering = true
        ring.classList.add("cursor-ring--hover")
        dot.classList.add("cursor-dot--hover")
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest("a, button, [role='button'], input, textarea, select, label")) {
        hovering = false
        ring.classList.remove("cursor-ring--hover")
        dot.classList.remove("cursor-dot--hover")
      }
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true })
    document.addEventListener("mouseover", onMouseOver, { passive: true })
    document.addEventListener("mouseout", onMouseOut, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-[#c8a45d] mix-blend-difference will-change-transform"
        style={{ transition: "opacity 0.2s" }}
        aria-hidden="true"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[9998] h-7 w-7 rounded-full border border-[#c8a45d]/50 will-change-transform"
        style={{ transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.2s" }}
        aria-hidden="true"
      />
    </>
  )
}

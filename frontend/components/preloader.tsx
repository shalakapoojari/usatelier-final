"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

// Pixel horse body pixel map (row, col) — 10×14 pixel grid, px = 6px each
const BODY_PIXELS: [number, number][] = [
  // Head
  [0,1],[0,2],
  [1,0],[1,1],[1,2],[1,3],
  [2,0],[2,2],[2,3],[2,4],   // [2,1] = eye gap
  // Neck
  [3,3],[3,4],
  // Body
  [3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],
  [4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[4,11],
  [5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],
  [6,5],[6,6],[6,7],[6,8],[6,9],
  // Tail
  [2,11],[2,12],[3,12],[4,12],
]

// Front legs — 2 pairs, each will be animated
const FRONT_LEGS_A: [number, number][] = [
  [7,5],[8,4],[9,3],[10,2],  // f-left forward
  [7,7],[8,7],[9,7],[10,7],  // f-right down
]
const FRONT_LEGS_B: [number, number][] = [
  [7,5],[8,5],[9,5],[10,5],  // f-left center
  [7,7],[8,8],[9,9],[10,10], // f-right backward
]

// Back legs — animated in opposition
const BACK_LEGS_A: [number, number][] = [
  [7,9],[8,9],[9,9],[10,9],  // b-left down
  [7,11],[8,12],[9,13],[10,13], // b-right extended back
]
const BACK_LEGS_B: [number, number][] = [
  [7,9],[8,8],[9,7],[10,6],  // b-left forward
  [7,11],[8,11],[9,11],[10,11], // b-right down
]

const PX = 5 // pixel size in px
const COLS = 14
const ROWS = 11

function PixelHorse({ frame }: { frame: 0 | 1 }) {
  const frontLegs = frame === 0 ? FRONT_LEGS_A : FRONT_LEGS_B
  const backLegs = frame === 0 ? BACK_LEGS_A : BACK_LEGS_B

  const allPixels = [
    ...BODY_PIXELS.map(p => ({ p, type: "body" })),
    ...frontLegs.map(p => ({ p, type: "leg-f" })),
    ...backLegs.map(p => ({ p, type: "leg-b" })),
  ]

  return (
    <div
      style={{
        position: "relative",
        width: COLS * PX,
        height: ROWS * PX,
        imageRendering: "pixelated",
      }}
    >
      {allPixels.map(({ p: [row, col], type }, i) => (
        <div
          key={`${type}-${i}`}
          style={{
            position: "absolute",
            width: PX,
            height: PX,
            top: row * PX,
            left: col * PX,
            background:
              type === "body"
                ? "linear-gradient(135deg, #9B30FF, #FF2D9B)"
                : type === "leg-f"
                ? "#c460ff"
                : "#ff7ac0",
          }}
        />
      ))}
    </div>
  )
}

export function Preloader() {
  const preloaderRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const percentRef = useRef<HTMLParagraphElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const frameCountRef = useRef(0)
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    // Pixel frame flipper — toggle between two divs at ~10fps
    const frame0 = frameRef.current?.querySelector(".pf-0") as HTMLElement | null
    const frame1 = frameRef.current?.querySelector(".pf-1") as HTMLElement | null
    let showFirst = true
    const flip = () => {
      if (frame0 && frame1) {
        frame0.style.display = showFirst ? "block" : "none"
        frame1.style.display = showFirst ? "none" : "block"
        showFirst = !showFirst
      }
      rafRef.current = setTimeout(flip, 100)
    }
    rafRef.current = setTimeout(flip, 100)

    const progress = { value: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        if (rafRef.current) clearTimeout(rafRef.current)
        document.body.style.overflow = "auto"
        try {
          ;(window as any).__PRELOADER_DONE__ = true
          window.dispatchEvent(new CustomEvent("preloader:done"))
        } catch (e) { /* ignore */ }
      },
    })

    tl.to(progress, {
      value: 100,
      duration: 2.5,
      ease: "power1.inOut",
      onUpdate: () => {
        if (barRef.current && percentRef.current) {
          barRef.current.style.width = `${progress.value}%`
          percentRef.current.innerText = `${Math.round(progress.value)}%`
        }
      },
    })
    .to(preloaderRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.55,
      ease: "power2.in",
    })
    .set(preloaderRef.current, { display: "none" })

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current)
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div
      ref={preloaderRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#06030f",
        // Faint grid lines
        backgroundImage: `
          linear-gradient(rgba(155,48,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(155,48,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    >
      {/* Soft purple glow behind pixel runner */}
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(155,48,255,0.25) 0%, rgba(255,45,155,0.1) 50%, transparent 80%)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* Pixel horse container — two frames, toggled */}
      <div ref={frameRef} style={{ position: "relative", marginBottom: 28 }}>
        <div className="pf-0">
          <PixelHorse frame={0} />
        </div>
        <div className="pf-1" style={{ display: "none" }}>
          <PixelHorse frame={1} />
        </div>
      </div>

      {/* Brand name — subtle */}
      <p style={{
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: "0.55em",
        color: "rgba(255,255,255,0.2)",
        marginBottom: 20,
        fontFamily: "'Geist', sans-serif",
      }}>
        U.S ATELIER
      </p>

      {/* Purple→Pink progress bar */}
      <div
        style={{
          width: 180,
          height: 1,
          background: "rgba(155,48,255,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "0%",
            background: "linear-gradient(90deg, #9B30FF, #FF2D9B)",
            boxShadow: "0 0 8px rgba(155,48,255,0.8)",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* Percentage */}
      <p
        ref={percentRef}
        style={{
          marginTop: 10,
          fontSize: 9,
          letterSpacing: "0.4em",
          color: "rgba(155,48,255,0.6)",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        0%
      </p>
    </div>
  )
}

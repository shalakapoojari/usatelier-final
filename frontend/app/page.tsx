"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Preloader } from "@/components/preloader"
import { MarqueeTicker } from "@/components/marquee-ticker"
import { getApiBase } from "@/lib/api-base"
import { resolveMediaUrl } from "@/lib/media-url"

gsap.registerPlugin(ScrollTrigger)

/* ════════════════════════════════════════════════════════════
   RUNWAY PRODUCT CARD — used in horizontal strip sections
════════════════════════════════════════════════════════════ */
function RunwayProductCard({ product, index }: { product: any; index?: number }) {
  const images = typeof product.images === 'string'
    ? (() => { try { return JSON.parse(product.images) } catch { return [product.images] } })()
    : product.images
  const imageUrl = resolveMediaUrl(images && images[0] ? images[0] : "/placeholder.jpg")
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  return (
    <div
      ref={cardRef}
      className="group hover-lift relative shrink-0 overflow-hidden"
      style={{ width: "280px", height: "380px" }}
    >
      <Link href={`/product/${product.id}`} className="block h-full w-full">
        {/* Image */}
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 brightness-50 group-hover:brightness-75"
          />
        </div>
        {/* Overlay info */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="font-serif italic text-xl text-white/90 leading-tight mb-1 group-hover:text-white transition-colors">
            {product.name}
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-white/70 transition-colors">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
        </div>
      </Link>
    </div>
  )
}

import { ProductSkeleton } from "@/components/product-skeleton"

/* ════════════════════════════════════════════════════════════
   VERTICAL SNAP RUNWAY — one slide per product, snap-scroll
════════════════════════════════════════════════════════════ */
function VerticalSnapRunway({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // IntersectionObserver for slide entrance animation + progress indicator
  useEffect(() => {
    if (!products || products.length === 0) return
    const observers = slideRefs.current.map((slide, idx) => {
      if (!slide) return null
      const imgEl  = slide.querySelector('.runway-slide-img')
      const cntEl  = slide.querySelector('.runway-slide-content')
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSlide(idx)
            imgEl?.classList.add('entered')
            cntEl?.classList.add('entered')
          }
        },
        { threshold: 0.5 }
      )
      obs.observe(slide)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [products])

  if (!products || products.length === 0) return null

  return (
    <section id="best-sellers" className="relative">
      {/* Right-side vertical progress indicator — clean monochromatic */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center"
        style={{ height: "60vh", gap: 0 }}
        aria-hidden="true"
      >
        <div
          style={{
            width: 1,
            flex: 1,
            background: "rgba(255,255,255,0.1)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `${(activeSlide / Math.max(products.length - 1, 1)) * 100}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              transition: "top 400ms ease",
            }}
          />
        </div>
      </div>

      {/* Snap scroll container */}
      <div ref={containerRef} className="runway-snap-container">
        {products.map((product, idx) => {
          const imgs = typeof product.images === 'string'
            ? (() => { try { return JSON.parse(product.images) } catch { return [product.images] } })()
            : product.images
          const imgUrl = resolveMediaUrl(imgs?.[0] || '/placeholder.jpg')

          return (
            <div
              key={product.id || idx}
              ref={(el) => { slideRefs.current[idx] = el }}
              className="runway-slide"
            >
              {/* LEFT — Full-bleed image */}
              <div className="runway-slide-img relative overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  style={{ filter: "brightness(0.75)" }}
                  priority={idx === 0}
                />
                {/* Slide number watermark */}
                <span
                  className="absolute bottom-8 left-8 font-serif select-none pointer-events-none"
                  style={{ fontSize: 80, lineHeight: 1, color: "rgba(255,255,255,0.04)" }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* RIGHT — Product details */}
              <div
                className="runway-slide-content flex flex-col justify-center px-10 md:px-16 lg:px-20"
                style={{ background: "rgba(0,0,0,0.92)" }}
              >
                {/* Label */}
                <p
                  className="text-[9px] uppercase tracking-[0.6em] mb-6"
                  style={{ color: "rgba(240,240,240,0.3)" }}
                >
                  {idx === 0 ? "Runway 01" : `— Piece ${String(idx + 1).padStart(2, '0')}`}
                </p>

                {/* Product name — clean white serif */}
                <h2
                  className="font-serif leading-none uppercase mb-4 text-white"
                  style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 300 }}
                >
                  {product.name}
                </h2>

                {/* Category */}
                {product.category && (
                  <p
                    className="text-[10px] uppercase tracking-[0.4em] mb-4"
                    style={{ color: "rgba(240,240,240,0.35)" }}
                  >
                    {product.category}
                  </p>
                )}

                {/* Description */}
                {product.description && (
                  <p
                    className="text-sm leading-relaxed mb-8 max-w-xs"
                    style={{ color: "rgba(240,240,240,0.5)", fontWeight: 300 }}
                  >
                    {product.description.slice(0, 140)}{product.description.length > 140 ? '...' : ''}
                  </p>
                )}

                {/* Price — clean white */}
                <p
                  className="font-serif text-3xl mb-8 text-white/90"
                  style={{ letterSpacing: "-0.01em", fontWeight: 300 }}
                >
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </p>

                {/* CTA — clean border style */}
                <Link
                  href={`/product/${product.id}`}
                  className="inline-flex w-fit items-center justify-center px-8 py-3 text-[10px] uppercase tracking-[0.4em] transition-all duration-300 hover:bg-white/8 hover:border-white/50 hover:text-white text-white/60 border border-white/20"
                >
                  View Piece →
                </Link>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-10">
                  {products.map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      style={{
                        width: dotIdx === idx ? 20 : 4,
                        height: 1,
                        background: dotIdx === idx ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                        transition: "all 400ms ease",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   BEST SELLERS SECTION — admin-controlled, static fallback
   Placed between the FIN runway section and the footer
════════════════════════════════════════════════════════════ */

// Placeholder product cards shown when admin hasn't set up products yet
const PLACEHOLDER_BESTSELLERS = [
  {
    id: "placeholder-1",
    name: "Essential Crew Tee",
    price: 4500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop",
    badge: "Best Seller",
  },
  {
    id: "placeholder-2",
    name: "Structured Overcoat",
    price: 18900,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1374&auto=format&fit=crop",
    badge: "Most Loved",
  },
  {
    id: "placeholder-3",
    name: "Tailored Slim Trouser",
    price: 8200,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1374&auto=format&fit=crop",
    badge: "",
  },
  {
    id: "placeholder-4",
    name: "Merino Ribbed Knit",
    price: 7600,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop",
    badge: "New Drop",
  },
  {
    id: "placeholder-5",
    name: "Raw Hem Cargo",
    price: 9800,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1526&auto=format&fit=crop",
    badge: "",
  },
  {
    id: "placeholder-6",
    name: "Linen Relaxed Shirt",
    price: 6400,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1374&auto=format&fit=crop",
    badge: "Staff Pick",
  },
]

function BestSellerCard({ product, isPlaceholder = false }: { product: any; isPlaceholder?: boolean }) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  const imageUrl = isPlaceholder
    ? product.image
    : (() => {
        const imgs = typeof product.images === 'string'
          ? (() => { try { return JSON.parse(product.images) } catch { return [product.images] } })()
          : product.images
        return resolveMediaUrl(imgs?.[0] || '/placeholder.jpg')
      })()

  const productLink = isPlaceholder ? "/view-all" : `/product/${product.id}`
  const price = isPlaceholder ? product.price : Number(product.price)

  return (
    <div
      ref={cardRef}
      className="group flex-shrink-0 w-[240px] md:w-[280px] bg-[#0a0a0a] border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden"
    >
      {/* Product image */}
      <div className="relative h-[320px] w-full overflow-hidden bg-[#111]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-70 group-hover:brightness-85"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 text-[8px] uppercase tracking-[0.3em] text-white/70 bg-black/60 backdrop-blur-sm px-3 py-1 border border-white/10">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="p-5">
        <h3 className="font-serif text-base text-white/90 leading-tight mb-1 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-5">
          ₹{price.toLocaleString('en-IN')}
        </p>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={() => {
            if (!isPlaceholder && typeof window !== "undefined") {
              window.location.href = productLink
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[9px] uppercase tracking-[0.35em] text-white/55 border border-white/15 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={12} strokeWidth={1.5} />
          {isPlaceholder ? "Shop Now" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

function BestSellersSection({ products }: { products: any[] }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const headingRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Use API products if available, otherwise show placeholders
  const displayProducts = products.length > 0 ? products : PLACEHOLDER_BESTSELLERS
  const isPlaceholder = products.length === 0

  useEffect(() => {
    if (!headingRef.current) return
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  return (
    /* ── BEST SELLERS ──────────────────────────────────────────────── */
    <section
      ref={sectionRef}
      id="best-sellers-grid"
      className="relative bg-[#040404] py-20 md:py-32 overflow-hidden"
      aria-labelledby="best-sellers-heading"
    >
      {/* Section header */}
      <div className="px-8 md:px-20 mb-12" ref={headingRef}>
        <div className="flex items-end justify-between">
          <div>
            {/* Eyebrow label */}
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3">
              Curated by the Studio
            </p>
            {/* Section title — matches reference h2 style */}
            <h2
              id="best-sellers-heading"
              className="font-serif text-5xl md:text-7xl font-light text-white/90 leading-none"
            >
              Best Sellers
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-white/25 mt-4 max-w-xs">
              Our most coveted pieces, loved by many.
            </p>
          </div>
          <Link
            href="/view-all"
            className="hidden md:inline-flex text-[10px] uppercase tracking-[0.3em] text-white/35 hover:text-white transition-colors border-b border-white/15 hover:border-white/50 pb-0.5 mb-2"
          >
            View All →
          </Link>
        </div>
        {/* Thin divider */}
        <div className="mt-8 h-px w-full bg-white/5" />
      </div>

      {/* Horizontal scrollable card strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 px-8 md:px-20 pb-4 overflow-x-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {displayProducts.map((p: any, idx: number) => (
          <BestSellerCard
            key={isPlaceholder ? `ph-${idx}` : `${p.id}-${idx}`}
            product={p}
            isPlaceholder={isPlaceholder}
          />
        ))}
      </div>

      {/* Mobile — View All link */}
      <div className="md:hidden px-8 mt-8">
        <Link
          href="/view-all"
          className="text-[10px] uppercase tracking-[0.3em] text-white/35 hover:text-white transition-colors border-b border-white/15 hover:border-white/50 pb-0.5"
        >
          View All →
        </Link>
      </div>
    </section>
  )
}

/* ════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [API_BASE, setApiBase] = useState("")
  useEffect(() => {
    setApiBase(getApiBase())
  }, [])

  const rootRef = useRef<HTMLDivElement | null>(null)
  const manifestoRef = useRef<HTMLParagraphElement | null>(null)

  const [config, setConfig] = useState<any>(null)
  const [bestsellers, setBestsellers] = useState<any[]>([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const router = useRouter()

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  /* ── Embla autoplay ── */
  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)

    let intervalId: any
    const startAutoplay = () => {
      stopAutoplay()
      intervalId = setInterval(() => {
        emblaApi.scrollNext()
      }, 4000)
    }
    const stopAutoplay = () => {
      if (intervalId) clearInterval(intervalId)
    }
    const handleVisibilityChange = () => {
      if (document.hidden) stopAutoplay()
      else startAutoplay()
    }

    startAutoplay()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      emblaApi.off('select', onSelect)
      stopAutoplay()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [emblaApi, onSelect])

  /* ── Homepage config + products ── */
  useEffect(() => {
    const fetchConfig = async () => {
      if (!API_BASE) return
      try {
        const res = await fetch(`${API_BASE}/api/homepage`)
        if (res.ok) {
          const data = await res.json()
          setConfig(data)
          const fetchCategory = async (ids: string[]) => {
            if (!ids || ids.length === 0) return []
            const promises = ids.map(id =>
              fetch(`${API_BASE}/api/products/${id}`).then(r => r.ok ? r.json() : null)
            )
            const results = await Promise.all(promises)
            return results.filter(Boolean)
          }
          const b = await fetchCategory(data.bestseller_product_ids)
          setBestsellers(b)
        }
      } catch (err) {
        console.error("Failed to fetch homepage config:", err)
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchConfig()
  }, [API_BASE])

  /* ── HERO ANIMATION ── */
  useEffect(() => {
    if (loadingConfig) return
    let ctxHost: gsap.Context | null = null

    const runHero = () => {
      ctxHost = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0 })

        tl.to(".hero-line span", {
          y: "0%",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
        })

        gsap.fromTo(".hero-tagline",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.6 }
        )

        gsap.fromTo(".hero-season",
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
        )

        gsap.to(".hero-cta-desktop", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.9,
        })
      }, rootRef)
    }

    const onPreloaderDone = () => runHero()

    if ((window as any).__PRELOADER_DONE__) {
      runHero()
    } else {
      window.addEventListener("preloader:done", onPreloaderDone)
    }

    return () => {
      window.removeEventListener("preloader:done", onPreloaderDone)
      if (ctxHost) ctxHost.revert()
    }
  }, [loadingConfig])

  /* ── MANIFESTO ANIMATION ── */
  useEffect(() => {
    if (!manifestoRef.current) return
    gsap.fromTo(
      manifestoRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [])

  /* ── HERO PARALLAX SCROLL ── */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const vh = window.innerHeight
          const progress = Math.min(scrollY / vh, 1)
          const parallaxPx = progress * (vh * 0.18)
          document.querySelectorAll<HTMLElement>(".hero-parallax-img").forEach(el => {
            el.style.transform = `translateY(${parallaxPx}px) scale(1.05)`
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── Slide data from config or defaults ── */
  const slides = config?.hero_slides && config.hero_slides.length > 0
    ? config.hero_slides.map((s: any) => {
        const content = (s.content || "").trim()
        const lines = content.split("\n").filter(Boolean)
        const words = content.split(" ").filter(Boolean)
        const half = Math.ceil(words.length / 2)
        return {
          image: s.image || "/placeholder.jpg",
          content,
          product_id: s.product_id || "",
          title1: lines[0] || words.slice(0, half).join(" ") || "ETHEREAL",
          title2: lines[1] || words.slice(half).join(" ") || "SHADOWS",
          cta_text: "View The Lookbook",
          cta_link: s.product_id ? `/product/${s.product_id}` : "/view-all",
        }
      })
    : [
        {
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
          content: "ETHEREAL\nSHADOWS",
          title1: "ETHEREAL",
          title2: "SHADOWS",
          cta_text: "View The Lookbook",
          cta_link: "/view-all",
        }
      ]

  const manifestoText = config?.manifesto_text ||
    "U.S Atelier is premium menswear designed for the modern man who values style, comfort, and craftsmanship with innovative tailoring to deliver clothing that makes a statement—confident, stylish, and refined."

  const seasonLabel = config?.season_label || "Fall Winter 2025"

  return (
    <>
      <Preloader />

      {/* ── Root wrapper: overflow-x hidden to prevent horizontal bleed on mobile ── */}
      <div ref={rootRef} className="bg-black text-white min-h-screen" style={{ overflowX: "hidden" }}>
        <SiteHeader />

        {/* ═══════════════════════════════════════════════════════════
            HERO CAROUSEL — full-screen with left-anchored title
        ═══════════════════════════════════════════════════════════ */}
        <section className="hero-carousel relative h-screen bg-black">
          <div className="embla h-full w-full" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {slides.map((slide: any, idx: number) => (
                <div key={idx} className="embla__slide relative flex-[0_0_100%] h-full w-full" style={{ minWidth: 0 }}>

                  {/* Background image with parallax class */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={resolveMediaUrl(slide.image || "/placeholder.jpg")}
                      alt={`Hero Slide ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center hero-parallax-img"
                      style={{ filter: "brightness(0.42)", willChange: "transform" }}
                    />
                    {/* Clean dark gradient overlay — no rainbow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-transparent to-black/45" />
                  </div>

                  {/* Season label — top left */}
                  <div className="hero-season absolute top-28 left-8 md:left-12 z-20">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/40">
                      {seasonLabel}
                    </p>
                  </div>

                  {/* HERO TITLE — left-aligned, bottom-anchored */}
                  <div
                    className="absolute inset-0 z-10 flex flex-col items-start justify-end pointer-events-none"
                    style={{ paddingLeft: "clamp(32px, 7vw, 120px)", paddingBottom: "clamp(100px, 16vh, 180px)" }}
                  >
                    <div className="hero-line overflow-hidden">
                      <h1 className="leading-none uppercase font-serif">
                        {/* First line — clean white */}
                        <span
                          className="block font-semibold text-white"
                          style={{
                            fontSize: "clamp(36px, 9vw, 120px)",
                            letterSpacing: "-0.01em",
                            display: "block",
                            transform: "translateY(110%)",
                          }}
                        >
                          {slide.title1}
                        </span>
                        {/* Second line — muted italic white */}
                        <span
                          className="block italic font-light text-white/45"
                          style={{
                            fontSize: "clamp(36px, 11vw, 140px)",
                            letterSpacing: "-0.02em",
                            marginTop: "-0.05em",
                            display: "block",
                            transform: "translateY(110%)",
                          }}
                        >
                          {slide.title2}
                        </span>
                      </h1>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8 md:mt-10 pointer-events-auto hero-cta-desktop" style={{ opacity: 0, transform: "translateY(20px)" }}>
                      <Link
                        href={slide.cta_link || "/view-all"}
                        className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-10 py-4 text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/60 transition-all duration-500 hover:border-white/60 hover:text-white hover:bg-white/8 min-w-[220px] md:min-w-[280px] active:scale-95"
                      >
                        {slide.cta_text || "View The Lookbook"}
                      </Link>
                    </div>
                  </div>

                  {/* Animated scroll indicator — bottom center */}
                  <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 hero-tagline" style={{ opacity: 0 }}>
                    <div className="h-10 w-px overflow-hidden rounded-full bg-white/15">
                      <div className="h-full w-full scroll-indicator-line bg-white/50" />
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
                  </div>

                  {/* Bottom-left tagline */}
                  <div className="hero-tagline absolute bottom-12 left-8 md:left-12 z-20 opacity-0">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/35 leading-relaxed">
                      Designed in India.
                      <br />
                      Crafted with Precision.
                      <br />
                      Worn with Confidence.
                    </p>
                  </div>

                  {/* Slide indicator dots */}
                  <div className="absolute bottom-12 right-8 md:right-12 z-20 flex gap-2">
                    {slides.map((_: any, dotIdx: number) => (
                      <button
                        key={dotIdx}
                        onClick={() => emblaApi?.scrollTo(dotIdx)}
                        className={`transition-all duration-500 rounded-full ${selectedIndex === dotIdx ? 'w-6 h-1 bg-white/60' : 'w-1 h-1 bg-white/20'}`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel navigation arrows */}
            <button
              type="button"
              aria-label="Previous hero slide"
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-4 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/40 hover:text-white transition-colors md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next hero slide"
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-4 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/40 hover:text-white transition-colors md:flex"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            MANIFESTO — large centered serif text, deep black
            Adopted from frontend2 reference layout
        ═══════════════════════════════════════════════════════════ */}
        <section className="reveal bg-[#030303] py-24 md:py-40 px-8 md:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <p
              ref={manifestoRef}
              className="font-serif text-3xl md:text-5xl leading-[1.25] md:leading-[1.2] text-gray-300 font-light"
              style={{ opacity: 0 }}
            >
              {manifestoText.split(" ").map((word: string, i: number, arr: string[]) => {
                const fromEnd = arr.length - 1 - i
                const isEnd = fromEnd < 5
                return (
                  <span
                    key={i}
                    style={{ color: isEnd ? `rgba(200,200,196,${Math.max(0.15, 1 - (5 - fromEnd) * 0.17)})` : "rgb(200,200,196)" }}
                  >
                    {word}{" "}
                  </span>
                )
              })}
            </p>
          </div>
        </section>

        {/* ── Marquee ticker strip between manifesto and runway ── */}
        <MarqueeTicker />

        {/* ═══════════════════════════════════════════════════════════
            RUNWAY 01 — vertical snap scroll, one slide per bestseller
        ═══════════════════════════════════════════════════════════ */}
        {bestsellers.length > 0 && (
          <VerticalSnapRunway products={bestsellers} />
        )}

        {/* ═══════════════════════════════════════════════════════════
            BEST SELLERS — admin-curated product grid section
            Inserted before the FIN panel and footer
        ═══════════════════════════════════════════════════════════ */}
        <BestSellersSection products={bestsellers} />

        {/* ═══════════════════════════════════════════════════════════
            FIN — closing runway panel before footer
        ═══════════════════════════════════════════════════════════ */}
        <section className="bg-[#030303]">
          <div className="px-8 md:px-20">
            <div className="border-t border-white/5 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-8">
              <p className="font-serif italic text-7xl md:text-9xl text-white/8 leading-none select-none">FIN</p>
              <div className="text-center md:text-right">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-6">
                  The full collection awaits
                </p>
                <Link
                  href="/view-all"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-10 py-4 text-[10px] uppercase tracking-[0.35em] text-white/50 transition-all duration-500 hover:border-white/50 hover:text-white hover:bg-white/5 active:scale-95"
                >
                  Shop The Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Preloader } from "@/components/preloader"
import { MarqueeTicker } from "@/components/marquee-ticker"
import { getApiBase } from "@/lib/api-base"
import { resolveMediaUrl } from "@/lib/media-url"

gsap.registerPlugin(ScrollTrigger)

function RunwayProductCard({ product, index }: { product: any; index?: number }) {
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
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
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  )
}

import { ProductSkeleton } from "@/components/product-skeleton"

/* ════════════════════════════════════════════════════════════
   STICKY GALLERY — vertical scroll chapters, no GSAP
════════════════════════════════════════════════════════════ */
type GalleryChapter = {
  photo: string
  label: string
  title: string
  subtitle: string
  link: string
}

function StickyGallery({ chapters }: { chapters: GalleryChapter[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (chapters.length === 0) return
    const observers = chapterRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(index) },
        { threshold: 0.5, rootMargin: "0px 0px -10% 0px" }
      )
      observer.observe(ref)
      return observer
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [chapters.length])

  if (chapters.length === 0) return null

  return (
    <section className="relative flex bg-black" style={{ minHeight: `${chapters.length * 100}vh` }}>
      {/* Far-left progress line */}
      <div className="hidden md:block absolute left-6 top-0 bottom-0 w-px bg-white/5 z-10">
        <div
          className="bg-[#c8a45d]/30 w-full transition-all duration-500"
          style={{ height: `${((activeIdx + 1) / chapters.length) * 100}%` }}
        />
      </div>

      {/* LEFT: scrolling chapters */}
      <div className="w-full md:w-1/2 flex flex-col">
        {chapters.map((chapter, i) => (
          <div
            key={i}
            ref={el => { chapterRefs.current[i] = el }}
            className="flex flex-col justify-center px-10 md:px-16 lg:px-24"
            style={{ minHeight: "100vh" }}
          >
            {/* Progress dot + label */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                activeIdx === i ? "bg-[#c8a45d]/70 scale-125" : "bg-white/15"
              }`} />
              <span className="text-[9px] uppercase tracking-[0.5em] text-white/25">
                {String(i + 1).padStart(2, "0")} — {chapter.label}
              </span>
            </div>

            {/* Chapter title */}
            <h2
              className={`font-serif leading-none uppercase mb-4 transition-all duration-500 ${
                activeIdx === i ? "opacity-100" : "opacity-30"
              }`}
              style={{ fontSize: "clamp(28px, 4vw, 58px)" }}
            >
              <span className={activeIdx === i ? "gradient-text" : "text-white/30"}>
                {chapter.title}
              </span>
            </h2>

            {/* Chapter subtitle */}
            <p className={`text-[10px] uppercase tracking-[0.4em] mb-8 transition-all duration-500 ${
              activeIdx === i ? "text-white/40" : "text-white/12"
            }`}>
              {chapter.subtitle}
            </p>

            {/* CTA */}
            <Link
              href={chapter.link}
              className={`inline-flex w-fit items-center gap-3 text-[9px] uppercase tracking-[0.4em] border-b pb-0.5 transition-all duration-500 ${
                activeIdx === i
                  ? "text-white/60 border-white/30 hover:text-white hover:border-white"
                  : "text-transparent border-transparent pointer-events-none"
              }`}
            >
              Explore Collection
            </Link>

            {/* Mobile: show photo inline */}
            <div className="md:hidden mt-10 relative h-72 overflow-hidden">
              <Image
                src={resolveMediaUrl(chapter.photo)}
                alt={chapter.title}
                fill
                className="object-cover brightness-50"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: sticky photo panel (desktop only) */}
      <div className="hidden md:block w-1/2 sticky top-0 h-screen overflow-hidden">
        {chapters.map((chapter, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-600"
            style={{ opacity: activeIdx === i ? 1 : 0, transitionDuration: "0.6s" }}
          >
            <Image
              src={resolveMediaUrl(chapter.photo)}
              alt={chapter.title}
              fill
              className="object-cover brightness-45"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            {/* Chapter number watermark */}
            <div className="absolute bottom-10 right-10">
              <span className="font-serif text-[120px] leading-none text-white/4 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function RunwaySection({ title, subtitle, tagline, products, sectionId }: { title: string, subtitle: string, tagline?: string, products: any[], sectionId?: string }) {
  const titleRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!products || products.length === 0 || !titleRef.current) return
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    )
  }, [products])

  if (!products || products.length === 0) return null

  return (
    <div id={sectionId} className="scroll-mt-32">
      {/* Section header */}
      <div className="px-8 md:px-20 mb-10" ref={titleRef}>
        <div className="flex items-end justify-between">
          <div>
            {/* small label */}
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-3">
              {subtitle}
            </p>
            {/* Large italic serif title */}
            <h2 className="font-serif italic text-5xl md:text-7xl font-light text-white/90 leading-none">
              {title}
            </h2>
            {tagline && (
              <p className="text-xs uppercase tracking-[0.3em] text-white/30 mt-4 max-w-xs">
                {tagline}
              </p>
            )}
          </div>
          <Link
            href="/view-all"
            className="hidden md:inline-flex text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5 mb-2"
          >
            View All →
          </Link>
        </div>
        {/* Thin divider */}
        <div className="mt-8 h-px w-full bg-white/5" />
      </div>

      {/* Horizontal scroll product strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 px-8 md:px-20 pb-6 overflow-x-auto no-scrollbar"
      >
        {products.map((p, idx) => (
          <RunwayProductCard key={`${p.id}-${idx}`} product={p} index={idx} />
        ))}
      </div>

      {/* Mobile view all */}
      <div className="md:hidden px-8 mt-6">
        <Link
          href="/view-all"
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
        >
          View All →
        </Link>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [API_BASE, setApiBase] = useState("")
  useEffect(() => {
    setApiBase(getApiBase())
  }, [])

  const rootRef = useRef<HTMLDivElement | null>(null)
  const manifestoRef = useRef<HTMLParagraphElement | null>(null)

  const [config, setConfig] = useState<any>(null)
  const [bestsellers, setBestsellers] = useState<any[]>([])
  const [featured, setFeatured] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [loadingConfig, setLoadingConfig] = useState(true)
  const router = useRouter()

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

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
          const [b, f, n] = await Promise.all([
            fetchCategory(data.bestseller_product_ids),
            fetchCategory(data.featured_product_ids),
            fetchCategory(data.new_arrival_product_ids)
          ])
          setBestsellers(b)
          setFeatured(f)
          setNewArrivals(n)
        }
      } catch (err) {
        console.error("Failed to fetch homepage config:", err)
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchConfig()
  }, [API_BASE])

  /* ================= HERO ANIMATION ================= */
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

        // Animate the bottom-left tagline
        gsap.fromTo(".hero-tagline", 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.6 }
        )

        // Animate the season label
        gsap.fromTo(".hero-season",
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
        )

        // CTA button fades in with the title
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

  /* ================= MANIFESTO ANIMATION ================= */
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

  /* ================= HERO PARALLAX SCROLL ================= */
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

  // Season label from config or default
  const seasonLabel = config?.season_label || "Fall Winter 2025"

  // Build sticky gallery chapters from fetched product sections
  const galleryChapters: GalleryChapter[] = (
    [
      bestsellers.length > 0
        ? {
            photo: (() => {
              const p = bestsellers[0]
              const imgs = typeof p.images === "string" ? JSON.parse(p.images || "[]") : (p.images || [])
              return imgs[0] || "/placeholder.jpg"
            })(),
            label: "Best Sellers",
            title: "The Runway",
            subtitle: "Our most coveted pieces, loved by many",
            link: "/#best-sellers",
          }
        : null,
      featured.length > 0
        ? {
            photo: (() => {
              const p = featured[0]
              const imgs = typeof p.images === "string" ? JSON.parse(p.images || "[]") : (p.images || [])
              return imgs[0] || "/placeholder.jpg"
            })(),
            label: "Editorial",
            title: "Featured",
            subtitle: "Curated selections from our editorial team",
            link: "/#featured-products",
          }
        : null,
      newArrivals.length > 0
        ? {
            photo: (() => {
              const p = newArrivals[0]
              const imgs = typeof p.images === "string" ? JSON.parse(p.images || "[]") : (p.images || [])
              return imgs[0] || "/placeholder.jpg"
            })(),
            label: "New Drop",
            title: "New Arrivals",
            subtitle: "Fresh pieces just landed in the studio",
            link: "/#new-arrivals",
          }
        : null,
    ].filter(Boolean) as GalleryChapter[]
  )

  return (
    <>
      <Preloader />

      <div ref={rootRef} className="bg-black text-white overflow-x-hidden min-h-screen">
        <SiteHeader />

        {/* ═══════════════════════════════════════════════════════════
            HERO CAROUSEL — full-screen with centered title overlay
        ═══════════════════════════════════════════════════════════ */}
        <section className="hero-carousel relative h-screen bg-black">
          <div className="embla h-full w-full" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {slides.map((slide: any, idx: number) => (
                <div key={idx} className="embla__slide relative flex-[0_0_100%] h-full w-full">

                  {/* Background image with parallax class */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={resolveMediaUrl(slide.image || "/placeholder.jpg")}
                      alt={`Hero Slide ${idx}`}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center hero-parallax-img"
                      style={{ filter: "brightness(0.42)", willChange: "transform" }}
                    />
                    {/* Purple-tinted overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0215]/60 via-transparent to-[#0d0510]/50" />
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/55" />
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
                        {/* First line — purple→pink gradient */}
                        <span
                          className="block font-semibold gradient-text"
                          style={{
                            fontSize: "clamp(36px, 9vw, 120px)",
                            letterSpacing: "-0.01em",
                            display: "block",
                            transform: "translateY(110%)",
                          }}
                        >
                          {slide.title1}
                        </span>
                        {/* Second line — muted italic, subtle purple-white */}
                        <span
                          className="block italic font-light"
                          style={{
                            fontSize: "clamp(36px, 11vw, 140px)",
                            letterSpacing: "-0.02em",
                            marginTop: "-0.05em",
                            background: "linear-gradient(135deg, rgba(155,48,255,0.55) 0%, rgba(200,180,255,0.4) 50%, rgba(255,45,155,0.4) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
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
                        className="inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-10 py-4 text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/60 transition-all duration-500 hover:border-purple-500/60 hover:text-white hover:bg-purple-500/10 min-w-[220px] md:min-w-[280px] active:scale-95"
                      >
                        {slide.cta_text || "View The Lookbook"}
                      </Link>
                    </div>
                  </div>

                  {/* Animated scroll indicator — bottom center */}
                  <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 hero-tagline" style={{ opacity: 0 }}>
                    <div className="h-10 w-px overflow-hidden rounded-full" style={{ background: "rgba(155,48,255,0.2)" }}>
                      <div className="h-full w-full scroll-indicator-line" style={{ background: "linear-gradient(#9B30FF, #FF2D9B)" }} />
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Scroll</span>
                  </div>

                  {/* Bottom-left tagline — "Designed in Paris. Crafted in Milan." */}
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
                        className={`transition-all duration-500 rounded-full ${idx === dotIdx ? 'w-6 h-1 bg-white/60' : 'w-1 h-1 bg-white/20'}`}
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
        ═══════════════════════════════════════════════════════════ */}
        <section className="reveal bg-black py-24 md:py-40 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <p
              ref={manifestoRef}
              className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.25] md:leading-[1.2] text-white font-light"
              style={{ opacity: 0 }}
            >
              {manifestoText.split(" ").map((word: string, i: number, arr: string[]) => {
                // Fade the last few words to create a fade-out effect
                const fromEnd = arr.length - 1 - i
                const isEnd = fromEnd < 5
                return (
                  <span
                    key={i}
                    className="transition-opacity"
                    style={{ color: isEnd ? `rgba(255,255,255,${Math.max(0.15, 1 - (5 - fromEnd) * 0.17)})` : "rgb(255,255,255)" }}
                  >
                    {word}{" "}
                  </span>
                )
              })}
            </p>
          </div>
        </section>

        {/* Marquee ticker strip between manifesto and runway */}
        <MarqueeTicker />

        {/* ═══════════════════════════════════════════════════════════
            STICKY GALLERY — editorial chapters
        ═══════════════════════════════════════════════════════════ */}
        {galleryChapters.length > 0 && (
          <StickyGallery chapters={galleryChapters} />
        )}

        {/* ═══════════════════════════════════════════════════════════
            THE RUNWAY — product showcase sections
        ═══════════════════════════════════════════════════════════ */}
        <section className="reveal bg-black py-16 md:py-24 space-y-24 md:space-y-40">
          {/* Runway intro block */}
          <div className="px-8 md:px-20">
            <div className="border-t border-white/8 pt-12">
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 mb-6">— The Collection</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 max-w-sm">
                Featuring raw hems, structured shoulders, liquid silk drapes.
              </p>
            </div>
          </div>

          {/* Best Sellers runway */}
          <RunwaySection
            sectionId="best-sellers"
            title="The Runway"
            subtitle="Best Selling"
            tagline="Scroll to Explore →"
            products={bestsellers}
          />

          {/* Featured Products */}
          {featured.length > 0 && (
            <RunwaySection
              sectionId="featured-products"
              title="Featured"
              subtitle="Editorial Spotlight"
              tagline="Curated Selections"
              products={featured}
            />
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <RunwaySection
              sectionId="new-arrivals"
              title="New Arrivals"
              subtitle="Latest Drop"
              tagline="Fresh From The Studio"
              products={newArrivals}
            />
          )}

          {/* FIN block */}
          <div className="px-8 md:px-20">
            <div className="border-t border-white/8 pt-12 flex items-center justify-between">
              <p className="font-serif italic text-2xl text-white/20">FIN</p>
              <Link
                href="/view-all"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-[10px] uppercase tracking-[0.35em] text-white/50 transition-all duration-500 hover:border-white/50 hover:text-white"
              >
                Shop The Collection
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  )
}

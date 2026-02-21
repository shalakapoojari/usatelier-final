"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

gsap.registerPlugin(ScrollTrigger)

const values = [
    {
        number: "01",
        title: "Silence as Design",
        body: "We believe the most powerful statement is restraint. Every stitch, every seam, every absence of embellishment is intentional.",
    },
    {
        number: "02",
        title: "Craft Above Commerce",
        body: "Our atelier in Milan employs master tailors who have spent decades perfecting a single technique. There is no algorithm for that.",
    },
    {
        number: "03",
        title: "Slowness as Luxury",
        body: "We release two collections per year. No drops. No collabs. No noise. Quality demands patience — from us, and from you.",
    },
    {
        number: "04",
        title: "Material Integrity",
        body: "Every fabric we use is traceable to its source. Cashmere from Mongolia, linen from Belgium, silk from Como. Nothing less.",
    },
]

const timeline = [
    { year: "2018", event: "Founded in a one-room studio in Paris's 11th arrondissement." },
    { year: "2019", event: "First collection — 'Vol. 01: Dust' — sells out in 48 hours." },
    { year: "2020", event: "Atelier established in Milan. First international stockist opens in Tokyo." },
    { year: "2021", event: "Sustainability report published. 100% traceable supply chain achieved." },
    { year: "2022", event: "Campaign shot by Saul Leiter estate collaboration. Paris Fashion Week debut." },
    { year: "2023", event: "Online flagship relaunched. Global shipping to 40 countries." },
    { year: "2025", event: "Fall/Winter campaign 'Ethereal Shadows' — our most defining collection to date." },
]

export default function MaisonPage() {
    const rootRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".maison-hero-line", {
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.12,
            })

            gsap.utils.toArray<HTMLElement>(".maison-reveal").forEach((el) => {
                gsap.from(el, {
                    y: 50,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                    },
                })
            })
        }, rootRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={rootRef} className="bg-[#030303] text-[#e8e8e3] min-h-screen">
            <SiteHeader />

            {/* ── HERO ── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2574"
                    alt="Maison Hero"
                    fill
                    priority
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-transparent to-[#030303]" />

                <div className="relative z-10 text-center px-6">
                    <p className="maison-hero-line uppercase tracking-[0.6em] text-xs text-gray-400 mb-6">
                        The House
                    </p>
                    <h1 className="maison-hero-line font-serif text-[12vw] md:text-[8vw] font-light leading-none">
                        Maison
                    </h1>
                    <p className="maison-hero-line font-serif text-[12vw] md:text-[8vw] font-light leading-none italic text-gray-400">
                        U.S ATELIER.
                    </p>
                    <p className="maison-hero-line mt-10 text-sm text-gray-500 tracking-widest uppercase">
                        Founded 2018 · Paris & Milan
                    </p>
                </div>
            </section>

            {/* ── MANIFESTO ── */}
            <section className="py-40 px-8 md:px-32 max-w-[1200px] mx-auto">
                <p className="maison-reveal uppercase tracking-[0.4em] text-xs text-gray-500 mb-10">
                    Our Philosophy
                </p>
                <h2 className="maison-reveal font-serif text-4xl md:text-6xl font-light leading-snug text-gray-200">
                    We build garments the way architects build
                    <span className="italic text-gray-400"> cathedrals.</span>
                </h2>
                <p className="maison-reveal mt-12 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl border-l border-white/10 pl-8">
                    Slowly. Deliberately. With the understanding that what we create will outlast the moment of its making.
                    In an industry built on speed, U.S ATELIER is a refusal — a studied, elegant act of resistance.
                    We make only what is necessary, and we make it once, perfectly.
                </p>
            </section>

            {/* ── SPLIT IMAGE + TEXT ── */}
            <section className="px-8 md:px-16 pb-32 max-w-[1400px] mx-auto">
                <div className="grid md:grid-cols-2 gap-0 border border-white/10">
                    <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2595"
                            alt="Atelier"
                            fill
                            className="object-cover grayscale opacity-80"
                        />
                    </div>
                    <div className="flex flex-col justify-center p-12 md:p-16 bg-white/[0.02]">
                        <p className="maison-reveal uppercase tracking-[0.4em] text-xs text-gray-500 mb-8">
                            The Atelier
                        </p>
                        <h2 className="maison-reveal font-serif text-3xl md:text-4xl font-light mb-8 leading-snug">
                            A studio built on the belief that <span className="italic">silence is a material.</span>
                        </h2>
                        <p className="maison-reveal text-gray-400 text-sm leading-relaxed mb-6">
                            Our Milan atelier is not a factory. It is a room of twelve people, each an expert in a single
                            domain — pattern, drape, finish, hand. They have worked together for years. They do not rush.
                        </p>
                        <p className="maison-reveal text-gray-400 text-sm leading-relaxed">
                            When you purchase a garment from U.S ATELIER, you are not buying fabric.
                            You are buying the accumulated hours of people who believe that how something is made
                            is just as important as what it becomes.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-32 px-8 md:px-16 border-t border-white/10">
                <div className="max-w-[1400px] mx-auto">
                    <p className="maison-reveal uppercase tracking-[0.4em] text-xs text-gray-500 mb-16 text-center">
                        What We Stand For
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
                        {values.map((v, i) => (
                            <div
                                key={i}
                                className={`maison-reveal p-10 ${i < 3 ? "border-r border-white/10" : ""}`}
                            >
                                <p className="text-6xl font-serif text-white/5 mb-6">{v.number}</p>
                                <h3 className="uppercase tracking-widest text-xs text-white mb-4">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ── */}
            <section className="py-32 px-8 md:px-16 border-t border-white/10">
                <div className="max-w-[900px] mx-auto">
                    <p className="maison-reveal uppercase tracking-[0.4em] text-xs text-gray-500 mb-16">
                        The Story
                    </p>
                    <div className="space-y-0">
                        {timeline.map((item, i) => (
                            <div
                                key={i}
                                className="maison-reveal flex gap-12 py-8 border-b border-white/10 last:border-0 group"
                            >
                                <span className="font-serif text-2xl font-light text-gray-600 group-hover:text-white transition-colors w-16 shrink-0">
                                    {item.year}
                                </span>
                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors pt-1">
                                    {item.event}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECOND IMAGE ── */}
            <section className="px-8 md:px-16 pb-32 max-w-[1400px] mx-auto">
                <div className="relative aspect-[21/9] overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670"
                        alt="The Collection"
                        fill
                        className="object-cover grayscale opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-transparent to-[#030303]/80" />
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div>
                            <p className="uppercase tracking-[0.5em] text-xs text-gray-400 mb-4">The Collection</p>
                            <h2 className="font-serif text-5xl md:text-7xl font-light">Wear Less. Say More.</h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-8 text-center border-t border-white/10">
                <h2 className="font-serif text-4xl font-light mb-10">
                    Begin Your Wardrobe
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/shop"
                        className="inline-block px-12 py-5 border border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Shop the Collection
                    </Link>
                    <Link
                        href="/campaign"
                        className="inline-block px-12 py-5 border border-white/20 uppercase tracking-widest text-xs text-gray-400 hover:text-white hover:border-white/40 transition-all duration-300"
                    >
                        View Campaign
                    </Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}

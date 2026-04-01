"use client"

import { useEffect } from "react"

export default function HeroSection() {

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY
            const bg = document.querySelector(".hero-bg") as HTMLElement

            if (bg) {
                bg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <section className="relative h-screen overflow-hidden">

            {/* Background */}
            <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564"
                className="hero-bg absolute inset-0 w-full h-full object-cover scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                <h1 className="text-[10vw] font-serif">BE YOU</h1>
            </div>

        </section>
    )
}
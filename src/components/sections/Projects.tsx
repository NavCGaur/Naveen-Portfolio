"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useProjectModal } from "@/hooks/use-project-modal"
import { projectsData } from "@/data/projectsData"

export default function Projects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { openModal } = useProjectModal()

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    const firstCard = scrollContainerRef.current.querySelector("[data-card]") as HTMLElement
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 24 // gap-6 = 24px
      const current = scrollContainerRef.current.scrollLeft
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? current - cardWidth : current + cardWidth,
        behavior: "smooth",
      })
    }
  }

  return (
    <section id="projects" className="py-[100px] px-6 md:px-10 bg-ink overflow-hidden">
      <div className="max-w-[1100px] mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4"
            >
              Featured Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif text-[clamp(30px,4vw,46px)] tracking-[-0.025em] leading-[1.1] text-white"
            >
              Projects I&apos;ve shipped
            </motion.h2>
          </div>

          {/* Arrow Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden md:flex gap-2 flex-shrink-0 ml-6"
          >
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.05] hover:border-gold hover:text-gold transition-all duration-200 flex items-center justify-center group cursor-pointer"
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-white/40 group-hover:text-gold transition-colors">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.05] hover:border-gold hover:text-gold transition-all duration-200 flex items-center justify-center group cursor-pointer"
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-white/40 group-hover:text-gold transition-colors">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

          {projectsData.map((project, i) => (
            <motion.div
              data-card
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] snap-start"
            >
              <button
                onClick={() => openModal(project)}
                className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-xl cursor-pointer"
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-xl bg-[#141414] border border-white/[0.07] shadow-[0px_4px_32px_rgba(0,0,0,0.4)] group-hover:border-gold/30 transition-all duration-300">

                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 380px, 420px"
                      unoptimized
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Tech pills */}
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech, j) => (
                          <span key={j} className="px-2.5 py-1 text-[11px] font-medium bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-2.5 py-1 text-[11px] font-medium bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Gold arrow indicator */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gold flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="#0D0D0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="p-5">
                    <h3 className="text-[15px] font-medium text-white mb-1 group-hover:text-gold transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-[13px] text-white/50 line-clamp-2 leading-[1.6]">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-b-xl" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="w-full h-px bg-white/[0.08] mt-16" />
      </div>
    </section>
  )
}

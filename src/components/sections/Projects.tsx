"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useProjectModal } from "@/hooks/use-project-modal"
import { projectsData } from "@/data/projectsData"

export default function Projects() {
  const { openModal } = useProjectModal()
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const limit = showAll ? projectsData.length : (isMobile ? 3 : 6)
  const visibleProjects = projectsData.slice(0, limit)

  return (
    <section id="projects" className="py-[100px] px-6 md:px-10 hd:px-14 bg-ink overflow-hidden">
      <div className="max-w-[1100px] hd:max-w-[1280px] mx-auto">

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
        </div>

        {/* Wrapping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: showAll ? 0 : i * 0.07 }}
                className="w-full"
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {projectsData.length > (isMobile ? 3 : 6) && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group relative overflow-hidden inline-block border border-gold text-gold bg-gold/[0.05] px-8 py-3 rounded-md text-[15px] font-medium tracking-[0.05em] hover:bg-gold hover:text-ink transition-all duration-300 shadow-md shadow-gold/5 hover:shadow-gold/20 cursor-pointer"
            >
              <span className="relative z-10">{showAll ? "Show Less" : "More Projects →"}</span>
            </button>
          </div>
        )}

        {/* Bottom rule */}
        <div className="w-full h-px bg-white/[0.08] mt-16" />
      </div>
    </section>
  )
}

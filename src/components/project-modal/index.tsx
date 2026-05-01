"use client"

import { useState } from "react"
import { Project, useProjectModal } from "@/hooks/use-project-modal"
import { ProjectModalLeftPanel } from "./LeftPanel"
import { ProjectModalRightPanel } from "./RightPanel"

export function ProjectModal() {
  const { isOpen, selectedProject, closeModal } = useProjectModal()
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen || !selectedProject) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* Modal Container */}
      <div
        className="relative w-full h-full max-w-[1400px] max-h-[92vh] m-4 bg-[#111111] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/[0.08]"
        style={{ animation: "slideUp 0.3s ease" }}
      >
        {/* Header */}
        <div className="flex-none flex items-center justify-between px-8 py-5 border-b border-white/[0.08]">
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-[20px] md:text-[24px] text-white truncate">
              {selectedProject.title}
            </h2>
          </div>

          <div className="flex items-center gap-6 ml-4">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-[13px] font-medium text-gold hover:text-gold/80 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isCopied ? "Link copied!" : "Copy link"}
              {isCopied ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              onClick={closeModal}
              className="text-white/50 hover:text-gold transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Split Content */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Panel */}
          <ProjectModalLeftPanel project={selectedProject} onClose={closeModal} />

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-white/[0.08]" />

          {/* Right Panel */}
          <ProjectModalRightPanel project={selectedProject} />
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { Project } from "@/hooks/use-project-modal"

interface LeftPanelProps {
  project: Project
  onClose: () => void
}

export function ProjectModalLeftPanel({ project }: LeftPanelProps) {
  return (
    <div className="w-full lg:w-[420px] flex-none lg:h-full overflow-y-auto p-8 lg:p-12 space-y-8">
      {/* Client & Metadata */}
      <div className="space-y-3 pt-2">
        {project.client && (
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-gold font-medium">Client:</span>
            <span className="text-white/70">{project.client}</span>
          </div>
        )}
        {project.industry && (
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-gold font-medium">Industry:</span>
            <span className="text-white/70">{project.industry}</span>
          </div>
        )}
        {project.role && (
          <div className="flex items-start gap-2 text-[13px]">
            <span className="text-gold font-medium whitespace-nowrap">My Role:</span>
            <span className="text-white/70">{project.role}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.08]" />

      {/* Overview */}
      {project.overview && (
        <div className="space-y-2">
          <h3 className="font-serif text-[17px] text-white">Overview</h3>
          <p className="text-[14px] text-white/65 leading-[1.7]">{project.overview}</p>
        </div>
      )}

      {/* Challenge */}
      {project.challenge && (
        <div className="space-y-2">
          <h3 className="font-serif text-[17px] text-white">Challenge</h3>
          <p className="text-[14px] text-white/65 leading-[1.7]">{project.challenge}</p>
        </div>
      )}

      {/* Solution */}
      {project.solution && (
        <div className="space-y-2">
          <h3 className="font-serif text-[17px] text-white">Solution</h3>
          <p className="text-[14px] text-white/65 leading-[1.7]">{project.solution}</p>
        </div>
      )}

      {/* Results */}
      {project.results && (
        <div className="space-y-2">
          <h3 className="font-serif text-[17px] text-white">Results</h3>
          <p className="text-[14px] text-white/65 leading-[1.7]">{project.results}</p>
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-serif text-[17px] text-white">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="text-[12px] px-3 py-1 border border-gold rounded-full text-gold bg-gold/[0.08]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium bg-gold text-ink rounded-lg hover:bg-gold/90 transition-colors"
          >
            View Live Site
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium border border-white/20 text-white rounded-lg hover:border-gold hover:text-gold transition-colors"
          >
            View Code
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import { Project } from "@/hooks/use-project-modal"

interface RightPanelProps {
  project: Project
}

export function ProjectModalRightPanel({ project }: RightPanelProps) {
  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
      {project.images.length > 0 ? (
        <div className="space-y-6">
          <h3 className="font-serif text-[20px] text-white">Project Gallery</h3>
          <div className="grid grid-cols-1 gap-5">
            {project.images.map((image, index) => (
              <div
                key={index}
                className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]"
              >
                <Image
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-white/40">
          <p>No images available for this project.</p>
        </div>
      )}
    </div>
  )
}

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Project {
  title: string
  slug: string
  date: string
  cover: string
  description: string
  client?: string
  industry?: string
  liveUrl?: string
  repoUrl?: string
  role?: string
  techStack: string[]
  images: string[]
  overview?: string
  challenge?: string
  solution?: string
  results?: string
}

interface ProjectModalContextType {
  isOpen: boolean
  selectedProject: Project | null
  openModal: (project: Project) => void
  closeModal: () => void
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined)

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsOpen(true)
    const slug = project.slug.split("/").pop() || project.slug
    window.history.pushState({ project: slug }, "", `?project=${slug}`)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedProject(null)
    window.history.pushState({}, "", window.location.pathname)
    document.body.style.overflow = "unset"
  }

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      if (!params.get("project")) {
        setIsOpen(false)
        setSelectedProject(null)
        document.body.style.overflow = "unset"
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeModal()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  return (
    <ProjectModalContext.Provider value={{ isOpen, selectedProject, openModal, closeModal }}>
      {children}
    </ProjectModalContext.Provider>
  )
}

export function useProjectModal() {
  const context = useContext(ProjectModalContext)
  if (!context) throw new Error("useProjectModal must be used within a ProjectModalProvider")
  return context
}

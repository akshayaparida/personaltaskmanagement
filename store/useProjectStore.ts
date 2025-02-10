import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  description?: string
  color?: string
  progress: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

interface ProjectStore {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  updateProgress: (id: string, progress: number) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updatedProject, updatedAt: new Date() }
              : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),
      updateProgress: (id, progress) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, progress, updatedAt: new Date() }
              : project
          ),
        })),
    }),
    {
      name: 'project-storage',
    }
  )
)
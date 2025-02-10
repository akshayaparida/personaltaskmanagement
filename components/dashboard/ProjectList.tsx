import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useProjectStore } from '@/store/useProjectStore'
import { useTaskStore } from '@/store/useTaskStore'

interface Project {
  id: string
  name: string
  description?: string
  color: string
}

export function ProjectList() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId).length
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button variant="outline" size="sm">Manage</Button>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {getProjectTaskCount(project.id)} tasks
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
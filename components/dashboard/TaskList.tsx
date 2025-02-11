import React from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export function TaskList() {
  const { tasks, loading, error, toggleTaskComplete, removeTask } = useTaskStore();

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tasks.length) {
    return <div>No tasks found</div>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </span>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTask(task.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          {task.description && (
            <CardContent>
              <p className="text-sm text-gray-500">{task.description}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
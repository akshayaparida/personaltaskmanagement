// types/task.ts
export interface Task {
    id: string;
    title: string;
    completed: boolean;  // Added this field since it's used in the component
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    projectId?: string;
    categoryId?: string;
    createdAt: Date;
    updatedAt: Date;
  }
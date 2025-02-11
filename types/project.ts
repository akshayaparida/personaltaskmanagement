// types/project.ts
export interface Project {
    id: string;
    name: string;
    description?: string;
    color?: string; // Add this line
    status: 'active' | 'completed' | 'archived';
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
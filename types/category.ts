// types/category.ts
export interface Category {
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
  }
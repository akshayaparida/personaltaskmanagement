// store/useDashboardStore.ts
import { create } from 'zustand';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { Category } from '@/types/category';

interface DashboardState {
  tasks: Task[];
  projects: Project[];
  categories: Category[];
  stats: {
    tasksCount: number;
    projectsCount: number;
    categoriesCount: number;
  };
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  tasks: [],
  projects: [],
  categories: [],
  stats: {
    tasksCount: 0,
    projectsCount: 0,
    categoriesCount: 0
  },
  isLoading: false,
  error: null,
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      set({ 
        tasks: data.tasks,
        projects: data.projects,
        categories: data.categories,
        stats: data.stats,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));
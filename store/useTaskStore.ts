// store/useTaskStore.ts
import { create } from 'zustand';
import { Task } from '@/types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

interface TaskActions {
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  removeTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type TaskStore = TaskState & TaskActions;

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  ...initialState,

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => 
    set((state) => ({ 
      tasks: [...state.tasks, task] 
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  toggleTaskComplete: async (taskId) => {
    try {
      const state = get();
      const task = state.tasks.find(t => t.id === taskId);
      
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          completed: !task.completed
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? 'Failed to toggle task status');
      }

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to toggle task status' });
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
import { useCallback } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Task } from '@/types/task';

interface UseTasksOptions {
  onError?: (error: string) => void;
}

interface TaskFilters {
  projectId?: string;
  categoryId?: string;
}

interface TaskResponse {
  success: boolean;
  data?: Task[];
  message?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { 
    tasks,
    loading,
    error,
    setTasks,
    addTask,
    updateTask: updateStoreTask,
    removeTask,
    setLoading,
    setError
  } = useTaskStore();

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters?.projectId) queryParams.append('projectId', filters.projectId);
      if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId);

      const baseUrl = '/api/tasks';
      const queryString = queryParams.toString();
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
      
      const response = await fetch(url);
      const data: TaskResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? 'Failed to fetch tasks');
      }

      setTasks(data.data ?? []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching tasks';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setTasks, setLoading, setError, options]);

  const createTask = useCallback(async (taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      const data: TaskResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? 'Failed to create task');
      }

      if (!data.data?.[0]) {
        throw new Error('No task data received');
      }

      addTask(data.data[0]);
      return data.data[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating task';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addTask, setLoading, setError, options]);

  const updateTask = useCallback(async (taskId: string, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, id: taskId }),
      });

      const data: TaskResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? 'Failed to update task');
      }

      if (!data.data?.[0]) {
        throw new Error('No task data received');
      }

      updateStoreTask(data.data[0]);
      return data.data[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating task';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateStoreTask, setLoading, setError, options]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const data: TaskResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message ?? 'Failed to delete task');
      }

      removeTask(taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting task';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [removeTask, setLoading, setError, options]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
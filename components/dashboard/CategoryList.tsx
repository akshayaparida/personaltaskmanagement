"use client"

import { useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useTaskStore } from '@/store/useTaskStore'
import { Category } from '@/types/category'

interface CategoryListProps {
  readonly categories?: readonly Category[];
}

export function CategoryList({ categories: propCategories }: CategoryListProps) {
  const storeCategories = useCategoryStore((state) => state.categories);
  const tasks = useTaskStore((state) => state.tasks);

  const categories = useMemo(() => {
    return propCategories || storeCategories;
  }, [propCategories, storeCategories]);

  const getCategoryTaskCount = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button variant="outline" size="sm">Manage</Button>
      </div>
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span>{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {getCategoryTaskCount(category.id)} tasks
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

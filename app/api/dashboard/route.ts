import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { tasks, projects, categories } from '@/db/schema';

export async function GET() {
  try {
    // Fetch tasks, projects, and categories
    const fetchedTasks = await db.select().from(tasks);
    const fetchedProjects = await db.select().from(projects);
    const fetchedCategories = await db.select().from(categories);

    // Calculate statistics
    const stats = {
      tasksCount: fetchedTasks.length,
      projectsCount: fetchedProjects.length,
      categoriesCount: fetchedCategories.length,
    };

    return NextResponse.json({ 
      tasks: fetchedTasks, 
      projects: fetchedProjects, 
      categories: fetchedCategories, 
      stats 
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

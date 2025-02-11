import { NextResponse } from 'next/server'
import { db } from '@/lib/drizzle'
import { tasks } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

interface TaskQueryParams {
  projectId?: string;
  categoryId?: string;
}

interface TaskBody {
  id?: number;
  title: string;
  description?: string;
  isCompleted?: boolean;
  projectId?: number;
  categoryId?: number;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const categoryId = searchParams.get('categoryId')
    
    let conditions = [eq(tasks.userId, parseInt(session.user.id))]

    if (projectId) {
      conditions.push(eq(tasks.projectId, parseInt(projectId)))
    }

    if (categoryId) {
      conditions.push(eq(tasks.categoryId, parseInt(categoryId)))
    }

    const userTasks = await db.query.tasks.findMany({
      where: and(...conditions),
      orderBy: tasks.createdAt
    })

    return NextResponse.json(
      { success: true, data: userTasks },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: TaskBody = await request.json();
    
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Task title is required" },
        { status: 400 }
      );
    }

    const newTask = await db.insert(tasks).values({
      title: body.title.trim(),
      description: body.description?.trim(),
      isCompleted: body.isCompleted ?? false,
      projectId: body.projectId,
      categoryId: body.categoryId,
      userId: parseInt(session.user.id)
    }).returning();

    return NextResponse.json(
      { 
        success: true, 
        data: newTask[0],
        message: "Task created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: TaskBody = await request.json();
    
    if (!body.id || !body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Task ID and title are required" },
        { status: 400 }
      );
    }

    const updatedTask = await db.update(tasks)
      .set({ 
        title: body.title.trim(),
        description: body.description?.trim(),
        isCompleted: body.isCompleted,
        projectId: body.projectId,
        categoryId: body.categoryId
      })
      .where(
        and(
          eq(tasks.id, body.id),
          eq(tasks.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!updatedTask.length) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: updatedTask[0],
        message: "Task updated successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: TaskBody = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Task ID is required" },
        { status: 400 }
      );
    }

    const deletedTask = await db.delete(tasks)
      .where(
        and(
          eq(tasks.id, body.id),
          eq(tasks.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!deletedTask.length) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Task deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { success: false, message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
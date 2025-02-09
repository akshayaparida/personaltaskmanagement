import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const projectId = searchParams.get('projectId');

    // Build base query
    let baseQuery = db
      .select()
      .from(tasks);

    // Build conditions array
    const conditions = [eq(tasks.userId, parseInt(session.userId))];

    if (categoryId) {
      conditions.push(eq(tasks.categoryId, parseInt(categoryId)));
    }

    if (projectId) {
      conditions.push(eq(tasks.projectId, parseInt(projectId)));
    }

    // Apply all conditions using and()
    const userTasks = await baseQuery.where(and(...conditions));

    return NextResponse.json(
      { success: true, data: userTasks },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error while fetching tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Task title is required" },
        { status: 400 }
      );
    }

    const taskData = {
      title: body.title.trim(),
      description: body.description?.trim(),
      userId: parseInt(session.userId),
      categoryId: body.categoryId ? parseInt(body.categoryId) : null,
      projectId: body.projectId ? parseInt(body.projectId) : null,
      isCompleted: body.isCompleted || false
    };

    const newTask = await db
      .insert(tasks)
      .values(taskData)
      .returning();

    return NextResponse.json(
      { success: true, data: newTask[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error while creating task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.id || !body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Task ID and title are required" },
        { status: 400 }
      );
    }

    const taskData = {
      title: body.title.trim(),
      description: body.description?.trim(),
      categoryId: body.categoryId ? parseInt(body.categoryId) : null,
      projectId: body.projectId ? parseInt(body.projectId) : null,
      isCompleted: body.isCompleted || false
    };

    const updatedTask = await db
      .update(tasks)
      .set(taskData)
      .where(
        and(
          eq(tasks.id, body.id),
          eq(tasks.userId, parseInt(session.userId))
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
      { success: true, data: updatedTask[0] },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in PUT /api/tasks:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error while updating task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Task ID is required" },
        { status: 400 }
      );
    }

    const deletedTask = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, body.id),
          eq(tasks.userId, parseInt(session.userId))
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
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in DELETE /api/tasks:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error while deleting task" },
      { status: 500 }
    );
  }
}
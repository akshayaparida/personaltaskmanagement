import { NextResponse } from 'next/server'
import { db } from '@/lib/drizzle'
import { projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getSession } from '@/lib/auth'

interface ProjectBody {
  id?: number;
  name?: string;
  description?: string;
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

    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, parseInt(session.user.id)),
      orderBy: projects.createdAt
    });

    return NextResponse.json(
      { success: true, data: userProjects },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
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

    const body: ProjectBody = await request.json();
    
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Project name is required" },
        { status: 400 }
      );
    }

    const newProject = await db.insert(projects).values({
      name: body.name.trim(),
      description: body.description?.trim(),
      userId: parseInt(session.user.id)
    }).returning();

    return NextResponse.json(
      { 
        success: true, 
        data: newProject[0],
        message: "Project created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { success: false, message: "Failed to create project" },
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

    const body: ProjectBody = await request.json();
    
    if (!body.id || !body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Project ID and name are required" },
        { status: 400 }
      );
    }

    const updatedProject = await db.update(projects)
      .set({ 
        name: body.name.trim(),
        description: body.description?.trim()
      })
      .where(
        and(
          eq(projects.id, body.id),
          eq(projects.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!updatedProject.length) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: updatedProject[0],
        message: "Project updated successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/projects:', error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
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

    const body: ProjectBody = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const deletedProject = await db.delete(projects)
      .where(
        and(
          eq(projects.id, body.id),
          eq(projects.userId, parseInt(session.user.id))
        )
      )
      .returning();

    if (!deletedProject.length) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Project deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/projects:', error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
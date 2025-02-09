import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, parseInt(session.userId)));

    return NextResponse.json({ success: true, data: allProjects });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, message: "Project name is required" }, { status: 400 });
    }

    const newProject = await db
      .insert(projects)
      .values({
        name,
        description,
        userId: parseInt(session.userId)
      })
      .returning();

    return NextResponse.json({ success: true, data: newProject[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating project" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ success: false, message: "ID and Name are required" }, { status: 400 });
    }

    const updatedProject = await db
      .update(projects)
      .set({ name, description })
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userId, parseInt(session.userId))
        )
      )
      .returning();

    if (!updatedProject.length) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProject[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const deletedProject = await db
      .delete(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userId, parseInt(session.userId))
        )
      )
      .returning();

    if (!deletedProject.length) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting project" }, { status: 500 });
  }
}
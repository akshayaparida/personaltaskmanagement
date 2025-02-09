import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET: Fetch all categories for authenticated user
export async function GET() {
  try {
    // Get the authentication session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch categories for the authenticated user
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, parseInt(session.userId)))
      .orderBy(categories.createdAt);

    return NextResponse.json(
      { 
        success: true, 
        data: userCategories 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error while fetching categories" 
      },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  try {
    // Get the authentication session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = await db
      .insert(categories)
      .values({
        name: body.name.trim(),
        userId: parseInt(session.userId)
      })
      .returning();

    return NextResponse.json(
      { 
        success: true, 
        data: newCategory[0],
        message: "Category created successfully" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error while creating category" 
      },
      { status: 500 }
    );
  }
}

// PUT: Update an existing category
export async function PUT(req: Request) {
  try {
    // Get the authentication session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id || !body.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Category ID and name are required" },
        { status: 400 }
      );
    }

    // Update category
    const updatedCategory = await db
      .update(categories)
      .set({ name: body.name.trim() })
      .where(
        and(
          eq(categories.id, body.id),
          eq(categories.userId, parseInt(session.userId))
        )
      )
      .returning();

    if (!updatedCategory.length) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: updatedCategory[0],
        message: "Category updated successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in PUT /api/categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error while updating category" 
      },
      { status: 500 }
    );
  }
}

// DELETE: Remove a category
export async function DELETE(req: Request) {
  try {
    // Get the authentication session
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Delete category
    const deletedCategory = await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, body.id),
          eq(categories.userId, parseInt(session.userId))
        )
      )
      .returning();

    if (!deletedCategory.length) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Category deleted successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error while deleting category" 
      },
      { status: 500 }
    );
  }
}
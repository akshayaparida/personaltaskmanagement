// app/api/categories/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/drizzle'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const userCategories = await db.query.categories.findMany({
      where: eq(categories.userId, parseInt(userId)),
      orderBy: categories.createdAt
    })

    return NextResponse.json({ success: true, data: userCategories })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, userId } = await request.json()

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: 'Name and userId are required' },
        { status: 400 }
      )
    }

    const newCategory = await db.insert(categories).values({
      name,
      userId: parseInt(userId)
    }).returning()

    return NextResponse.json({ success: true, data: newCategory[0] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json()

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'Category ID and name are required' },
        { status: 400 }
      )
    }

    const updatedCategory = await db.update(categories)
      .set({ name })
      .where(eq(categories.id, id))
      .returning()

    return NextResponse.json({ success: true, data: updatedCategory[0] })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }

    await db.delete(categories).where(eq(categories.id, id))

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
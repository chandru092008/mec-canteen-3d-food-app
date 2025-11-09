import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { foodItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let items;
    if (category) {
      items = await db.query.foodItems.findMany({
        where: eq(foodItems.category, category),
      });
    } else {
      items = await db.query.foodItems.findMany();
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

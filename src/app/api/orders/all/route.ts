import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        // This would include user data if relations are set up
      },
    });

    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

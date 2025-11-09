import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, orderItems, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, parseInt(userId)),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const pickupCode = `MEC${Math.floor(100 + Math.random() * 900)}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: data.userId,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'completed',
        orderStatus: 'pending',
        pickupCode,
        items: data.items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Insert order items
    if (data.items && data.items.length > 0) {
      await db.insert(orderItems).values(
        data.items.map((item: any) => ({
          orderId: newOrder.id,
          foodItemId: item.id,
          quantity: item.quantity,
          price: item.price,
          customizations: item.customizations || null,
        }))
      );
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

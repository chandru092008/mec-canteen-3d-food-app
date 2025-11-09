import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const orderId = parseInt(params.id);

    const [updatedOrder] = await db
      .update(orders)
      .set({
        orderStatus: data.orderStatus,
        paymentStatus: data.paymentStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

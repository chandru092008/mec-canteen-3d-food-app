import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
        studentId: data.studentId || null,
        phone: data.phone || null,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

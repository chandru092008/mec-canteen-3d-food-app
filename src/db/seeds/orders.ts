import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleOrders = [
        {
            userId: 1,
            totalAmount: 80,
            paymentMethod: 'UPI',
            paymentStatus: 'completed',
            orderStatus: 'completed',
            pickupCode: 'MEC001',
            items: [
                {
                    foodItemId: 12,
                    name: 'Biriyani',
                    quantity: 1,
                    price: 80
                }
            ],
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            totalAmount: 50,
            paymentMethod: 'Cash',
            paymentStatus: 'completed',
            orderStatus: 'ready',
            pickupCode: 'MEC002',
            items: [
                {
                    foodItemId: 37,
                    name: 'Breakfast Combo',
                    quantity: 1,
                    price: 50
                }
            ],
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            totalAmount: 110,
            paymentMethod: 'Card',
            paymentStatus: 'completed',
            orderStatus: 'preparing',
            pickupCode: 'MEC003',
            items: [
                {
                    foodItemId: 9,
                    name: 'Meals',
                    quantity: 1,
                    price: 60
                },
                {
                    foodItemId: 16,
                    name: 'Samosa',
                    quantity: 2,
                    price: 30
                },
                {
                    foodItemId: 25,
                    name: 'Coffee',
                    quantity: 1,
                    price: 15
                }
            ],
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            totalAmount: 70,
            paymentMethod: 'QR',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            pickupCode: 'MEC004',
            items: [
                {
                    foodItemId: 13,
                    name: 'Fried Rice',
                    quantity: 1,
                    price: 70
                }
            ],
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 1,
            totalAmount: 90,
            paymentMethod: 'Bank Transfer',
            paymentStatus: 'failed',
            orderStatus: 'cancelled',
            pickupCode: 'MEC005',
            items: [
                {
                    foodItemId: 40,
                    name: 'Student Special',
                    quantity: 1,
                    price: 90
                }
            ],
            createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
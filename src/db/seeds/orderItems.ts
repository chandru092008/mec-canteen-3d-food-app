import { db } from '@/db';
import { orderItems } from '@/db/schema';

async function main() {
    const sampleOrderItems = [
        {
            orderId: 1,
            foodItemId: 12,
            quantity: 1,
            price: 80,
            customizations: null,
        },
        {
            orderId: 2,
            foodItemId: 37,
            quantity: 1,
            price: 50,
            customizations: null,
        },
        {
            orderId: 3,
            foodItemId: 9,
            quantity: 1,
            price: 60,
            customizations: { note: 'Extra sambar' },
        },
        {
            orderId: 3,
            foodItemId: 16,
            quantity: 2,
            price: 30,
            customizations: null,
        },
        {
            orderId: 3,
            foodItemId: 25,
            quantity: 1,
            price: 15,
            customizations: { note: 'Less sugar' },
        },
        {
            orderId: 4,
            foodItemId: 13,
            quantity: 1,
            price: 70,
            customizations: { note: 'Extra spicy' },
        },
        {
            orderId: 5,
            foodItemId: 40,
            quantity: 1,
            price: 90,
            customizations: null,
        },
    ];

    await db.insert(orderItems).values(sampleOrderItems);
    
    console.log('✅ Order items seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
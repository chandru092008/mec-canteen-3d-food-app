import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const sampleUsers = [
        {
            email: 'student@mec.edu',
            password: 'student123',
            role: 'student',
            fullName: 'Rajesh Kumar',
            studentId: 'MEC2024001',
            phone: '9876543210',
            walletBalance: 500,
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            email: 'admin@mec.edu',
            password: 'admin123',
            role: 'admin',
            fullName: 'Admin User',
            studentId: null,
            phone: '9988776655',
            walletBalance: 0,
            createdAt: sixtyDaysAgo.toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
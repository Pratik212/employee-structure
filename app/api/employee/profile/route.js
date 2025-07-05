import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET employee's own profile
export async function GET(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            include: {
                department: true,
                location: true,
                manager: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
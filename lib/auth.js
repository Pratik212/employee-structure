import { NextResponse } from 'next/server';
import prisma from '../prisma';

// Example middleware for checking admin role
export async function isAdmin(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return null; // No error, proceed
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Check if user is authenticated (either admin or employee)
export async function isAuthenticated(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return {
            userId: user.id,
            role: user.role,
        }; // Return user info
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Get employee ID from user ID
export async function getEmployeeIdFromUserId(userId) {
    try {
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            select: { id: true }
        });

        return employee ? employee.id : null;
    } catch (error) {
        return null;
    }
}
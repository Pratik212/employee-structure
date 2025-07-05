import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

// GET all employees (admin only)
export async function GET(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const employees = await prisma.employee.findMany({
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
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST to create a new employee (admin only)
export async function POST(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        // Create user account first
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash, // In production, hash this password
                role: data.isAdmin ? 'ADMIN' : 'EMPLOYEE',
            },
        });

        // Then create employee profile
        const employee = await prisma.employee.create({
            data: {
                userId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                position: data.position,
                departmentId: data.departmentId,
                locationId: data.locationId,
                hireDate: new Date(data.hireDate),
                salary: data.salary,
                managerId: data.managerId || null,
            },
            include: {
                department: true,
                location: true,
            },
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
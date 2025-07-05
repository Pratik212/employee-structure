import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

// GET all leave requests (admin only)
export async function GET(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        // Get filter parameters from URL
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const employeeId = searchParams.get('employeeId');

        // Build filter
        const where = {};
        if (status) {
            where.status = status;
        }
        if (employeeId) {
            where.employeeId = parseInt(employeeId);
        }

        const leaves = await prisma.leave.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        return NextResponse.json(leaves);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST to create a new leave request (admin can create on behalf of employees)
export async function POST(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        const leave = await prisma.leave.create({
            data: {
                employeeId: data.employeeId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                leaveType: data.leaveType,
                reason: data.reason || null,
                status: data.status || 'Pending',
                approvedById: data.approvedById || null,
                approvedOn: data.status === 'Approved' ? new Date() : null,
            },
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json(leave, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH to update leave status (approve/reject)
export async function PATCH(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        const leave = await prisma.leave.update({
            where: {
                id: data.id,
            },
            data: {
                status: data.status,
                approvedById: data.approvedById,
                approvedOn: data.status === 'Approved' ? new Date() : null,
            },
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json(leave);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
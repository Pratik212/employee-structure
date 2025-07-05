import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET employee's own leave requests
export async function GET(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // First get the employee id from the user id
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            select: { id: true }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        // Get filter parameters from URL
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Build filter
        const where = {
            employeeId: employee.id
        };

        if (status) {
            where.status = status;
        }

        const leaves = await prisma.leave.findMany({
            where,
            orderBy: {
                startDate: 'desc',
            },
        });

        return NextResponse.json(leaves);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST for employee to request leave
export async function POST(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        // First get the employee id from the user id
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            select: { id: true }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        // Validate required fields
        const { startDate, endDate, reason, type } = data;

        if (!startDate || !endDate || !reason || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: startDate, endDate, reason, and type are required' },
                { status: 400 }
            );
        }

        // Create the leave request with pending status
        const leave = await prisma.leave.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                type,
                status: 'PENDING',
                employee: {
                    connect: {
                        id: employee.id
                    }
                }
            }
        });

        return NextResponse.json(leave, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT to update a leave request
export async function PUT(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: 'Leave ID is required' }, { status: 400 });
        }

        // Get the employee to verify ownership
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            select: { id: true }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        // Check if the leave request belongs to this employee
        const leaveRequest = await prisma.leave.findUnique({
            where: { id: parseInt(id) },
            select: { employeeId: true, status: true }
        });

        if (!leaveRequest) {
            return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
        }

        if (leaveRequest.employeeId !== employee.id) {
            return NextResponse.json({ error: 'Unauthorized to update this leave request' }, { status: 403 });
        }

        // Only allow updates if status is PENDING
        if (leaveRequest.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Cannot update a leave request that has already been approved or rejected' },
                { status: 400 }
            );
        }

        // Process the update
        const updatedLeave = await prisma.leave.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json(updatedLeave);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE to cancel a leave request
export async function DELETE(request) {
    // In a real app, you'd get the user ID from a JWT token or session
    const userId = request.headers.get('user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get leave ID from the URL
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Leave ID is required' }, { status: 400 });
        }

        // Get the employee to verify ownership
        const employee = await prisma.employee.findFirst({
            where: { userId: parseInt(userId) },
            select: { id: true }
        });

        if (!employee) {
            return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
        }

        // Check if the leave request belongs to this employee
        const leaveRequest = await prisma.leave.findUnique({
            where: { id: parseInt(id) },
            select: { employeeId: true, status: true }
        });

        if (!leaveRequest) {
            return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
        }

        if (leaveRequest.employeeId !== employee.id) {
            return NextResponse.json({ error: 'Unauthorized to delete this leave request' }, { status: 403 });
        }

        // Only allow deletion if status is PENDING
        if (leaveRequest.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Cannot delete a leave request that has already been approved or rejected' },
                { status: 400 }
            );
        }

        // Delete the leave request
        await prisma.leave.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET employee's own attendance records
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
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build date filter if provided
        const where = {
            employeeId: employee.id
        };

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const attendances = await prisma.attendance.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(attendances);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST for employee to check in/out
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

        // Get today's date (without time)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if we're checking in or out
        const isCheckIn = data.action === 'checkIn';
        const isCheckOut = data.action === 'checkOut';

        if (!isCheckIn && !isCheckOut) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Check if attendance record exists for today
        let attendance = await prisma.attendance.findUnique({
            where: {
                employeeId_date: {
                    employeeId: employee.id,
                    date: today
                }
            }
        });

        const now = new Date();

        if (attendance) {
            // Update existing record
            attendance = await prisma.attendance.update({
                where: {
                    id: attendance.id
                },
                data: {
                    ...(isCheckIn ? { checkIn: now } : {}),
                    ...(isCheckOut ? { checkOut: now } : {}),
                    status: isCheckIn ? 'Present' : attendance.status
                }
            });
        } else {
            // Create new record
            attendance = await prisma.attendance.create({
                data: {
                    employeeId: employee.id,
                    date: today,
                    checkIn: isCheckIn ? now : null,
                    checkOut: isCheckOut ? now : null,
                    status: isCheckIn ? 'Present' : 'Absent'
                }
            });
        }

        return NextResponse.json(attendance);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

// GET all attendance records (admin only)
export async function GET(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        // Get filter parameters from URL
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const employeeId = searchParams.get('employeeId');

        // Build filter
        const where = {};
        if (date) {
            where.date = new Date(date);
        }
        if (employeeId) {
            where.employeeId = parseInt(employeeId);
        }

        const attendances = await prisma.attendance.findMany({
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
                date: 'desc',
            },
        });

        return NextResponse.json(attendances);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST to create or update attendance (admin only)
export async function POST(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        // Format the date correctly - we only want the date part
        const attendanceDate = new Date(data.date);

        // Use upsert to either create or update
        const attendance = await prisma.attendance.upsert({
            where: {
                employeeId_date: {
                    employeeId: data.employeeId,
                    date: attendanceDate,
                },
            },
            update: {
                checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
                checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
                status: data.status,
                notes: data.notes,
            },
            create: {
                employeeId: data.employeeId,
                date: attendanceDate,
                checkIn: data.checkIn ? new Date(data.checkIn) : null,
                checkOut: data.checkOut ? new Date(data.checkOut) : null,
                status: data.status,
                notes: data.notes,
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

        return NextResponse.json(attendance, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
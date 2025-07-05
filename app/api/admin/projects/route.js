import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

// GET all projects (admin only)
export async function GET(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        // Get filter parameters from URL
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Build filter
        const where = {};
        if (status) {
            where.status = status;
        }

        const projects = await prisma.project.findMany({
            where,
            include: {
                members: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST to create a new project (admin only)
export async function POST(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        // Create the project
        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: data.status || 'Not Started',
            },
        });

        // If team members were provided, add them to the project
        if (data.members && data.members.length > 0) {
            const memberPromises = data.members.map(member =>
                prisma.projectMember.create({
                    data: {
                        projectId: project.id,
                        employeeId: member.employeeId,
                        role: member.role,
                        joinDate: new Date(data.startDate),
                    },
                })
            );

            await Promise.all(memberPromises);
        }

        // Return the created project with its members
        const projectWithMembers = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                members: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(projectWithMembers, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH to update a project (admin only)
export async function PATCH(request) {
    // Check if user is admin
    const authError = await isAdmin(request);
    if (authError) return authError;

    try {
        const data = await request.json();

        const project = await prisma.project.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : null,
                status: data.status,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
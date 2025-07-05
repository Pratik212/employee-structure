// app/api/employees/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch employees with related data
        const employees = await prisma.employee.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                },
                department: true,
                location: true,
                manager: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Create transaction to ensure both user and employee are created
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the user first
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash: data.password, // In production, hash this password
                    role: "EMPLOYEE"
                }
            });

            // 2. Create the employee linked to the user
            const employee = await tx.employee.create({
                data: {
                    userId: user.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    position: data.position,
                    departmentId: parseInt(data.departmentId),
                    locationId: parseInt(data.locationId),
                    managerId: data.managerId ? parseInt(data.managerId) : null,
                    hireDate: new Date(data.hireDate),
                    salary: parseFloat(data.salary),
                    isActive: data.isActive
                },
                include: {
                    user: {
                        select: {
                            email: true,
                            role: true
                        }
                    },
                    department: true,
                    location: true
                }
            });

            return employee;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating employee:", error);
        return NextResponse.json(
            { error: `Failed to create employee: ${error.message}` },
            { status: 400 }
        );
    }
}
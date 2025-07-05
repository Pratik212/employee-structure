// app/api/departments/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const departments = await prisma.department.findMany();
        return NextResponse.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json(
            { error: "Failed to fetch departments" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const department = await prisma.department.create({
            data: {
                name: data.name,
                description: data.description || ""
            }
        });

        return NextResponse.json(department, { status: 201 });
    } catch (error) {
        console.error("Error creating department:", error);
        return NextResponse.json(
            { error: `Failed to create department: ${error.message}` },
            { status: 400 }
        );
    }
}

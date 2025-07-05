// app/api/locations/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const locations = await prisma.location.findMany();
        return NextResponse.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json(
            { error: "Failed to fetch locations" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const location = await prisma.location.create({
            data: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zipCode: data.zipCode
            }
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error("Error creating location:", error);
        return NextResponse.json(
            { error: `Failed to create location: ${error.message}` },
            { status: 400 }
        );
    }
}
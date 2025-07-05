// app/api/comments/route.js
import { NextResponse } from "next/server";
import {users} from "@/app/user";

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request) {
  try {
    const userData = await request.json();

    // Create a new user with the correct properties
    const newUser = {
      id: users.length + 1,
      name: userData.name, // Use the correct property from request
      email: userData.email, // Use the correct property from request
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 400 });
  }
}
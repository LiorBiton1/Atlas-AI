import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    const { username, password, name, email } = await request.json();
    await connectDB();

    // Check if the user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the user
    const user = await User.create({
        username,
        password: hashedPassword,
        name,
        email
    });

    return NextResponse.json({ message: "User registered", user: { id: user._id, username: user.username } });
}
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { username, password, name, email } = await request.json();
        
        // Validate input
        if(!username || !password || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        await connectDB();

        // Check if the user exists
        const existingUser = await User.findOne({ 
            $or: [
                { username },
                { email }
            ]
        });

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

        return NextResponse.json({ message: "User registered successfully", 
            user: { id: user._id.toString(), username: user.username, email: user.email }
        });
    }
    catch(error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
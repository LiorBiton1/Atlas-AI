import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MongoServerError } from "mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { username, password, name, email } = await request.json();
        
        // Validate input
        if(!username || !password || !email || !name) {
            return NextResponse.json({ 
                error: "Missing required fields",
                missing: {
                    username: !username,
                    password: !password,
                    email: !email,
                    name: !name
                }
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                error: "Invalid email format" 
            }, { status: 400 });
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json({ 
                error: "Password must be at least 6 characters long" 
            }, { status: 400 });
        }

        // Validate username length
        if (username.length < 3) {
            return NextResponse.json({ 
                error: "Username must be at least 3 characters long" 
            }, { status: 400 });
        }
        

        await connectDB();

        // Check if user already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return NextResponse.json({
                error: "Username already exists",
                field: "username"
            }, { status: 409 });
        }

        // Check if email already used
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({
                error: "Email already registered",
                field: "email"
            }, { status: 409 });
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
            user: { id: user._id.toString(), username: user.username, email: user.email, name: user.name }
        }, { status: 201 });
    }
    catch(error: unknown) {
        console.error("Registration error:", error);

        // If two people create same user at the same time
        if(error instanceof MongoServerError && error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({
                error: `User with this ${field} already exists`,
                field: field
            }, { status: 409 });
        }

        // Handle other errors
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { isValidEmail, EMAIL_MESSAGE, PASSWORD_MESSAGE, REGISTRATION_MESSAGE, USERNAME_MESSAGE } from "@/utils/auth";
import { registerNewUser } from "@/utils/auth/server/userService";

export async function POST(request: NextRequest) {
    try {
        const { username, password, name, email } = await request.json();
        
        // Validate input
        if(!username || !password || !email || !name) {
            return NextResponse.json({ 
                error: REGISTRATION_MESSAGE.MISSING_FIELDS,
                missing: {
                    username: !username,
                    password: !password,
                    email: !email,
                    name: !name
                }
            }, { status: 400 });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json({ 
                error: EMAIL_MESSAGE.INVALID_FORMAT
            }, { status: 400 });
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json({ 
                error: PASSWORD_MESSAGE.MIN_LENGTH
            }, { status: 400 });
        }

        // Validate username length
        if (username.length < 3) {
            return NextResponse.json({ 
                error: USERNAME_MESSAGE.MIN_LENGTH
            }, { status: 400 });
        }
        
        const result = await registerNewUser({ username, password, name, email });

        if(result.error) {
            return NextResponse.json({
                error: result.error,
                field: result.field
            }, { status: 409 });
        }

        const user = result.user;

        return NextResponse.json({ message: REGISTRATION_MESSAGE.USER_SUCCESS, 
            user: { id: user._id.toString(), username: user.username, email: user.email, name: user.name }
        }, { status: 201 });
    }
    catch(error: unknown) {
        console.error("Registration error:", error);

        // If two people create same user at the same time
        if(error instanceof MongoServerError && error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({ error: `User with this ${field} already exists`, field: field }, { status: 409 });
        }

        // Handle other errors
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
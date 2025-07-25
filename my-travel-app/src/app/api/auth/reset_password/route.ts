import { NextRequest, NextResponse } from "next/server";
import { resetUserPassword } from "@/utils/auth/server";
import { PASSWORD_MESSAGE, RESET_PASSWORD_MESSAGE } from "@/utils/auth/messages";

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();
        
        // Validate input
        if (!token || !password) {
            return NextResponse.json({ error: RESET_PASSWORD_MESSAGE.PASSWORD_AND_TOKEN_REQUIRED }, { status: 400 });
        }

        // Validate password length
        if(password.length < 6) {
            return NextResponse.json({ error: PASSWORD_MESSAGE.MIN_LENGTH }, { status: 400 });
        }

        const result = await resetUserPassword(token, password);

        if(result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ message: result.message }, { status: 200 });
    }
    catch(error: unknown) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
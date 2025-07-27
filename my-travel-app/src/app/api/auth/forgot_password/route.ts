import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, EMAIL_MESSAGE } from "@/utils/auth";
import { initiatePasswordReset } from "@/utils/auth/server/passwordService";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate input
        if(!email) {
            return NextResponse.json({ error: EMAIL_MESSAGE.REQUIRED }, { status: 400 });
        }

        // Validate email format
        if(!isValidEmail(email)) {
            return NextResponse.json({ error: EMAIL_MESSAGE.INVALID_FORMAT }, { status: 400 });
        }

        const result = await initiatePasswordReset(email)

        if(result.error) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ message: result.message }, { status: 200 });
    }
    catch(error: unknown) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

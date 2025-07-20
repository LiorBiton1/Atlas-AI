import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate input
        if(!email) {
            return NextResponse.json({
                error: "Email is required"
            }, { status: 400});
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if(!emailRegex.test(email)) {
            return NextResponse.json({
                error: "Invalid email format"
            }, { status: 400});
        }

        // Connect to the database
        await connectDB();

        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            // Don't reveal if the user doesn't exist (security measure)
            return NextResponse.json({
                 message: "If an account with this email exists, you will receive a password reset link."
            }, { status: 200 });
        }

        // Check if user has a password (not a Google OAuth user)
        if(!user.password) {
            return NextResponse.json({
                error: "This account does not have a password set. Please use Google sign-in."
            }, { status: 400 });
        }

        // Create a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Update the user with reset token
        await User.findByIdAndUpdate(user._id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpiry
        });

        // Send reset email
        await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json({
            message: "If an account with this email exists, you will receive a password reset link.",
        }, { status: 200 });
    }
    catch(error: unknown) {
        console.error("Forgot password error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// Send Email Function
async function sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // To be added: Add more email providers if needed
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD // The apps password
        }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth?reset_token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Atlas AI Password Reset Request",
       html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}
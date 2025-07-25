import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Token and password are required",
        },
        { status: 400 },
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      );
    }

    // Connect to the database
    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is still valid
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
        },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1,
      },
    });

    return NextResponse.json(
      {
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/auth/server/emailService';
import { findUserByEmailOrUsername, findUserByEmail } from './userService';
import { FORGOT_PASSWORD_MESSAGE, RESET_PASSWORD_MESSAGE } from "../messages";

/**
 * Verifies a user's credentials by checking email/username and password.
 * @param email - The user's email address.
 * @param username - The user's username.
 * @param password - The user's password.
 * @returns User info if credentials are valid, otherwise null.
 */
export async function verifyUserCredentials(email: string, username: string, password: string) {
    await connectDB();

    // Find user by username or email
    const user = await findUserByEmailOrUsername(email, username);

    // Check if there is a user and if the user has a password (not a Google OAuth user)
    if(!user || !user.password) {
        // User not found or this is a Google OAuth user trying to sign in with credentials
        return null;
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        // Invalid password
        return null;
    }
    
    // Successful login
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
    };
};

/**
 * Initiates the password reset process for a user.
 * Generates a reset token, updates the user, and sends a reset email.
 * @param email - The user's email address.
 * @returns An object with a message or error.
 */
export async function initiatePasswordReset(email: string) {
    await connectDB();

    // Check if user exists
    const user = await findUserByEmail(email);
    if(!user) {
        // Don't reveal if the user doesn't exist (security measure)
        return { message: FORGOT_PASSWORD_MESSAGE.SUCCESS };
    }
    // Check if user has a password (not a Google OAuth user)
    if(!user.password) {
        return { error: FORGOT_PASSWORD_MESSAGE.NO_PASSWORD };
    }

    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update the user with reset token
    await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
    });

    await sendPasswordResetEmail(email, resetToken);

    return { message: FORGOT_PASSWORD_MESSAGE.SUCCESS };
};

/**
 * Resets a user's password using a reset token.
 * @param token - The password reset token.
 * @param password - The new password.
 * @returns An object with a message or error.
 */
export async function resetUserPassword(token: string, password: string) {
    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() } // Check if token is still valid
    });

    if (!user) {
        return { error: RESET_PASSWORD_MESSAGE.EXPIRED_TOKEN };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        $unset: {
            resetPasswordToken: 1,
            resetPasswordExpires: 1
        }
    });

    return { message: RESET_PASSWORD_MESSAGE.SUCCESS };
};
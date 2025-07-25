import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { FORGOT_PASSWORD_MESSAGE, RESET_PASSWORD_MESSAGE } from "./authMessages";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { EMAIL_MESSAGE, USERNAME_MESSAGE } from "./validationMessages";

/**
 * Finds a user by email or username.
 * @param email - The user's email address.
 * @param username - The user's username.
 * @returns The user document if found, otherwise null.
 */
export async function findUserByEmailOrUsername(email: string, username: string) {
    return User.findOne({
        $or: [
            { email },
            { username }
        ]
    });
};

/**
 * Finds a user by email.
 * @param email - The user's email address.
 * @returns The user document if found, otherwise null.
 */
export async function findUserByEmail(email: string) {
    return User.findOne({ email });
};


/**
 * Finds a user by username.
 * @param username - The user's username.
 * @returns The user document if found, otherwise null.
 */
export async function findUserByUsername(username: string) {
    return User.findOne({ username });
};

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
 * Creates a new user for Google sign-in, or returns the existing user if one exists.
 * Ensures the username is unique.
 * @param params - Object containing email, name, and googleId.
 * @returns The created or existing user document.
 */
export async function createGoogleUser({ email, name, googleId }: { email: string; name: string; googleId: string }) {
    await connectDB();
    
    // Check if the user already exists by email
    const existingUser = await findUserByEmail(email);

    if(existingUser) {
        return existingUser;
    }
    
    // Create a username from email
    const baseUsername = email.split("@")[0] || 'user';
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (await findUserByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
    }

    // Create a new user for Google sign-in
    return User.create({
        username,
        email,
        name,
        googleId,
        // No password for Google users
    });
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

// Send Email Function
export async function sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // To be added: Add more email providers if needed
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD // The apps password
        }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/auth?mode=resetPassword&reset_token=${token}`;

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
};

/**
 * Registers a new user after validating uniqueness and hashing the password.
 * @param username - The desired username.
 * @param password - The plain password.
 * @param name - The user's name.
 * @param email - The user's email.
 * @returns An object with either the new user or an error/field.
 */
export async function registerNewUser({ username, password, name, email }: { username: string, password: string, name: string, email: string }) {
    await connectDB();

    // Check for existing username
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
        return { error: USERNAME_MESSAGE.ALREADY_REGISTERED, field: "username" };
    }

    // Check for existing email
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
        return { error: EMAIL_MESSAGE.ALREADY_REGISTERED, field: "email" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the new user
    const user = await User.create({
        username,
        password: hashedPassword,
        name,
        email
    });

    return { user };
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
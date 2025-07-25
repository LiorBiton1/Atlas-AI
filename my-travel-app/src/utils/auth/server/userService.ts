import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { EMAIL_MESSAGE, USERNAME_MESSAGE } from "../messages/validationMessages";

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
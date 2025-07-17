import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Check if credentials are provided and the password is not empty
                if(!credentials?.password) {
                    return null;
                }

                try {
                    await connectDB();
                
                    // Find user by username or email
                    const user = await User.findOne({ 
                        $or: [
                            { email: credentials.email }, 
                            { username: credentials.username }
                        ] 
                    });

                    if(!user) {
                        // User not found
                        return null;
                    }

                    // Check if user has a password (not a Google OAuth user)
                    if(!user.password) {
                        // This is a Google OAuth user trying to sign in with credentials
                        return null;
                    }

                    // Verify the password
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

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
                }
                catch(error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/auth", // Redirect sign-in errors to auth page
        error: "/auth", // Redirect all errors to auth page
    },
    callbacks: {
        async signIn({ user, account }) {
            if(account?.provider === "google") {
                try {
                    await connectDB();

                    // Check if user already exists
                    const existingUser = await User.findOne({ email: user.email });

                    if(!existingUser) {
                        // Create a username from email
                        const baseUsername = user.email?.split("@")[0] || 'user';
                        let username = baseUsername;
                        let counter = 1;

                        // Ensure username is unique
                        while (await User.findOne({ username })) {
                            username = `${baseUsername}${counter}`;
                            counter++;
                        }

                        // Create a new user for Google sign-in
                        await User.create({
                            username,
                            email: user.email,
                            name: user.name,
                            googleId: account.providerAccountId,
                            // No password for Google users
                        });
                    }
                    return true;
                }
                catch(error) {
                    console.error('Google sign-in error:', error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            if(session.user?.email) {
                await connectDB();
                const dbUser = await User.findOne({ email: session.user.email });
                if(dbUser) {
                    session.user.username = dbUser.username;
                    session.user.id = dbUser._id.toString();
                }
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };
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
                // If no credentials are provided, return null
                if(!credentials) return null;
                await connectDB();
                
                // Find user by username or email
                const user = await User.findOne({ 
                    $or: [
                        { email: credentials.email }, 
                        { username: credentials.username }
                    ] 
                });

                if(user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user._id.toString(), username: user.username, email: user.email, name: user.name };
                }
                // If the credentials are invalid or user not found, return null
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth", // Redirect sign-in errors to auth page
        error: "/auth", // Redirect all errors to auth page
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if(account?.provider === "google") {
                await connectDB();

                // Check if user already exists
                const existingUser = await User.findOne({ email: user.email });

                if(!existingUser) {
                    // Create a username from email
                    let baseUsername = user.email?.split("@")[0] || 'user';
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
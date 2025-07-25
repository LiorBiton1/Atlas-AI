import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import { findUserByEmail, createGoogleUser, verifyUserCredentials } from "@/utils/auth/authServiceServer";

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
                    // verify user credentials
                    return await verifyUserCredentials(credentials.email, credentials.username, credentials.password);
                }
                catch(error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/auth?mode=login", // Redirect sign-in errors to auth page
        error: "/auth", // Redirect all errors to auth page
    },
    callbacks: {
        async signIn({ user, account }) {
            if(account?.provider === "google") {
                try {
                    // Create or find the user in the database
                    await createGoogleUser({
                        email: user.email,
                        name: user.name ?? "Google User", // If the name isn't provided, use a default name
                        googleId: account.providerAccountId,
                    });

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
                const dbUser = await findUserByEmail(session.user.email);
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
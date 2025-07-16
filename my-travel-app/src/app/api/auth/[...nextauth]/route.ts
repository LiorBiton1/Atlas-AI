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
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password", placeholder: "your-password" }
            },
            async authorize(credentials) {
                // If no credentials are provided, return null
                if(!credentials) return null;
                await connectDB();
                const user = await User.findOne({ username: credentials.username });
                if(user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user._id.toString(), name: user.name, email: user.email };
                }
                // If the credentials are invalid
                return null;
            }
        })
    ],
});

export { handler as GET, handler as POST };
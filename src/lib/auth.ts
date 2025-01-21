import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async session({ session }) {
            return session;
        },
        async jwt({ token }) {
            return token;
        },
    },
    providers: []
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
    const session = await getServerSession(authOptions);
    return !!session;
};

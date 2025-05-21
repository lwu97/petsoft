// lib/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

const config = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const validated = authSchema.safeParse(credentials);
                if (!validated.success) return null;

                const { email, password } = validated.data;
                const user = await getUserByEmail(email);
                if (!user) return null;

                const valid = await bcrypt.compare(
                    password,
                    user.hashedPassword
                );
                return valid ? user : null;
            },
        }),
    ],
    callbacks: {
        authorized({ request, auth }) {
            const isLoggedIn = Boolean(auth?.user);
            const isAppPage = request.nextUrl.pathname.startsWith("/app");

            if (!isLoggedIn && isAppPage) return false;
            if (isLoggedIn && isAppPage) return true;
            if (isLoggedIn && !isAppPage) {
                return NextResponse.redirect(
                    new URL("/app/dashboard", request.nextUrl)
                );
            }
            return true;
        },
        jwt({ token, user }) {
            if (user?.id) {
                token.userId = String(user.id);
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.userId) {
                session.user.id = token.userId;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(config);

import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },

  providers: [
    //V347
    Credentials({
      async authorize(credentials) {
        // runs on login (every login attempt)
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user) {
          console.log("No user found");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ], //V347
  callbacks: {
    authorized: ({ request }) => {
      // runs on every request with Middleware
      const isTryingToAccessSlashApp =
        request.nextUrl.pathname.includes("/app");

      if (isTryingToAccessSlashApp) {
        return false;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);

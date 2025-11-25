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
        console.log("email: ", email);

        // const user = await prisma.user.findUnique({
        //   where: { email: email },
        // }); //V365
        const user = await getUserByEmail(email);
        if (!user) {
          console.log("No user found");
          return null;
        } //V365

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
    authorized: ({ auth, request }) => {
      // runs on every request with Middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessSlashApp =
        request.nextUrl.pathname.includes("/app");

      //V350
      // if (isTryingToAccessSlashApp) {
      //   return false;
      // } else {
      //   return true;
      // }
      if (!isLoggedIn && isTryingToAccessSlashApp) {
        return false;
      } //V350

      if (isLoggedIn && isTryingToAccessSlashApp) {
        return true;
      } //V350

      if (isLoggedIn && !isTryingToAccessSlashApp) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      } //V350 //V354

      if (!isLoggedIn && !isTryingToAccessSlashApp) {
        return true; //V354
      }

      return false; //V354
    },
    jwt: ({ token, user }) => {
      if (user) {
        //on sign in
        token.userId = user.id as string;
      }

      return token;
    }, //V357
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    }, //V357
  },
} satisfies NextAuthConfig;

//V353 signOut
export const { auth, signIn, signOut } = NextAuth(config);

import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { EuthForm } from "@/lib/validations";
import { authFormSchema } from "@/lib/validations";
import { sleep } from "./utils";

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
        // runs on login

        // validation
        const validatedFormDataObject = authFormSchema.safeParse(credentials); //V368
        if(!validatedFormDataObject.success) {
          return null //V367 V368
        } //

        const parsed = authFormSchema.safeParse(credentials); //V368
        if (!parsed.success) return null;
        //const { email, password, subscription } = parsed.data;
        // extract values
        //const { email, password, subscription } = validatedFormDataObject.data;
        const { email, password } = validatedFormDataObject.data;

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
        ); //
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        } //

        return user;
      }, //
    }), //
  ], //V347
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with Middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessSlashApp =
        request.nextUrl.pathname.includes("/app"); //

      console.log(
        isLoggedIn,
        isTryingToAccessSlashApp,
        auth?.user.hasAccess,
        request.nextUrl.pathname
      ); // V396

      //V350
      // if (isTryingToAccessSlashApp) {
      //   return false;
      // } else {
      //   return true;
      // }
      if (!isLoggedIn && isTryingToAccessSlashApp) {
        return false;
      } //V350

      if (isLoggedIn && isTryingToAccessSlashApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl)); //V388 
      } //V388    

      if (isLoggedIn && isTryingToAccessSlashApp && auth?.user.hasAccess) {
        return true;
      } //V350 //V388    

      if (isLoggedIn && 
        (request.nextUrl.pathname.includes("/login") || 
          request.nextUrl.pathname.includes("/signup")) && auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl)); // V396
      }

      if (isLoggedIn && !isTryingToAccessSlashApp) {
        if (
          (request.nextUrl.pathname.includes("/login") || 
            request.nextUrl.pathname.includes("/signup")) && 
          !auth?.user.hasAccess) {
          //return Response.redirect(new URL("/app/dashboard", request.nextUrl)); // V381
          return Response.redirect(new URL("/payment", request.nextUrl)); // V381
        } //V381

        return true; //V381
      } //V350 //V354

      if (!isLoggedIn && !isTryingToAccessSlashApp) {
        return true; //V354
      } //

      return false; //V354
    }, //
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        //on sign in
        token.userId = user.id as string;
        token.email = user.email!; // V393
        token.hasAccess = user.hasAccess; // V387
      } //

      if (trigger === "update") {
        //await sleep(1000); //V397
        // on every request
        const userFromDb = await getUserByEmail(token.email); // V393
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess; // V393
        } // V393
      } // V393

      return token;
    }, //V357
    session: ({ session, token }) => {
      //if (session.user) { // V393
        session.user.id = token.userId;
        session.user.hasAccess =  token.hasAccess; // V387
      //} // V393

      return session;
    }, //V357
  }, //
} satisfies NextAuthConfig; //

//V353 signOut
//export const { auth, signIn, signOut } = NextAuth(config); //V366
export const { auth, signIn, signOut, handlers: { POST, GET } } = NextAuth(config); //V366 

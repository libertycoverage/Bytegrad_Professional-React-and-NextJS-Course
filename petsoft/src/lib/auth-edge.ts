import NextAuth, { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./server-utils";
import prisma from "./db"; // V400

export const nextAuthEdgeConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        maxAge: 30 * 24 * 60 * 60,
        strategy: "jwt",
    },
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
            //const userFromDb = await getUserByEmail(token.email); // V393 // V400
            const userFromDb = await prisma.user.findUnique({
              where: { email: token.email },
            }); // V400 // moved from server-utils.ts for the edge here, because we are not using server-only
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
      providers: [],
} satisfies NextAuthConfig;
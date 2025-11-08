import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized: ({ request }) => {
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

export const { auth } = NextAuth(config);

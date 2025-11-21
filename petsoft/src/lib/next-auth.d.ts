import {} from "next-auth";

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
  }
}

declare module "@auth/core/" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
  }
}

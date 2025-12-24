import {} from "next-auth";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
  } // V387
} // V387

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      hasAccess: boolean; //V387
    }; //
  }//
}//

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    hasAccess: boolean;
  } //
} //

import {} from "next-auth";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  } // V387
} // V387

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      //hasAccess: boolean; //V387 //V393
    }; //
  }//
}//

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string; // V393
    hasAccess: boolean;
  } //
} //

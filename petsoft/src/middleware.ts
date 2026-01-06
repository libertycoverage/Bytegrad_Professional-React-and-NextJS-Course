// import { NextResponse } from "next/server";

//import { auth } from "./lib/auth"; // V400
import NextAuth from "next-auth";
import { auth } from "./lib/auth-no-edge"; // V400
import { nextAuthEdgeConfig } from "./lib/auth-edge"; // V400

// export function middleware(request: Request) {
//   console.log(request.url);
//   return NextResponse.next();
// }

//export default auth; // V400
export default NextAuth(nextAuthEdgeConfig).auth; // V400


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; // 

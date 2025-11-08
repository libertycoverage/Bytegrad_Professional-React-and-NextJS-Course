// import { NextResponse } from "next/server";

import { auth } from "./lib/auth";

// export function middleware(request: Request) {
//   console.log(request.url);
//   return NextResponse.next();
// }

export default auth;

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
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return NextResponse.redirect("/login");
  }

  // if the user is not authenticated you redirect them to the login page,
  // otherwise you can let the request continue

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/account"],
};

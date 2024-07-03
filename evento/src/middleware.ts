// V249 begin
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // return NextResponse.next();
  return NextResponse.redirect(new URL("/events/all", request.url));
}

export const config = {
  matcher: ["/events"],
};
// V249 begin

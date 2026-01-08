import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./libs/session";

const AUTH_ROUTES = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  const { pathname } = req.nextUrl;

  // if (!session && PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
  if (!session && !session?.user && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/warehouses", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

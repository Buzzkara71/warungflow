import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/products", "/sales"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/sales/:path*"],
};

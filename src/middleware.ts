import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, ADMIN_COOKIE } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes; let /admin/login and API routes through
  if (
    !pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value ?? "";

  if (!verifyToken(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

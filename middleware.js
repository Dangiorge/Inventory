import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Secret used in NextAuth
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // Allow public routes
  const publicPaths = ["/login", "/register", "/"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the JWT token from NextAuth
  const token = await getToken({ req, secret });

  // If no token, redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Example: restrict dashboard pages based on role
  if (pathname.startsWith("/dashboard")) {
    if (token.role !== "admin") {
      // Redirect non-admins to homepage or error page
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Define which routes the middleware runs on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/some-protected-route/:path*",
    "/profile/:path*",
  ],
};

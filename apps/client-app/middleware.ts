import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  console.log("Middleare ran");
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  let isValidToken = false;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // 🔴 PROTECTED ROUTES (/admin)
  if (pathname.startsWith("/user")) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  // 🟢 AUTH ROUTES (/auth/signin)
  if (pathname.startsWith("/auth")) {
    if (isValidToken) {
        return NextResponse.redirect(new URL("/", req.url));
    
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All images/icons (svg, png, jpg, etc.)
     */
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/user/:path*', 
    '/auth/:path*',
  ],
};

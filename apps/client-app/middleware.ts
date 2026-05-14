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
      const signinUrl = new URL("/auth/signin", req.url);
      signinUrl.searchParams.set(
        "next",
        `${pathname}${req.nextUrl.search}`,
      );
      return NextResponse.redirect(signinUrl);
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
    '/user/:path*', 
  ],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("accessToken")?.value;

//   const { pathname } = req.nextUrl;

//   // protect only admin routes
//   if (pathname.startsWith("/admin")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/auth/signin", req.url));
//     }

//     try {
//       await jwtVerify(token, SECRET);
//       return NextResponse.next();
//     } catch (err) {
//       return NextResponse.redirect(new URL("/auth/signin", req.url));
//     }
//   }

//   return NextResponse.next();
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  let isValidToken = false;
  let role = null;

  // 1️⃣ verify token once
  if (token) {
    try {
      const res = await jwtVerify(token, SECRET);
      role = res.payload.role;
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // 🔴 PROTECTED ROUTES (/admin)
  if (pathname.startsWith("/admin")) {
    if (!isValidToken || role !== "admin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  // 🟢 AUTH ROUTES (/auth/signin)
  if (pathname.startsWith("/auth")) {
    if (pathname === "/auth/signin" && isValidToken && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}  
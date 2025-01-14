import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin_home") && token.title !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/admin_home", "/admin_items", "/about(.*)", "/searchresults(.*)",
    "/home", "/api/add", "/api/getAll", "/api/getAll/users", "/api/users", "/api/auth",
    "/api/delete", "/api/search", "/api/update", "/api/upload", "/api/add/users"],
};

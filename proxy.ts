import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "nfc_ring_session";

async function getSessionEdge(token: string | undefined) {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: "USER" | "ADMIN" };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await getSessionEdge(token);

  if (pathname.startsWith("/dashboard") && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && (!session || session.role !== "ADMIN")) {
    const url = req.nextUrl.clone();
    url.pathname = session ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  if ((pathname === "/login" || pathname === "/register") && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};

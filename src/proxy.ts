import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/src/lib/jwt-edge";
import { UserRole } from "@/src/modules/auth/types";

const JWT_SECRET = process.env.JWT_SECRET || "";

// Map roles to their dashboards
function getDashboardRedirect(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin/dashboard";
    case UserRole.DISTRIBUTOR:
      return "/distributor/dashboard";
    case UserRole.SHOPKEEPER:
    default:
      return "/shopkeeper/dashboard";
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenCookie = request.cookies.get("accessToken");
  const token = tokenCookie?.value;

  // 1. Check if it's an Auth page
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  // 2. Check if it's a role-specific dashboard path
  const isAdminPath = pathname.startsWith("/admin");
  const isDistributorPath = pathname.startsWith("/distributor");
  const isShopkeeperPath = pathname.startsWith("/shopkeeper");
  const isProtectedPath = isAdminPath || isDistributorPath || isShopkeeperPath;

  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyTokenEdge(token, JWT_SECRET);
    if (!payload) {
      // Invalid token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // Role-based authorization check
    if (isAdminPath && payload.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL(getDashboardRedirect(payload.role), request.url));
    }
    if (isDistributorPath && payload.role !== UserRole.DISTRIBUTOR) {
      return NextResponse.redirect(new URL(getDashboardRedirect(payload.role), request.url));
    }
    if (isShopkeeperPath && payload.role !== UserRole.SHOPKEEPER) {
      return NextResponse.redirect(new URL(getDashboardRedirect(payload.role), request.url));
    }
  }

  if (isAuthPage) {
    if (token) {
      const payload = await verifyTokenEdge(token, JWT_SECRET);
      if (payload) {
        return NextResponse.redirect(new URL(getDashboardRedirect(payload.role), request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/distributor/:path*",
    "/shopkeeper/:path*",
    "/login",
    "/register",
  ],
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't need authentication
    const publicRoutes = ["/", "/services", "/contact", "/careers", "/login", "/register", "/faq", "/about", "/testimonials", "/pricing", "/get-started", "/privacy", "/terms", "/service-areas"];
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith("/careers/") || pathname.startsWith("/services/"))) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based access control
    const role = token.role as string;

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!["ADMIN", "SCHEDULER", "BILLING_STAFF", "HR_STAFF"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Client portal routes
    if (pathname.startsWith("/portal/client")) {
      if (!["CLIENT", "FAMILY_MEMBER", "ADMIN"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Employee portal routes
    if (pathname.startsWith("/portal/employee")) {
      if (!["CAREGIVER", "NURSE", "ADMIN", "SCHEDULER"].includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // API routes protection
    if (pathname.startsWith("/api")) {
      // Allow auth routes
      if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
      }

      // Allow public API routes
      if (pathname.startsWith("/api/services") || pathname.startsWith("/api/faq")) {
        return NextResponse.next();
      }

      // Allow webhooks
      if (pathname.startsWith("/api/webhooks")) {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        const publicRoutes = [
          "/",
          "/services",
          "/contact",
          "/careers",
          "/login",
          "/register",
          "/faq",
          "/about",
          "/testimonials",
          "/pricing",
          "/get-started",
          "/privacy",
          "/terms",
          "/service-areas",
        ];

        if (
          publicRoutes.some(
            (route) => pathname === route || pathname.startsWith("/careers/") || pathname.startsWith("/services/")
          )
        ) {
          return true;
        }

        // API routes that should be public
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/services") ||
          pathname.startsWith("/api/faq") ||
          pathname.startsWith("/api/webhooks")
        ) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

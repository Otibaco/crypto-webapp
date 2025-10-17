import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Protect all dashboard pages
  if (pathname.startsWith("/dashboard")) {
    const walletConnected = request.cookies.get("wallet_connected")?.value === "true"

    if (!walletConnected) {
      const url = request.nextUrl.clone()
      url.pathname = "/connect"
      return NextResponse.redirect(url)
    }
  }

  // Allow everything else
  return NextResponse.next()
}

// Apply only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
}

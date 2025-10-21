import { NextResponse } from "next/server"
// Middleware to protect dashboard routes and redirect based on wallet connection status
export function middleware(request) {
  const { pathname } = request.nextUrl

  const walletConnected = request.cookies.get("wallet_connected")?.value === "true"

  // If user is connected and visiting / or /connect, redirect to /dashboard to avoid showing connect UI 
  if (walletConnected && (pathname === '/' || pathname === '/connect')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Protect all dashboard pages: if not connected, send to /connect
  if (pathname.startsWith('/dashboard')) {
    if (!walletConnected) {
      const url = request.nextUrl.clone()
      url.pathname = '/connect'
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

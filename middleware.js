import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only protect dashboard pages
  if (pathname.startsWith("/dashboard")) {
    // Get wagmi's persisted wallet state cookie
    const wagmiCookie = request.cookies.get("wagmi.store")

    // If there's no wagmi.store cookie, user not connected
    if (!wagmiCookie) {
      const url = request.nextUrl.clone()
      url.pathname = "/connect" // redirect home (or /connect if you want)
      return NextResponse.redirect(url)
    }

    // Parse the cookie and check connection
    try {
      const parsed = JSON.parse(decodeURIComponent(wagmiCookie.value))
      const isConnected = parsed?.state?.connections?.length > 0

      if (!isConnected) {
        const url = request.nextUrl.clone()
        url.pathname = "/connect"
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error("Failed to parse wagmi.store cookie:", err)
      const url = request.nextUrl.clone()
      url.pathname = "/connect"
      return NextResponse.redirect(url)
    }
  }

  // Let everything else pass through
  return NextResponse.next()
}

// Tell Next.js to apply this middleware only for dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
}

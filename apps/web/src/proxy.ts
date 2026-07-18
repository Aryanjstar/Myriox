import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

// We don't verify the JWT here (Edge middleware would need the shared HS256 secret to do
// that, and the token is still fully verified by the Plan/Simulation services on every
// request) — this is just a presence check so unauthenticated visitors are redirected to
// sign-in instead of momentarily flashing an empty dashboard.
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("myriox_token")?.value;
  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const urlPath = request.nextUrl.pathname;
  const isPublicPage = urlPath === "/login" || urlPath === "/register";

  // Si no está logueado y trata de entrar a cualquier página protegida
  if (!authToken && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si está logueado y trata de entrar a páginas públicas (login/registro)
  if (authToken && isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

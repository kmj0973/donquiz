import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.has("token");

  // 로그인 + 로그인 페이지
  if (auth && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // 로그인 X + 로그인 페이지 X
  if (!auth && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/myInfo", "/create"],
};

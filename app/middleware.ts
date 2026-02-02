import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPrivate && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

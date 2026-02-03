import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/profile/edit', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export function proxy(req: NextRequest, accessToken?: string) {
  const { pathname } = req.nextUrl;

  const isPrivate = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPrivate && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return NextResponse.next();
}
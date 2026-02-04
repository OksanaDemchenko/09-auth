import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from './lib/api/api';
import { parse } from 'cookie';

const privateRoutes = ['/profile', '/profile/edit', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(req: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = req.nextUrl;

  const isPrivate = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublic = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  
  if (accessToken) {
    if (isPublic) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
    return NextResponse.next();
  }


  if (refreshToken) {
    const apiRes = await api.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed['Max-Age']),
        };

        if (parsed.accessToken) {
          cookieStore.set('accessToken', parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          cookieStore.set('refreshToken', parsed.refreshToken, options);
        }
      }

      if (isPublic) {
        return NextResponse.redirect(new URL('/profile', req.url));
      }

      return NextResponse.next();
    }
  }

 
  if (isPrivate) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

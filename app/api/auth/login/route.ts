// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api'; // твій axios інстанс
import { parse } from 'cookie';
import type { AxiosError } from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Виконуємо запит на бекенд
    const apiRes = await api.post('/auth/login', body);

    // Беремо set-cookie з відповіді бекенду
    const setCookieHeader = apiRes.headers['set-cookie'];
    const response = NextResponse.json(apiRes.data, { status: 200 });

    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        if (parsed.accessToken) {
          response.cookies.set('accessToken', parsed.accessToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }

        if (parsed.refreshToken) {
          response.cookies.set('refreshToken', parsed.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      }
    }

    return response;
  } catch (err) {
    let errorMessage = 'Unknown error';
    let statusCode = 500;

    if ((err as AxiosError).isAxiosError) {
      const axiosError = err as AxiosError<{ error: string }>;
      errorMessage = axiosError.response?.data?.error ?? axiosError.message;
      statusCode = axiosError.response?.status ?? 500;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

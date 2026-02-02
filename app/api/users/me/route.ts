export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api }  from '@/lib/api/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';


export async function GET() {
  try {
    const cookieStore = await cookies(); 
    const cookieHeader = cookieStore
      .getAll()
      .map((c: RequestCookie) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 401 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const cookieStore = await cookies(); 
    const cookieHeader = cookieStore
      .getAll()
      .map((c: RequestCookie) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 401 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

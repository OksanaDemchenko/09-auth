import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { isAxiosError } from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('/auth/login', body);

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: 'accessToken',
      value: apiRes.data.accessToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false, 
    });

    response.cookies.set({
      name: 'refreshToken',
      value: apiRes.data.refreshToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: error.response?.status ?? 401 }
      );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

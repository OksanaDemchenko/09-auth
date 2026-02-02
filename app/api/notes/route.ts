import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { headers } from 'next/headers';
import { isAxiosError } from 'axios';

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie');

    const search = request.nextUrl.searchParams.get('search') ?? '';
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const rawTag = request.nextUrl.searchParams.get('tag') ?? '';
    const tag = rawTag === 'All' ? '' : rawTag;

    const res = await api('/notes', {
      params: {
        ...(search && { search }),
        page,
        perPage: 12,
        ...(tag && { tag }),
      },
      headers: {
        Cookie: cookie ?? '',
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

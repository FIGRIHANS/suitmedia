/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Ambil parameter dengan fallback default
    const pageNumber = searchParams.get('page[number]') ?? searchParams.get('page') ?? '1';
    const pageSize = searchParams.get('page[size]') ?? searchParams.get('size') ?? '10';
    const sort = searchParams.get('sort') ?? '-published_at';

    // Default append fields
    const appendParams = ['small_image', 'medium_image'];

    // Construct query string
    const queryParams = new URLSearchParams({
      'page[number]': pageNumber,
      'page[size]': pageSize,
      sort: sort,
    });

    // Append multiple append[] values
    appendParams.forEach((field) => {
      queryParams.append('append[]', field);
    });

    const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?${queryParams.toString()}`;

    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    // Tangani error dari backend
    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
      } catch {
        errorText = 'Unknown error';
      }
      return new Response(JSON.stringify({ error: errorText }), { status: res.status });
    }

    const data = await res.json();

    // ✅ Gunakan NextResponse.json di sini
    return NextResponse.json(data);

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Internal Server Error' }), {
      status: 500,
    });
  }
}

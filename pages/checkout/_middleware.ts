import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `p=${req.page.name}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}



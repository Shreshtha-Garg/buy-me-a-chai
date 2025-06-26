

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    // Debug: Log the incoming request URL
    // console.log("Incoming request URL:", request.url);

    // Check if there are any cookies in the request
    const token = request.cookies.get('next-auth.session-token')?.value;
    // console.log("Cookies are :");
    // console.log(request.cookies);
    // console.log("Token is :");
    // console.log(token);
    if (!token) {
        console.log("Token not found in cookies");
        return NextResponse.next();
    }

    // console.log("Token found in cookies:", token);

    try {
        const secret = process.env.NEXTAUTH_SECRET;
        // console.log("secret is : ",secret);
        const decoded = await getToken({ req: request, secret });
        // console.log("decoded token is : ",decoded);
        if (decoded) {
            if (['/login', '/signup', '/setprofile'].includes(request.nextUrl.pathname)) {
                console.log("Redirecting to:", `/${decoded.username}`);
                return NextResponse.redirect(new URL(`/${decoded.username}`, request.url));
            }
        }
    } catch (error) {
        console.error('JWT verification failed:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/signup', '/setprofile'],
};


import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    // console.log("Inside middleware fn");

    // Check if there are any cookies in the request
    const token = request.cookies.get('next-auth.session-token')?.value;

    if (!token) {
        console.log("Token not found in cookies");
        return NextResponse.next();
    }

    // console.log("Token found in cookies:", token);

    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const decoded = await getToken({ req: request, secret });

        if (decoded) {
            // console.log("Decoded token:", decoded);

            if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/setprofile') {
                // console.log("Redirecting to username page");
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

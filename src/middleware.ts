import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check for email in the cookies
export function middleware(request: NextRequest) {
    console.log("middleware is running");
  // Get the email from cookies
  const email = request.cookies.get('email');

  // List of paths that do not require authentication
  const publicPaths = ['/login'];

  // If there is no email and the current path is not in the list of public pages
  if (!email && !publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to continue if the email exists or if it's a public page
  return NextResponse.next();
}

// Define matcher to apply middleware only to specific routes
export const config = {
    matcher: ['/dashboard', '/blogs', '/blogs/:id*'], // Match dashboard, blogs, and blog post pages
  };

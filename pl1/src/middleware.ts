import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define front-end routes that require Clerk authentication
const isProtectedFrontendRoute = createRouteMatcher([
  '/dashboard(.*)', // Protected front-end dashboard
  '/profile(.*)',   // User profile pages
  '/protected(.*)', // Any other protected front-end routes
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect front-end routes with Clerk
  // PayloadCMS admin routes (/admin/*) will use their own authentication
  if (isProtectedFrontendRoute(req)) {
    try {
      // For satellite applications, we need to await the auth result
      const authResult = await auth();

      // Check if user is authenticated
      if (!authResult.userId) {
        const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in');
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      // If authentication fails, redirect to sign-in
      const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in');
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}, {
  // Configure as a satellite application
  isSatellite: true,
  domain: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
});

export const config = {
  // Only apply middleware to front-end routes, exclude PayloadCMS admin and webhooks
  matcher: [
    '/((?!admin|api|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};

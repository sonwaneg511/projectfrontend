import { NextResponse } from 'next/server';
import {
  AUTH_ROUTES,
  DYNAMIC_PROTECTED_ROUTES,
  PROTECTED_ROUTES,
} from './constants/constants';

export function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('jwt')?.value;

  const isDynamicRoute = DYNAMIC_PROTECTED_ROUTES.some((route) =>
    route.test(pathname)
  );

  const isProtectedRoute =
    PROTECTED_ROUTES.includes(pathname) || isDynamicRoute;

  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/invalidsession', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/invalidsession',

    '/dashboard',

    '/campaigns',
    '/create-campaign',

    '/reviews',

    '/posts',
    '/posts/:post_id',
    '/create-post',

    '/locations',
    '/locations/:dealer_id',

    '/reports',

    '/settings',

    '/coe/internal-onboarding',
    '/coe/campaigns',
    '/coe/campaign-details/:campaignId',
  ],
};

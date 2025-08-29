// FILE: app/routes/($locale).account_.login.tsx
// ✅ FIXED: Complete login route with proper error handling and redirect logic

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {customerAccount} = context;

  try {
    // Check if already logged in
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (isLoggedIn) {
      // Get redirect destination from URL params
      const url = new URL(request.url);
      const redirectTo = url.searchParams.get('redirect') || '/account';
      return redirect(redirectTo);
    }

    // Get redirect destination and store it in OAuth state
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') || '/account';

    // Initiate the OAuth login flow
    return await customerAccount.login({
      authUrl: new URL('/auth/callback', request.url).href,
      state: redirectTo // Pass redirect destination as state
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // If login fails, redirect to a login page with error
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') || '/account';
    
    // For now, redirect to home with error parameter
    // In the future, you could create a proper login error page
    return redirect(`/?login_error=true&redirect=${encodeURIComponent(redirectTo)}`);
  }
}
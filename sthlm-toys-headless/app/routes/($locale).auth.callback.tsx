// FILE: app/routes/($locale).auth.callback.tsx
// ✅ 2025 STANDARD: OAuth callback handler

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  try {
    const {customerAccount} = context;
    
    // Process the authorization callback
    await customerAccount.authorize(request);
    
    // Get redirect destination from URL params
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('state') || 
                       url.searchParams.get('redirect') || 
                       '/account';
    
    return redirect(redirectTo);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return redirect('/account/login?error=callback_failed');
  }
}
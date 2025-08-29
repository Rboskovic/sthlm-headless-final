// FILE: app/routes/($locale).auth.callback.tsx
// ✅ FIXED: Complete OAuth callback handler with proper state handling

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {customerAccount, session} = context;
  
  try {
    // Process the OAuth authorization callback
    await customerAccount.authorize(request);
    
    // Get redirect destination from state parameter or URL params
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const redirectParam = url.searchParams.get('redirect');
    
    // Determine where to redirect after successful login
    let redirectTo = '/account'; // Default
    
    if (state) {
      redirectTo = state;
    } else if (redirectParam) {
      redirectTo = redirectParam;
    }
    
    // Ensure redirect is internal and safe
    if (redirectTo.startsWith('/')) {
      return redirect(redirectTo, {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }
    
    // Fallback to account page
    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // If callback fails, redirect to login with error
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('state') || 
                      url.searchParams.get('redirect') || 
                      '/account';
    
    return redirect(`/account/login?error=callback_failed&redirect=${encodeURIComponent(redirectTo)}`, {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }
}
// FILE: app/routes/($locale).account_.logout.tsx
// ✅ FIXED: Enhanced logout with proper redirect

import {redirect, type ActionFunctionArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// Redirect anyone who visits /account/logout directly
export async function loader() {
  return redirect('/');
}

export async function action({context}: ActionFunctionArgs) {
  try {
    // Call Shopify's logout
    const logoutResponse = await context.customerAccount.logout();
    
    // If logout returns a response, use it (might include redirect)
    if (logoutResponse) {
      return logoutResponse;
    }
    
    // Otherwise, manually redirect to home
    return redirect('/', {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
  } catch (error) {
    // If logout fails for any reason, still redirect home
    console.error('Logout error:', error);
    return redirect('/');
  }
}
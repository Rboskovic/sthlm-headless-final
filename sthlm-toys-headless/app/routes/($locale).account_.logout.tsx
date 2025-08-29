// FILE: app/routes/($locale).account_.logout.tsx
// ✅ FIXED: Complete logout route with proper session handling

import {redirect, type ActionFunctionArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// Handle GET requests - redirect anyone who visits /account/logout directly
export async function loader() {
  return redirect('/', {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

// Handle POST requests - actual logout action
export async function action({context}: ActionFunctionArgs) {
  const {customerAccount, session} = context;
  
  try {
    // Call Shopify's logout method
    const logoutResponse = await customerAccount.logout();
    
    // Clear any local session data
    session.unset('customerId');
    session.unset('customerAccessToken');
    
    // If logout returns a response (redirect), use it
    if (logoutResponse instanceof Response) {
      return logoutResponse;
    }
    
    // Otherwise, redirect to home with cleared session
    return redirect('/', {
      headers: {
        'Set-Cookie': await session.commit(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if logout fails, clear session and redirect
    try {
      session.unset('customerId');
      session.unset('customerAccessToken');
      
      return redirect('/', {
        headers: {
          'Set-Cookie': await session.commit(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch (sessionError) {
      console.error('Session cleanup error:', sessionError);
      return redirect('/');
    }
  }
}
// FILE: app/routes/($locale).account_.logout.tsx
// ✅ SHOPIFY NATIVE: Redirect to home (Shopify handles logout)

import {redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  // Just redirect to home - Shopify will handle logout through their system
  return redirect('/');
}

export async function action({context}: ActionFunctionArgs) {
  // Also handle POST requests by redirecting to home
  return redirect('/');
}
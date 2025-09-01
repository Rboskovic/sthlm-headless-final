// FILE: app/routes/($locale).account.tsx
// ✅ SHOPIFY NATIVE: Simple redirect to Shopify's account system
// ✅ NO CUSTOM LOGIC: Let Shopify handle everything

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

// Your shop ID for Shopify account URLs
const SHOP_ID = '90088112507';

export async function loader({context}: LoaderFunctionArgs) {
  // Redirect directly to Shopify's native account page
  return redirect(`https://shopify.com/${SHOP_ID}/account`);
}
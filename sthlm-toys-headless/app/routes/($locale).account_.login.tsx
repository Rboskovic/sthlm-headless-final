// FILE: app/routes/($locale).account_.login.tsx
// ✅ SHOPIFY NATIVE: Redirect to Shopify's login page

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

const SHOP_ID = '90088112507';

export async function loader({context}: LoaderFunctionArgs) {
  return redirect(`https://shopify.com/${SHOP_ID}/account/login`);
}
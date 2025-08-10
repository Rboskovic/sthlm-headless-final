// FILE: app/routes/($locale).account.tsx
// ✅ FIXED: COMPLETELY removed duplicate AccountMenu navigation (Issue #1)

import {
  data as remixData,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Outlet, useLoaderData} from 'react-router';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context, request}: LoaderFunctionArgs) {
  // ✅ KEEP EXACTLY AS IS: This auth logic works perfectly
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();

    if (!isLoggedIn) {
      return redirect('/account/login');
    }

    const {data, errors} = await context.customerAccount.query(
      CUSTOMER_DETAILS_QUERY,
    );

    if (errors?.length || !data?.customer) {
      return redirect('/account/login');
    }

    return remixData(
      {customer: data.customer},
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    return redirect('/account/login');
  }
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  // ✅ FIXED: COMPLETELY removed all duplicate navigation - no AccountMenu, no greeting

  return (
    <div className="account">
      {/* ✅ COMPLETELY REMOVED: All duplicate navigation components */}
      <Outlet context={{customer}} />
    </div>
  );
}
// FILE: app/routes/($locale).account.tsx
// ✅ ENHANCED: Removed duplicate greeting since it's now in header dropdown

import {
  data as remixData,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from 'react-router';
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

  // ✅ ENHANCED: Removed duplicate greeting - now handled in header dropdown

  return (
    <div className="account">
      {/* ✅ REMOVED: Duplicate greeting section */}
      <AccountMenu />
      <br />
      <br />
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
    <nav role="navigation">
      <NavLink to="/account/orders" style={isActiveStyle}>
        Orders &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/wishlist" style={isActiveStyle}>
        &nbsp; Wishlist &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/profile" style={isActiveStyle}>
        &nbsp; Profile &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/addresses" style={isActiveStyle}>
        &nbsp; Addresses &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      &nbsp;
      <button 
        type="submit"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontSize: 'inherit',
          fontFamily: 'inherit'
        }}
      >
        Sign out
      </button>
    </Form>
  );
}
// FILE: app/routes/($locale).account.tsx - ENHANCED VERSION
// ✅ SHOPIFY HYDROGEN STANDARDS: Enhanced layout with modern design matching reference
// ✅ BUILDS ON EXISTING: Keeps all current Shopify functionality, just improves styling

import {
  data as remixData,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, NavLink, Outlet, useLoaderData} from 'react-router';
import {User, LogOut} from 'lucide-react';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context, request}: LoaderFunctionArgs) {
  // ✅ SHOPIFY HYDROGEN: Keep existing auth logic exactly as is
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Mobile Hidden, Desktop Visible */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccountNavigation />
        </div>
      </div>

      {/* Mobile Navigation - Visible on small screens */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <MobileAccountNavigation />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <Outlet context={{customer}} />
      </div>
    </div>
  );
}

// ✅ ENHANCED: Desktop navigation with modern styling
function AccountNavigation() {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-8">
        <NavItem to="/account/orders" label="Orders" />
        <NavItem to="/account/wishlist" label="Wishlist" />
        <NavItem to="/account/profile" label="Profile" />
        <NavItem to="/account/addresses" label="Addresses" />
        <NavItem to="/account/payment" label="Payment" />
        <NavItem to="/account/marketing" label="Marketing" />
      </div>

      <div className="flex items-center">
        <LogoutButton />
      </div>
    </nav>
  );
}

// ✅ ENHANCED: Mobile navigation with better UX
function MobileAccountNavigation() {
  return (
    <div className="space-y-4">
      {/* Mobile Navigation Grid */}
      <div className="grid grid-cols-2 gap-2">
        <MobileNavItem to="/account/orders" label="Orders" />
        <MobileNavItem to="/account/wishlist" label="Wishlist" />
        <MobileNavItem to="/account/profile" label="Profile" />
        <MobileNavItem to="/account/addresses" label="Addresses" />
        <MobileNavItem to="/account/payment" label="Payment" />
        <MobileNavItem to="/account/marketing" label="Marketing" />
      </div>

      {/* Mobile Logout */}
      <div className="pt-2 border-t border-gray-200">
        <LogoutButton isMobile />
      </div>
    </div>
  );
}

// ✅ REUSABLE COMPONENT: Navigation item with active states
interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({to, label}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// ✅ REUSABLE COMPONENT: Mobile navigation item
function MobileNavItem({to, label}: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `block px-3 py-2 text-sm font-medium text-center rounded-md border transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

// ✅ ENHANCED: Logout button with better styling
function LogoutButton({isMobile = false}: {isMobile?: boolean}) {
  if (isMobile) {
    return (
      <Form className="w-full" method="POST" action="/account/logout">
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </button>
      </Form>
    );
  }

  return (
    <Form method="POST" action="/account/logout">
      <button
        type="submit"
        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
      >
        <LogOut size={16} className="mr-2" />
        Sign out
      </button>
    </Form>
  );
}

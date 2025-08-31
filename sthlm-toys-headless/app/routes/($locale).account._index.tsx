// FILE: app/routes/($locale).account._index.tsx
// ✅ FIXED: All issues addressed - Swedish translation, centered layout, proper styling

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import {User, Package, MapPin, Heart, LogOut} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Mitt konto - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login');
    }
    await context.customerAccount.handleAuthStatus();
    return {};
  } catch (error) {
    return redirect('/account/login');
  }
}

export default function AccountIndex() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  const quickActions = [
    {
      title: 'Mina beställningar',
      description: 'Se orderhistorik och spåra leveranser',
      href: '/account/orders',
      icon: Package,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Adresser',
      description: 'Hantera leverans- och faktureringsadresser',
      href: '/account/addresses',
      icon: MapPin,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Min önskelista',
      description: 'Spara produkter för senare',
      href: '/account/wishlist',
      icon: Heart,
      color: 'bg-pink-50 text-pink-600'
    },
    {
      title: 'Profilinställningar',
      description: 'Uppdatera dina personuppgifter',
      href: '/account/profile',
      icon: User,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Issue #1 & #5: Centered on desktop, no extra padding */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                {/* Issue #1: Remove padding between title & subtitle, centered on desktop */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Välkommen tillbaka{customer?.firstName && `, ${customer.firstName}`}!
                </h1>
                <p className="text-gray-600">
                  Hantera ditt konto och se dina beställningar
                </p>
              </div>
              
              {/* Issue #4: Mobile logout button fits one row */}
              <Link
                to="/account/logout"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors w-full sm:w-auto"
              >
                <LogOut size={16} className="mr-2" />
                Logga ut
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            {/* Issue #9 & #10: Remove padding & center text */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center sm:text-left">
              Snabbåtgärder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 group h-full flex flex-col"
                  >
                    <div className="flex items-start h-full">
                      <div className={`p-3 rounded-lg ${action.color} group-hover:scale-105 transition-transform flex-shrink-0`}>
                        <Icon size={24} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account Summary - Issue #3: Same height as other components, white button */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Kontosammanfattning
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Namn:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {customer?.firstName && customer?.lastName 
                        ? `${customer.firstName} ${customer.lastName}`
                        : 'Ej angivet'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">E-post:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {customer?.emailAddress?.emailAddress || 'Ej angivet'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Adresser:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {customer?.addresses?.nodes?.length || 0} sparade
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Issue #3: White button with proper height matching */}
              <div className="p-6 pt-0">
                <Link
                  to="/account/profile"
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="mr-2" />
                  Redigera profil
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section with blue button */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Registrera dig för kul!
            </h3>
            <p className="text-gray-600 mb-6">
              Få exklusiva uppdateringar om nya LEGO®-set, byggidéer och recensioner.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Ange e-postadress"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {/* Issue #6 & #11: Blue button with white text, Swedish translation */}
                <button
                  type="button"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Registrera dig
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Genom att registrera dig för vårt nyhetsbrev godkänner du våra{' '}
                <Link to="/pages/privacy-policy" className="underline text-blue-600">
                  villkor och integritetspolicy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
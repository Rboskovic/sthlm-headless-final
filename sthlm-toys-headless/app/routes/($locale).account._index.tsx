// FILE: app/routes/($locale).account._index.tsx
// ✅ NEW: Complete Account Dashboard with proper navigation

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import {User, Package, MapPin, CreditCard, Heart, Settings, LogOut} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'My Account - STHLM Toys & Games'}];
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
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Välkommen tillbaka{customer?.firstName && `, ${customer.firstName}`}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Hantera ditt konto och se dina beställningar
                </p>
              </div>
              
              <Link
                to="/account/logout"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Snabbåtgärder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 group"
                  >
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg ${action.color} group-hover:scale-105 transition-transform`}>
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

          {/* Account Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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
                  <span className="text-sm text-gray-500">Adresser:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {customer?.addresses?.nodes?.length || 0} sparade
                  </span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/account/profile"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Settings size={16} className="mr-2" />
                    Redigera profil
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Senaste aktivitet
              </h3>
              
              <div className="text-sm text-gray-500 text-center py-8">
                <Package size={32} className="mx-auto mb-2 opacity-50" />
                Inga senaste beställningar
              </div>
              
              <Link
                to="/collections"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Börja handla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
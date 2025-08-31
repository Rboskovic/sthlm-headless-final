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
      {/* Header - NO PADDING, CENTERED */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div style={{ textAlign: 'center', flex: '1' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  margin: '0',
                  padding: '0'
                }}>
                  Välkommen tillbaka{customer?.firstName && `, ${customer.firstName}`}!
                </h1>
                <p style={{ 
                  color: '#6b7280',
                  margin: '0',
                  padding: '0'
                }}>
                  Hantera ditt konto och se dina beställningar
                </p>
              </div>
              
              {/* Logout button - FIXED sizing */}
              <Link
                to="/account/logout"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  color: '#ffffff',
                  backgroundColor: '#dc2626',
                  textDecoration: 'none'
                }}
              >
                <LogOut size={16} style={{ marginRight: '8px' }} />
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
              
              <div className="p-6 pt-0">
                <Link
                  to="/account/profile"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    color: '#374151',
                    backgroundColor: '#ffffff',
                    textDecoration: 'none'
                  }}
                >
                  <User size={16} style={{ marginRight: '8px' }} />
                  Redigera profil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
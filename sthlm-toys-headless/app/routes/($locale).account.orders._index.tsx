// FILE: app/routes/($locale).account.orders._index.tsx
// ✅ FIXED: Swedish translation, centered text, proper styling for empty state

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import {Package, ShoppingBag} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Orderhistorik - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login?redirect=/account/orders');
    }
    await context.customerAccount.handleAuthStatus();
    return {};
  } catch (error) {
    return redirect('/account/login?redirect=/account/orders');
  }
}

export default function OrdersPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  // Date formatting for Swedish locale
  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return 'Okänt datum';
    try {
      return new Date(dateString).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Okänt datum';
    }
  };

  // Money formatting for Swedish locale
  const formatMoney = (amount?: string, currency?: string) => {
    if (!amount) return 'N/A';
    try {
      const numAmount = parseFloat(amount);
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currency || 'SEK'
      }).format(numAmount);
    } catch (error) {
      return `${amount} ${currency || 'SEK'}`;
    }
  };

  // Get orders from customer data
  const orders = customer?.orders?.edges || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Issues #3: Centered on desktop, no padding between title/subtitle */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center lg:text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Orderhistorik
              </h1>
              <p className="text-gray-600">
                Spåra dina beställningar och se orderdetaljer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          // Issue #6 & #10: Centered empty state with Swedish text and blue CTA button
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Du har inte gjort några beställningar ännu.
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Utforska vårt sortiment och lägg till produkter du vill spara för senare!
            </p>
            {/* Issue #11: Blue button with white text */}
            <Link
              to="/collections/all"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag size={20} className="mr-2" />
              Börja shoppa →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(({node: order}) => (
              <div 
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.fulfillmentStatus === 'FULFILLED' 
                          ? 'bg-green-100 text-green-800' 
                          : order.fulfillmentStatus === 'PARTIAL'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.fulfillmentStatus === 'FULFILLED' && 'Levererad'}
                        {order.fulfillmentStatus === 'PARTIAL' && 'Delvis levererad'}
                        {order.fulfillmentStatus === 'PENDING' && 'Väntar på leverans'}
                        {!order.fulfillmentStatus && 'Behandlas'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                      <span>Beställd: {formatOrderDate(order.processedAt)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Totalt: {formatMoney(order.totalPrice?.amount, order.totalPrice?.currencyCode)}</span>
                      {order.lineItems?.edges?.length && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{order.lineItems.edges.length} artikel{order.lineItems.edges.length !== 1 ? 'ar' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/account/orders/${encodeURIComponent(order.id)}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Visa detaljer
                    </Link>
                    
                    {/* Reorder button if order is fulfilled */}
                    {order.fulfillmentStatus === 'FULFILLED' && (
                      <button
                        type="button"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm"
                        onClick={() => {
                          // This would need to be implemented to add items back to cart
                          alert('Beställ igen-funktionen kommer snart!');
                        }}
                      >
                        Beställ igen
                      </button>
                    )}
                  </div>
                </div>

                {/* Order items preview */}
                {order.lineItems?.edges && order.lineItems.edges.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {order.lineItems.edges.slice(0, 3).map(({node: lineItem}) => (
                        <div 
                          key={lineItem.id}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {lineItem.variant?.product?.title}
                          {lineItem.quantity > 1 && ` (${lineItem.quantity})`}
                        </div>
                      ))}
                      {order.lineItems.edges.length > 3 && (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          +{order.lineItems.edges.length - 3} fler
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
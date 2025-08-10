// FILE: app/routes/($locale).account.orders._index.tsx
// ✅ FIXED: Orders page with proper date formatting and error handling

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Order History'}];
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

export default function OrdersPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  // ✅ FIXED: Proper date formatting for orders
  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  // ✅ FIXED: Proper money formatting
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
    <div style={{ padding: '20px' }}>
      <h2>Order History</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Track your orders and view order details
      </p>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div style={{ marginTop: '20px' }}>
          {orders.map(({node: order}) => (
            <div 
              key={order.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                    Order #{order.number}
                  </h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    {formatOrderDate(order.processedAt)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
                    {formatMoney(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                    Status: {order.financialStatus || 'Unknown'}
                  </p>
                </div>
              </div>
              
              {/* Fulfillment Status */}
              {order.fulfillments?.nodes?.[0] && (
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
                  Fulfillment: {order.fulfillments.nodes[0].status}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '30px'
      }}>
        📦
      </div>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        You haven't placed any orders yet.
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>
        Start shopping to see your order history here.
      </p>
      <Link 
        to="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        Start Shopping →
      </Link>
    </div>
  );
}
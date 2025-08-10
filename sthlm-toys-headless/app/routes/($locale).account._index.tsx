// FILE: app/routes/($locale).account._index.tsx
// ✅ FIXED: Invalid date display + proper contact info + better layout

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'My Account'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  // Auth is handled by parent layout
  return {};
}

export default function AccountDashboard() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  // ✅ FIXED: Proper date formatting with fallback
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Account</h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Account Details Card */}
        <AccountCard
          title="Account details"
          description="Change your name, log-in details, and contact information."
          href="/account/profile"
          details={[
            `Name: ${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Not set',
            `Email: ${customer?.emailAddress?.emailAddress || 'Not set'}`,
            `Phone: ${customer?.phoneNumber?.phoneNumber || 'Not set'}`,
          ]}
        />

        {/* Order History Card */}
        <AccountCard
          title="Order history"
          description="You'll find your order history here after your first purchase with us. Happy shopping!"
          href="/account/orders"
        />

        {/* My Addresses Card */}
        <AccountCard
          title="My addresses"
          description="Please add an address for faster future orders."
          href="/account/addresses"
        />

        {/* Wishlist Card */}
        <AccountCard
          title="My wishlist"
          description="Save your favorite items for later."
          href="/account/wishlist"
        />
      </div>

      {/* ✅ FIXED: Account Information with Proper Date */}
      <div style={{
        marginTop: '30px',
        backgroundColor: '#e7f3ff',
        padding: '20px',
        border: '1px solid #b3d9ff',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#0066cc', marginBottom: '15px' }}>Account Information</h3>
        <div style={{ color: '#0066cc' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Account Status:</strong> Active
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Member Since:</strong> {formatMemberSince(customer?.createdAt)}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Customer ID:</strong> {customer?.id?.split('/').pop() || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AccountCardProps {
  title: string;
  description: string;
  href: string;
  details?: string[];
}

function AccountCard({ title, description, href, details }: AccountCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          color: '#333',
          fontSize: '18px'
        }}>
          {title}
        </h3>
        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#666',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      </div>

      {/* Details Section */}
      {details && (
        <div style={{ marginBottom: '15px' }}>
          {details.map((detail, index) => (
            <p key={index} style={{ 
              margin: '5px 0', 
              fontSize: '13px', 
              color: '#555'
            }}>
              {detail}
            </p>
          ))}
        </div>
      )}

      {/* Action Link */}
      <div style={{ marginTop: 'auto' }}>
        <Link 
          to={href}
          style={{
            display: 'inline-block',
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '8px 16px',
            border: '1px solid #007bff',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#007bff';
          }}
        >
          Manage →
        </Link>
      </div>
    </div>
  );
}
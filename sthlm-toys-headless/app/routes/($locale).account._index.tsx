// FILE: app/routes/($locale).account._index.tsx
// ✅ RESTORED: Basic account dashboard using standard customer fields

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import {User, Package, MapPin, Heart, ChevronRight} from 'lucide-react';
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

  return (
    <div 
      style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* ✅ FIXED: Centered "My Account" heading */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '28px', 
          fontWeight: 'bold',
          color: '#111827'
        }}>
          My Account
        </h1>
        <p style={{ 
          margin: '0', 
          color: '#6b7280',
          fontSize: '16px'
        }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* ✅ ENHANCED: Account grid layout */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px'
        }}
      >
        {/* Account Details Card */}
        <AccountCard
          icon={<User size={24} className="text-blue-600" />}
          title="Account details"
          description="Change your name and manage your marketing preferences."
          href="/account/profile"
          details={[
            `Name: ${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Not set',
          ].filter(Boolean)}
        />

        {/* Order History Card */}
        <AccountCard
          icon={<Package size={24} className="text-blue-600" />}
          title="Order history"
          description="You'll find your order history here after your first purchase with us. Happy shopping!"
          href="/account/orders"
        />

        {/* My Addresses Card */}
        <AccountCard
          icon={<MapPin size={24} className="text-blue-600" />}
          title="My addresses"
          description={
            customer?.addresses?.nodes?.length > 0 
              ? "Manage your delivery addresses for faster checkout."
              : "Please add an address for faster future orders."
          }
          href="/account/addresses"
          details={
            customer?.addresses?.nodes?.length > 0 
              ? [
                  `Addresses: ${customer.addresses.nodes.length}`,
                  customer?.defaultAddress 
                    ? `Default: ${customer.defaultAddress.city}${customer.defaultAddress.zoneCode ? `, ${customer.defaultAddress.zoneCode}` : ''}`
                    : 'No default address set'
                ].filter(Boolean)
              : []
          }
        />

        {/* ✅ ENHANCED: Wishlist Card */}
        <AccountCard
          icon={<Heart size={24} className="text-blue-600" />}
          title="My wishlist"
          description="Save your favorite items for later."
          href="/account/wishlist"
        />
      </div>
    </div>
  );
}

interface AccountCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  details?: string[];
}

function AccountCard({ icon, title, description, href, details }: AccountCardProps) {
  return (
    <Link
      to={href}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
      className="hover:shadow-md hover:border-blue-300"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            {title}
          </h3>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
      
      <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
        {description}
      </p>
      
      {details && details.length > 0 && (
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
          {details.map((detail, index) => (
            <div key={index} style={{ 
              fontSize: '13px', 
              color: '#4b5563', 
              marginBottom: '4px',
              padding: '2px 0'
            }}>
              {detail}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
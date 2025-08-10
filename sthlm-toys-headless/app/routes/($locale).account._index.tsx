// FILE: app/routes/($locale).account._index.tsx
// ✅ ENHANCED: Smyths-style layout + removed duplicate sections + added wishlist

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
      {/* ✅ ENHANCED: Added "My Account" heading (Issue #3) */}
      <div style={{ marginBottom: '30px' }}>
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

      {/* ✅ ENHANCED: Smyths-style card grid layout */}
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
          icon={<Package size={24} className="text-blue-600" />}
          title="Order history"
          description="You'll find your order history here after your first purchase with us. Happy shopping!"
          href="/account/orders"
        />

        {/* My Addresses Card */}
        <AccountCard
          icon={<MapPin size={24} className="text-blue-600" />}
          title="My addresses"
          description="Please add an address for faster future orders."
          href="/account/addresses"
        />

        {/* ✅ ENHANCED: Wishlist Card (replaces payment details) */}
        <AccountCard
          icon={<Heart size={24} className="text-blue-600" />}
          title="My wishlist"
          description="Save your favorite items for later."
          href="/account/wishlist"
        />
      </div>

      {/* ✅ REMOVED: Duplicate navigation section */}
      {/* ✅ REMOVED: Blue account information section */}
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
        display: 'block',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        minHeight: '200px',
      }}
      className="account-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Card Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon}
          <h3 
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              lineHeight: '1.4'
            }}
          >
            {title}
          </h3>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      {/* Card Description */}
      <p 
        style={{
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.5',
          margin: '0 0 16px 0'
        }}
      >
        {description}
      </p>

      {/* Card Details (if provided) */}
      {details && details.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {details.map((detail, index) => (
            <div
              key={index}
              style={{
                fontSize: '13px',
                color: '#374151',
                marginBottom: '6px',
                padding: '4px 0',
                borderBottom: index < details.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
            >
              {detail}
            </div>
          ))}
        </div>
      )}

      {/* Card Action Footer */}
      <div 
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6'
        }}
      >
        <span 
          style={{
            fontSize: '14px',
            color: '#3b82f6',
            fontWeight: '500'
          }}
        >
          Manage →
        </span>
      </div>
    </Link>
  );
}
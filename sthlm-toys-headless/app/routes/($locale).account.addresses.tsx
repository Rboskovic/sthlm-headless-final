// FILE: app/routes/($locale).account.addresses.tsx
// ✅ FIXED: Proper default address, empty state, and address display

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useOutletContext, type MetaFunction, Link} from 'react-router';
import {MapPin, Plus, Edit, Trash2, Star} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'My Addresses'}];
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

export default function AddressesPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  // ✅ FIXED: Get actual addresses and default from customer data
  const addresses = customer?.addresses?.nodes || [];
  const defaultAddressId = customer?.defaultAddress?.id;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>My Addresses</h2>
          <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        <Link
          to="/account/addresses/add"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          <Plus size={16} />
          Add Address
        </Link>
      </div>

      {/* ✅ IMPROVED: Empty state or addresses display */}
      {addresses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#f3f4f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <MapPin size={32} style={{ color: '#9ca3af' }} />
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '18px', fontWeight: '600' }}>
            You haven't added any addresses yet
          </h3>
          <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
            Add your delivery addresses to make checkout faster and easier.<br />
            Your first address will automatically become your default.
          </p>
          <Link
            to="/account/addresses/add"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus size={16} />
            Add Your First Address
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '20px'
        }}>
          {addresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              isDefault={address.id === defaultAddressId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AddressCardProps {
  address: {
    id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    zoneCode?: string;
    zip?: string;
    phoneNumber?: string;
  };
  isDefault: boolean;
}

function AddressCard({ address, isDefault }: AddressCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: isDefault ? '2px solid #007bff' : '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      transition: 'all 0.2s ease',
      boxShadow: isDefault ? '0 4px 12px rgba(0, 123, 255, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* ✅ ENHANCED: Default badge */}
      {isDefault && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <Star size={12} />
          Default
        </div>
      )}

      <div style={{ marginBottom: '12px', paddingRight: isDefault ? '70px' : '0' }}>
        <h4 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#111827'
        }}>
          {address.firstName} {address.lastName}
        </h4>
        {address.company && (
          <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
            {address.company}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 2px 0', fontSize: '14px', color: '#374151' }}>
          {address.address1}
        </p>
        {address.address2 && (
          <p style={{ margin: '0 0 2px 0', fontSize: '14px', color: '#374151' }}>
            {address.address2}
          </p>
        )}
        <p style={{ margin: '0', fontSize: '14px', color: '#374151' }}>
          {address.city}{address.zoneCode ? `, ${address.zoneCode}` : ''} {address.zip}
        </p>
        {address.phoneNumber && (
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📞 {address.phoneNumber}
          </p>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '8px',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '16px'
      }}>
        <Link
          to={`/account/addresses/${address.id}/edit`}
          style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            color: '#374151',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        >
          <Edit size={14} />
          Edit
        </Link>
        
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #fecaca',
            backgroundColor: 'transparent',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          onClick={() => {
            if (confirm('Are you sure you want to delete this address?')) {
              // TODO: Implement delete functionality
              console.log('Delete address:', address.id);
            }
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
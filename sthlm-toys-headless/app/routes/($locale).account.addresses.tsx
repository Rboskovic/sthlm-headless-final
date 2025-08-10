// FILE: app/routes/($locale).account.addresses.tsx
// ✅ FIXED: Proper revalidation, mobile styling, and data refresh

import {redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useOutletContext, type MetaFunction, Link, Form, useActionData, useNavigation} from 'react-router';
import {MapPin, Plus, Edit, Trash2, Star} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {DELETE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';
import {data} from '@shopify/remix-oxygen';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'My Addresses'}];
};

// ✅ ADDED: Force revalidation when data changes
export function shouldRevalidate() {
  return true;
}

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

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'DELETE') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const formData = await request.formData();
  const addressId = formData.get('addressId') as string;

  if (!addressId) {
    return data({error: 'Address ID is required'}, {status: 400});
  }

  try {
    const {data: mutationData, errors} = await customerAccount.mutate(
      DELETE_ADDRESS_MUTATION,
      {
        variables: { addressId },
      }
    );

    if (errors?.length) {
      return data({
        error: errors[0].message,
        success: false,
      });
    }

    if (mutationData?.customerAddressDelete?.userErrors?.length) {
      return data({
        error: mutationData.customerAddressDelete.userErrors[0].message,
        success: false,
      });
    }

    if (mutationData?.customerAddressDelete?.deletedAddressId) {
      // ✅ FIXED: Redirect to trigger data refresh instead of returning data
      return redirect('/account/addresses?deleted=true');
    }

    return data({
      error: 'Failed to delete address',
      success: false,
    });

  } catch (error: any) {
    return data({
      error: error.message || 'An unexpected error occurred',
      success: false,
    });
  }
}

export default function AddressesPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();

  // ✅ FIXED: Filter out empty addresses and get valid addresses
  const allAddresses = customer?.addresses?.nodes || [];
  const validAddresses = allAddresses.filter(address => 
    address && address.id && (address.address1 || address.city)
  );
  const defaultAddressId = customer?.defaultAddress?.id;

  // ✅ ADDED: Check for success params from URL
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const showDeleteSuccess = urlParams?.get('deleted') === 'true';
  const showAddSuccess = urlParams?.get('added') === 'true';
  const showUpdateSuccess = urlParams?.get('updated') === 'true';

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Success Messages */}
      {showDeleteSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          Address deleted successfully
        </div>
      )}

      {showAddSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          Address added successfully
        </div>
      )}

      {showUpdateSuccess && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          Address updated successfully
        </div>
      )}

      {actionData?.success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          {actionData.message}
        </div>
      )}
      
      {actionData?.error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {actionData.error}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>My Addresses</h2>
          <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        
        {/* ✅ IMPROVED: Better mobile button styling */}
        <Link
          to="/account/addresses/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            width: '100%',
            maxWidth: '200px',
            alignSelf: 'flex-end'
          }}
          className="add-address-btn"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          <Plus size={16} />
          Add Address
        </Link>
      </div>

      {/* ✅ FIXED: Show only valid addresses or empty state */}
      {validAddresses.length === 0 ? (
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
          
          {/* ✅ IMPROVED: Better mobile button for empty state */}
          <Link
            to="/account/addresses/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '200px',
              boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)'
            }}
          >
            <Plus size={18} />
            Add Your First Address
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '20px'
        }}>
          {validAddresses.map((address) => (
            <AddressCard 
              key={address.id} 
              address={address} 
              isDefault={address.id === defaultAddressId}
            />
          ))}
        </div>
      )}

      {/* ✅ ADDED: Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .add-address-btn {
            width: 100% !important;
            max-width: none !important;
            align-self: stretch !important;
          }
        }
      `}</style>
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
  const navigation = useNavigation();
  const isDeleting = navigation.state === 'submitting' && navigation.formData?.get('addressId') === address.id;

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
          to={`/account/addresses/edit/${address.id}`}
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
        
        <Form method="delete" style={{ display: 'contents' }}>
          <input type="hidden" name="addressId" value={address.id} />
          <button
            type="submit"
            disabled={isDeleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #fecaca',
              backgroundColor: 'transparent',
              color: isDeleting ? '#9ca3af' : '#dc2626',
              fontSize: '13px',
              fontWeight: '500',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = '#fef2f2';
                e.currentTarget.style.borderColor = '#f87171';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#fecaca';
              }
            }}
            onClick={(e) => {
              if (!isDeleting && !confirm('Are you sure you want to delete this address?')) {
                e.preventDefault();
              }
            }}
          >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </Form>
      </div>
    </div>
  );
}
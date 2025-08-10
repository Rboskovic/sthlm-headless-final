// FILE: app/routes/($locale).account.addresses.tsx
// ✅ FIXED: Better address UI, no duplicates, proper empty state

import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useOutletContext, type MetaFunction} from 'react-router';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {useState} from 'react';

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
  const [showForm, setShowForm] = useState(false);

  // Get addresses from customer data
  const addresses = customer?.addresses?.nodes || [];
  const defaultAddress = customer?.defaultAddress;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>My Addresses</h2>
          <p style={{ margin: '0', color: '#666' }}>
            Manage your delivery addresses
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0' }}>Add New Address</h3>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>
          
          <AddressForm onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Existing Addresses */}
      {addresses.length === 0 && !showForm ? (
        <EmptyAddresses onAddAddress={() => setShowForm(true)} />
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '15px' 
        }}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={defaultAddress?.id === address.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ onCancel }: { onCancel: () => void }) {
  return (
    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
      {/* First Row - Names */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Address Line 1 - Full Width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Address *
        </label>
        <input
          type="text"
          name="address1"
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* City, Postal Code */}
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          City *
        </label>
        <input
          type="text"
          name="city"
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Postal Code *
        </label>
        <input
          type="text"
          name="zip"
          required
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Country - Full Width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Country *
        </label>
        <select
          name="country"
          required
          defaultValue="SE"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="SE">Sweden</option>
          <option value="NO">Norway</option>
          <option value="DK">Denmark</option>
          <option value="FI">Finland</option>
        </select>
      </div>

      {/* Actions - Full Width */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ccc',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressCard({ address, isDefault }: { address: any; isDefault: boolean }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: isDefault ? '2px solid #007bff' : '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px'
    }}>
      {isDefault && (
        <div style={{
          backgroundColor: '#e7f3ff',
          color: '#0066cc',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '10px',
          display: 'inline-block'
        }}>
          Default Address
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>{address.firstName} {address.lastName}</strong>
        {address.company && <div style={{ color: '#666' }}>{address.company}</div>}
      </div>
      
      <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
        <div>{address.address1}</div>
        {address.address2 && <div>{address.address2}</div>}
        <div>{address.city}, {address.zip}</div>
        <div>{address.territoryCode}</div>
        {address.phoneNumber && <div>{address.phoneNumber}</div>}
      </div>
    </div>
  );
}

function EmptyAddresses({ onAddAddress }: { onAddAddress: () => void }) {
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
        📍
      </div>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        No addresses saved
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>
        Add an address to make checkout faster
      </p>
      <button
        onClick={onAddAddress}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Add Your First Address
      </button>
    </div>
  );
}
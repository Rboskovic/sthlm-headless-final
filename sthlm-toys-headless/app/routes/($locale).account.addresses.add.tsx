// FILE: app/routes/($locale).account.addresses.add.tsx
// ✅ NEW: Add address route

import {redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  type MetaFunction,
  Link,
} from 'react-router';
import {data} from '@shopify/remix-oxygen';
import {CREATE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';
import {ArrowLeft} from 'lucide-react';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Add Address'}];
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

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const formData = await request.formData();

  try {
    const address = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: formData.get('company') as string || '',
      address1: formData.get('address1') as string,
      address2: formData.get('address2') as string || '',
      city: formData.get('city') as string,
      zoneCode: formData.get('zoneCode') as string,
      zip: formData.get('zip') as string,
      phoneNumber: formData.get('phoneNumber') as string || '',
      territoryCode: formData.get('territoryCode') as string || 'SE', // Default to Sweden
    };

    const defaultAddress = formData.get('defaultAddress') === 'on';

    const {data: mutationData, errors} = await customerAccount.mutate(
      CREATE_ADDRESS_MUTATION,
      {
        variables: {
          address,
          defaultAddress,
        },
      }
    );

    if (errors?.length) {
      return data({
        error: errors[0].message,
        success: false,
      });
    }

    if (mutationData?.customerAddressCreate?.userErrors?.length) {
      return data({
        error: mutationData.customerAddressCreate.userErrors[0].message,
        success: false,
      });
    }

    if (mutationData?.customerAddressCreate?.customerAddress) {
      return redirect('/account/addresses');
    }

    return data({
      error: 'Failed to create address',
      success: false,
    });

  } catch (error: any) {
    return data({
      error: error.message || 'An unexpected error occurred',
      success: false,
    });
  }
}

export default function AddAddressPage() {
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Back button */}
      <Link
        to="/account/addresses"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#007bff',
          textDecoration: 'none',
          marginBottom: '20px',
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} />
        Back to Addresses
      </Link>

      <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: 'bold' }}>
        Add New Address
      </h2>

      {/* Error message */}
      {actionData?.error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {actionData.error}
        </div>
      )}

      <Form method="post">
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '12px'
        }}>
          {/* Name fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Company */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Address fields */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Address *
            </label>
            <input
              type="text"
              name="address1"
              placeholder="Street address"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            />
            <input
              type="text"
              name="address2"
              placeholder="Apartment, suite, etc. (optional)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* City, Province, Postal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Province/State
              </label>
              <input
                type="text"
                name="zoneCode"
                placeholder="e.g., Stockholm"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Postal Code *
              </label>
              <input
                type="text"
                name="zip"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phoneNumber"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Default address checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="defaultAddress"
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>
                Set as default address
              </span>
            </label>
          </div>

          {/* Submit button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link
              to="/account/addresses"
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: isSubmitting ? '#9ca3af' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
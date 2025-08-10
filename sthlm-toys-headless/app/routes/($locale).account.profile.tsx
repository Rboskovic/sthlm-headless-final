// FILE: app/routes/($locale).account.profile.tsx
// ✅ SIMPLIFIED: Using only available Customer Account API fields

import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {CUSTOMER_PROFILE_QUERY} from '~/graphql/customer-account/CustomerProfileQuery';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  type MetaFunction,
} from 'react-router';

// Simplified customer type for profile page
export type CustomerProfileData = {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: {
    emailAddress?: string;
  };
  phoneNumber?: {
    phoneNumber?: string;
  };
};

export type ActionResponse = {
  error: string | null;
  customer: CustomerProfileData | null;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile Settings'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();
  
  // Fetch enhanced customer data for profile page
  try {
    const {data: customerData, errors} = await context.customerAccount.query(
      CUSTOMER_PROFILE_QUERY,
    );

    if (errors?.length || !customerData?.customer) {
      // Fallback to basic customer data if enhanced query fails
      return {customer: null};
    }

    return {customer: customerData.customer};
  } catch (error) {
    // Fallback to basic customer data if enhanced query fails
    return {customer: null};
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    // ✅ KEEP EXACTLY: Name update logic (working perfectly)
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;

    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) continue;
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    const {data: mutationData, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      { variables: { customer } }
    );

    if (errors?.length) {
      return data({ 
        error: errors[0].message, 
        customer: null, 
        success: false
      });
    }

    if (!mutationData?.customerUpdate?.customer) {
      return data({
        error: 'Profile update failed.',
        customer: null,
        success: false
      });
    }

    return data({
      error: null,
      customer: mutationData.customerUpdate.customer,
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error: any) {
    return data({
      error: error.message || 'An unexpected error occurred',
      customer: null,
      success: false,
    });
  }
}

export default function AccountProfile() {
  const {customer: profileCustomer} = useLoaderData<typeof loader>();
  const {state} = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const customer = actionData?.customer ?? profileCustomer;
  const isSubmitting = state === 'submitting';

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Profile Settings</h2>

      {/* ✅ Success/Error Messages */}
      {actionData?.success && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '12px 16px',
          borderRadius: '4px',
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
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {actionData.error}
        </div>
      )}

      {/* ✅ KEEP EXACTLY: Personal Information Section (working perfectly) */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Personal Information</h3>
        <Form method="put">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={customer?.firstName || ''}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                defaultValue={customer?.lastName || ''}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isSubmitting ? 'Saving...' : 'Update Profile'}
          </button>
        </Form>
      </div>

      {/* ✅ NEW: Contact Information Display (Read-only) */}
      {(customer?.emailAddress?.emailAddress || customer?.phoneNumber?.phoneNumber) && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Contact Information</h3>
          
          {customer?.emailAddress?.emailAddress && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email Address
              </label>
              <div style={{
                padding: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                color: '#495057'
              }}>
                {customer.emailAddress.emailAddress}
              </div>
              <small style={{ color: '#6c757d' }}>
                Email updates are managed through your Shopify account settings
              </small>
            </div>
          )}

          {customer?.phoneNumber?.phoneNumber && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone Number
              </label>
              <div style={{
                padding: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                color: '#495057'
              }}>
                {customer.phoneNumber.phoneNumber}
              </div>
              <small style={{ color: '#6c757d' }}>
                Phone updates are managed through your Shopify account settings
              </small>
            </div>
          )}
        </div>
      )}

      {/* ✅ INFORMATIONAL: Marketing Preferences Note */}
      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '20px',
        border: '1px solid #b3d9ff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#004085' }}>Marketing Preferences</h3>
        <p style={{ margin: '0', color: '#004085', fontSize: '14px', lineHeight: '1.5' }}>
          Email marketing preferences are managed through your Shopify account settings 
          or by using the unsubscribe links in our emails. For any marketing preference 
          changes, please contact our customer support.
        </p>
      </div>
    </div>
  );
}
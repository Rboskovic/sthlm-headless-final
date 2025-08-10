// FILE: app/routes/($locale).account.profile.tsx
// ✅ FIXED: Correct implementation using only existing customerUpdate mutation

import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from 'react-router';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    
    // ✅ FIXED: Only update fields that are supported by customerUpdate
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
        error: 'Customer profile update failed.',
        customer: null,
        success: false,
      });
    }

    return data({
      error: null,
      customer: mutationData.customerUpdate.customer,
      success: true,
      message: 'Profile updated successfully',
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
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const actionData = useActionData<ActionResponse>();
  const customer = actionData?.customer ?? account?.customer;
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

      {/* ✅ FIXED: Name Update Form */}
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

      {/* ✅ FIXED: Contact Information - Read-only for now */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Contact Information</h3>
        
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
            {customer?.emailAddress?.emailAddress || 'No email address on file'}
          </div>
          <small style={{ color: '#6c757d' }}>
            Email updates are managed through your Shopify account settings
          </small>
        </div>

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
            {customer?.phoneNumber?.phoneNumber || 'No phone number on file'}
          </div>
          <small style={{ color: '#6c757d' }}>
            Phone updates are managed through your Shopify account settings
          </small>
        </div>
      </div>
    </div>
  );
}
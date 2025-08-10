// FILE: app/routes/($locale).account.profile.tsx
// ✅ FIXED: Profile save error + proper success handling + correct contact info display

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
    const validInputKeys = ['firstName', 'lastName'] as const;

    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    const {data: mutationData, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      return data({
        error: errors[0].message,
        customer: null,
        success: false,
      });
    }

    if (!mutationData?.customerUpdate?.customer) {
      return data({
        error: 'Customer profile update failed.',
        customer: null,
        success: false,
      });
    }

    // ✅ FIXED: Return proper success response without redirect
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

  // ✅ FIXED: Format date properly with fallback
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Profile</h2>
      
      {/* ✅ FIXED: Better success message display */}
      {actionData?.success && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          ✅ {actionData.message}
        </div>
      )}

      {/* ✅ FIXED: Better error message display */}
      {actionData?.error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ❌ {actionData.error}
        </div>
      )}

      {/* Personal Information Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Personal Information</h3>
        
        <Form method="PUT" style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={customer?.firstName ?? ''}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={customer?.lastName ?? ''}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </Form>
      </div>

      {/* ✅ FIXED: Contact Information - Customer Data Only */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Contact Information</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email
          </label>
          <div style={{
            padding: '8px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            color: '#6c757d'
          }}>
            {customer?.emailAddress?.emailAddress || 'No email address on file'}
          </div>
          <small style={{ color: '#6c757d' }}>
            Email address is managed through your Shopify account
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Phone
          </label>
          <div style={{
            padding: '8px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            color: '#6c757d'
          }}>
            {customer?.phoneNumber?.phoneNumber || 'No phone number on file'}
          </div>
          <small style={{ color: '#6c757d' }}>
            Phone number is managed through your Shopify account
          </small>
        </div>
      </div>

      {/* ✅ FIXED: Account Information with Proper Date */}
      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '20px',
        border: '1px solid #b3d9ff',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#0066cc' }}>Account Information</h3>
        <div style={{ color: '#0066cc' }}>
          <p><strong>Account Status:</strong> Active</p>
          <p><strong>Member Since:</strong> {formatMemberSince(customer?.createdAt)}</p>
          <p><strong>Customer ID:</strong> {customer?.id?.split('/').pop() || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
}
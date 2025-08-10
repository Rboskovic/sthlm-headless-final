// FILE: app/routes/($locale).account.profile.tsx
// ✅ ENHANCED: Added marketing preferences + customer since + removed email/phone fields + separate profile query

import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {CUSTOMER_MARKETING_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerMarketingUpdateMutation';
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

// Enhanced customer type for profile page
export type CustomerProfileData = {
  id: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  acceptsMarketing?: boolean;
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
  actionType?: 'profile' | 'marketing';
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
  const actionType = form.get('actionType') as string;

  try {
    if (actionType === 'profile') {
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
          success: false,
          actionType: 'profile'
        });
      }

      if (!mutationData?.customerUpdate?.customer) {
        return data({
          error: 'Profile update failed.',
          customer: null,
          success: false,
          actionType: 'profile'
        });
      }

      return data({
        error: null,
        customer: mutationData.customerUpdate.customer,
        success: true,
        message: 'Profile updated successfully',
        actionType: 'profile'
      });

    } else if (actionType === 'marketing') {
      // ✅ NEW: Marketing preferences update
      const acceptsMarketing = form.get('acceptsMarketing') === 'on';
      
      const customer: CustomerUpdateInput = {
        acceptsMarketing
      };

      const {data: mutationData, errors} = await customerAccount.mutate(
        CUSTOMER_MARKETING_UPDATE_MUTATION,
        { variables: { customer } }
      );

      if (errors?.length) {
        return data({ 
          error: errors[0].message, 
          customer: null, 
          success: false,
          actionType: 'marketing'
        });
      }

      if (!mutationData?.customerUpdate?.customer) {
        return data({
          error: 'Marketing preferences update failed.',
          customer: null,
          success: false,
          actionType: 'marketing'
        });
      }

      return data({
        error: null,
        customer: mutationData.customerUpdate.customer,
        success: true,
        message: 'Marketing preferences updated successfully',
        actionType: 'marketing'
      });
    }

    return data({
      error: 'Invalid action type',
      customer: null,
      success: false,
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

  // Format customer since date
  const formatCustomerSince = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long'
      });
    } catch {
      return null;
    }
  };

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

      {/* ✅ NEW: Customer Since Information */}
      {customer?.createdAt && formatCustomerSince(customer.createdAt) && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Account Information</h3>
          <div style={{
            padding: '12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>Customer since:</span>
            <span style={{ color: '#495057' }}>
              {formatCustomerSince(customer.createdAt)}
            </span>
          </div>
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
          <input type="hidden" name="actionType" value="profile" />
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
            disabled={isSubmitting && actionData?.actionType === 'profile'}
            style={{
              backgroundColor: isSubmitting && actionData?.actionType === 'profile' ? '#ccc' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting && actionData?.actionType === 'profile' ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isSubmitting && actionData?.actionType === 'profile' ? 'Saving...' : 'Update Profile'}
          </button>
        </Form>
      </div>

      {/* ✅ NEW: Marketing Preferences Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Marketing Preferences</h3>
        <Form method="put">
          <input type="hidden" name="actionType" value="marketing" />
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              borderRadius: '4px'
            }}>
              <input
                type="checkbox"
                name="acceptsMarketing"
                defaultChecked={customer?.acceptsMarketing || false}
                style={{
                  marginRight: '12px',
                  width: '16px',
                  height: '16px'
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  Email Marketing
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                  Receive special offers, promotions, and new product information by email
                </div>
              </div>
            </label>
            <small style={{ color: '#6c757d', display: 'block', marginTop: '8px' }}>
              You can unsubscribe at any time by clicking the unsubscribe link in our emails
            </small>
          </div>

          <button
            type="submit"
            disabled={isSubmitting && actionData?.actionType === 'marketing'}
            style={{
              backgroundColor: isSubmitting && actionData?.actionType === 'marketing' ? '#ccc' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting && actionData?.actionType === 'marketing' ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isSubmitting && actionData?.actionType === 'marketing' ? 'Saving...' : 'Update Preferences'}
          </button>
        </Form>
      </div>

      {/* ✅ REMOVED: Contact Information section (email/phone) as requested */}
    </div>
  );
}
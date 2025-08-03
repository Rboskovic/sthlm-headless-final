// FILE: app/routes/($locale).account.profile.tsx - ENHANCED VERSION
// ✅ SHOPIFY HYDROGEN STANDARDS: Enhanced profile with email/phone matching reference design
// ✅ BUILDS ON EXISTING: Keeps all Shopify functionality, adds modern styling and more fields

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
import {User, Check, AlertCircle} from 'lucide-react';

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
  // ✅ SHOPIFY HYDROGEN: Keep existing auth handling
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

    // ✅ SHOPIFY HYDROGEN: Keep existing mutation logic
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;
  const isSubmitting = state === 'submitting';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Account Details
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Change your name, log-in details, and contact information.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {action?.success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {action.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {action?.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {action.error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <Form method="PUT" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter your first name"
                      defaultValue={customer.firstName ?? ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter your last name"
                      defaultValue={customer.lastName ?? ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            </div>
          </div>

          {/* Contact Information Card - Read Only */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Email - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                    {customer.emailAddress?.emailAddress ||
                      'No email address on file'}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Email address is managed through your Shopify account
                  </p>
                </div>

                {/* Phone - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600">
                    {customer.phoneNumber?.phoneNumber ||
                      'No phone number on file'}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Phone number is managed through your Shopify account
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-blue-900 mb-2">
              Account Information
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Account Status:</strong> Active
              </p>
              <p>
                <strong>Member Since:</strong>{' '}
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Customer ID:</strong> {customer.id.split('/').pop()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

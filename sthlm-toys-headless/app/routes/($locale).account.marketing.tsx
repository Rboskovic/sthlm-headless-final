// FILE: app/routes/($locale).account.marketing.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Marketing preferences for customer account

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
import {Mail, Check, Info} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
  preferences?: {
    newToys: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
};

export const meta: MetaFunction = () => {
  return [{title: 'Marketing Preferences'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  // ✅ SHOPIFY HYDROGEN: Auth is handled by parent layout
  await context.customerAccount.handleAuthStatus();
  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  // ✅ SHOPIFY HYDROGEN: Ensure customer is logged in
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return data({error: 'Unauthorized'}, {status: 401});
  }

  const formData = await request.formData();

  // Extract preferences from form data
  const preferences = {
    newToys: formData.get('newToys') === 'on',
    promotions: formData.get('promotions') === 'on',
    newsletter: formData.get('newsletter') === 'on',
  };

  try {
    // ✅ SHOPIFY HYDROGEN: In real implementation, this would update customer metafields
    // For now, we'll simulate saving preferences
    // await customerAccount.mutate(UPDATE_MARKETING_PREFERENCES_MUTATION, {
    //   variables: { preferences }
    // });

    return data({
      success: true,
      message: 'Marketing preferences updated successfully',
      preferences,
    });
  } catch (error: any) {
    return data(
      {error: error.message || 'Failed to update preferences'},
      {status: 400},
    );
  }
}

export default function MarketingPreferences() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Mock current preferences - in real implementation this would come from customer metafields
  const currentPreferences = actionData?.preferences || {
    newToys: true,
    promotions: true,
    newsletter: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Marketing Preferences
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your email subscription preferences and communication
              settings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Feedback */}
        {actionData?.success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {actionData.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {actionData?.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {actionData.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">
                Email Preferences
              </h2>
            </div>

            <Form method="POST" className="space-y-6">
              {/* Current Email Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">
                  Email Address
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {customer.emailAddress?.emailAddress ||
                    'No email address on file'}
                </p>
              </div>

              {/* Email Types */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">
                    What would you like to hear about?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Receive special offers, promotions and new product
                    information by email. Please select your preferences below.
                  </p>

                  <div className="space-y-4">
                    {/* New Toys */}
                    <PreferenceCheckbox
                      name="newToys"
                      label="New Toys"
                      description="Be the first to know about new toy arrivals and latest releases"
                      defaultChecked={currentPreferences.newToys}
                    />

                    {/* Promotions */}
                    <PreferenceCheckbox
                      name="promotions"
                      label="Promotions"
                      description="Get exclusive deals, discounts, and special offers"
                      defaultChecked={currentPreferences.promotions}
                    />

                    {/* Newsletter */}
                    <PreferenceCheckbox
                      name="newsletter"
                      label="Newsletter"
                      description="Monthly newsletter with toy guides, tips, and featured products"
                      defaultChecked={currentPreferences.newsletter}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </Form>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Privacy & Unsubscribe
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  We respect your privacy and will never share your email
                  address with third parties. You can unsubscribe from any email
                  category at any time by clicking the unsubscribe link in our
                  emails or by updating your preferences here.
                </p>
                <p className="mt-2">
                  For more information, please read our{' '}
                  <a
                    href="/privacy-policy"
                    className="underline hover:text-blue-800"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ REUSABLE COMPONENT: Preference checkbox with description
interface PreferenceCheckboxProps {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

function PreferenceCheckbox({
  name,
  label,
  description,
  defaultChecked,
}: PreferenceCheckboxProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={name} className="font-medium text-gray-900">
          {label}
        </label>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

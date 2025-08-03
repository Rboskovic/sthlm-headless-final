// FILE: app/routes/($locale).account.payment.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Payment management for customer account

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
import {CreditCard, Plus, Trash2, Check} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Payment Details'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  // ✅ SHOPIFY HYDROGEN: Auth is handled by parent layout
  // For now, we'll handle payment methods as a placeholder
  // In full implementation, this would query Shopify's payment methods API
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
  const action = formData.get('action') as string;

  // For demo purposes - in real implementation this would integrate with Shopify Payments
  switch (action) {
    case 'add_payment':
      return data({
        success: true,
        message: 'Payment method added successfully',
      });
    case 'remove_payment':
      return data({
        success: true,
        message: 'Payment method removed successfully',
      });
    default:
      return data({error: 'Invalid action'}, {status: 400});
  }
}

export default function PaymentDetails() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Mock payment methods - in real implementation this would come from Shopify
  const savedPaymentMethods = [
    {
      id: '1',
      type: 'visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Payment Details
            </h1>
            <p className="mt-2 text-gray-600">
              Add payment options for faster checkouts.
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

        {/* Saved Payment Methods */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Saved Payment Methods
            </h2>

            {savedPaymentMethods.length > 0 ? (
              <div className="space-y-4">
                {savedPaymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No payment methods saved
                </h3>
                <p className="mt-2 text-gray-600">
                  Add a payment method to speed up future checkouts.
                </p>
              </div>
            )}
          </div>

          {/* Add New Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Payment Method
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Payment methods are securely managed
                    through Shopify Payments during checkout. This demo shows
                    the interface structure.
                  </p>
                </div>
              </div>
            </div>

            <Form method="POST" className="space-y-4">
              <input type="hidden" name="action" value="add_payment" />

              {/* Mock Add Payment Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-3 border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Adding...' : 'Add Payment Method'}
              </button>
            </Form>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Security & Privacy
            </h3>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and securely stored by
              Shopify Payments. We never store your full credit card details on
              our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ REUSABLE COMPONENT: Payment method card
interface PaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

function PaymentMethodCard({
  method,
  isSubmitting,
}: {
  method: PaymentMethod;
  isSubmitting: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-base font-medium text-gray-900">
                •••• •••• •••• {method.lastFour}
              </p>
              {method.isDefault && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Expires {method.expiryMonth}/{method.expiryYear}
            </p>
          </div>
        </div>

        <Form method="POST" className="inline">
          <input type="hidden" name="action" value="remove_payment" />
          <input type="hidden" name="paymentMethodId" value={method.id} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50 disabled:opacity-50"
            aria-label="Remove payment method"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Form>
      </div>
    </div>
  );
}

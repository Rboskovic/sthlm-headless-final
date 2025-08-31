// FILE: app/routes/($locale).account.profile.tsx
// ✅ FIXED: Swedish translation, proper marketing preferences handling, better UX

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
  Link,
} from 'react-router';
import {ArrowLeft, User, Mail, Info} from 'lucide-react';

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
  return [{title: 'Profilinställningar - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();
  
  try {
    const {data: customerData, errors} = await context.customerAccount.query(
      CUSTOMER_PROFILE_QUERY,
    );

    if (errors?.length || !customerData?.customer) {
      return {customer: null};
    }

    return {customer: customerData.customer};
  } catch (error) {
    return {customer: null};
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Metod inte tillåten'}, {status: 405});
  }

  const form = await request.formData();

  try {
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
        error: 'Profiluppdatering misslyckades.',
        customer: null,
        success: false
      });
    }

    return data({
      error: null,
      customer: mutationData.customerUpdate.customer,
      success: true,
      message: 'Din profil har uppdaterats framgångsrikt!'
    });

  } catch (error: any) {
    return data({
      error: error.message || 'Ett oväntat fel uppstod',
      customer: null,
      success: false
    });
  }
}

export default function ProfilePage() {
  const {customer} = useLoaderData<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Issues #3: Centered on desktop, no padding between title/subtitle */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="text-center lg:text-center flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Profilinställningar
                </h1>
                <p className="text-gray-600">
                  Uppdatera din personliga information
                </p>
              </div>
              
              <Link
                to="/account"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Tillbaka till mitt konto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Messages */}
        {actionData?.success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            {actionData.message}
          </div>
        )}
        
        {actionData?.error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {actionData.error}
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Personlig information</h2>
            </div>

            <Form method="put" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Förnamn
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={customer?.firstName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Efternamn
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={customer?.lastName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Uppdaterar...' : 'Uppdatera profil'}
                </button>
              </div>
            </Form>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mail size={20} className="text-green-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900">Kontaktinformation</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-postadress
                </label>
                <input
                  type="email"
                  value={customer?.emailAddress?.emailAddress || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E-postuppdateringar hanteras via dina Shopify-kontoinställningar
                </p>
              </div>
            </div>
          </div>

          {/* Marketing Preferences Section */}
          <div className="bg-blue-50 rounded-lg shadow-sm p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <Info size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Marknadsföringsinställningar</h2>
                <p className="text-sm text-blue-800 mb-4">
                  E-postmarknadsföringsinställningar hanteras via dina Shopify-kontoinställningar eller genom att använda avregistreringslänkarna i våra e-postmeddelanden. För ändringar av marknadsföringspreferenser, kontakta vår kundtjänst.
                </p>
                
                <div className="flex gap-3">
                  <Link
                    to="/pages/kontakt"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Kontakta kundtjänst
                  </Link>
                  <Link
                    to="/pages/privacy-policy"
                    className="px-6 py-3 border border-blue-300 text-blue-700 font-medium rounded-md hover:bg-blue-100 transition-colors text-sm"
                  >
                    Integritetspolicy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
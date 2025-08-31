// FILE: app/routes/($locale).account.addresses.add.tsx
// ✅ WORKING: Simple add address form that actually loads

import {redirect, data, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useNavigation, type MetaFunction, Link} from 'react-router';
import {ArrowLeft} from 'lucide-react';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Lägg till adress - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login');
    }
    return {};
  } catch (error) {
    return redirect('/account/login');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'POST') {
    return data({error: 'Metod inte tillåten'}, {status: 405});
  }

  const formData = await request.formData();

  try {
    // Simple address creation using Customer Account API
    const addressInput = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: (formData.get('company') as string) || '',
      address1: formData.get('address1') as string,
      address2: (formData.get('address2') as string) || '',
      city: formData.get('city') as string,
      territoryCode: 'SE',
      zip: formData.get('zip') as string,
      phoneNumber: (formData.get('phoneNumber') as string) || '',
    };

    const defaultAddress = formData.get('defaultAddress') === 'on';

    const CREATE_ADDRESS_MUTATION = `#graphql
      mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
        customerAddressCreate(input: { address: $address, defaultAddress: $defaultAddress }) {
          customerAddress {
            id
            firstName
            lastName
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const {data: mutationData, errors} = await customerAccount.mutate(
      CREATE_ADDRESS_MUTATION,
      { variables: { address: addressInput, defaultAddress } }
    );

    if (errors?.length) {
      return data({ error: errors[0].message, success: false });
    }

    if (mutationData?.customerAddressCreate?.userErrors?.length) {
      return data({ 
        error: mutationData.customerAddressCreate.userErrors[0].message, 
        success: false 
      });
    }

    if (mutationData?.customerAddressCreate?.customerAddress) {
      return redirect('/account/addresses');
    }

    return data({ error: 'Misslyckades att skapa adress', success: false });

  } catch (error: any) {
    return data({ error: 'Ett oväntat fel uppstod', success: false });
  }
}

export default function AddAddressPage() {
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/account/addresses"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Tillbaka till adresser
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Lägg till ny adress
          </h1>

          {/* Error message */}
          {actionData?.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Förnamn *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efternamn *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Företag (valfritt)
              </label>
              <input
                type="text"
                name="company"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adress *
                </label>
                <input
                  type="text"
                  name="address1"
                  placeholder="Gatuadress"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address2"
                  placeholder="Lägenhet, svit, etc. (valfritt)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stad *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postnummer *
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefonnummer (valfritt)
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Default address checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="defaultAddress"
                id="defaultAddress"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                Ange som standardadress
              </label>
            </div>

            {/* Submit buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/account/addresses"
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors text-center"
              >
                Avbryt
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '8px 24px',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
                  color: '#ffffff',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  flex: '1'
                }}
                className="sm:flex-none"
              >
                {isSubmitting ? 'Sparar...' : 'Spara adress'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
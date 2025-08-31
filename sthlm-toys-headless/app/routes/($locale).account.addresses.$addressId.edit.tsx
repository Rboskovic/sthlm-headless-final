// FILE: app/routes/($locale).account.addresses.$addressId.edit.tsx
// ✅ PROPER SHOPIFY: Customer Account API with correct edit patterns

import {redirect, data, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useNavigation, useLoaderData, type MetaFunction, Link} from 'react-router';
import {ArrowLeft} from 'lucide-react';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export type LoaderData = {
  address: {
    id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    zip?: string;
    phoneNumber?: string;
  } | null;
  isDefault: boolean;
};

export const meta: MetaFunction = () => {
  return [{title: 'Redigera adress - STHLM Toys & Games'}];
};

export async function loader({context, params}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login');
    }

    const addressId = params.addressId;
    if (!addressId) {
      return redirect('/account/addresses');
    }

    // ✅ PROPER SHOPIFY: Using Customer Account API query
    const CUSTOMER_ADDRESSES_QUERY = `#graphql
      query CustomerAddresses {
        customer {
          id
          defaultAddress {
            id
          }
          addresses(first: 20) {
            nodes {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              zip
              phoneNumber
            }
          }
        }
      }
    `;

    const {data: customerData, errors} = await context.customerAccount.query(CUSTOMER_ADDRESSES_QUERY);

    if (errors?.length || !customerData?.customer) {
      return redirect('/account/addresses');
    }

    const addresses = customerData.customer.addresses?.nodes || [];
    const address = addresses.find((addr) => addr.id === addressId);

    if (!address) {
      return redirect('/account/addresses');
    }

    const isDefault = customerData.customer.defaultAddress?.id === addressId;

    return data({ address, isDefault });
  } catch (error) {
    console.error('Error loading address:', error);
    return redirect('/account/addresses');
  }
}

export async function action({request, context, params}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Metod inte tillåten'}, {status: 405});
  }

  const formData = await request.formData();
  const addressId = params.addressId;

  if (!addressId) {
    return data({error: 'Adress-ID krävs'}, {status: 400});
  }

  try {
    // ✅ PROPER SHOPIFY: Customer Account API address input
    const addressInput = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: (formData.get('company') as string) || '',
      address1: formData.get('address1') as string,
      address2: (formData.get('address2') as string) || '',
      city: formData.get('city') as string,
      territoryCode: 'SE', // Sweden
      zip: formData.get('zip') as string,
      phoneNumber: (formData.get('phoneNumber') as string) || '',
    };

    const defaultAddress = formData.get('defaultAddress') === 'on';

    // ✅ PROPER SHOPIFY: Official Customer Account API mutation
    const UPDATE_ADDRESS_MUTATION = `#graphql
      mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
        customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
          customerAddress {
            id
            firstName
            lastName
            address1
            city
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const {data: mutationData, errors} = await customerAccount.mutate(
      UPDATE_ADDRESS_MUTATION,
      { variables: { addressId, address: addressInput, defaultAddress } }
    );

    if (errors?.length) {
      return data({ error: errors[0].message, success: false });
    }

    if (mutationData?.customerAddressUpdate?.userErrors?.length) {
      return data({ 
        error: mutationData.customerAddressUpdate.userErrors[0].message, 
        success: false 
      });
    }

    if (mutationData?.customerAddressUpdate?.customerAddress) {
      return redirect('/account/addresses');
    }

    return data({ error: 'Misslyckades att uppdatera adress', success: false });

  } catch (error: any) {
    console.error('Address update error:', error);
    return data({ error: 'Ett oväntat fel uppstod', success: false });
  }
}

export default function EditAddressPage() {
  const {address, isDefault} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Adress hittades inte</h1>
          <p className="text-gray-600 mb-4">Den begärda adressen kunde inte hittas.</p>
          <Link
            to="/account/addresses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Tillbaka till adresser
          </Link>
        </div>
      </div>
    );
  }

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
            Redigera adress
          </h1>

          {/* Error message */}
          {actionData?.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              {actionData.error}
            </div>
          )}

          <Form method="put" className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Förnamn *
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={address.firstName || ''}
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
                  defaultValue={address.lastName || ''}
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
                defaultValue={address.company || ''}
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
                  defaultValue={address.address1 || ''}
                  placeholder="Gatuadress"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address2"
                  defaultValue={address.address2 || ''}
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
                  defaultValue={address.city || ''}
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
                  defaultValue={address.zip || ''}
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
                defaultValue={address.phoneNumber || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Default address checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="defaultAddress"
                id="defaultAddress"
                defaultChecked={isDefault}
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
              {/* ✅ FIXED: WHITE TEXT on blue button */}
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
                {isSubmitting ? 'Uppdaterar...' : 'Uppdatera adress'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
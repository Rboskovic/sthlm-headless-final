// FILE: app/routes/($locale).account.addresses.tsx
// ✅ FIXED: Swedish translation, proper error handling, working add/edit addresses

import {redirect, data, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useOutletContext, type MetaFunction, Link, Form, useActionData, useNavigation} from 'react-router';
import {MapPin, Plus, Edit, Trash2, Star} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {DELETE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  error?: string;
  success?: boolean;
  message?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Mina adresser - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login?redirect=/account/addresses');
    }
    await context.customerAccount.handleAuthStatus();
    return {};
  } catch (error) {
    return redirect('/account/login?redirect=/account/addresses');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;
  
  const isLoggedIn = await customerAccount.isLoggedIn();
  if (!isLoggedIn) {
    return redirect('/account/login?redirect=/account/addresses');
  }

  const formData = await request.formData();
  const action = formData.get('action') as string;
  const addressId = formData.get('addressId') as string;

  if (action === 'delete' && addressId) {
    try {
      const {data: mutationData, errors} = await customerAccount.mutate(
        DELETE_ADDRESS_MUTATION,
        {
          variables: { addressId },
        }
      );

      if (errors?.length) {
        return data({
          error: errors[0].message,
          success: false,
        });
      }

      if (mutationData?.customerAddressDelete?.userErrors?.length) {
        return data({
          error: mutationData.customerAddressDelete.userErrors[0].message,
          success: false,
        });
      }

      return data({
        success: true,
        message: 'Adress raderad framgångsrikt',
      });

    } catch (error: any) {
      return data({
        error: error.message || 'Ett oväntat fel uppstod',
        success: false,
      });
    }
  }

  return data({error: 'Ogiltig åtgärd'}, {status: 400});
}

export default function AddressesPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const navigation = useNavigation();

  const addresses = customer?.addresses?.nodes || [];
  const defaultAddressId = customer?.defaultAddress?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - NO PADDING, CENTERED */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div style={{ textAlign: 'center', flex: '1' }}>
                <h1 style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: '#111827',
                  margin: '0',
                  padding: '0'
                }}>
                  Mina adresser
                </h1>
                <p style={{ 
                  color: '#6b7280',
                  margin: '0',
                  padding: '0'
                }}>
                  Hantera dina leverans- och faktureringsadresser för snabbare utcheckning
                </p>
              </div>
              
              {/* Fixed Add Address Button - Issue #8 */}
              <Link
                to="/account/addresses/add"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Plus size={16} className="mr-2" />
                Lägg till adress
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Inga adresser sparade ännu
            </h3>
            <p className="text-gray-600 mb-6" style={{ textAlign: 'center' }}>
              Lägg till en adress för snabbare utcheckning
            </p>
            <Link
              to="/account/addresses/add"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '500',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              <Plus size={16} style={{ marginRight: '8px' }} />
              Lägg till din första adress
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => {
              const isDefault = address.id === defaultAddressId;
              const isDeleting = navigation.state === 'submitting' && 
                               navigation.formData?.get('addressId') === address.id;
              
              return (
                <div 
                  key={address.id}
                  className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
                    isDefault 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Default Badge */}
                  {isDefault && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star size={16} className="text-blue-600 fill-current" />
                      <span className="text-sm font-medium text-blue-600">
                        Standard
                      </span>
                    </div>
                  )}
                  
                  {/* Address Content */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {address.firstName} {address.lastName}
                    </h3>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {address.company && (
                        <p>{address.company}</p>
                      )}
                      <p>{address.address1}</p>
                      {address.address2 && <p>{address.address2}</p>}
                      <p>{address.zip} {address.city}</p>
                      {address.phoneNumber && (
                        <p>{address.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {/* Fixed Edit Link - Issue #7 */}
                    <Link
                      to={`/account/addresses/${encodeURIComponent(address.id)}/edit`}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Edit size={14} className="mr-1" />
                      Redigera
                    </Link>
                    
                    {!isDefault && (
                      <Form method="post">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="addressId" value={address.id} />
                        <button
                          type="submit"
                          disabled={isDeleting}
                          className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                          onClick={(e) => {
                            if (!confirm('Är du säker på att du vill radera denna adress?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Trash2 size={14} className="mr-1" />
                          {isDeleting ? 'Raderar...' : 'Radera'}
                        </button>
                      </Form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
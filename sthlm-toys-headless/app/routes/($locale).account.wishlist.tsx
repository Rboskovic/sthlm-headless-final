// FILE: app/routes/($locale).account.wishlist.tsx
// ✅ FIXED: Swedish translation, centered empty state, proper styling

import {redirect, data, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useOutletContext, Link, useLoaderData, type MetaFunction} from 'react-router';
import {Heart, Trash2, ShoppingBag, ArrowLeft} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {
  getCustomerWishlist,
  addToCustomerWishlist,
  removeFromCustomerWishlist,
  type WishlistItem,
} from '~/lib/wishlist.server';

export type ActionResponse = {
  success?: boolean;
  action?: string;
  productId?: string;
  message?: string;
  error?: string;
};

export type LoaderData = {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
};

export const meta: MetaFunction = () => {
  return [{title: 'Min önskelista - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login?redirect=/account/wishlist');
    }
    
    await context.customerAccount.handleAuthStatus();
    
    // Load customer wishlist from metafields
    const wishlistItems = await getCustomerWishlist(context.customerAccount);
    
    return data({
      wishlistItems,
      wishlistCount: wishlistItems.length,
    } satisfies LoaderData);
  } catch (error) {
    console.error('Wishlist loader error:', error);
    return redirect('/account/login?redirect=/account/wishlist');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login?redirect=/account/wishlist');
    }

    const formData = await request.formData();
    const action = formData.get('action') as string;
    const productId = formData.get('productId') as string;

    if (!productId || !action) {
      return data({error: 'Saknade obligatoriska parametrar'}, {status: 400});
    }

    let result: {success: boolean; error?: string};

    if (action === 'remove') {
      result = await removeFromCustomerWishlist(context.customerAccount, productId);
      
      if (result.success) {
        return data({
          success: true,
          action: 'remove',
          productId,
          message: 'Produkten togs bort från önskelistan',
        } satisfies ActionResponse);
      }
    }

    return data({
      error: result?.error || 'Ett fel uppstod',
      success: false,
    } satisfies ActionResponse);

  } catch (error: any) {
    return data({
      error: error.message || 'Ett oväntat fel uppstod',
      success: false,
    } satisfies ActionResponse);
  }
}

export default function WishlistPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {wishlistItems, wishlistCount} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionResponse>();

  const formatPrice = (amount?: string, currencyCode?: string) => {
    if (!amount) return '';
    try {
      const numAmount = parseFloat(amount);
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currencyCode || 'SEK'
      }).format(numAmount);
    } catch (error) {
      return `${amount} ${currencyCode || 'SEK'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Min önskelista
                </h1>
                <p className="text-gray-600">
                  {wishlistCount > 0 
                    ? `Du har ${wishlistCount} produkt${wishlistCount !== 1 ? 'er' : ''} i din önskelista`
                    : 'Din önskelista är tom'
                  }
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

        {wishlistItems.length === 0 ? (
          // Issue #9 & #10: Centered empty state with proper styling
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Heart size={64} className="mx-auto text-gray-400 mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Din önskelista är tom
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Utforska vårt sortiment och lägg till produkter du vill spara för senare!
            </p>
            {/* Issue #11: Blue button with white text */}
            <Link
              to="/collections/all"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag size={20} className="mr-2" />
              Börja shoppa →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 group"
              >
                <div className="aspect-square relative">
                  {item.featuredImage?.url ? (
                    <img
                      src={item.featuredImage.url}
                      alt={item.featuredImage.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <Form method="post" className="absolute top-2 right-2">
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="productId" value={item.id} />
                    <button
                      type="submit"
                      className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                      title="Ta bort från önskelista"
                      onClick={(e) => {
                        if (!confirm('Är du säker på att du vill ta bort denna produkt från din önskelista?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </Form>
                </div>

                <div className="p-4">
                  <Link 
                    to={`/products/${item.handle}`}
                    className="block group-hover:text-blue-600 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {item.priceRange?.minVariantPrice && (
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(
                          item.priceRange.minVariantPrice.amount,
                          item.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                    )}
                  </Link>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/products/${item.handle}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-center text-sm"
                    >
                      Visa produkt
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Tillagd {new Date(item.addedAt).toLocaleDateString('sv-SE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
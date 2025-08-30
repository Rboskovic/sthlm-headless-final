// FILE: app/routes/($locale).account.wishlist.tsx
// ✅ SHOPIFY HYDROGEN: Complete wishlist route with server-side storage

import {redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {Form, useActionData, useOutletContext, Link, useLoaderData, type MetaFunction} from 'react-router';
import {data} from '@shopify/remix-oxygen';
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
      return data({error: 'Missing required parameters'}, {status: 400});
    }

    let result: {success: boolean; error?: string};

    if (action === 'add') {
      const productTitle = formData.get('productTitle') as string;
      const productHandle = formData.get('productHandle') as string;
      const productImageStr = formData.get('productImage') as string;
      const productPriceStr = formData.get('productPrice') as string;

      if (!productTitle || !productHandle) {
        return data({error: 'Missing product information'}, {status: 400});
      }

      const item: Omit<WishlistItem, 'addedAt'> = {
        id: productId,
        title: productTitle,
        handle: productHandle,
        featuredImage: productImageStr ? JSON.parse(productImageStr) : undefined,
        priceRange: productPriceStr ? {
          minVariantPrice: JSON.parse(productPriceStr)
        } : undefined,
      };

      result = await addToCustomerWishlist(context.customerAccount, item);
    } else if (action === 'remove') {
      result = await removeFromCustomerWishlist(context.customerAccount, productId);
    } else {
      return data({error: 'Invalid action'}, {status: 400});
    }

    if (!result.success) {
      return data({error: result.error || 'An error occurred'}, {status: 500});
    }

    return data({
      success: true,
      action,
      productId,
      message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist`,
    } satisfies ActionResponse);
    
  } catch (error) {
    console.error('Wishlist action error:', error);
    return data({error: 'An error occurred'}, {status: 500});
  }
}

export default function WishlistPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {wishlistItems, wishlistCount} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionResponse>();

  const formatPrice = (amount: string, currencyCode: string) => {
    try {
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currencyCode
      }).format(parseFloat(amount));
    } catch {
      return `${amount} ${currencyCode}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link
              to="/account"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-1" />
              Tillbaka till mitt konto
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Min önskelista</h1>
                <p className="mt-2 text-gray-600">
                  {wishlistCount > 0 
                    ? `${wishlistCount} ${wishlistCount === 1 ? 'produkt' : 'produkter'} i din önskelista`
                    : 'Din önskelista är tom'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {actionData?.message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`p-4 rounded-md ${
            actionData.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {actionData.message}
          </div>
        </div>
      )}

      {actionData?.error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="p-4 rounded-md bg-red-50 text-red-800">
            {actionData.error}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistCount === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Din önskelista är tom
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Utforska vårt sortiment och lägg till produkter du vill spara för senare!
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag size={20} className="mr-2" />
              Börja shoppa
            </Link>
          </div>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative">
                  {item.featuredImage ? (
                    <img
                      src={item.featuredImage.url}
                      alt={item.featuredImage.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={48} className="text-gray-300" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Form method="post" className="absolute top-2 right-2">
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="productId" value={item.id} />
                    <button
                      type="submit"
                      className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm hover:shadow-md transition-all"
                      title="Ta bort från önskelista"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </Form>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/products/${item.handle}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  
                  {item.priceRange && (
                    <p className="text-lg font-bold text-gray-900 mb-3">
                      {formatPrice(
                        item.priceRange.minVariantPrice.amount,
                        item.priceRange.minVariantPrice.currencyCode
                      )}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link
                      to={`/products/${item.handle}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Se produkt
                    </Link>
                    
                    <Form method="post" className="flex-shrink-0">
                      <input type="hidden" name="action" value="remove" />
                      <input type="hidden" name="productId" value={item.id} />
                      <button
                        type="submit"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="Ta bort"
                      >
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </Form>
                  </div>
                </div>

                {/* Added Date */}
                <div className="px-4 pb-4 text-xs text-gray-500">
                  Sparad {new Date(item.addedAt).toLocaleDateString('sv-SE')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// FILE: app/routes/($locale).account.wishlist.tsx
// SIMPLE VERSION: No GraphQL mutations, just basic functionality

import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  useActionData,
  Form,
  Link,
  type MetaFunction,
} from 'react-router';
import {Heart, ShoppingBag, Trash2} from 'lucide-react';

export const meta: MetaFunction = () => {
  return [{title: 'Önskelista - STHLM Toys & Games'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  // Ensure customer is authenticated
  await context.customerAccount.handleAuthStatus();

  // For now, return mock data - we'll add real wishlist data later
  const mockWishlistProducts = [
    {
      id: 'mock-1',
      title: 'LEGO Creator Expert Big Ben',
      handle: 'lego-creator-expert-big-ben',
      vendor: 'LEGO',
      price: {amount: '2499.00', currencyCode: 'SEK'},
      compareAtPrice: {amount: '2999.00', currencyCode: 'SEK'},
      featuredImage: {
        url: 'https://via.placeholder.com/300x300?text=LEGO+Big+Ben',
        altText: 'LEGO Big Ben',
      },
      availableForSale: true,
    },
    {
      id: 'mock-2',
      title: 'Barbie Dreamhouse Adventures Dollhouse',
      handle: 'barbie-dreamhouse-adventures',
      vendor: 'Mattel',
      price: {amount: '1299.00', currencyCode: 'SEK'},
      compareAtPrice: null,
      featuredImage: {
        url: 'https://via.placeholder.com/300x300?text=Barbie+Dreamhouse',
        altText: 'Barbie Dreamhouse',
      },
      availableForSale: true,
    },
  ];

  return json({
    products: mockWishlistProducts,
    message: 'Wishlist is working! (Mock data for now)',
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const formData = await request.formData();
  const action = formData.get('action') as string;
  const productId = formData.get('productId') as string;

  // For now, just return success - we'll add real functionality later
  return json({
    success: true,
    action,
    productId,
    message: `${action === 'add' ? 'Added to' : 'Removed from'} wishlist (mock action)`,
  });
}

export default function WishlistPage() {
  const {products, message} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Min önskelista
        </h1>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-gray-600">
          {products.length === 0
            ? 'Du har inga sparade produkter än.'
            : `${products.length} sparade ${products.length === 1 ? 'produkt' : 'produkter'}`}
        </p>
      </div>

      {actionData?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{actionData.message}</p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Din önskelista är tom
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Börja handla och lägg till produkter du älskar genom att klicka på
            hjärtat.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            Börja handla
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <WishlistProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistProductCard({product}: {product: any}) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>

          {product.vendor && (
            <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {product.price.amount} {product.price.currencyCode}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.compareAtPrice.amount}{' '}
                  {product.compareAtPrice.currencyCode}
                </span>
              )}
            </div>

            {!product.availableForSale && (
              <span className="text-sm text-red-600 font-medium">Slutsåld</span>
            )}
          </div>
        </div>
      </Link>

      {/* Remove from wishlist button */}
      <Form method="POST" className="absolute top-2 right-2">
        <input type="hidden" name="action" value="remove" />
        <input type="hidden" name="productId" value={product.id} />
        <button
          type="submit"
          className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow group/btn"
          title="Ta bort från önskelista"
        >
          <Trash2
            size={16}
            className="text-red-600 group-hover/btn:text-red-700"
          />
        </button>
      </Form>
    </div>
  );
}

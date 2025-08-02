// FILE: app/routes/($locale).account.wishlist.tsx
// CORRECT: Following exact pattern of your account.addresses.tsx and account.profile.tsx

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {data, type MetaFunction} from '@shopify/remix-oxygen';
import {Form, useActionData, useOutletContext, Link} from 'react-router';
import {Heart, ShoppingBag, Trash2} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export type ActionResponse = {
  success?: boolean;
  action?: string;
  productId?: string;
  message?: string;
  error?: string;
};

export const meta: MetaFunction = () => {
  return [{title: 'Wishlist'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  const formData = await request.formData();
  const action = formData.get('action') as string;
  const productId = formData.get('productId') as string;

  if (!productId) {
    return data({error: 'Product ID is required'}, {status: 400});
  }

  // For now, just return success - following your existing pattern
  return data({
    success: true,
    action,
    productId,
    message: `${action === 'add' ? 'Added to' : 'Removed from'} wishlist`,
  });
}

export default function WishlistPage() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();

  // Mock data for now - following your existing account page patterns
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

  return (
    <div className="account-wishlist">
      <h2>My wishlist</h2>
      <br />

      {actionData?.success && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '20px',
          }}
        >
          <p style={{color: '#155724', margin: 0}}>{actionData.message}</p>
        </div>
      )}

      {mockWishlistProducts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px 20px'}}>
          <Heart size={64} style={{color: '#ccc', marginBottom: '20px'}} />
          <h3>Your wishlist is empty</h3>
          <p>Start shopping and add products you love by clicking the heart.</p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginTop: '20px',
            }}
          >
            <ShoppingBag size={20} />
            Start shopping
          </Link>
        </div>
      ) : (
        <div>
          <p>
            You have {mockWishlistProducts.length} saved{' '}
            {mockWishlistProducts.length === 1 ? 'product' : 'products'}
          </p>
          <br />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {mockWishlistProducts.map((product) => (
              <WishlistProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistProductCard({product}: {product: any}) {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <Link
        to={`/products/${product.handle}`}
        style={{textDecoration: 'none', color: 'inherit'}}
      >
        <div style={{aspectRatio: '1/1', backgroundColor: '#f8f8f8'}}>
          <img
            src={product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </div>

        <div style={{padding: '15px'}}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              lineHeight: '1.3',
            }}
          >
            {product.title}
          </h3>

          {product.vendor && (
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 8px 0',
              }}
            >
              {product.vendor}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{fontSize: '18px', fontWeight: 'bold'}}>
                {product.price.amount} {product.price.currencyCode}
              </span>
              {product.compareAtPrice && (
                <span
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    textDecoration: 'line-through',
                  }}
                >
                  {product.compareAtPrice.amount}{' '}
                  {product.compareAtPrice.currencyCode}
                </span>
              )}
            </div>

            {!product.availableForSale && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#dc3545',
                  fontWeight: 'medium',
                }}
              >
                Out of stock
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Remove from wishlist button */}
      <Form
        method="POST"
        style={{position: 'absolute', top: '8px', right: '8px'}}
      >
        <input type="hidden" name="action" value="remove" />
        <input type="hidden" name="productId" value={product.id} />
        <button
          type="submit"
          style={{
            padding: '8px',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
          title="Remove from wishlist"
        >
          <Trash2 size={16} style={{color: '#dc3545'}} />
        </button>
      </Form>
    </div>
  );
}

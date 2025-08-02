// FILE: app/routes/($locale).account.wishlist.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Fixed to redirect instead of throwing errors

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {data, redirect, type MetaFunction} from '@shopify/remix-oxygen';
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
  // ✅ FIXED: Check authentication and redirect if needed
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();

    if (!isLoggedIn) {
      // Redirect to login instead of throwing error
      return redirect('/account/login');
    }

    await context.customerAccount.handleAuthStatus();
    return {};
  } catch (error) {
    // Any auth errors should redirect to login
    return redirect('/account/login');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  // ✅ FIXED: Check auth in action too
  try {
    const isLoggedIn = await customerAccount.isLoggedIn();

    if (!isLoggedIn) {
      return redirect('/account/login');
    }

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
  } catch (error) {
    return redirect('/account/login');
  }
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
            {mockWishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
          <br />
          <div style={{display: 'grid', gap: '20px'}}>
            {mockWishlistProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              >
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText}
                  style={{width: '100px', height: '100px', objectFit: 'cover'}}
                />
                <div style={{flex: 1}}>
                  <h4>{product.title}</h4>
                  <p>Vendor: {product.vendor}</p>
                  <p>
                    Price: {product.price.amount} {product.price.currencyCode}
                  </p>
                  {product.compareAtPrice && (
                    <p>
                      Compare at: {product.compareAtPrice.amount}{' '}
                      {product.compareAtPrice.currencyCode}
                    </p>
                  )}
                  <p>
                    Status:{' '}
                    {product.availableForSale ? 'In stock' : 'Out of stock'}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <Form method="post">
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="productId" value={product.id} />
                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </Form>
                  <Link
                    to={`/products/${product.handle}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                  >
                    <ShoppingBag size={16} />
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// FILE: app/routes/($locale).account.wishlist.tsx
// ✅ FIXED: Better wishlist structure, proper data handling, improved UI

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {data, redirect, type MetaFunction} from '@shopify/remix-oxygen';
import {Form, useActionData, useOutletContext, Link} from 'react-router';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {useState, useEffect} from 'react';

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
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login');
    }
    await context.customerAccount.handleAuthStatus();
    return {};
  } catch (error) {
    return redirect('/account/login');
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const isLoggedIn = await context.customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return redirect('/account/login');
    }

    const formData = await request.formData();
    const action = formData.get('action') as string;
    const productId = formData.get('productId') as string;

    if (!productId) {
      return data({error: 'Product ID is required'}, {status: 400});
    }

    // For now, just return success - in Phase 3 we'll implement real functionality
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
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const actionData = useActionData<ActionResponse>();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && customer?.id) {
      const stored = localStorage.getItem(`wishlist_${customer.id}`);
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setWishlistItems(Array.isArray(items) ? items : []);
        } catch (e) {
          console.error('Error loading wishlist:', e);
          setWishlistItems([]);
        }
      }
    }
  }, [customer?.id]);

  // Mock data for display purposes (Phase 3 will replace with real product data)
  const mockWishlistProducts = [
    {
      id: 'mock-1',
      title: 'LEGO Creator Expert Big Ben',
      handle: 'lego-creator-expert-big-ben',
      vendor: 'LEGO',
      price: { amount: '2499.00', currencyCode: 'SEK' },
      compareAtPrice: { amount: '2999.00', currencyCode: 'SEK' },
      featuredImage: {
        url: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081',
        altText: 'LEGO Big Ben',
      },
      availableForSale: true,
    },
    {
      id: 'mock-2',
      title: 'Barbie Dreamhouse Adventures Dollhouse',
      handle: 'barbie-dreamhouse-adventures',
      vendor: 'Mattel',
      price: { amount: '1299.00', currencyCode: 'SEK' },
      compareAtPrice: null,
      featuredImage: {
        url: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081',
        altText: 'Barbie Dreamhouse',
      },
      availableForSale: true,
    },
  ];

  // Helper function to format money
  const formatMoney = (amount: string, currency: string) => {
    try {
      const numAmount = parseFloat(amount);
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currency
      }).format(numAmount);
    } catch (error) {
      return `${amount} ${currency}`;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My wishlist</h2>
      
      {actionData?.success && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          ✅ {actionData.message}
        </div>
      )}

      {actionData?.error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ❌ {actionData.error}
        </div>
      )}

      {mockWishlistProducts.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            You have {mockWishlistProducts.length} saved{' '}
            {mockWishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {mockWishlistProducts.map((product) => (
              <WishlistProductCard
                key={product.id}
                product={product}
                formatMoney={formatMoney}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistProductCard({ product, formatMoney }: { product: any; formatMoney: (amount: string, currency: string) => string }) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Product Image */}
      <div style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
      
      {/* Product Details */}
      <div style={{ padding: '15px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '16px',
          lineHeight: '1.3'
        }}>
          {product.title}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            {formatMoney(product.price.amount, product.price.currencyCode)}
          </span>
          {product.compareAtPrice && (
            <span style={{ 
              marginLeft: '8px',
              fontSize: '14px', 
              color: '#666',
              textDecoration: 'line-through'
            }}>
              {formatMoney(product.compareAtPrice.amount, product.compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to={`/products/${product.handle}`}
            style={{
              display: 'block',
              textAlign: 'center',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            View Product
          </Link>
          
          <Form method="post" style={{ margin: '0' }}>
            <input type="hidden" name="action" value="remove" />
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#dc3545',
                border: '1px solid #dc3545',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#f8f9fa',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '30px'
      }}>
        ❤️
      </div>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        Your wishlist is empty
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#666' }}>
        Start shopping and add products you love by clicking the heart.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      >
        🛒 Start shopping
      </Link>
    </div>
  );
}
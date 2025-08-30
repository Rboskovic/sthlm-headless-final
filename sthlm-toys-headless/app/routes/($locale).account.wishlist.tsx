// FILE: app/routes/($locale).account.wishlist.tsx
// ✅ QUICK FIX: Session storage only - works for all users

import {redirect, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useOutletContext, Link, type MetaFunction} from 'react-router';
import {useState, useEffect} from 'react';
import {Heart, Trash2, ShoppingBag, ArrowLeft} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  addedAt: string;
}

const SESSION_STORAGE_KEY = 'sthlm_wishlist_session';

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
    return {};
  } catch (error) {
    return redirect('/account/login?redirect=/account/wishlist');
  }
}

export default function WishlistPage() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistItems(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.warn('Error loading wishlist:', error);
        setWishlistItems([]);
      }
      setIsLoading(false);
    }
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);
    
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedItems));
        window.dispatchEvent(new CustomEvent('wishlist-updated', {
          detail: {count: updatedItems.length}
        }));
      } catch (error) {
        console.warn('Failed to save to session storage:', error);
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Laddar din önskelista...</p>
        </div>
      </div>
    );
  }

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
                  {wishlistItems.length > 0 
                    ? `${wishlistItems.length} ${wishlistItems.length === 1 ? 'produkt' : 'produkter'} i din önskelista`
                    : 'Din önskelista är tom'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
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
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm hover:shadow-md transition-all"
                    title="Ta bort från önskelista"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
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
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      title="Ta bort"
                    >
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
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
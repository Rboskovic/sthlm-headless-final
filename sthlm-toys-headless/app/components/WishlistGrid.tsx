// app/components/WishlistGrid.tsx
import { Link } from 'react-router';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { SessionWishlistButton } from '~/components/SessionWishlistButton';
import type { WishlistItem } from '~/lib/wishlist-storage';

interface WishlistGridProps {
  items: WishlistItem[];
}

export function WishlistGrid({ items }: WishlistGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div key={`${item.id}-${item.variantId || 'default'}-${index}`} className="group">
          <div className="relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              {item.featuredImage?.url ? (
                <img
                  src={item.featuredImage.url}
                  alt={item.featuredImage.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Wishlist Button */}
              <div className="absolute top-3 right-3">
                <SessionWishlistButton
                  product={{
                    id: item.id,
                    title: item.title,
                    handle: item.handle,
                    featuredImage: item.featuredImage,
                    priceRange: item.priceRange
                  }}
                  variantId={item.variantId}
                  size="sm"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                <Link 
                  to={`/products/${item.handle}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.title}
                </Link>
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  {item.priceRange?.minVariantPrice && (
                    <span className="text-lg font-bold text-gray-900">
                      {item.priceRange.minVariantPrice.amount} {item.priceRange.minVariantPrice.currencyCode}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* View Product */}
                  <Link
                    to={`/products/${item.handle}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    title="View Product"
                  >
                    <ExternalLink size={14} />
                    <span>View</span>
                  </Link>
                  
                  {/* Add to Cart - You can implement this later */}
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    title="Add to Cart"
                    onClick={() => {
                      // TODO: Implement add to cart functionality
                      // You can use your existing cart logic here
                      console.log('Add to cart:', item);
                    }}
                  >
                    <ShoppingCart size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
              
              {/* Added date */}
              <p className="text-xs text-gray-500 mt-2">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
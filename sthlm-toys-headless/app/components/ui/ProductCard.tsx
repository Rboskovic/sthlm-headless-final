// FILE: app/components/ui/ProductCard.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Reusable product card component

import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {cn} from '~/lib/utils';
import {PriceDisplay} from './PriceDisplay';
import {ShopButton} from './ShopButton';
import {Heart, ShoppingCart, Eye} from 'lucide-react';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductCardProps {
  product: ProductFragment;
  loading?: 'eager' | 'lazy';
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  showQuickView?: boolean;
  onQuickAdd?: (variantId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  onQuickView?: (productHandle: string) => void;
}

/**
 * ProductCard Component
 * Consistent product display across all sections
 * 
 * @example
 * // Basic product card
 * <ProductCard product={product} />
 * 
 * // With quick actions
 * <ProductCard 
 *   product={product}
 *   showQuickAdd
 *   showWishlist
 *   onQuickAdd={(variantId) => addToCart(variantId)}
 * />
 * 
 * // Compact variant for grids
 * <ProductCard 
 *   product={product}
 *   variant="compact"
 * />
 */
export function ProductCard({
  product,
  loading = 'lazy',
  className,
  variant = 'default',
  showQuickAdd = false,
  showWishlist = true,
  showQuickView = false,
  onQuickAdd,
  onWishlistToggle,
  onQuickView,
}: ProductCardProps) {
  if (!product?.id) return null;

  const {
    id,
    title,
    handle,
    vendor,
    selectedOrFirstAvailableVariant: firstVariant,
  } = product;

  const productUrl = `/products/${handle}`;
  const imageData = firstVariant?.image;

  // Check if product is on sale
  const isOnSale = firstVariant?.compareAtPrice && 
    parseFloat(firstVariant.compareAtPrice.amount) > parseFloat(firstVariant.price.amount);

  const discountPercentage = isOnSale && firstVariant?.compareAtPrice
    ? Math.round(
        ((parseFloat(firstVariant.compareAtPrice.amount) - parseFloat(firstVariant.price.amount)) /
          parseFloat(firstVariant.compareAtPrice.amount)) *
          100
      )
    : 0;

  // Variant-specific styles
  const variantClasses = {
    default: 'group relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300',
    compact: 'group relative bg-white rounded-md overflow-hidden hover:shadow-md transition-all duration-200',
    detailed: 'group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100',
  };

  const imageHeightClasses = {
    default: 'aspect-square',
    compact: 'aspect-square',
    detailed: 'aspect-[4/5]',
  };

  return (
    <div className={cn(variantClasses[variant], className)}>
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link
          to={productUrl}
          className={cn('block', imageHeightClasses[variant])}
          prefetch="intent"
        >
          {imageData ? (
            <Image
              data={imageData}
              alt={imageData.altText || title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {showWishlist && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onWishlistToggle?.(id);
                  }}
                  className="h-9 w-9 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-4 w-4 text-gray-700 hover:text-red-500" />
                </button>
              )}
              {showQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onQuickView?.(handle);
                  }}
                  className="h-9 w-9 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
                  aria-label="Quick view"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className={cn(
        'p-4',
        variant === 'compact' && 'p-3',
        variant === 'detailed' && 'p-5'
      )}>
        {/* Vendor */}
        {vendor && variant !== 'compact' && (
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {vendor}
          </p>
        )}

        {/* Title */}
        <Link to={productUrl} prefetch="intent">
          <h3 className={cn(
            'font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2',
            variant === 'compact' ? 'text-sm' : 'text-base'
          )}>
            {title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2">
          <PriceDisplay
            price={firstVariant?.price}
            compareAtPrice={firstVariant?.compareAtPrice}
            size={variant === 'compact' ? 'sm' : 'md'}
            showDiscountBadge={false}
            variant="inline"
          />
        </div>

        {/* Quick Add Button */}
        {showQuickAdd && firstVariant && variant !== 'compact' && (
          <div className="mt-3">
            <ShopButton
              size="sm"
              variant="outline"
              fullWidth
              onClick={() => onQuickAdd?.(firstVariant.id)}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              disabled={!firstVariant.availableForSale}
            >
              {firstVariant.availableForSale ? 'Quick Add' : 'Out of Stock'}
            </ShopButton>
          </div>
        )}

        {/* Additional Details for detailed variant */}
        {variant === 'detailed' && (
          <div className="mt-3 space-y-2">
            {/* Rating placeholder */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  )}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">(24)</span>
            </div>

            {/* Stock status */}
            {firstVariant?.availableForSale ? (
              <p className="text-xs text-green-600 font-medium">In Stock</p>
            ) : (
              <p className="text-xs text-red-600 font-medium">Out of Stock</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProductGrid Component
 * Wrapper for product card grids
 */
export function ProductGrid({
  products,
  columns = 4,
  className,
  variant = 'default',
  showQuickAdd = false,
}: {
  products: ProductFragment[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showQuickAdd?: boolean;
}) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          showQuickAdd={showQuickAdd}
          loading={index < 8 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

// Export types for TypeScript
export type {ProductCardProps};
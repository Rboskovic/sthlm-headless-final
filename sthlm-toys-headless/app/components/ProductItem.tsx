// FILE: app/components/ProductItem.tsx
// ✅ SHOPIFY STANDARD: Compatible with both collection and product data structures
// ✅ FIXED: Mobile layout changed to vertical (Smyths-style) instead of horizontal
// ✅ FIXED: Added image fallback when no image available
// ✅ FIXED: Added consistent title heights for proper alignment + Mobile image centering
// ✅ NEW: Added discount labels when products are on sale

import {Link, useNavigate} from 'react-router';
import {useState} from 'react';
import {Image, type MappedProductOptions} from '@shopify/hydrogen';
import {Heart} from 'lucide-react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {WishlistButton} from './WishlistButton';
import type {ProductFragment} from 'storefrontapi.generated';

// Define compatible product type that works with both data structures
interface CompatibleProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  // Collection query structure
  featuredImage?: {
    id?: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  } | null;
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
  // Product detail structure  
  selectedOrFirstAvailableVariant?: {
    id: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    } | null;
    image?: {
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    } | null;
    selectedOptions?: Array<{name: string; value: string}>;
    title?: string;
    sku?: string;
  } | null;
  images?: {
    nodes: Array<{
      url: string;
      altText?: string;
      width?: number;
      height?: number;
    }>;
  };
}

export function ProductItem({
  product,
  loading,
}: {
  product: CompatibleProduct | ProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const {open} = useAside();

  // ✅ FIXED: Handle both data structures
  const variant = getCompatibleVariant(product);
  const image = getCompatibleImage(product);
  const price = getCompatiblePrice(product);
  const compareAtPrice = getCompatibleCompareAtPrice(product);

  const productUrl = `/products/${product.handle}`;

  if (!variant && !price) {
    console.warn('Product missing variant and price data:', product.title);
    return null;
  }

  // ✅ NEW: Calculate discount percentage for sale badge
  const isOnSale = compareAtPrice && price && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  // Desktop Layout - FIXED: Changed object-cover to object-contain with padding
  return (
    <>
      {/* Desktop Layout - PIXEL PERFECT MATCH TO SCREENSHOT */}
      <div className="hidden lg:block h-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group relative h-full flex flex-col">
          {/* Wishlist Heart - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <WishlistButton
              productId={product.id}
              productTitle={product.title}
              size="sm"
              className="w-8 h-8 bg-white rounded-full shadow-sm border border-gray-200 hover:border-red-300"
            />
          </div>

          {/* ✅ NEW: Discount Badge - Top Left */}
          {isOnSale && discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Product Image - SMART: object-cover by default, object-contain for wide images */}
          <Link to={productUrl} className="block mb-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
              {image ? (
                <Image
                  alt={image.altText || product.title}
                  src={image.url}
                  width={300}
                  height={300}
                  loading={loading}
                  className="w-full h-full object-cover"
                  style={{
                    objectFit: image.width && image.height && (image.width / image.height) > 1.3 ? 'contain' : 'cover'
                  }}
                />
              ) : (
                // ✅ NEW: Image fallback for desktop
                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <svg
                    className="w-16 h-16 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v16.5a1.5 1.5 0 0 0 1.5 1.5Z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Ingen bild</span>
                </div>
              )}
            </div>
          </Link>

          {/* Product Details - Flexible content area */}
          <div className="flex-1 flex flex-col">
            <Link
              className="block mb-3 group-hover:text-blue-600 transition-colors"
              to={productUrl}
            >
              {/* ✅ FIXED: Consistent title height for alignment */}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2" style={{ minHeight: '3.5rem', display: 'flex', alignItems: 'flex-start' }}>
                {product.title}
              </h3>
              {product.vendor && (
                <p className="text-sm text-gray-500 mb-1">{product.vendor}</p>
              )}
            </Link>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-gray-900">
                {price.currencyCode} {Math.round(parseFloat(price.amount))}
              </span>
              {isOnSale && compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {compareAtPrice.currencyCode} {Math.round(parseFloat(compareAtPrice.amount))}
                </span>
              )}
            </div>

            {/* ✅ FIXED: Add to Cart Button - Pushes to bottom */}
            <div className="mt-auto">
              {variant ? (
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: variant.id,
                      quantity: 1,
                    },
                  ]}
                  onClick={() => {
                    console.log('🐛 Opening cart modal from product card');
                    open('cart');
                  }}
                  disabled={!variant.availableForSale}
                  variant="primary"
                  size="md"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
                  analytics={{
                    products: [
                      {
                        productGid: product.id,
                        variantGid: variant.id,
                        name: product.title,
                        variantName: variant.title || product.title,
                        brand: product.vendor,
                        price: price.amount,
                        quantity: 1,
                      },
                    ],
                  }}
                >
                  {variant.availableForSale ? 'Lägg i varukorg' : 'Slut i lager'}
                </AddToCartButton>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 font-medium py-3 px-6 rounded-xl text-center">
                  Ej tillgänglig
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Mobile Layout - Changed to VERTICAL (Smyths-style) instead of horizontal */}
      <div className="lg:hidden h-full">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group h-full flex flex-col">
          {/* ✅ FIXED: Mobile Image - Now full width at top (vertical layout) */}
          <div className="relative aspect-square bg-gray-50 flex-shrink-0">
            <Link to={productUrl} className="block w-full h-full">
              {image ? (
                <Image
                  alt={image.altText || product.title}
                  src={image.url}
                  width={200}
                  height={200}
                  loading={loading}
                  className="w-full h-full object-contain p-2"
                  style={{
                    objectFit: image.width && image.height && (image.width / image.height) > 1.3 ? 'contain' : 'cover'
                  }}
                />
              ) : (
                // ✅ NEW: Image fallback for mobile
                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v16.5a1.5 1.5 0 0 0 1.5 1.5Z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Ingen bild</span>
                </div>
              )}
            </Link>
            
            {/* Mobile Wishlist Button - Top Right */}
            <div className="absolute top-2 right-2">
              <WishlistButton
                productId={product.id}
                productTitle={product.title}
                size="sm"
                className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              />
            </div>

            {/* ✅ IMPROVED: Discount Badge - Mobile Top Left with better styling */}
            {isOnSale && discountPercentage > 0 && (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full px-2 py-1 shadow-sm">
                  -{discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* ✅ FIXED: Mobile Product Info - Now below image (vertical layout) */}
          <div className="p-3 flex flex-col flex-grow">
            {/* Vendor */}
            {product.vendor && (
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                {product.vendor}
              </p>
            )}

            {/* Product Title */}
            <Link
              to={productUrl}
              className="block group-hover:text-blue-600 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
                {product.title}
              </h3>
            </Link>

            {/* Mobile Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-bold text-gray-900">
                {price.currencyCode} {Math.round(parseFloat(price.amount))}
              </span>
              {isOnSale && compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {compareAtPrice.currencyCode} {Math.round(parseFloat(compareAtPrice.amount))}
                </span>
              )}
            </div>

            {/* Mobile Add to Cart - Pushes to bottom */}
            <div className="mt-auto">
              {variant ? (
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: variant.id,
                      quantity: 1,
                    },
                  ]}
                  onClick={() => {
                    console.log('🐛 Opening cart modal from mobile product card');
                    open('cart');
                  }}
                  disabled={!variant.availableForSale}
                  variant="primary"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-lg text-sm transition-colors duration-200"
                  analytics={{
                    products: [
                      {
                        productGid: product.id,
                        variantGid: variant.id,
                        name: product.title,
                        variantName: variant.title || product.title,
                        brand: product.vendor,
                        price: price.amount,
                        quantity: 1,
                      },
                    ],
                  }}
                >
                  {variant.availableForSale ? 'Lägg till' : 'Slut'}
                </AddToCartButton>
              ) : (
                <div className="w-full bg-gray-100 text-gray-500 font-medium py-2.5 px-3 rounded-lg text-center text-sm">
                  Ej tillgänglig
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper functions to handle both data structures
function getCompatibleVariant(product: CompatibleProduct | ProductFragment) {
  if ('selectedOrFirstAvailableVariant' in product && product.selectedOrFirstAvailableVariant) {
    return {
      id: product.selectedOrFirstAvailableVariant.id,
      availableForSale: product.selectedOrFirstAvailableVariant.availableForSale,
      price: product.selectedOrFirstAvailableVariant.price,
      compareAtPrice: product.selectedOrFirstAvailableVariant.compareAtPrice,
      selectedOptions: product.selectedOrFirstAvailableVariant.selectedOptions || [],
      title: product.selectedOrFirstAvailableVariant.title,
      sku: product.selectedOrFirstAvailableVariant.sku,
    };
  }
  
  // For collection structure, create a minimal variant from priceRange
  if ('priceRange' in product && product.priceRange) {
    return {
      id: `${product.id}-variant`,
      availableForSale: true,
      price: product.priceRange.minVariantPrice,
      compareAtPrice: product.priceRange.maxVariantPrice && 
        product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount
        ? product.priceRange.maxVariantPrice 
        : null,
      selectedOptions: [],
      title: product.title,
      sku: null,
    };
  }
  
  return null;
}

function getCompatibleImage(product: CompatibleProduct | ProductFragment) {
  // Try selectedOrFirstAvailableVariant image first
  if ('selectedOrFirstAvailableVariant' in product && product.selectedOrFirstAvailableVariant?.image) {
    return product.selectedOrFirstAvailableVariant.image;
  }
  
  // Try featuredImage (collection structure)
  if ('featuredImage' in product && product.featuredImage) {
    return product.featuredImage;
  }
  
  // Try images array
  if ('images' in product && product.images?.nodes?.length && product.images.nodes[0]) {
    return product.images.nodes[0];
  }
  
  return null;
}

function getCompatiblePrice(product: CompatibleProduct | ProductFragment) {
  // Try selectedOrFirstAvailableVariant price first
  if ('selectedOrFirstAvailableVariant' in product && product.selectedOrFirstAvailableVariant?.price) {
    return product.selectedOrFirstAvailableVariant.price;
  }
  
  // Try priceRange (collection structure)
  if ('priceRange' in product && product.priceRange) {
    return product.priceRange.minVariantPrice;
  }
  
  return { amount: '0', currencyCode: 'SEK' };
}

function getCompatibleCompareAtPrice(product: CompatibleProduct | ProductFragment) {
  // Try selectedOrFirstAvailableVariant compareAtPrice first
  if ('selectedOrFirstAvailableVariant' in product && product.selectedOrFirstAvailableVariant?.compareAtPrice) {
    return product.selectedOrFirstAvailableVariant.compareAtPrice;
  }
  
  // For collection structure, use maxVariantPrice if different from minVariantPrice
  if ('priceRange' in product && product.priceRange?.maxVariantPrice) {
    const min = product.priceRange.minVariantPrice;
    const max = product.priceRange.maxVariantPrice;
    if (max.amount !== min.amount) {
      return max;
    }
  }
  
  return null;
}
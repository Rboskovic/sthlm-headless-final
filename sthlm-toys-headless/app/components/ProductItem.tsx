// FILE: app/components/ProductItem.tsx
// ✅ SHOPIFY STANDARD: Compatible with both collection and product data structures
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
              {image && (
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

      {/* Mobile Layout - ✅ FIXED: Mobile image centering */}
      <div className="lg:hidden h-full">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group h-full flex flex-col">
          <div className="flex flex-1">
            {/* ✅ FIXED: Mobile Image with proper centering */}
            <div className="w-32 h-32 flex-shrink-0 relative bg-gray-50 flex items-center justify-center">
              <Link to={productUrl} className="block w-full h-full flex items-center justify-center">
                {image && (
                  <Image
                    alt={image.altText || product.title}
                    src={image.url}
                    width={128}
                    height={128}
                    loading={loading}
                    className="w-full h-full object-cover"
                    style={{
                      objectFit: image.width && image.height && (image.width / image.height) > 1.3 ? 'contain' : 'cover'
                    }}
                  />
                )}
              </Link>
              
              {/* Mobile Wishlist Button */}
              <div className="absolute top-1 right-1">
                <WishlistButton
                  productId={product.id}
                  productTitle={product.title}
                  size="sm"
                  className="w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </div>

              {/* ✅ NEW: Discount Badge - Mobile Top Left */}
              {isOnSale && discountPercentage > 0 && (
                <div className="absolute top-1 left-1">
                  <span className="inline-flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Product Info */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex-1">
                <Link
                  to={productUrl}
                  className="block group-hover:text-blue-600 transition-colors"
                >
                  {/* ✅ FIXED: Consistent title height for mobile alignment */}
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1" style={{ minHeight: '2.5rem', display: 'flex', alignItems: 'flex-start' }}>
                    {product.title}
                  </h3>
                  {product.vendor && (
                    <p className="text-xs text-gray-500 mb-2">{product.vendor}</p>
                  )}
                </Link>

                {/* Mobile Price */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {price.currencyCode} {Math.round(parseFloat(price.amount))}
                  </span>
                  {isOnSale && compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {compareAtPrice.currencyCode} {Math.round(parseFloat(compareAtPrice.amount))}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile Add to Cart */}
              {variant && (
                <div className="mt-auto">
                  <AddToCartButton
                    lines={[
                      {
                        merchandiseId: variant.id,
                        quantity: 1,
                      },
                    ]}
                    onClick={() => open('cart')}
                    disabled={!variant.availableForSale}
                    variant="primary"
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                  >
                    {variant.availableForSale ? 'Lägg till' : 'Slut'}
                  </AddToCartButton>
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
  if ('images' in product && product.images?.nodes?.[0]) {
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
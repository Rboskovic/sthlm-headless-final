// FILE: app/components/ProductItem.tsx
// ✅ SHOPIFY STANDARD: Compatible with both collection and product data structures

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

  // Desktop Layout - Original
  return (
    <>
      {/* Desktop Layout - PIXEL PERFECT MATCH TO SCREENSHOT */}
      <div className="hidden lg:block">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group relative">
          {/* Wishlist Heart - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <WishlistButton
              productId={product.id}
              productTitle={product.title}
              size="sm"
              className="w-8 h-8 bg-white rounded-full shadow-sm border border-gray-200 hover:border-red-300"
            />
          </div>

          <div className="flex flex-col h-full">
            {/* Product Image */}
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
                  />
                )}
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 flex flex-col">
              <Link
                className="block mb-3 group-hover:text-blue-600 transition-colors"
                to={productUrl}
              >
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                {product.vendor && (
                  <p className="text-sm text-gray-500 mb-1">{product.vendor}</p>
                )}
              </Link>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-gray-900">
                  {price.currencyCode} {price.amount}
                </span>
                {compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {compareAtPrice.currencyCode} {compareAtPrice.amount}
                  </span>
                )}
              </div>
            </div>

            {/* ✅ FIXED: Add to Cart Button - Only show if we have variant data */}
            {variant ? (
              <AddToCartButton
                disabled={!variant.availableForSale}
                onClick={() => {
                  console.log('🐛 Opening cart aside after adding item');
                  open('cart');
                }}
                lines={[
                  {
                    merchandiseId: variant.id,
                    quantity: 1,
                  },
                ]}
                analytics={{
                  products: [
                    {
                      productGid: product.id,
                      variantGid: variant.id,
                      name: product.title,
                      variantName: variant.title || product.title,
                      brand: product.vendor,
                      price: variant.price.amount,
                      quantity: 1,
                    },
                  ],
                }}
                variant="addToCart"
                size="md"
                className="w-full"
              >
                {variant.availableForSale ? 'Add to cart' : 'Sold out'}
              </AddToCartButton>
            ) : (
              <Link
                to={productUrl}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
              >
                View Product
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout - PIXEL PERFECT MATCH TO SCREENSHOT */}
      <div className="lg:hidden p-4">
        <div className="flex gap-4">
          {/* Product Image - Left Side */}
          <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
            {/* Wishlist Heart - Top Right of Image */}
            <div className="absolute top-1 right-1 z-10">
              <WishlistButton
                productId={product.id}
                productTitle={product.title}
                size="sm"
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </div>

            <Link to={productUrl} className="block w-full h-full">
              {image && (
                <Image
                  alt={image.altText || product.title}
                  src={image.url}
                  width={96}
                  height={96}
                  loading={loading}
                  className="w-full h-full object-cover"
                />
              )}
            </Link>
          </div>

          {/* Product Details - Right Side */}
          <div className="flex-1 flex flex-col justify-between min-h-[96px]">
            <div>
              <Link to={productUrl} className="block">
                <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
                  {product.title}
                </h3>
              </Link>
              {product.vendor && (
                <p className="text-xs text-gray-500 mb-2">{product.vendor}</p>
              )}
            </div>

            {/* Bottom row: Price + Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {price.currencyCode} {price.amount}
                </span>
                {compareAtPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    {compareAtPrice.currencyCode} {compareAtPrice.amount}
                  </span>
                )}
              </div>

              {/* ✅ FIXED: Mobile Add to Cart Button - Only show if we have variant data */}
              {variant ? (
                <AddToCartButton
                  disabled={!variant.availableForSale}
                  onClick={() => {
                    console.log('🐛 Opening cart aside after adding item (mobile)');
                    open('cart');
                  }}
                  lines={[
                    {
                      merchandiseId: variant.id,
                      quantity: 1,
                    },
                  ]}
                  analytics={{
                    products: [
                      {
                        productGid: product.id,
                        variantGid: variant.id,
                        name: product.title,
                        variantName: variant.title || product.title,
                        brand: product.vendor,
                        price: variant.price.amount,
                        quantity: 1,
                      },
                    ],
                  }}
                  variant="addToCart"
                  size="sm"
                  className="px-3 py-1 text-xs"
                >
                  {variant.availableForSale ? 'Add' : 'Out'}
                </AddToCartButton>
              ) : (
                <Link
                  to={productUrl}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ SHOPIFY STANDARD: Helper functions to handle both data structures

function getCompatibleVariant(product: CompatibleProduct | ProductFragment) {
  // Try product detail structure first
  if ('selectedOrFirstAvailableVariant' in product && product.selectedOrFirstAvailableVariant) {
    return product.selectedOrFirstAvailableVariant;
  }
  
  // For collection structure, create a compatible variant object
  if ('priceRange' in product && product.priceRange) {
    return {
      id: `gid://shopify/ProductVariant/${product.id}-variant`, // Fallback ID
      availableForSale: true, // Assume available in collection views
      price: product.priceRange.minVariantPrice,
      compareAtPrice: product.priceRange.maxVariantPrice && 
        product.priceRange.maxVariantPrice.amount !== product.priceRange.minVariantPrice.amount 
        ? product.priceRange.maxVariantPrice 
        : null,
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
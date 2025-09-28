// FILE: app/components/ProductItem.tsx
// ✅ FIXED: Consistent card heights with centered, fully visible images

import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import { SessionWishlistButton } from '~/components/SessionWishlistButton';
import type {ProductFragment} from 'storefrontapi.generated';

interface CompatibleProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
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
  };
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
  } | null;
}

export function ProductItem({
  product,
  loading,
}: {
  product: CompatibleProduct | ProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const {open} = useAside();

  const variant = product.selectedOrFirstAvailableVariant || 
    ((product as any).priceRange ? {
      id: product.id,
      availableForSale: true,
      price: (product as any).priceRange.minVariantPrice,
      compareAtPrice: null,
    } : null);

  const image = product.selectedOrFirstAvailableVariant?.image || 
                (product as any).featuredImage || 
                null;

  const price = product.selectedOrFirstAvailableVariant?.price || 
                (product as any).priceRange?.minVariantPrice || 
                null;

  const compareAtPrice = product.selectedOrFirstAvailableVariant?.compareAtPrice;

  if (!variant && !price) return null;

  const isOnSale = compareAtPrice && price && 
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / 
        parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  const productUrl = `/products/${product.handle}`;

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Image Container - FIXED HEIGHT with centered image */}
      <div className="relative bg-gray-50" style={{ height: '280px' }}>
        {/* Sale Badge */}
        {isOnSale && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-600 text-white text-xs font-bold rounded px-2 py-1">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute top-2 right-2 z-10">
          <SessionWishlistButton
            product={product}
            size="sm"
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm"
          />
        </div>

        {/* Image - Centered in fixed container */}
        <Link to={productUrl} className="block w-full h-full flex items-center justify-center p-4">
          {image ? (
            <Image
              data={image}
              alt={image.altText || product.title}
              loading={loading}
              className="max-w-full max-h-full object-contain"
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 200px, 150px"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v16.5a1.5 1.5 0 0 0 1.5 1.5Z" />
              </svg>
              <span className="text-xs">Ingen bild</span>
            </div>
          )}
        </Link>
      </div>

      {/* Product Info - Fixed structure for consistent alignment */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title - Fixed min-height for alignment */}
        <Link to={productUrl} className="block mb-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2" style={{ minHeight: '40px' }}>
            {product.title}
          </h3>
          {product.vendor && (
            <p className="text-xs text-gray-500">{product.vendor}</p>
          )}
        </Link>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              SEK {Math.round(parseFloat(price.amount))}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                SEK {Math.round(parseFloat(compareAtPrice.amount))}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart - Always at bottom */}
        <div className="mt-auto">
          {variant ? (
            <AddToCartButton
              lines={[{
                merchandiseId: variant.id,
                quantity: 1,
              }]}
              onClick={() => open('cart')}
              disabled={!variant.availableForSale}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
              analytics={{
                products: [{
                  productGid: product.id,
                  variantGid: variant.id,
                  name: product.title,
                  variantName: (variant as any).title || product.title,
                  brand: product.vendor,
                  price: price.amount,
                  quantity: 1,
                }],
              }}
            >
              {variant.availableForSale ? 'Lägg i varukorg' : 'Slut i lager'}
            </AddToCartButton>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 font-medium py-2.5 px-4 rounded-lg text-sm text-center">
              Ej tillgänglig
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
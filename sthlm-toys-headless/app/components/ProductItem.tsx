import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {Heart} from 'lucide-react';
import {useState} from 'react';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

export function ProductItem({
  product,
  loading,
}: {
  product: Product;
  loading?: 'eager' | 'lazy';
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const variant = product.variants?.nodes?.[0];
  const variantUrl = `/products/${product.handle}${variant?.selectedOptions?.length ? `?${variant.selectedOptions.map(option => `${option.name}=${option.value}`).join('&')}` : ''}`;

  const image = product.featuredImage;
  const minPrice = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;

  // Calculate discount percentage if there's a compare at price
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(minPrice?.amount || '0');
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(minPrice?.amount || '0')) / parseFloat(compareAtPrice.amount)) * 100)
    : 0;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
        {/* Wishlist Heart - Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        <Link
          className="block"
          key={product.id}
          prefetch="intent"
          to={variantUrl}
        >
          {/* Product Image with proper containment */}
          <div className="relative overflow-hidden bg-gray-50 rounded-lg mb-4 aspect-square">
            {image ? (
              <Image
                alt={image.altText || product.title}
                aspectRatio="1/1"
                data={image}
                loading={loading}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs">No image</p>
                </div>
              </div>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">0.0 (0)</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {minPrice && <Money data={minPrice} />}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  <Money data={compareAtPrice!} />
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log('Add to cart:', product.title);
          }}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Add to cart
        </button>
      </div>

      {/* Mobile Layout - PIXEL PERFECT MATCH TO SCREENSHOT */}
      <div className="lg:hidden p-4">
        <div className="flex gap-4">
          {/* Product Image - Left Side */}
          <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden relative">
            {/* Wishlist Heart - Top Right of Image */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm"
            >
              <Heart
                size={12}
                className={`transition-colors duration-200 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            <Link to={variantUrl} className="block w-full h-full">
              {image ? (
                <Image
                  alt={image.altText || product.title}
                  aspectRatio="1/1"
                  data={image}
                  loading={loading}
                  sizes="96px"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </Link>
          </div>

          {/* Product Info - Right Side */}
          <div className="flex-1 min-w-0">
            <Link to={variantUrl} className="block">
              {/* Star Rating */}
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-3 h-3 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs text-gray-600">0.0 (0)</span>
              </div>

              {/* Product Title */}
              <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                {product.title}
              </h3>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-gray-900">
                  {minPrice && <Money data={minPrice} />}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    <Money data={compareAtPrice!} />
                  </span>
                )}
              </div>
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log('Add to cart:', product.title);
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
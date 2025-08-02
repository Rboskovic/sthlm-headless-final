// FILE: app/components/ProductForm.tsx
// ✅ REVERTED: Back to original layout + working wishlist button

import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {WishlistButton} from './WishlistButton';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  quantity = 1,
  onQuantityChange,
}: {
  product?: ProductFragment;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  const handleQuantityDecrease = () => {
    if (quantity > 1 && onQuantityChange) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(quantity + 1);
    }
  };

  // Debug logs - remove these after testing
  console.log('🐛 ProductForm - selectedVariant:', selectedVariant);
  console.log('🐛 ProductForm - quantity:', quantity);

  return (
    <div className="product-form space-y-6">
      {/* Product Options */}
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5
              className="text-base font-medium text-gray-900 mb-3"
              style={{
                fontFamily:
                  "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
              }}
            >
              {option.name}
            </h5>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const baseClasses = `
                  flex items-center justify-center min-w-12 h-10 px-3 py-2 
                  border border-gray-300 rounded text-sm font-medium transition-all duration-200 
                  cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                `;

                const stateClasses = selected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : available
                    ? 'hover:border-gray-400 hover:bg-gray-50'
                    : 'opacity-50 cursor-not-allowed';

                const linkClasses = `${baseClasses} ${stateClasses}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={name}
                      to={`/products/${handle}${variantUriQuery}`}
                      className={linkClasses}
                      style={{
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      }}
                    >
                      {swatch?.color && (
                        <div
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                          style={{backgroundColor: swatch.color}}
                        />
                      )}
                      {name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={name}
                    to={`?${variantUriQuery}`}
                    className={linkClasses}
                    style={{
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    }}
                  >
                    {swatch?.color && (
                      <div
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{backgroundColor: swatch.color}}
                      />
                    )}
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ✅ REVERTED: Original Quantity and Add to Cart Layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
          <button
            type="button"
            onClick={handleQuantityDecrease}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <div
            className="w-12 h-10 flex items-center justify-center text-gray-900 font-medium border-l border-r border-gray-300"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            {quantity}
          </div>

          <button
            type="button"
            onClick={handleQuantityIncrease}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
            style={{
              fontFamily:
                "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* ✅ REVERTED: Original Add to Cart Button Layout */}
        <div className="flex-1">
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              console.log('🐛 Opening cart aside');
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantity,
                    },
                  ]
                : []
            }
            analytics={{
              products: [
                {
                  productGid: selectedVariant?.product?.id,
                  variantGid: selectedVariant?.id,
                  name: selectedVariant?.product?.title,
                  variantName: selectedVariant?.title,
                  brand: selectedVariant?.product?.vendor,
                  price: selectedVariant?.price?.amount,
                  quantity: quantity,
                },
              ],
            }}
          >
            {selectedVariant?.availableForSale
              ? 'LÄGG I VARUKORGEN'
              : 'Slutsåld'}
          </AddToCartButton>
        </div>
      </div>

      {/* ✅ REVERTED: Original Separate Wishlist Button (but now working) */}
      {product && (
        <WishlistButton
          productId={product.id}
          productTitle={product.title}
          size="lg"
          className="w-10 h-10 border border-gray-300 rounded-lg hover:border-gray-400"
        />
      )}

      {/* Availability Status */}
      {selectedVariant && (
        <div className="text-sm">
          {selectedVariant.availableForSale ? (
            <p className="text-green-600 font-medium">✓ In stock</p>
          ) : (
            <p className="text-red-600 font-medium">✗ Out of stock</p>
          )}
        </div>
      )}
    </div>
  );
}

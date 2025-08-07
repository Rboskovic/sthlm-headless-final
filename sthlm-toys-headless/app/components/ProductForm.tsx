// FILE: app/components/ProductForm.tsx
// ✅ SHOPIFY STANDARD: Proper product form with quantity management and cart functionality

import {Link, useNavigate} from 'react-router';
import {useState, useEffect} from 'react';
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
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // ✅ FIXED: Sync local quantity with prop changes
  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  // ✅ FIXED: Proper quantity handlers
  const handleQuantityDecrease = () => {
    const newQuantity = Math.max(1, localQuantity - 1);
    setLocalQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  const handleQuantityIncrease = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  // Debug logs - remove these after testing
  console.log('🐛 ProductForm - selectedVariant:', selectedVariant);
  console.log('🐛 ProductForm - quantity:', localQuantity);
  console.log('🐛 ProductForm - product:', product?.title);

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

                return (
                  <button
                    key={name}
                    className={`${baseClasses} ${stateClasses}`}
                    style={{
                      fontFamily:
                        "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                    }}
                    disabled={!available}
                    onClick={() => {
                      if (!selected && available) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ✅ FIXED: Add to Cart Section with Quantity and Actions */}
      <div className="flex gap-4 items-center">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={handleQuantityDecrease}
            disabled={localQuantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {localQuantity}
          </div>

          <button
            type="button"
            onClick={handleQuantityIncrease}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
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

        {/* ✅ FIXED: Add to Cart Button with proper analytics */}
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
                      quantity: localQuantity,
                    },
                  ]
                : []
            }
            analytics={{
              products: [
                {
                  productGid: selectedVariant?.product?.id || product?.id,
                  variantGid: selectedVariant?.id,
                  name: selectedVariant?.product?.title || product?.title,
                  variantName: selectedVariant?.title,
                  brand: selectedVariant?.product?.vendor || product?.vendor,
                  price: selectedVariant?.price?.amount,
                  quantity: localQuantity,
                },
              ],
            }}
            variant="addToCart"
            size="lg"
          >
            {selectedVariant?.availableForSale
              ? 'LÄGG I VARUKORGEN'
              : 'Slutsåld'}
          </AddToCartButton>
        </div>
      </div>

      {/* ✅ FIXED: Wishlist Button */}
      {product && (
        <div className="flex justify-center">
          <WishlistButton
            productId={product.id}
            productTitle={product.title}
            size="lg"
            className="w-10 h-10 border border-gray-300 rounded-lg hover:border-gray-400"
          />
        </div>
      )}

      {/* Availability Status */}
      {selectedVariant && (
        <div className="text-sm">
          {selectedVariant.availableForSale ? (
            <p className="text-green-600 font-medium">✓ In Stock</p>
          ) : (
            <p className="text-red-600 font-medium">⚠ Out of Stock</p>
          )}
          {selectedVariant.quantityAvailable !== undefined && (
            <p className="text-gray-500 mt-1">
              {selectedVariant.quantityAvailable > 0
                ? `${selectedVariant.quantityAvailable} available`
                : 'No stock available'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ✅ SHOPIFY STANDARD: Product option swatch component
function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return null;

  return (
    <div
      aria-label={name}
      className="w-5 h-5 rounded border border-gray-300 mr-2 flex-shrink-0"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded"
        />
      )}
    </div>
  );
}
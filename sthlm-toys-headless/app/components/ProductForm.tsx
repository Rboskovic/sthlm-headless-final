// FILE: app/components/ProductForm.tsx
// ✅ SHOPIFY STANDARD: Clean product form with working quantity management

import {Link, useNavigate} from 'react-router';
import {useState, useEffect} from 'react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {useAside} from './Aside';
import {Minus, Plus} from 'lucide-react';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  quantity = 1,
  onQuantityChange,
  hideQuantity = false, // New prop to hide quantity selector
}: {
  product?: ProductFragment;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  hideQuantity?: boolean; // New prop to control quantity visibility
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

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const newQuantity = Math.max(1, value);
    setLocalQuantity(newQuantity);
    onQuantityChange?.(newQuantity);
  };

  return (
    <div className="product-form space-y-6">
      {/* Product Options */}
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h4 className="text-base font-medium text-gray-900 mb-3">
              {option.name}
            </h4>
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
                  border rounded-md text-sm font-medium transition-all duration-200 
                  cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                `;

                const stateClasses = selected
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : available
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';

                if (isDifferentProduct) {
                  // SEO: When the variant is a combined listing child product
                  // that leads to a different url, render as anchor tag
                  return (
                    <Link
                      className={`${baseClasses} ${stateClasses}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO: When the variant is an update to the search param,
                  // render as button with javascript navigation
                  return (
                    <button
                      type="button"
                      className={`${baseClasses} ${stateClasses} ${
                        exists && !selected ? 'link' : ''
                      }`}
                      key={option.name + name}
                      disabled={!exists || !available}
                      onClick={() => {
                        if (!exists) return;
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity Selector - Only show if not hidden */}
      {!hideQuantity && selectedVariant?.availableForSale && (
        <div className="quantity-selector">
          <h4 className="text-base font-medium text-gray-900 mb-3">Quantity</h4>
          <div className="flex items-center border border-gray-300 rounded-md w-fit">
            <button
              type="button"
              onClick={handleQuantityDecrease}
              disabled={localQuantity <= 1}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <input
              type="number"
              min="1"
              value={localQuantity}
              onChange={handleQuantityInputChange}
              className="w-16 h-10 text-center border-0 focus:ring-0 focus:outline-none text-gray-900 font-medium"
              aria-label="Quantity"
            />
            
            <button
              type="button"
              onClick={handleQuantityIncrease}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ProductOptionSwatch Component
 * Renders color swatches or text for product options
 */
function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch>;
  name: string;
}) {
  if (swatch?.color) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{backgroundColor: swatch.color}}
        />
        <span>{name}</span>
      </div>
    );
  }

  if (swatch?.image?.previewImage?.url) {
    return (
      <div className="flex items-center gap-2">
        <img
          src={swatch.image.previewImage.url}
          alt={name}
          className="w-4 h-4 rounded-full object-cover border border-gray-300"
        />
        <span>{name}</span>
      </div>
    );
  }

  return <span>{name}</span>;
}
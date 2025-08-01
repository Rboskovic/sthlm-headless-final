import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
  quantity = 1,
  onQuantityChange,
}: {
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
                    ? 'bg-white text-gray-700 hover:border-gray-400'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';

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
                      style={{
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      }}
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
                      className={`${baseClasses} ${stateClasses}`}
                      key={option.name + name}
                      style={{
                        fontFamily:
                          "UniformRnd, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif",
                      }}
                      disabled={!available}
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

      {/* Shop Pay Payment Options */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <div className="text-sm text-gray-600 mb-2">
          Betala senare för beställningar över 350,00 kr med
          <span className="font-medium text-purple-600 ml-1">Shop Pay</span>
        </div>
        <div className="text-xs text-gray-500">Läs mer</div>
      </div>

      {/* Quantity Selector and Add to Cart */}
      <div className="flex items-center gap-3">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={handleQuantityDecrease}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
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

        {/* Add to Cart Button */}
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

        {/* Wishlist/Heart Icon */}
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          title="Add to Wishlist"
        >
          <svg
            className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

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
          className="w-3 h-3 rounded-full border border-gray-300"
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
          className="w-3 h-3 rounded-full border border-gray-300 object-cover"
        />
        <span>{name}</span>
      </div>
    );
  }

  return <span>{name}</span>;
}

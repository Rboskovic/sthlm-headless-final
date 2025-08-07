// FILE: app/components/CartLineItem.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Well-styled cart line item

import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import {Minus, Plus, Trash2} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="block"
        >
          {image && (
            <Image
              alt={title}
              data={image}
              height={layout === 'aside' ? 80 : 120}
              width={layout === 'aside' ? 80 : 120}
              loading="lazy"
              className="rounded-lg object-cover bg-gray-100"
            />
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            {/* Product Title */}
            <Link
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="block group"
            >
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>

            {/* Product Options */}
            {selectedOptions.length > 0 && (
              <div className="mt-1 space-y-1">
                {selectedOptions.map((option) => (
                  <p key={option.name} className="text-sm text-gray-600">
                    {option.name}: {option.value}
                  </p>
                ))}
              </div>
            )}

            {/* Product Price */}
            <div className="mt-2">
              <Money
                data={line?.cost?.totalAmount}
                className="text-lg font-bold text-gray-900"
              />
              {line?.cost?.compareAtAmountPerQuantity && (
                <Money
                  data={line.cost.compareAtAmountPerQuantity}
                  className="text-sm text-gray-500 line-through ml-2"
                />
              )}
            </div>
          </div>

          {/* Remove Button */}
          <CartLineRemoveButton 
            lineIds={[id]} 
            disabled={!!line.isOptimistic}
            layout={layout}
          />
        </div>

        {/* Quantity Controls */}
        <div className="mt-4">
          <CartLineQuantity line={line} layout={layout} />
        </div>
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayout;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 font-medium">Antal:</span>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        {/* Decrease Button */}
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            type="submit"
            aria-label="Minska antal"
            disabled={quantity <= 1 || !!isOptimistic}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
        </CartLineUpdateButton>

        {/* Quantity Display */}
        <div className="px-3 py-2 min-w-[2.5rem] text-center text-sm font-medium text-gray-900 border-l border-r border-gray-300 bg-white">
          {quantity}
        </div>

        {/* Increase Button */}
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            type="submit"
            aria-label="Öka antal"
            disabled={!!isOptimistic}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </CartLineUpdateButton>
      </div>

      {/* Loading indicator */}
      {isOptimistic && (
        <div className="text-xs text-gray-500 italic">Uppdaterar...</div>
      )}
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
  layout,
}: {
  lineIds: string[];
  disabled: boolean;
  layout: CartLayout;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        type="submit"
        disabled={disabled}
        className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-red-50"
        aria-label="Ta bort vara"
        title="Ta bort vara"
      >
        <Trash2 size={layout === 'aside' ? 18 : 20} />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
// FILE: app/components/CartLineItem.tsx
// ✅ FIXED: Added inventory validation with Swedish error message

import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import {Minus, Plus, Trash2, AlertCircle} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useState} from 'react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * En enskild artikel i kundvagnen. Visar produktbild, titel, pris.
 * Tillhandahåller kontroller för att uppdatera antal eller ta bort artikeln.
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
    <div className="relative flex items-start gap-4 py-6 border-b border-gray-100 last:border-b-0">
      {/* ✅ FIXED: Natural produktbild display matching ProductCard exactly */}
      <div className="flex-shrink-0">
        <Link
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="block aspect-square w-20 h-20 relative overflow-hidden bg-gray-50 rounded-lg"
        >
          {image && (
            <Image
              data={image}
              alt={image.altText || title}
              className="h-full w-full object-cover object-center transition-transform duration-200 hover:scale-105"
              loading="lazy"
              sizes="80px"
            />
          )}
        </Link>
      </div>

      {/* Produktdetaljer */}
      <div className="flex-1 min-w-0">
        {/* ✅ FIXED: Title with proper spacing (no extra padding since compare price moved) */}
        <div className="flex-1 min-w-0 mb-3">
          <Link
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="block group"
          >
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Produktalternativ */}
          {selectedOptions.length > 0 && (
            <div className="mt-1">
              {selectedOptions
                .filter((option) => option.name !== 'Title' || option.value !== 'Default Title')
                .map((option) => (
                  <p key={option.name} className="text-xs text-gray-500">
                    {option.name}: {option.value}
                  </p>
                ))}
            </div>
          )}
        </div>

        {/* ✅ FIXED: Price with compare price × quantity calculation */}
        <div className="mb-4 flex items-center gap-2">
          <Money
            data={line?.cost?.totalAmount}
            className="text-base text-gray-900"
          />
          {/* ✅ FIXED: Compare price multiplied by quantity */}
          {line?.cost?.compareAtAmountPerQuantity && line?.quantity && (
            <Money
              data={{
                amount: (parseFloat(line.cost.compareAtAmountPerQuantity.amount) * line.quantity).toString(),
                currencyCode: line.cost.compareAtAmountPerQuantity.currencyCode
              }}
              className="text-sm text-gray-400 line-through"
            />
          )}
        </div>

        {/* ✅ FIXED: Wider quantity controls with more spacing + trash icon */}
        <div className="flex items-center gap-3">
          <CartLineQuantity line={line} layout={layout} />
          <CartLineRemoveButton 
            lineIds={[id]} 
            disabled={Boolean(!line || line.isOptimistic)}
            layout={layout}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * ✅ FIXED: Wider quantity controls with inventory validation
 */
function CartLineQuantity({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayout;
}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic, merchandise} = line;
  
  // ✅ NEW: Get available inventory
  const availableQuantity = (merchandise as any)?.quantityAvailable || 999;
  
  // ✅ NEW: Track if user tried to exceed max
  const [showMaxError, setShowMaxError] = useState(false);
  
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  
  // ✅ NEW: Check if next quantity would exceed available
  const isMaxQuantity = quantity >= availableQuantity;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">
        {/* ✅ WIDER: Decrease button with more padding */}
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            type="submit"
            aria-label="Minska antal"
            disabled={quantity <= 1 || !!isOptimistic}
            className="w-10 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-full"
          >
            <Minus size={14} />
          </button>
        </CartLineUpdateButton>

        {/* ✅ WIDER: Quantity display with more width */}
        <div className="w-14 h-8 flex items-center justify-center text-xs font-medium text-gray-900 border-l border-r border-gray-200 bg-white">
          {quantity}
        </div>

        {/* ✅ NEW: Increase button with validation */}
        <CartLineUpdateButton 
          lines={[{id: lineId, quantity: isMaxQuantity ? quantity : nextQuantity}]}
        >
          <button
            type="submit"
            aria-label="Öka antal"
            disabled={!!isOptimistic || isMaxQuantity}
            onClick={() => {
              if (isMaxQuantity) {
                setShowMaxError(true);
                setTimeout(() => setShowMaxError(false), 3000);
              }
            }}
            className="w-10 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-full"
          >
            <Plus size={14} />
          </button>
        </CartLineUpdateButton>
      </div>
      
      {/* ✅ NEW: Swedish error message when max quantity reached */}
      {showMaxError && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
          <span className="text-xs text-red-700 font-medium">
            Maximalt {availableQuantity} tillgängliga
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * ✅ FIXED: Clean remove button without black box
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
    <CartLineUpdateButton lines={lineIds.map((id) => ({id, quantity: 0}))}>
      <button
        type="submit"
        disabled={disabled}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0"
        aria-label="Ta bort från kundvagn"
      >
        <Trash2 size={14} />
      </button>
    </CartLineUpdateButton>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
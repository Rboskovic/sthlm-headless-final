// FILE: app/components/CartLineItem.tsx
// ✅ FINAL: Swedish translation with larger product cards

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
    <div className="flex items-start gap-4 py-6 border-b border-gray-100 last:border-b-0">
      {/* Produktbild - Större */}
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
              height={120}
              width={120}
              loading="lazy"
              className="rounded-lg object-cover bg-gray-50 border border-gray-100"
            />
          )}
        </Link>
      </div>

      {/* Produktdetaljer */}
      <div className="flex-1 min-w-0">
        {/* Produkttitel och Ta bort-knapp */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <Link
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="block group"
            >
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                {product.title}
              </h3>
            </Link>

            {/* Produktalternativ */}
            {selectedOptions.length > 0 && (
              <div className="mt-2">
                {selectedOptions
                  .filter((option) => option.name !== 'Title' || option.value !== 'Default Title')
                  .map((option) => (
                    <p key={option.name} className="text-sm text-gray-500">
                      {option.name}: {option.value}
                    </p>
                  ))}
              </div>
            )}
          </div>

          {/* Ta bort-knapp */}
          <CartLineRemoveButton 
            lineIds={[id]} 
            disabled={!!line.isOptimistic}
            layout={layout}
          />
        </div>

        {/* Produktpris */}
        <div className="mb-4">
          <Money
            data={line?.cost?.totalAmount}
            className="text-lg font-semibold text-gray-900"
          />
          {line?.cost?.compareAtAmountPerQuantity && (
            <Money
              data={line.cost.compareAtAmountPerQuantity}
              className="text-sm text-gray-400 line-through ml-2"
            />
          )}
        </div>

        {/* Antal-kontroller */}
        <CartLineQuantity line={line} layout={layout} />
      </div>
    </div>
  );
}

/**
 * Förbättrade antal-kontroller med ren design som matchar skärmbilder
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
    <div className="flex items-center justify-between">
      {/* Antal-kontroller */}
      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
        {/* Minska-knapp */}
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            type="submit"
            aria-label="Minska antal"
            disabled={quantity <= 1 || !!isOptimistic}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={16} />
          </button>
        </CartLineUpdateButton>

        {/* Antal-visning */}
        <div className="w-12 h-10 flex items-center justify-center text-sm font-medium text-gray-900 border-l border-r border-gray-200 bg-white">
          {quantity}
        </div>

        {/* Öka-knapp */}
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            type="submit"
            aria-label="Öka antal"
            disabled={!!isOptimistic}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
          </button>
        </CartLineUpdateButton>
      </div>

      {/* Laddningsindikator */}
      {isOptimistic && (
        <div className="text-xs text-blue-600 italic">Uppdaterar...</div>
      )}
    </div>
  );
}

/**
 * Förbättrad ta bort-knapp med bättre styling
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
        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-red-50"
        aria-label="Ta bort artikel"
        title="Ta bort artikel"
      >
        <Trash2 size={18} />
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
 * Returnerar en unik nyckel för uppdateringsåtgärden. Detta används för att säkerställa att åtgärder som modifierar samma rad
 * artiklar inte körs samtidigt, utan avbryter varandra. Till exempel, om användaren klickar "Öka antal"
 * och "Minska antal" i snabb följd, kommer åtgärderna att avbryta varandra och endast den sista kommer att köras.
 * @param lineIds - rad-id:n som påverkas av uppdateringen
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
// FILE: app/components/CartSummary.tsx
// ✅ FINAL: Swedish translation without subtotal section

import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';
import {ShopButton} from './ui/ShopButton';
import {ArrowRight, Tag, Truck, Shield} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Rabatter */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* Uppskattad totalsumma */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">Uppskattad totalsumma</span>
          <span className="text-lg font-semibold text-gray-900">
            {cart.cost?.totalAmount?.amount ? (
              <Money data={cart.cost.totalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        
        <p className="text-sm text-gray-500">
          Skatter, rabatter och <button className="underline">frakt</button> beräknas vid kassan.
        </p>
      </div>

      {/* Kassaåtgärder */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={layout} cart={cart} />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  layout,
  cart,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  if (!checkoutUrl) return null;

  const totalAmount = cart.cost?.totalAmount?.amount || '0';
  const formattedTotal = parseFloat(totalAmount).toFixed(2);

  return (
    <div className="space-y-3">
      {/* Huvudsaklig kassa-knapp */}
      <ShopButton
        asChild
        variant="primary"
        size={layout === 'aside' ? 'lg' : 'lg'}
        fullWidth
        className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        <a href={checkoutUrl} target="_self">
          <span className="text-white">Checkout • | {formattedTotal} $</span>
        </a>
      </ShopButton>

      {/* Förtroendemärken - Kompakt för aside-layout */}
      {layout === 'aside' && (
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield size={12} />
            <span>Säker betalning</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck size={12} />
            <span>Fri frakt över €20</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: Array<{
    code: string;
    applicable: boolean;
  }>;
}) {
  const codes = discountCodes?.filter((discount) => discount.applicable) ?? [];

  return (
    <>
      {/* Befintliga tillämpade rabatter */}
      {codes.map((discount) => (
        <div key={discount.code} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Rabatt: {discount.code}
            </span>
          </div>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.DiscountCodesUpdate}
            inputs={{
              discountCode: '',
              discountCodes: codes
                .filter(({code}) => code !== discount.code)
                .map(({code}) => code),
            }}
          >
            <button
              type="submit"
              className="text-green-600 hover:text-green-800 transition-colors"
              aria-label={`Ta bort ${discount.code} rabatt`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </CartForm>
        </div>
      ))}

      {/* Lägg till rabattformulär */}
      <DiscountForm discountCodes={codes} />
    </>
  );
}

function DiscountForm({discountCodes}: {discountCodes: Array<{code: string}>}) {
  const discountFormRef = useRef<HTMLFormElement>(null);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes.map(({code}) => code)}}
      ref={discountFormRef}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const isSubmitting = fetcher.state === 'submitting';
        
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                name="discountCode"
                placeholder="Rabattkod"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Tillämpar...' : 'Tillämpa'}
              </button>
            </div>
            {fetcher.data?.formError && (
              <p className="text-sm text-red-600">{fetcher.data.formError}</p>
            )}
          </div>
        );
      }}
    </CartForm>
  );
}
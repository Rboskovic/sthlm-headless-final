// FILE: app/components/CartSummary.tsx
// ✅ MINIMAL: Removed Sammanställning section - only checkout button + discount codes

import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {FetcherWithComponents} from 'react-router';
import {ShopButton} from './ui/ShopButton';
import {Tag, Truck, Shield, Gift} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Rabatter - Keep discount codes */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* ✅ REMOVED: Entire Sammanställning section */}
      {/* Only checkout button + disclaimer + trust badges remain */}
      
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
      {/* ✅ MAIN: Blue checkout button with total already included */}
      <ShopButton
        asChild
        variant="primary"
        size={layout === 'aside' ? 'lg' : 'lg'}
        fullWidth
        className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        <a href={checkoutUrl} target="_self">
          <span className="text-white">Gå till kassan • {formattedTotal} kr</span>
        </a>
      </ShopButton>

      {/* ✅ KEPT: Disclaimer text below checkout button */}
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Alla priser visas inkl. moms. Rabatter och frakt beräknas i kassan.
      </p>

      {/* ✅ KEPT: Trust badges for aside layout */}
      {layout === 'aside' && (
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield size={12} />
            <span>Säker betalning</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck size={12} />
            <span>Fri frakt över 989 kr</span>
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
      {/* Applied discount codes - keep existing styling */}
      {codes.map((discount) => (
        <div key={discount.code} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Gift size={16} className="text-green-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-green-800 block">
                {discount.code}
              </span>
              <span className="text-xs text-green-600">
                Rabatt tillämpad
              </span>
            </div>
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
              className="text-green-600 hover:text-green-800 hover:bg-green-100 p-1 rounded-full transition-all duration-200"
              aria-label={`Ta bort ${discount.code} rabatt`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </CartForm>
        </div>
      ))}

      {/* Add discount form - keep existing styling */}
      <DiscountForm discountCodes={codes} />
    </>
  );
}

function DiscountForm({discountCodes}: {discountCodes: Array<{code: string}>}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes.map(({code}) => code)}}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const isSubmitting = fetcher.state === 'submitting';
        
        return (
          <div className="space-y-2">
            {/* ✅ FIXED: Promocode input without black box */}
            <div className="flex rounded-xl border border-gray-200 bg-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
              <div className="flex items-center pl-3 text-gray-400">
                <Tag size={16} />
              </div>
              <input
                type="text"
                name="discountCode"
                placeholder="Ange rabattkod"
                className="flex-1 px-3 py-3 bg-transparent border-0 text-sm focus:outline-none focus:ring-0 focus:border-0 placeholder-gray-500"
                disabled={isSubmitting}
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Tillämpar...</span>
                  </>
                ) : (
                  <span>Tillämpa</span>
                )}
              </button>
            </div>
            
            {/* Error message */}
            {fetcher.data?.formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{fetcher.data.formError}</p>
              </div>
            )}
          </div>
        );
      }}
    </CartForm>
  );
}
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
    <div className="space-y-2 sm:space-y-4">
      <CartDiscounts discountCodes={cart.discountCodes} cart={cart} />
      
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
    <div className="space-y-2 sm:space-y-3">
      <ShopButton
        asChild
        variant="primary"
        size={layout === 'aside' ? 'lg' : 'lg'}
        fullWidth
        className="h-10 sm:h-12 md:h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base md:text-lg"
      >
        <a href={checkoutUrl} target="_self">
          <span className="text-white">Gå till kassan • {formattedTotal} kr</span>
        </a>
      </ShopButton>

      <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed px-1">
        Alla priser visas inkl. moms. Rabatter och frakt beräknas i kassan.
      </p>

      {layout === 'aside' && (
        <div className="flex items-center justify-center gap-2 sm:gap-4 pt-1 text-[9px] sm:text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield size={10} className="sm:w-3 sm:h-3" />
            <span className="whitespace-nowrap">Säker betalning</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck size={10} className="sm:w-3 sm:h-3" />
            <span className="whitespace-nowrap">Fri frakt till ombud över 799 kr</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  cart,
}: {
  discountCodes?: Array<{
    code: string;
    applicable: boolean;
  }>;
  cart: OptimisticCart<CartApiQueryFragment | null>;
}) {
  const codes = discountCodes?.filter((discount) => discount.applicable) ?? [];

  const subtotal = cart.cost?.subtotalAmount;
  const total = cart.cost?.totalAmount;
  
  let totalDiscount = 0;

  if (cart.lines?.nodes) {
    cart.lines.nodes.forEach((line) => {
      if (line.discountAllocations && line.discountAllocations.length > 0) {
        line.discountAllocations.forEach((allocation) => {
          if (allocation.discountedAmount?.amount) {
            totalDiscount += parseFloat(allocation.discountedAmount.amount);
          }
        });
      }
    });
  }

  if (cart.discountAllocations && cart.discountAllocations.length > 0) {
    cart.discountAllocations.forEach((allocation) => {
      if (allocation.discountedAmount?.amount) {
        totalDiscount += parseFloat(allocation.discountedAmount.amount);
      }
    });
  }

  const discountAmount = totalDiscount > 0 ? totalDiscount.toFixed(2) : null;
  const originalSubtotal = subtotal?.amount ? parseFloat(subtotal.amount) : 0;
  const calculatedSubtotal = total?.amount ? parseFloat(total.amount) + totalDiscount : originalSubtotal;

  return (
    <>
      {codes.map((discount) => (
        <div key={discount.code} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Tag size={12} className="sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-blue-800 block">
                  {discount.code}
                </span>
                <span className="text-[10px] sm:text-xs text-blue-600">
                  Rabattkod tillämpad
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
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded-full transition-all duration-200"
                aria-label={`Ta bort ${discount.code} rabatt`}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </CartForm>
          </div>

          {discountAmount && parseFloat(discountAmount) > 0 ? (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-blue-200 bg-white/50 space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-700">
                <span>Delsumma</span>
                <span className="font-medium">{calculatedSubtotal.toFixed(2)} kr</span>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm text-green-700 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Gift size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>Rabatt</span>
                </div>
                <span>-{discountAmount} kr</span>
              </div>

              <div className="border-t border-blue-200 my-1.5"></div>

              <div className="flex justify-between items-center text-sm sm:text-base font-bold text-gray-900">
                <span>Totalt</span>
                <span className="text-green-700">
                  {total && <Money data={total} />}
                </span>
              </div>

              <div className="text-center pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                  <Gift size={10} />
                  Du sparar {discountAmount} kr!
                </span>
              </div>
            </div>
          ) : (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-blue-200 bg-white/50">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-700">
                <Gift size={14} className="text-blue-600 flex-shrink-0" />
                <span>Rabatten beräknas i kassan</span>
              </div>
            </div>
          )}
        </div>
      ))}

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
            <div className="flex rounded-lg sm:rounded-xl border border-gray-200 bg-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
              <div className="flex items-center pl-1.5 sm:pl-3 text-gray-400 flex-shrink-0">
                <Tag size={10} className="sm:w-4 sm:h-4" />
              </div>
              <input
                type="text"
                name="discountCode"
                placeholder="Rabattkod"
                className="flex-1 min-w-0 px-1.5 sm:px-3 py-1.5 sm:py-3 bg-transparent border-0 text-[11px] sm:text-sm focus:outline-none focus:ring-0 focus:border-0 placeholder-gray-500"
                disabled={isSubmitting}
                style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-shrink-0 w-[85px] sm:w-[100px] px-2 sm:px-4 py-1.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-0.5 sm:gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline text-[10px] sm:text-sm">Tillämpar...</span>
                  </>
                ) : (
                  <span className="text-[10px] sm:text-sm">Tillämpa</span>
                )}
              </button>
            </div>
            
            {fetcher.data?.formError && (
              <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-600 font-medium">{fetcher.data.formError}</p>
              </div>
            )}
          </div>
        );
      }}
    </CartForm>
  );
}
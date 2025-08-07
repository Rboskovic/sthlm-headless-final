// FILE: app/components/CartSummary.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Well-styled cart summary with Swedish text

import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';
import {ShopButton} from './ui/ShopButton';
import {ArrowRight, Tag, Gift, Truck} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Order Summary Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ordersammanfattning
        </h3>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delsumma</span>
          <span className="font-semibold text-gray-900">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-gray-500" />
            <span className="text-gray-600">Frakt</span>
          </div>
          <span className="text-green-600 font-medium">
            {cart.cost?.subtotalAmount && 
             parseFloat(cart.cost.subtotalAmount.amount) >= 20 ? 'Gratis' : 'Beräknas vid kassan'}
          </span>
        </div>

        {/* Tax */}
        {cart.cost?.totalTaxAmount && parseFloat(cart.cost.totalTaxAmount.amount) > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Moms</span>
            <span className="font-semibold text-gray-900">
              <Money data={cart.cost.totalTaxAmount} />
            </span>
          </div>
        )}
      </div>

      {/* Discounts */}
      <CartDiscounts discountCodes={cart.discountCodes} />
      
      {/* Gift Cards */}
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Totalt</span>
          <span className="text-xl font-bold text-gray-900">
            {cart.cost?.totalAmount?.amount ? (
              <Money data={cart.cost.totalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        
        {/* Free shipping indicator */}
        {cart.cost?.subtotalAmount && parseFloat(cart.cost.subtotalAmount.amount) >= 20 && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <Truck size={14} />
            Fri frakt inkluderat!
          </p>
        )}
      </div>

      {/* Checkout Actions */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={layout} />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
}) {
  if (!checkoutUrl) return null;

  return (
    <div className="space-y-3">
      <ShopButton
        asChild
        variant="primary"
        size={layout === 'aside' ? 'md' : 'lg'}
        fullWidth
      >
        <a href={checkoutUrl} target="_self">
          <span>Gå till kassan</span>
          <ArrowRight size={18} />
        </a>
      </ShopButton>

      {layout === 'aside' && (
        <p className="text-xs text-gray-500 text-center">
          Frakt och moms beräknas vid kassan
        </p>
      )}

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Truck size={14} />
          <span>Fri frakt över €20</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <ArrowRight size={14} />
          <span>Säker betalning</span>
        </div>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-3">
      {/* Applied Discounts */}
      {codes.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800">
            <Tag size={16} />
            <span className="text-sm font-medium">Rabattkod tillagd</span>
          </div>
          {codes.map((code) => (
            <div key={code} className="flex items-center justify-between mt-2">
              <span className="text-sm text-green-700 font-mono bg-green-100 px-2 py-1 rounded">
                {code}
              </span>
              <UpdateDiscountForm>
                <button
                  type="submit"
                  className="text-xs text-green-700 hover:text-green-900 underline"
                >
                  Ta bort
                </button>
              </UpdateDiscountForm>
            </div>
          ))}
        </div>
      )}

      {/* Discount Code Input */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="space-y-2">
          <label htmlFor="discount-code" className="block text-sm font-medium text-gray-700">
            Rabattkod
          </label>
          <div className="flex gap-2">
            <input
              id="discount-code"
              type="text"
              name="discountCode"
              placeholder="Ange rabattkod"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ShopButton type="submit" variant="outline" size="md">
              Lägg till
            </ShopButton>
          </div>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'];
}) {
  const appliedGiftCards = giftCardCodes || [];

  return (
    <div className="space-y-3">
      {/* Applied Gift Cards */}
      {appliedGiftCards.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-purple-800">
            <Gift size={16} />
            <span className="text-sm font-medium">Presentkort tillämpad</span>
          </div>
          {appliedGiftCards.map((giftCard) => (
            <div key={giftCard.id} className="flex items-center justify-between mt-2">
              <span className="text-sm text-purple-700 font-mono bg-purple-100 px-2 py-1 rounded">
                ****{giftCard.lastCharacters}
              </span>
              <span className="text-sm text-purple-700">
                <Money data={giftCard.amountUsed} />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Gift Card Input */}
      <UpdateGiftCardForm giftCardCodes={appliedGiftCards}>
        <div className="space-y-2">
          <label htmlFor="gift-card-code" className="block text-sm font-medium text-gray-700">
            Presentkort
          </label>
          <div className="flex gap-2">
            <input
              id="gift-card-code"
              type="text"
              name="giftCardCode"
              placeholder="Ange presentkortskod"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <ShopButton type="submit" variant="outline" size="md">
              Lägg till
            </ShopButton>
          </div>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes || []}}
    >
      {children}
    </CartForm>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  children,
}: {
  giftCardCodes?: CartApiQueryFragment['appliedGiftCards'];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes?.map((giftCard) => giftCard.id) || [],
      }}
    >
      {children}
    </CartForm>
  );
}
// FILE: app/components/CartMain.tsx
// ✅ SHOPIFY HYDROGEN STANDARDS: Well-styled cart with Swedish text

import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {ShoppingBag, ArrowRight} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShopLinkButton} from './ui/ShopButton';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // Different styling for aside vs page layouts
  const containerClass = layout === 'aside' 
    ? 'flex flex-col h-full max-h-[80vh]'
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';

  return (
    <div className={containerClass}>
      {!cartHasItems ? (
        <CartEmpty layout={layout} />
      ) : (
        <>
          {/* Cart Items */}
          <div className={layout === 'aside' ? 'flex-1 overflow-y-auto' : 'lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start'}>
            <section className={layout === 'aside' ? 'px-4 py-2' : 'lg:col-span-7'}>
              {/* Cart Header */}
              <div className="mb-6">
                <h2 className={`font-bold text-gray-900 ${layout === 'aside' ? 'text-lg' : 'text-2xl'}`}>
                  Kundvagn ({cart?.totalQuantity || 0})
                </h2>
                {layout === 'page' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Fri frakt på beställningar över €20
                  </p>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </div>
            </section>

            {/* Cart Summary - Aside layout */}
            {layout === 'aside' && (
              <div className="border-t border-gray-200 p-4 mt-4">
                <CartSummary cart={cart} layout={layout} />
              </div>
            )}
          </div>

          {/* Cart Summary - Page layout */}
          {layout === 'page' && (
            <section className="lg:col-span-5">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <CartSummary cart={cart} layout={layout} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function CartEmpty({layout}: {layout: CartLayout}) {
  const {close} = useAside();

  return (
    <div className={`flex flex-col items-center justify-center text-center ${
      layout === 'aside' ? 'h-full p-6' : 'py-16'
    }`}>
      <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-100 rounded-full">
        <ShoppingBag className="w-10 h-10 text-gray-400" />
      </div>
      
      <h2 className={`font-bold text-gray-900 mb-4 ${layout === 'aside' ? 'text-xl' : 'text-2xl'}`}>
        Din kundvagn är tom
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Upptäck våra fantastiska produkter och lägg till något i din kundvagn för att komma igång.
      </p>
      
      {layout === 'aside' ? (
        <ShopLinkButton
          to="/collections"
          onClick={close}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={20} />}
          className="w-full"
        >
          Fortsätt handla
        </ShopLinkButton>
      ) : (
        <ShopLinkButton
          to="/collections"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={20} />}
        >
          Fortsätt handla
        </ShopLinkButton>
      )}
      
      {/* Popular Categories */}
      <div className="mt-12 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Populära kategorier</h3>
        <div className="grid grid-cols-2 gap-3">
          <ShopLinkButton
            to="/collections/lego"
            onClick={layout === 'aside' ? close : undefined}
            variant="outline"
            size="sm"
            className="w-full"
          >
            LEGO
          </ShopLinkButton>
          <ShopLinkButton
            to="/collections/barbie"
            onClick={layout === 'aside' ? close : undefined}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Barbie
          </ShopLinkButton>
        </div>
      </div>
    </div>
  );
}
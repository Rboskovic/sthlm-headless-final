// FILE: app/components/CartMain.tsx
// ✅ FINAL: Swedish translation with wider layout and fixed header

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
 * Huvudkomponenten för kundvagnen som visar kundvagnens artiklar och sammanfattning.
 * Används av både /cart-rutten och kundvagnens aside-dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // useOptimisticCart-hooken tillämpar väntande åtgärder på kundvagnen
  // så att användaren omedelbart ser feedback när de modifierar kundvagnen.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={layout === 'aside' ? 'h-full flex flex-col' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
      {!cartHasItems ? (
        <CartEmpty layout={layout} />
      ) : (
        <>
          {layout === 'aside' ? (
            // Aside-layout - matchande skärmbilder
            <>
              {/* Kundvagnsartiklar - Rullbar */}
              <div className="flex-1 overflow-y-auto cart-items-container">
                <div className="py-2">
                  {/* Produkter och Total-header - På samma rad */}
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Produkter</h3>
                    <span className="text-sm font-medium text-gray-900">Total</span>
                  </div>

                  {/* Kundvagnens artikellista */}
                  <div className="space-y-0">
                    {(cart?.lines?.nodes ?? []).map((line, index) => (
                      <CartLineItem
                        key={line.id}
                        line={line}
                        layout={layout}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Kundvagnssammanfattning - Fast längst ner */}
              <div className="cart-summary-container">
                <CartSummary cart={cart} layout={layout} />
              </div>
            </>
          ) : (
            // Sidlayout
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              <section className="lg:col-span-7">
                {/* Kundvagnshuvud */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Din kundvagn ({cart?.totalQuantity || 0})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Fri frakt på beställningar över €20
                  </p>
                </div>

                {/* Kundvagnens artikellista */}
                <div className="space-y-6">
                  {(cart?.lines?.nodes ?? []).map((line, index) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                    />
                  ))}
                </div>
              </section>

              {/* Kundvagnssammanfattning - Sidopanel */}
              <section className="lg:col-span-5 mt-10 lg:mt-0">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <CartSummary cart={cart} layout={layout} />
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CartEmpty({layout}: {layout: CartLayout}) {
  const {close} = useAside();

  return (
    <div className={`flex flex-col items-center justify-center ${layout === 'aside' ? 'h-full px-6' : 'py-16'}`}>
      <div className="text-center">
        <ShoppingBag 
          size={layout === 'aside' ? 64 : 80} 
          className="mx-auto text-gray-300 mb-4" 
        />
        <h3 className={`${layout === 'aside' ? 'text-lg' : 'text-xl'} font-medium text-gray-900 mb-2`}>
          Din kundvagn är tom
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          Det verkar som att du inte har lagt till några artiklar i din kundvagn än. Börja handla för att fylla den!
        </p>

        {/* Fortsätt handla-knapp */}
        <ShopLinkButton
          to="/"
          onClick={layout === 'aside' ? close : undefined}
          variant="primary"
          size={layout === 'aside' ? 'md' : 'lg'}
          className="mb-6"
        >
          <span>Fortsätt handla</span>
          <ArrowRight size={18} />
        </ShopLinkButton>

        {/* Populära kategorier */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Populära kategorier:</p>
          <div className="grid grid-cols-2 gap-2">
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
            <ShopLinkButton
              to="/collections/educational"
              onClick={layout === 'aside' ? close : undefined}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Pedagogiska
            </ShopLinkButton>
            <ShopLinkButton
              to="/collections/outdoor"
              onClick={layout === 'aside' ? close : undefined}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Utomhus
            </ShopLinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
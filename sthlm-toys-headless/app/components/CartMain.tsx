// FILE: app/components/CartMain.tsx
// ✅ FINAL: Fixed collections, spacing, and mobile menu styling match

import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {ShoppingBag} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShopButton, ShopLinkButton} from './ui/ShopButton';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  popularCollections?: Collection[];
};

/**
 * Huvudkomponenten för kundvagnen som visar kundvagnens artiklar och sammanfattning.
 * Används av både /cart-rutten och kundvagnens aside-dialog.
 */
export function CartMain({layout, cart: originalCart, popularCollections}: CartMainProps) {
  // useOptimisticCart-hooken tillämpar väntande åtgärder på kundvagnen
  // så att användaren omedelbart ser feedback när de modifierar kundvagnen.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={layout === 'aside' ? 'h-full flex flex-col' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
      {!cartHasItems ? (
        <CartEmpty layout={layout} popularCollections={popularCollections} />
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

function CartEmpty({layout, popularCollections}: {layout: CartLayout; popularCollections?: Collection[]}) {
  const {close} = useAside();

  return (
    <div className="h-full flex flex-col">
      {/* Empty Cart Message - Centered at top */}
      <div className="flex flex-col items-center text-center pt-8 pb-6 px-6">
        <ShoppingBag 
          size={64} 
          className="text-gray-300 mb-4" 
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Din kundvagn är tom
        </h3>
        <p className="text-gray-600 max-w-sm mb-6">
          Det verkar som att du inte har lagt till några artiklar i din kundvagn än. Börja handla för att fylla den!
        </p>

        {/* Continue Shopping Button - FIXED: Added mt-6 for top spacing */}
        <Link
          to="/collections/toys"
          onClick={layout === 'aside' ? close : undefined}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-xl mt-6 mb-6 transition-colors"
          style={{ color: 'white' }}
        >
          Fortsätt handla
        </Link>
      </div>

      {/* Popular Categories Section - Consistent spacing */}
      <div className="px-6 pb-6">
        <div className="mb-4">
          <h4 className="text-base font-medium text-gray-900 text-center">Populära</h4>
        </div>
        
        {/* Popular Categories Grid - Exact mobile menu styling */}
        <PopularCategoriesGrid 
          collections={popularCollections} 
          onClose={layout === 'aside' ? close : undefined}
        />
      </div>
    </div>
  );
}

/**
 * Popular Categories Grid Component - Exact copy from mobile menu for consistency
 */
function PopularCategoriesGrid({
  collections,
  onClose,
}: {
  collections?: Collection[];
  onClose?: () => void;
}) {
  // Helper functions from mobile menu
  const getMetafieldValue = (metafields: any[], key: string) => {
    const metafield = metafields?.find(
      (field) =>
        field?.namespace === 'custom' &&  // ✅ FIXED: Should be 'custom' not 'mobile_menu'
        field?.key === key &&
        field?.value
    );
    return metafield ? metafield.value : null;
  };

  const isTrueValue = (value: string | null): boolean => {
    if (!value) return false;
    const normalizedValue = value.toLowerCase().trim();
    return (
      normalizedValue === 'true' ||
      normalizedValue === '1' ||
      normalizedValue === 'yes'
    );
  };

  // Get featured collections from metafields (same logic as mobile menu)
  const featuredCollections =
    collections
      ?.filter((collection) => {
        const featuredValue = getMetafieldValue(
          collection.metafields,
          'mobile_menu_featured',  // ✅ CORRECT: This matches your GraphQL query
        );
        return isTrueValue(featuredValue);
      })
      ?.slice(0, 9) || [];

  // Fallback items with exact same data as mobile menu  
  const fallbackItems = [
    {id: 'deals', title: 'Erbjudanden', image: null, handle: 'deals'},
    {id: 'new', title: 'Nytt & Populärt', image: null, handle: 'new'},
    {id: 'all-toys', title: 'Alla Leksaker', image: null, handle: 'all-toys'},
    {id: 'lego', title: 'LEGO', image: null, handle: 'lego'},
    {id: 'minecraft', title: 'Minecraft', image: null, handle: 'minecraft'},
    {id: 'sonic', title: 'Sonic', image: null, handle: 'sonic'},
    {id: 'spiderman', title: 'Spiderman', image: null, handle: 'spiderman'},
    {id: 'disney', title: 'Disney', image: null, handle: 'disney'},
    {id: 'outdoor', title: 'Utomhus', image: null, handle: 'outdoor'},
  ];

  const displayItems =
    featuredCollections.length > 0 ? featuredCollections : fallbackItems;

  return (
    <div className="mobile-menu-popular-grid">
      {displayItems.map((item) => (
        <Link
          key={item.id}
          to={`/collections/${item.handle}`}
          onClick={onClose}
          className="mobile-menu-popular-item"
        >
          <div
            className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-2"
            style={{
              width: '5rem',
              height: '5rem',
              backgroundColor: item.image?.url ? 'transparent' : '#f3f4f6',
            }}
          >
            {item.image?.url ? (
              <img
                src={item.image.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 font-medium text-xs text-center px-1 leading-tight">
                {item.title}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-900 leading-tight text-center block">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}